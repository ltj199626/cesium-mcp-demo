import { useState } from 'react';
import { sendPreset } from '../api/bridgeClient';
import type { SceneAction } from '../api/bridgeClient';

const PRESETS: { label: string; preset: string; hint: string }[] = [
  { label: '飞到北京', preset: 'flyToBeijing', hint: '快速定位到北京' },
  { label: '飞到上海', preset: 'flyToShanghai', hint: '快速定位到上海' },
  { label: '飞到广州', preset: 'flyToGuangzhou', hint: '快速定位到广州' },
  { label: '飞到深圳', preset: 'flyToShenzhen', hint: '快速定位到深圳' },
  { label: '添加天安门标记', preset: 'addTiananmenMarker', hint: '在北京添加一个演示标记' },
  { label: '北京→上海连线', preset: 'drawBeijingToShanghaiLine', hint: '绘制一条跨城连线' },
  { label: '切换 OSM 底图', preset: 'switchToOsm', hint: '切换到底图模式' },
  { label: '切换 Ion 底图', preset: 'switchToIon', hint: '当前仍走稳定底图策略' },
  { label: '清空实体', preset: 'clearEntities', hint: '清空当前所有标记和连线' },
];

export function ControlPanel({ onAction }: { onAction: (a: SceneAction) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function handlePreset(preset: string) {
    try {
      setLoading(preset);
      const res = await sendPreset(preset);
      if (res.ok && res.sceneAction) onAction(res.sceneAction);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div>
        <h2 style={{ margin: '0 0 4px', fontSize: 16 }}>预置操作</h2>
        <div style={{ color: '#7f93b2', fontSize: 12 }}>适合演示时快速点按，直接触发 MCP tool 链路。</div>
      </div>

      {PRESETS.map(({ label, preset, hint }) => {
        const busy = loading === preset;
        return (
          <button
            key={preset}
            onClick={() => handlePreset(preset)}
            disabled={!!loading}
            style={{
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(133,153,188,0.25)',
              background: busy ? 'rgba(59,130,246,0.18)' : 'rgba(255,255,255,0.05)',
              color: '#e6eef8',
              cursor: loading ? 'wait' : 'pointer',
              fontSize: 13,
              textAlign: 'left',
              transition: 'background 0.15s, border-color 0.15s',
              opacity: loading && !busy ? 0.65 : 1,
            }}
            title={hint}
          >
            <div style={{ fontWeight: 600 }}>{busy ? '执行中… ' : ''}{label}</div>
            <div style={{ fontSize: 11, color: '#8da3c6', marginTop: 2 }}>{hint}</div>
          </button>
        );
      })}
    </div>
  );
}
