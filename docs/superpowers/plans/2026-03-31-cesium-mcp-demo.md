# Cesium MCP Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable local Cesium + MCP demo with preset controls, natural-language command input, a bridge server, MCP-style tools, and a visible execution log.

**Architecture:** The project is a local demo with two runtime parts: a Vite + Cesium frontend for rendering and interaction, and a Node.js + TypeScript server that exposes a frontend-friendly bridge API and an MCP-style tool layer. All actions flow through one command pipeline so buttons and text commands share the same parsing, execution, logging, and scene-update path.

**Tech Stack:** Vite, React, TypeScript, Cesium, Node.js, Express, Server-Sent Events, Vitest, npm workspaces

---

## File Structure

### Root
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/package.json` — workspace scripts for frontend/server/dev
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/.gitignore` — ignore dependencies/build outputs/env files
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/README.md` — setup, run, demo commands, troubleshooting
- Keep: `F:/项目/openClaw_work/cesium-mcp-demo/docs/superpowers/specs/2026-03-31-cesium-mcp-demo-design.md`

### Frontend
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/package.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/tsconfig.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/vite.config.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/index.html`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/main.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/App.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/styles.css`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/types.ts` — frontend-facing shared payload types
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/api/bridgeClient.ts` — command POST + SSE subscription helpers
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/state/demoStore.ts` — app state, log entries, scene actions
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/MapView.tsx` — Cesium viewer + scene updates
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/ControlPanel.tsx` — preset buttons
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/CommandInput.tsx` — text entry form
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/EventLog.tsx` — execution log UI
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/cesium/viewer.ts` — viewer init helper
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/cesium/applySceneAction.ts` — result payload → Cesium updates
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/env.d.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/__tests__/App.smoke.test.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/__tests__/EventLog.test.tsx`

### Server
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/package.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/tsconfig.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/index.ts` — server bootstrap
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/createApp.ts` — Express app wiring
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/routes/command.ts` — `POST /api/command`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/routes/events.ts` — `GET /api/events` SSE
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/commandRouter.ts` — central command pipeline
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/nlParser.ts` — rule-based parsing
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/presetCommands.ts` — preset action mapping
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/eventBus.ts` — SSE event publish/subscribe
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/domain/cityCatalog.ts` — supported city coordinates
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/domain/types.ts` — command/tool/event/result types
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/toolExecutor.ts` — tool dispatch wrapper
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/flyTo.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/addMarker.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/drawPolyline.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/switchBaseLayer.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/clearEntities.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/nlParser.test.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/commandRouter.test.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/toolExecutor.test.ts`

## Task 1: Scaffold root workspace

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/package.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/.gitignore`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/README.md`

- [ ] **Step 1: Create root `package.json` with npm workspaces and dev scripts**

```json
{
  "name": "cesium-mcp-demo",
  "private": true,
  "workspaces": ["frontend", "server"],
  "scripts": {
    "dev:frontend": "npm --workspace frontend run dev",
    "dev:server": "npm --workspace server run dev",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:frontend\"",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

- [ ] **Step 2: Create `.gitignore`**

```gitignore
node_modules/
dist/
.vite/
coverage/
.env
.env.*
*.log
```

- [ ] **Step 3: Create initial `README.md` skeleton**

Include sections for:
- project overview
- prerequisites
- install
- run frontend/server
- demo commands
- Cesium configuration notes

- [ ] **Step 4: Install root dependencies**

Run: `npm install`
Expected: root lockfile created successfully

- [ ] **Step 5: Verify workspace scripts are recognized**

Run: `npm run`
Expected: shows root scripts including `dev`, `build`, `test`

- [ ] **Step 6: Commit scaffold**

```bash
git add package.json package-lock.json .gitignore README.md
git commit -m "chore: scaffold cesium mcp demo workspace"
```

## Task 2: Scaffold server with tests first

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/package.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/tsconfig.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/index.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/createApp.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/commandRouter.test.ts`

- [ ] **Step 1: Create server `package.json`**

```json
{
  "name": "server",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "test": "vitest run"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json` for the server**

Use strict TypeScript with `rootDir: src` and `outDir: dist`.

- [ ] **Step 3: Write a failing smoke test for app creation**

```ts
import { describe, expect, it } from 'vitest';
import { createApp } from '../api/createApp';

describe('createApp', () => {
  it('creates an express app instance', () => {
    const app = createApp();
    expect(app).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run the server test to confirm failure**

Run: `npm --workspace server run test`
Expected: FAIL because `createApp` does not exist yet

- [ ] **Step 5: Create minimal `createApp.ts` and `index.ts` implementation**

`createApp.ts` should:
- create an Express app
- attach JSON middleware
- attach CORS middleware
- define a `/health` route returning `{ ok: true }`

`index.ts` should:
- import `createApp`
- listen on `process.env.PORT || 3001`
- log startup URL

- [ ] **Step 6: Re-run server tests**

Run: `npm --workspace server run test`
Expected: PASS

- [ ] **Step 7: Manually start the server and check health**

Run: `npm --workspace server run dev`
Then: `http://localhost:3001/health`
Expected: `{ "ok": true }`

- [ ] **Step 8: Commit server scaffold**

```bash
git add server/package.json server/tsconfig.json server/src
git commit -m "feat: scaffold demo server"
```

## Task 3: Define shared domain types and city catalog

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/domain/types.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/domain/cityCatalog.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/toolExecutor.test.ts`

- [ ] **Step 1: Write a failing test for city lookup**

```ts
import { describe, expect, it } from 'vitest';
import { cityCatalog } from '../domain/cityCatalog';

describe('cityCatalog', () => {
  it('contains Beijing coordinates', () => {
    expect(cityCatalog.Beijing.lon).toBeCloseTo(116.397);
    expect(cityCatalog.Beijing.lat).toBeCloseTo(39.908);
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm --workspace server run test -- src/__tests__/toolExecutor.test.ts`
Expected: FAIL because catalog/types do not exist yet

- [ ] **Step 3: Implement `types.ts`**

Define exact interfaces/types for:
- `PresetAction`
- `StructuredCommand`
- `ParseSuccess`
- `ParseFailure`
- `ToolResult`
- `SceneAction`
- `ServerEvent`

- [ ] **Step 4: Implement `cityCatalog.ts`**

Seed at least:
- Beijing
- Shanghai
- Guangzhou
- Shenzhen

- [ ] **Step 5: Re-run the test**

Run: `npm --workspace server run test`
Expected: PASS for the catalog assertion

- [ ] **Step 6: Commit domain primitives**

```bash
git add server/src/domain server/src/__tests__
git commit -m "feat: add domain types and city catalog"
```

## Task 4: Build and test the natural-language parser

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/nlParser.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/nlParser.test.ts`

- [ ] **Step 1: Write failing parser tests for the supported command classes**

```ts
import { describe, expect, it } from 'vitest';
import { parseNaturalLanguageCommand } from '../application/nlParser';

describe('parseNaturalLanguageCommand', () => {
  it('parses fly-to city commands', () => {
    const result = parseNaturalLanguageCommand('飞到北京');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.command.type).toBe('fly_to');
    }
  });

  it('parses coordinate fly-to commands', () => {
    const result = parseNaturalLanguageCommand('飞到 116.397,39.908');
    expect(result.ok).toBe(true);
  });

  it('parses marker commands', () => {
    const result = parseNaturalLanguageCommand('添加天安门标记在北京');
    expect(result.ok).toBe(true);
  });

  it('parses polyline commands', () => {
    const result = parseNaturalLanguageCommand('画一条从北京到上海的线');
    expect(result.ok).toBe(true);
  });

  it('parses layer switching commands', () => {
    const result = parseNaturalLanguageCommand('切换到底图 osm');
    expect(result.ok).toBe(true);
  });

  it('returns a readable error for unknown locations', () => {
    const result = parseNaturalLanguageCommand('飞到月球');
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run parser tests to verify failure**

Run: `npm --workspace server run test -- src/__tests__/nlParser.test.ts`
Expected: FAIL because parser does not exist yet

- [ ] **Step 3: Implement minimal parser behavior**

`nlParser.ts` should:
- normalize text
- detect command family by keywords
- parse lon/lat via regex
- resolve city names from the catalog
- return structured parse failures with message and examples

- [ ] **Step 4: Re-run parser tests**

Run: `npm --workspace server run test -- src/__tests__/nlParser.test.ts`
Expected: PASS

- [ ] **Step 5: Add one regression test for missing location**

Example input: `添加一个标记`
Expected: parse failure with missing-location message

- [ ] **Step 6: Re-run all server tests**

Run: `npm --workspace server run test`
Expected: PASS

- [ ] **Step 7: Commit parser**

```bash
git add server/src/application/nlParser.ts server/src/__tests__/nlParser.test.ts
git commit -m "feat: add rule-based command parser"
```

## Task 5: Implement MCP-style tools and executor

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/toolExecutor.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/flyTo.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/addMarker.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/drawPolyline.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/switchBaseLayer.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/mcp/tools/clearEntities.ts`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/toolExecutor.test.ts`

- [ ] **Step 1: Write failing tests for tool dispatch**

```ts
import { describe, expect, it } from 'vitest';
import { executeTool } from '../mcp/toolExecutor';

describe('executeTool', () => {
  it('returns a fly-to scene action', () => {
    const result = executeTool({ type: 'fly_to', lon: 116.397, lat: 39.908, label: 'Beijing' });
    expect(result.sceneAction.type).toBe('camera.flyTo');
  });

  it('returns a marker scene action', () => {
    const result = executeTool({ type: 'add_marker', name: '天安门', lon: 116.397, lat: 39.908 });
    expect(result.sceneAction.type).toBe('entity.addMarker');
  });
});
```

- [ ] **Step 2: Run the tool tests to verify failure**

Run: `npm --workspace server run test -- src/__tests__/toolExecutor.test.ts`
Expected: FAIL because tool executor/tools do not exist yet

- [ ] **Step 3: Implement the five tool modules with minimal pure functions**

Each tool should:
- accept one structured command variant
- return a deterministic `ToolResult`
- include user-friendly summary text
- produce one scene action payload

- [ ] **Step 4: Implement `toolExecutor.ts`**

`executeTool` should:
- switch on command type
- delegate to the matching tool module
- throw or return structured failure for unsupported types

- [ ] **Step 5: Re-run the tool tests**

Run: `npm --workspace server run test -- src/__tests__/toolExecutor.test.ts`
Expected: PASS

- [ ] **Step 6: Re-run all server tests**

Run: `npm --workspace server run test`
Expected: PASS

- [ ] **Step 7: Commit MCP-style tool layer**

```bash
git add server/src/mcp server/src/__tests__/toolExecutor.test.ts
git commit -m "feat: add mcp-style map tools"
```

## Task 6: Implement event bus and command router

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/eventBus.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/presetCommands.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/application/commandRouter.ts`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/__tests__/commandRouter.test.ts`

- [ ] **Step 1: Write failing router tests for preset and text commands**

```ts
import { describe, expect, it } from 'vitest';
import { createEventBus } from '../application/eventBus';
import { createCommandRouter } from '../application/commandRouter';

describe('commandRouter', () => {
  it('routes preset commands into tool execution', async () => {
    const eventBus = createEventBus();
    const router = createCommandRouter({ eventBus });
    const result = await router.handle({ mode: 'preset', action: 'flyToBeijing' });
    expect(result.ok).toBe(true);
  });

  it('routes text commands through the parser', async () => {
    const eventBus = createEventBus();
    const router = createCommandRouter({ eventBus });
    const result = await router.handle({ mode: 'text', text: '飞到北京' });
    expect(result.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run the router tests to verify failure**

Run: `npm --workspace server run test -- src/__tests__/commandRouter.test.ts`
Expected: FAIL because router/event bus do not exist yet

- [ ] **Step 3: Implement `eventBus.ts`**

Provide:
- subscribe/unsubscribe
- publish
- in-memory listener list

- [ ] **Step 4: Implement `presetCommands.ts`**

Map preset actions like:
- `flyToBeijing`
- `flyToShanghai`
- `addTiananmenMarker`
- `drawBeijingToShanghaiLine`
- `switchToOsm`
- `clearEntities`

- [ ] **Step 5: Implement `commandRouter.ts`**

Pipeline behavior:
- publish `command_received`
- normalize preset/text into structured command
- publish `command_parsed`
- execute tool
- publish `tool_invoking`, `tool_result`, and `scene_update`
- return structured success/failure

- [ ] **Step 6: Re-run router tests**

Run: `npm --workspace server run test -- src/__tests__/commandRouter.test.ts`
Expected: PASS

- [ ] **Step 7: Re-run all server tests**

Run: `npm --workspace server run test`
Expected: PASS

- [ ] **Step 8: Commit command pipeline**

```bash
git add server/src/application server/src/__tests__/commandRouter.test.ts
git commit -m "feat: add unified command routing pipeline"
```

## Task 7: Expose HTTP and SSE endpoints

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/routes/command.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/routes/events.ts`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/api/createApp.ts`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/server/src/index.ts`

- [ ] **Step 1: Write a failing test for `POST /api/command` contract**

Use an HTTP-level test or lightweight handler test asserting:
- preset submission returns `ok: true`
- text submission returns parse errors when invalid

- [ ] **Step 2: Run the test to verify failure**

Run: `npm --workspace server run test`
Expected: FAIL because routes are not wired yet

- [ ] **Step 3: Implement `command.ts` route**

Route behavior:
- validate request shape
- call router
- return JSON result with `requestId`, `normalizedCommand`, `toolResult`, or `error`

- [ ] **Step 4: Implement `events.ts` route**

SSE behavior:
- set correct SSE headers
- subscribe to event bus
- stream JSON events
- clean up on disconnect

- [ ] **Step 5: Wire routes into `createApp.ts`**

Also keep `/health`.

- [ ] **Step 6: Re-run tests**

Run: `npm --workspace server run test`
Expected: PASS

- [ ] **Step 7: Manually verify endpoint behavior**

Run server, then test:
- `GET /health`
- `POST /api/command` with preset JSON
- `POST /api/command` with text JSON
- `GET /api/events` in browser or curl-like SSE client

Expected: events stream and command responses look correct

- [ ] **Step 8: Commit server API layer**

```bash
git add server/src/api server/src/index.ts
git commit -m "feat: expose bridge api and sse events"
```

## Task 8: Scaffold frontend with tests first

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/package.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/tsconfig.json`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/vite.config.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/index.html`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/main.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/App.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/styles.css`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/env.d.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/__tests__/App.smoke.test.tsx`

- [ ] **Step 1: Create frontend `package.json`**

Include dependencies for:
- `react`
- `react-dom`
- `cesium`

Include dev dependencies for:
- `vite`
- `typescript`
- `vitest`
- `@testing-library/react`
- `jsdom`
- `@vitejs/plugin-react`

- [ ] **Step 2: Create frontend TypeScript and Vite config**

Make sure Cesium static asset handling is configured clearly and minimally.

- [ ] **Step 3: Write a failing smoke test for `App`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the demo title', () => {
    render(<App />);
    expect(screen.getByText(/Cesium MCP Demo/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run the frontend test to verify failure**

Run: `npm --workspace frontend run test`
Expected: FAIL because app does not exist yet

- [ ] **Step 5: Implement minimal frontend shell**

`App.tsx` should render:
- page title
- placeholder control area
- placeholder map area
- placeholder log area

- [ ] **Step 6: Re-run frontend tests**

Run: `npm --workspace frontend run test`
Expected: PASS

- [ ] **Step 7: Start the frontend manually**

Run: `npm --workspace frontend run dev`
Expected: blank but structured demo page renders in browser

- [ ] **Step 8: Commit frontend scaffold**

```bash
git add frontend
git commit -m "feat: scaffold frontend app shell"
```

## Task 9: Add bridge client, app state, and log UI

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/types.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/api/bridgeClient.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/state/demoStore.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/EventLog.tsx`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/App.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/__tests__/EventLog.test.tsx`

- [ ] **Step 1: Write a failing test for `EventLog` rendering**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EventLog } from '../components/EventLog';

describe('EventLog', () => {
  it('renders event summaries', () => {
    render(<EventLog entries={[{ id: '1', level: 'info', message: 'command received' }]} />);
    expect(screen.getByText('command received')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the frontend tests to verify failure**

Run: `npm --workspace frontend run test`
Expected: FAIL because `EventLog` does not exist yet

- [ ] **Step 3: Implement `types.ts` and `demoStore.ts`**

State should minimally track:
- command submission state
- log entries
- latest scene action
- connection state

- [ ] **Step 4: Implement `bridgeClient.ts`**

Functions:
- `postPresetCommand(action)`
- `postTextCommand(text)`
- `subscribeToEvents(onEvent)`

- [ ] **Step 5: Implement `EventLog.tsx` and wire it into `App.tsx`**

- [ ] **Step 6: Re-run frontend tests**

Run: `npm --workspace frontend run test`
Expected: PASS

- [ ] **Step 7: Commit bridge/log state layer**

```bash
git add frontend/src
 git commit -m "feat: add frontend bridge client and event log"
```

## Task 10: Add Cesium viewer and scene-action application

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/cesium/viewer.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/cesium/applySceneAction.ts`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/MapView.tsx`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/App.tsx`

- [ ] **Step 1: Write a failing test or adapter-level assertion for scene-action translation**

Example: a `camera.flyTo` scene action should call the adapter function with expected camera parameters.

- [ ] **Step 2: Run the test to verify failure**

Run: `npm --workspace frontend run test`
Expected: FAIL because scene-action helpers do not exist yet

- [ ] **Step 3: Implement `viewer.ts`**

Responsibilities:
- initialize Cesium viewer once
- handle startup errors cleanly
- export a small interface usable by React

- [ ] **Step 4: Implement `applySceneAction.ts`**

Support at least:
- `camera.flyTo`
- `entity.addMarker`
- `entity.drawPolyline`
- `layer.switch`
- `entity.clear`

- [ ] **Step 5: Implement `MapView.tsx`**

Responsibilities:
- mount Cesium container
- create viewer
- apply latest scene action from app state
- show error fallback on initialization failure

- [ ] **Step 6: Re-run frontend tests**

Run: `npm --workspace frontend run test`
Expected: PASS

- [ ] **Step 7: Manually verify the Cesium page loads**

Run frontend dev server
Expected: viewer is visible and no fatal startup error occurs

- [ ] **Step 8: Commit Cesium viewer integration**

```bash
git add frontend/src/cesium frontend/src/components/MapView.tsx frontend/src/App.tsx
git commit -m "feat: add cesium viewer and scene actions"
```

## Task 11: Add controls and wire the full interaction loop

**Files:**
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/ControlPanel.tsx`
- Create: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/components/CommandInput.tsx`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/App.tsx`
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/frontend/src/state/demoStore.ts`

- [ ] **Step 1: Write a failing test for command submission UI**

Example assertions:
- clicking a preset button calls the preset submit function
- submitting text calls the text submit function

- [ ] **Step 2: Run the test to verify failure**

Run: `npm --workspace frontend run test`
Expected: FAIL because controls do not exist yet

- [ ] **Step 3: Implement `ControlPanel.tsx`**

Preset actions should include at least:
- fly to Beijing
- fly to Shanghai
- add Tiananmen marker
- draw Beijing → Shanghai line
- switch to OSM
- clear entities

- [ ] **Step 4: Implement `CommandInput.tsx`**

Behavior:
- text box
- submit button
- small example commands shown below input
- disabled state while submitting

- [ ] **Step 5: Wire controls into `App.tsx` and app state**

The page should:
- post commands
- subscribe to SSE events on mount
- append events into the log
- apply scene actions to the map

- [ ] **Step 6: Re-run frontend tests**

Run: `npm --workspace frontend run test`
Expected: PASS

- [ ] **Step 7: Manually verify end-to-end behavior**

With frontend and server both running:
- click a preset button and see the map respond
- enter `飞到北京` and see the map respond
- enter an invalid command and see a readable error in the log

- [ ] **Step 8: Commit end-to-end UI flow**

```bash
git add frontend/src
git commit -m "feat: wire controls to bridge and map updates"
```

## Task 12: Finish docs and run final verification

**Files:**
- Modify: `F:/项目/openClaw_work/cesium-mcp-demo/README.md`

- [ ] **Step 1: Expand `README.md` with exact setup and run steps**

Include:
- prerequisites
- install commands
- server/frontend dev commands
- expected ports
- Cesium token/config notes if needed
- sample commands
- troubleshooting for blank map / failed startup / parser errors

- [ ] **Step 2: Run all automated tests**

Run: `npm test`
Expected: all frontend and server tests PASS

- [ ] **Step 3: Run production builds**

Run: `npm run build`
Expected: frontend and server build successfully

- [ ] **Step 4: Execute full manual demo checklist**

Verify:
- page loads
- map renders
- 5+ preset actions work
- 4+ text command classes work
- log shows command lifecycle
- errors are readable

- [ ] **Step 5: Update README with any verification findings that affect setup**

- [ ] **Step 6: Commit docs and verification pass**

```bash
git add README.md
git commit -m "docs: finalize cesium mcp demo setup and verification"
```

## Notes for the implementer

- Keep v1 intentionally narrow; do not add LLM integration.
- Prefer pure functions for parser and tools to keep testing simple.
- Keep Cesium-specific rendering logic in frontend helper modules, not in the server.
- If the target directory is not already a git repo, initialize one before attempting commit steps.
- If Cesium setup requires an access token, document exactly where to configure it.
