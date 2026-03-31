import type { LogEntry } from '../state/useLog';

const TYPE_COLOR: Record<string, string> = {
  command_received: '#60a5fa',
  command_parsed: '#a78bfa',
  tool_invoking: '#f59e0b',
  tool_result: '#34d399',
  scene_update: '#34d399',
  error: '#f87171',
};

const TYPE_LABEL: Record<string, string> = {
  command_received: '原始输入',
  command_parsed: '归一化意图',
  tool_invoking: '工具调用',
  tool_result: '执行结果',
  scene_update: '地图更新',
  error: '错误',
};

export function EventLog({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16 }}>Execution Log</h2>
          <div style={{ marginTop: 4, fontSize: 12, color: '#7f93b2' }}>按“输入 → 意图 → 执行”顺序观察 demo 全链路。</div>
        </div>
        <button onClick={onClear} style={{ fontSize: 12, padding: '2px 10px', cursor: 'pointer', borderRadius: 6, border: '1px solid #334', background: '#1a2035', color: '#a9bbd3' }}>清空</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.length === 0 && (
          <div style={{ color: '#4a5878', fontSize: 13, padding: 8 }}>等待命令...</div>
        )}
        {entries.map(e => (
          <div key={e.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 10px', borderLeft: `3px solid ${TYPE_COLOR[e.type] ?? '#888'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7fa3', marginBottom: 2 }}>
              <span style={{ color: TYPE_COLOR[e.type] ?? '#888', fontWeight: 700 }}>{TYPE_LABEL[e.type] ?? e.type}</span>
              <span>{e.ts}</span>
            </div>
            <div style={{ fontSize: 13 }}>{e.message}</div>
            {e.payload !== undefined && (
              <pre style={{ margin: '6px 0 0', fontSize: 11, color: '#6b7fa3', whiteSpace: 'pre-wrap', wordBreak: 'break-all', background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 8 }}>
                {String(JSON.stringify(e.payload, null, 2))}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
