import type { LogEntry } from '../state/useLog';

const TYPE_COLOR: Record<string, string> = {
  command_received: '#60a5fa',
  command_parsed: '#a78bfa',
  tool_invoking: '#f59e0b',
  tool_result: '#34d399',
  scene_update: '#34d399',
  error: '#f87171',
};

export function EventLog({ entries, onClear }: { entries: LogEntry[]; onClear: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <h2 style={{ margin: 0, fontSize: 16 }}>Execution Log</h2>
        <button onClick={onClear} style={{ fontSize: 12, padding: '2px 10px', cursor: 'pointer', borderRadius: 6, border: '1px solid #334', background: '#1a2035', color: '#a9bbd3' }}>清空</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {entries.length === 0 && (
          <div style={{ color: '#4a5878', fontSize: 13, padding: 8 }}>等待命令...</div>
        )}
        {entries.map(e => (
          <div key={e.id} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '6px 10px', borderLeft: `3px solid ${TYPE_COLOR[e.type] ?? '#888'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7fa3', marginBottom: 2 }}>
              <span style={{ color: TYPE_COLOR[e.type] ?? '#888' }}>{e.type}</span>
              <span>{e.ts}</span>
            </div>
            <div style={{ fontSize: 13 }}>{e.message}</div>
            {e.payload !== undefined && (
              <pre style={{ margin: '4px 0 0', fontSize: 11, color: '#6b7fa3', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {String(JSON.stringify(e.payload, null, 2))}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
