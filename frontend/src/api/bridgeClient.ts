const BASE = 'http://localhost:3001';

export type SceneAction = {
  type: string;
  payload: unknown;
};

export type CommandResponse = {
  ok: boolean;
  summary?: string;
  sceneAction?: SceneAction;
  error?: string;
  examples?: string[];
};

export async function sendCommand(text: string): Promise<CommandResponse> {
  const res = await fetch(`${BASE}/api/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return res.json();
}

export async function sendPreset(preset: string): Promise<CommandResponse> {
  const res = await fetch(`${BASE}/api/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preset }),
  });
  return res.json();
}

export function connectEvents(onEvent: (e: { type: string; message: string; payload?: unknown }) => void): () => void {
  if (typeof EventSource === 'undefined') {
    return () => {};
  }

  const es = new EventSource(`${BASE}/api/events`);
  es.onmessage = (msg) => {
    try {
      onEvent(JSON.parse(msg.data));
    } catch {
      // ignore malformed
    }
  };
  es.onerror = () => {
    // keep demo resilient; browser can auto-reconnect
  };
  return () => es.close();
}
