# Cesium MCP Demo Design

Date: 2026-03-31
Topic: Cesium MCP demo
Status: Draft approved by user in chat

## 1. Goal

Build a runnable local demo under `F:\项目\openClaw_work\cesium-mcp-demo` that shows a complete interaction loop:

- user clicks preset buttons or enters natural-language commands
- a local bridge server receives the command
- the bridge maps the request to MCP tool calls
- the Cesium scene updates in response
- the UI shows an execution log for the full chain

The demo should optimize for clarity, stability, and presentation value rather than production completeness.

## 2. Scope

### In scope

- Vite + Cesium frontend
- Node.js + TypeScript server
- MCP-style tool layer for map actions
- preset control buttons
- natural-language input with rule-based parsing
- execution log panel
- base layer switching
- markers, fly-to, polyline drawing, clear actions
- local development workflow and README

### Out of scope for v1

- LLM-backed command understanding
- multi-user collaboration
- authentication
- persistent storage
- remote deployment
- full MCP ecosystem compatibility testing across many clients
- complex GIS workflows like GeoJSON editing/import pipelines

## 3. Product Shape

The demo uses the chosen combination:

- **Presentation shape:** control console + log + Cesium map (`C`)
- **Implementation shape:** frontend talks to a local demo bridge, and the bridge maps actions to MCP tools (`A`)

This gives a clear live-demo UX while keeping the browser isolated from MCP protocol details.

## 4. User Experience

A single demo page should include:

- a Cesium globe/map viewport
- a preset action panel with buttons
- a natural-language command input box
- a scrolling execution log panel

### Example button actions

- Fly to Beijing
- Fly to Shanghai
- Add Tiananmen marker
- Draw Beijing → Shanghai line
- Switch base layer
- Clear map objects

### Example natural-language commands

- `飞到北京`
- `飞到上海`
- `飞到 116.397,39.908`
- `添加天安门标记在北京`
- `画一条从北京到上海的线`
- `切换到底图 osm`
- `清空地图对象`

## 5. Architecture

## 5.1 High-level components

### Frontend (`frontend/`)

Responsibilities:

- render the Cesium viewer
- collect user interactions
- submit commands to the local bridge
- receive result events
- update the scene and the execution log

Suggested modules:

- `MapView`: Cesium viewer setup and scene updates
- `ControlPanel`: preset actions
- `CommandInput`: text command form
- `EventLog`: execution log display
- `api/bridgeClient`: communication with bridge endpoints
- `state/demoStore`: local UI state

### Server (`server/`)

Responsibilities:

- expose frontend-friendly APIs
- parse and normalize incoming commands
- route commands to MCP tools
- broadcast results/events back to the frontend

Suggested modules:

- `api/http.ts`: HTTP server bootstrap
- `api/routes/command.ts`: accepts command submissions
- `api/routes/events.ts`: SSE stream endpoint
- `application/commandRouter.ts`: shared execution pipeline
- `application/nlParser.ts`: rule-based natural-language parser
- `application/eventBus.ts`: publish execution events
- `mcp/tools/*`: MCP tool definitions
- `mcp/toolExecutor.ts`: tool invocation wrapper
- `domain/cityCatalog.ts`: supported city coordinate table
- `domain/types.ts`: shared command/result types

### Shared contract

If needed, shared types can live in `server/domain/types.ts` first. A separate `shared/` package is not required for v1.

## 5.2 Command pipeline

All user actions must go through one execution path.

1. user triggers a preset action or enters text
2. frontend sends a request to `POST /api/command`
3. bridge classifies the input:
   - preset command → direct structured command mapping
   - natural language → parse into structured command
4. bridge invokes the mapped MCP tool
5. tool returns a structured result
6. bridge emits execution events through SSE
7. frontend updates the scene and log

This unified pipeline ensures that button-driven and text-driven interactions are demonstrated as the same underlying tool system.

## 6. API Design

### `POST /api/command`

Purpose:
- accept a preset command or natural-language command

Request examples:

```json
{ "mode": "preset", "action": "flyToBeijing" }
```

```json
{ "mode": "text", "text": "飞到北京" }
```

Response example:

```json
{
  "ok": true,
  "requestId": "req_123",
  "normalizedCommand": {
    "type": "fly_to",
    "lon": 116.397,
    "lat": 39.908,
    "label": "Beijing"
  }
}
```

### `GET /api/events`

Purpose:
- stream execution events to the frontend via SSE

Event types may include:

- `command_received`
- `command_parsed`
- `tool_invoking`
- `tool_result`
- `scene_update`
- `error`

### Optional `GET /api/state`

Purpose:
- return a snapshot of current frontend-relevant state for recovery/debugging

This is optional for v1 and should only be added if it simplifies client startup.

## 7. MCP Tool Set

Keep the initial tool set intentionally small and demo-friendly.

### `fly_to`

