import cors from 'cors';
import express from 'express';
import commandRouter from './routes/command.js';
import eventsRouter from './routes/events.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/command', commandRouter);
  app.use('/api/events', eventsRouter);

  return app;
}
