import { useState, useCallback } from 'react';

export type LogEntry = {
  id: string;
  type: string;
  message: string;
  payload?: unknown;
  ts: string;
};

export function useLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const append = useCallback((entry: Omit<LogEntry, 'ts'>) => {
    setEntries(prev => [
      { ...entry, ts: new Date().toLocaleTimeString() },
      ...prev.slice(0, 99),
    ]);
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, append, clear };
}
