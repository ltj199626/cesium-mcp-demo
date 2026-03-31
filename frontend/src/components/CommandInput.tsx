import { useState } from 'react';
import { sendCommand } from '../api/bridgeClient';
import type { SceneAction } from '../api/bridgeClient';

const QUICK_EXAMPLES = [
  '飞到北京',
  '飞到 121.473,31.230',
  '添加天安门标记在北京',
  '画一条从北京到上海的线',
  '切换到 osm',
  '清空标记',
];

export function CommandInput({ onAction }: { onAction: (a: SceneAction) => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [examples, setExamples] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    setExamples([]);
    try {
      const res = await sendCommand(text);
      if (res.ok && res.sceneAction) {
        onAction(res.sceneAction);
        setText('');
      } else {
        setError(res.error ?? '未知错误');
        setExamples(res.examples ?? []);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ margin: '0 0 4px', fontSize: 16 }}>自然语言输入</h2>
        <div style={{ color: '#7f93b2', fontSize: 12 }}>输入中文命令，走规则解析 → MCP tool → 地图更新。</div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="例: 画一条从北京到广州的线"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(133,153,188,0.3)',
            background: 'rgba(255,255,255,0.05)',
            color: '#e6eef8',
            fontSize: 13,
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 16px',
            borderRadius: 10,
            border: 'none',
            background: submitting ? '#4b5563' : '#3b82f6',
            color: '#fff',
            cursor: submitting ? 'wait' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {submitting ? '执行中…' : '执行'}
        </button>
      </form>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
        {QUICK_EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setText(example)}
            style={{
              border: '1px solid rgba(133,153,188,0.2)',
              background: 'rgba(255,255,255,0.04)',
              color: '#9eb2d0',
              fontSize: 12,
              borderRadius: 999,
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            {example}
          </button>
        ))}
      </div>

      {error && (
        <div style={{ marginTop: 10, color: '#f87171', fontSize: 13, background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10, padding: 10 }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>命令解析失败</div>
          <div>{error}</div>
          {examples.length > 0 && (
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              {examples.map((ex, i) => <li key={i} style={{ color: '#c6d2e3' }}>{ex}</li>)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