Inputs:
- `lon: number`
- `lat: number`
- `height?: number`
- `label?: string`

Result:
- structured camera target payload

### `add_marker`

Inputs:
- `name: string`
- `lon: number`
- `lat: number`
- `description?: string`

Result:
- marker entity payload

### `draw_polyline`

Inputs:
- `name?: string`
- `points: Array<{ lon: number; lat: number }>`

Result:
- polyline payload

### `switch_base_layer`

Inputs:
- `layer: "osm" | "imagery" | "ion"`

Result:
- active layer payload

### `clear_entities`

Inputs:
- optional filter or none for v1

Result:
- cleared entity summary

## 8. Natural-Language Parsing Strategy

Use a deterministic rule-based parser in v1. Do not depend on an external LLM.

Parsing strategy:

- keyword matching for command type
- regex extraction for lon/lat pairs
- lookup table for supported city names
- simple templates for marker/line/base-layer commands

### Supported city catalog for v1

At minimum:

- Beijing
- Shanghai
- Guangzhou
- Shenzhen

The catalog should be easy to extend.

### Parser behavior

- if a city name is found, map it to known coordinates
- if numeric coordinates are found, use them directly
- if required fields are missing, return a structured parse error
- if the place is unknown, return a helpful unsupported-location error

## 9. Frontend Scene Update Strategy

The frontend should remain responsible for actual Cesium rendering.

The backend returns structured result payloads. The frontend translates those results into Cesium actions, such as:

- camera flight
- entity add/update/remove
- base layer switch
- log entry rendering

This keeps Cesium-specific rendering logic in one place and prevents the server from depending on browser-only rendering concerns.

## 10. Error Handling

The demo should fail clearly and safely.

### Error categories

#### Parse errors
Examples:
- command not recognized
- missing location
- unsupported city

UX behavior:
- log a readable error
- keep the current map state unchanged
- show one or two example commands

#### Tool execution errors
Examples:
- invalid parameters passed to tool
- internal execution exception

UX behavior:
- log a highlighted error
- return a structured failure payload
- avoid partial/broken UI state when possible

#### Cesium initialization errors
Examples:
- missing token/config issue
- viewer bootstrap failure

UX behavior:
- show a visible startup error panel
- explain likely configuration cause in README

#### SSE / bridge connection errors
UX behavior:
- show disconnected state in log/UI
- allow page refresh recovery
- keep command posting behavior explicit about failure

## 11. Testing Strategy

Testing should be practical and focused.

### Server tests

- parser unit tests
- command router unit tests
- tool input/output tests

### Frontend checks

- smoke test that the viewer loads
- component-level checks for log rendering and command submission
- manual demo verification checklist for scene updates

### Demo verification checklist

- page loads successfully
- Cesium scene renders
- each preset button works
- text command for fly-to works
- text command for marker works
- text command for polyline works
- base layer switch works
- clear action works
- parse error shows readable feedback
- execution log shows the main stages

## 12. Directory Layout

```text
F:\项目\openClaw_work\cesium-mcp-demo\
  frontend\
    src\
      components\
      api\
      state\
      cesium\
    package.json
    vite.config.ts
  server\
    src\
      api\
      application\
      mcp\
      domain\
    package.json
    tsconfig.json
  docs\
    superpowers\
      specs\
        2026-03-31-cesium-mcp-demo-design.md
  package.json
  README.md
```

## 13. Non-Goals and Constraints

- v1 should favor readability over abstraction
- avoid introducing extra services or databases
- avoid direct browser-side MCP protocol complexity
- avoid premature package splitting unless it clearly reduces confusion
- keep the demo runnable locally with straightforward commands

## 14. Recommended Implementation Order

1. scaffold project structure
2. bring up Cesium frontend and basic page layout
3. create bridge server with `POST /api/command` and SSE events
4. implement MCP tool definitions and execution wrapper
5. wire preset buttons through the command pipeline
6. add rule-based natural-language parser
7. connect frontend scene updates to tool results
8. add execution log polish and README instructions
9. run verification checklist

## 15. Success Criteria

The v1 demo is successful if:

- it runs locally from the target directory
- the page shows a working Cesium globe
- at least 5 preset actions work
- at least 4 classes of text command work
- the execution log makes the MCP flow understandable
- README is sufficient for another developer to run the demo

## 16. Risks and Mitigations

### Risk: Cesium setup friction
Mitigation:
- document token/config clearly
- choose the simplest working base-layer path for local development

### Risk: natural-language parsing feels brittle
Mitigation:
- keep supported commands narrow and explicit
- provide examples in UI and README

### Risk: architecture becomes over-engineered
Mitigation:
- keep v1 to frontend + local bridge + MCP tool layer only
- defer shared package extraction and advanced state sync

## 17. Follow-up After Design

After user review of this spec, the next step is to create an implementation plan, then execute it.
