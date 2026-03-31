import { useEffect, useMemo, useState } from 'react';
import { connectEvents, sendCommand } from './api/bridgeClient';
import type { SceneAction } from './api/bridgeClient';
import { useLog } from './state/useLog';
import { ControlPanel } from './components/ControlPanel';
import { CommandInput } from './components/CommandInput';
import { EventLog } from './components/EventLog';
import { CesiumViewer } from './cesium/CesiumViewer';

const DEMO_SCENARIOS = [
  { title: '区域演示', text: '带我看看长三角' },
  { title: '城市组演示', text: '标出几个一线城市' },
  { title: '连线演示', text: '把北京和上海连起来' },
  { title: '定位演示', text: '去看看深圳' },
];

export default function App() {
  const { entries, append, clear } = useLog();
  const [pendingAction, setPendingAction] = useState<SceneAction | null>(null);
  const [connected, setConnected] = useState(true);
  const [intentSummary, setIntentSummary] = useState('等待命令');
  const [runningScenario, setRunningScenario] = useState<string | null>(null);

  useEffect(() => {
    const disconnect = connectEvents((e) => {
      setConnected(true);
      append({ id: e.type + Date.now(), type: e.type, message: e.message, payload: e.payload });

      if (e.type === 'command_received') {
        const raw = (e.payload as any)?.raw;
        const preset = (e.payload as any)?.preset;
        setIntentSummary(raw ? `原始输入：${raw}` : preset ? `预置命令：${preset}` : '收到命令');
      }

      if (e.type === 'command_parsed') {
        const parsedType = (e.payload as any)?.type;
        setIntentSummary(`归一化意图：${parsedType}`);
      }

      if (e.type === 'tool_result') {
        setIntentSummary(`执行结果：${e.message}`);
      }
    });
    return disconnect;
  }, [append]);

  const logSummary = useMemo(() => {
    const total = entries.length;
    const errors = entries.filter((e) => e.type === 'error').length;
    return { total, errors };
  }, [entries]);

  async function handleScenario(text: string) {
    try {
      setRunningScenario(text);
      const res = await sendCommand(text);
      if (res.ok && res.sceneAction) {
        setPendingAction(res.sceneAction);
      }
    } finally {
      setRunningScenario(null);
    }
  }

  function handleAction(action: SceneAction) {
    setPendingAction(action);
  }

  return (
    <div style={{ padding: 20, minHeight: '100vh', background: 'radial-gradient(circle at top, #172554 0%, #0b1020 38%, #09111f 100%)', color: '#e6eef8', fontFamily: 'Inter,system-ui,sans-serif' }}>
      <header style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.18)', color: '#a5c9ff', padding: '4px 10px', borderRadius: 999, fontSize: 12, marginBottom: 10 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#34d399' : '#f87171', display: 'inline-block' }} />
            {connected ? 'Bridge Connected' : 'Bridge Disconnected'}
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 30 }}>Cesium MCP Demo</h1>
          <p style={{ margin: 0, color: '#a9bbd3', fontSize: 14 }}>
            用按钮或自然语言触发命令，经过本地 bridge 和 MCP-style tools，实时驱动 Cesium 地图响应。
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <StatCard title="Events" value={String(logSummary.total)} tone="#60a5fa" />
          <StatCard title="Errors" value={String(logSummary.errors)} tone={logSummary.errors > 0 ? '#f87171' : '#34d399'} />
          <StatCard title="Mode" value="Intent Demo" tone="#a78bfa" />
        </div>
      </header>

      <section style={{ ...panelStyle, marginBottom: 16, paddingBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Quick Demo Scenarios</div>
            <div style={{ fontSize: 12, color: '#8fa3c2' }}>适合现场演示，一键触发更像“讲解式”的命令。</div>
          </div>
          <div style={{ fontSize: 12, color: '#9eb2d0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(133,153,188,0.14)', borderRadius: 999, padding: '4px 10px' }}>
            {intentSummary}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {DEMO_SCENARIOS.map((item) => {
            const busy = runningScenario === item.text;
            return (
              <button
                key={item.text}
                onClick={() => handleScenario(item.text)}
                disabled={!!runningScenario}
                style={{
                  border: '1px solid rgba(133,153,188,0.2)',
                  background: busy ? 'rgba(59,130,246,0.16)' : 'rgba(255,255,255,0.05)',
                  color: '#dbe7f5',
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: runningScenario ? 'wait' : 'pointer',
                  minWidth: 140,
                  textAlign: 'left',
                  opacity: runningScenario && !busy ? 0.7 : 1,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: 13 }}>{busy ? '执行中…' : item.title}</div>
                <div style={{ marginTop: 4, fontSize: 12, color: '#9eb2d0' }}>{item.text}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 360px', gap: 16, minHeight: 'calc(100vh - 220px)' }}>
        <div style={panelStyle}>
          <ControlPanel onAction={handleAction} />
          <CommandInput onAction={handleAction} />
        </div>

        <div style={{ ...panelStyle, padding: 10, minHeight: 540, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 14, left: 14, zIndex: 1, background: 'rgba(9,17,31,0.78)', border: '1px solid rgba(133,153,188,0.18)', borderRadius: 999, padding: '4px 10px', fontSize: 12, color: '#b4c3d9' }}>
            Scene View · {intentSummary}
          </div>
          <CesiumViewer pendingAction={pendingAction} />
        </div>

        <div style={panelStyle}>
          <EventLog entries={entries} onClear={clear} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div style={{ minWidth: 88, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(133,153,188,0.16)', borderRadius: 14, padding: '10px 12px' }}>
      <div style={{ fontSize: 11, color: '#8fa3c2', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: tone }}>{value}</div>
    </div>
  );
}

const panelStyle: React.CSSProperties = {
  background: 'rgba(10, 18, 34, 0.82)',
  border: '1px solid rgba(133,153,188,0.16)',
  borderRadius: 18,
  padding: 16,
  boxShadow: '0 20px 40px rgba(0,0,0,0.28)',
  backdropFilter: 'blur(10px)',
};
