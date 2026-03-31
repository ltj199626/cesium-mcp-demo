import type { Response } from 'express';
import type { ServerEvent } from '../domain/types.js';

const clients = new Set<Response>();

export function addClient(res: Response) {
  clients.add(res);
}

export function removeClient(res: Response) {
  clients.delete(res);
}

export function broadcast(event: ServerEvent) {
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of clients) {
    res.write(payload);
  }
}

let seq = 0;
export function makeEventId() {
  return String(++seq);
}
