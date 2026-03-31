import type { Request, Response } from 'express';
import { parseCommand } from './commandParser.js';
import { broadcast, makeEventId } from './eventBus.js';
import { executeTool } from '../mcp/tools/index.js';
import { presetActions } from './presetActions.js';
import type { StructuredCommand } from '../domain/types.js';

export async function handleCommand(req: Request, res: Response) {
  const raw: string = req.body?.text ?? '';
  const preset: string | undefined = req.body?.preset;

  const commandReceived = broadcast({
    id: makeEventId(),
    type: 'command_received',
    message: preset ? `预置动作: ${preset}` : `自然语言: ${raw}`,
    payload: { raw, preset },
  });

  let command: StructuredCommand;

  if (preset) {
    const resolved = presetActions[preset];
    if (!resolved) {
      broadcast({ id: makeEventId(), type: 'error', message: `未知预置动作: ${preset}` });
      res.status(400).json({ ok: false, error: `未知预置动作: ${preset}` });
      return;
    }
    command = resolved;
  } else {
    const parsed = parseCommand(raw);
    if (!parsed.ok) {
      broadcast({
        id: makeEventId(),
        type: 'error',
        message: parsed.error,
        payload: { examples: parsed.examples },
      });
      res.status(422).json(parsed);
      return;
    }
    command = parsed.command;
  }

  broadcast({
    id: makeEventId(),
    type: 'command_parsed',
    message: `解析完成: ${command.type}`,
    payload: command,
  });

  broadcast({ id: makeEventId(), type: 'tool_invoking', message: `调用 MCP tool: ${command.type}` });

  const result = executeTool(command);

  broadcast({
    id: makeEventId(),
    type: 'tool_result',
    message: result.summary,
    payload: result.sceneAction,
  });

  broadcast({
    id: makeEventId(),
    type: 'scene_update',
    message: `地图更新: ${result.summary}`,
    payload: result.sceneAction,
  });

  res.json({ ok: true, summary: result.summary, sceneAction: result.sceneAction });
}
