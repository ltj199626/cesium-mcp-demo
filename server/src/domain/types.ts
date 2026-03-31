// ---- Structured Commands ----

export type FlyToCommand = {
  type: 'fly_to';
  lon: number;
  lat: number;
  height?: number;
  label?: string;
};

export type AddMarkerCommand = {
  type: 'add_marker';
  name: string;
  lon: number;
  lat: number;
  description?: string;
};

export type DrawPolylineCommand = {
  type: 'draw_polyline';
  name?: string;
  points: { lon: number; lat: number }[];
};

export type SwitchBaseLayerCommand = {
  type: 'switch_base_layer';
  layer: 'osm' | 'imagery' | 'ion';
};

export type ClearEntitiesCommand = {
  type: 'clear_entities';
};

export type StructuredCommand =
  | FlyToCommand
  | AddMarkerCommand
  | DrawPolylineCommand
  | SwitchBaseLayerCommand
  | ClearEntitiesCommand;

// ---- Parse Result ----

export type ParseOk = { ok: true; command: StructuredCommand };
export type ParseFail = { ok: false; error: string; examples?: string[] };
export type ParseResult = ParseOk | ParseFail;

// ---- Scene Actions ----

export type SceneAction = {
  type:
    | 'camera.flyTo'
    | 'entity.addMarker'
    | 'entity.drawPolyline'
    | 'layer.switch'
    | 'entity.clear';
  payload: Record<string, unknown>;
};

// ---- Tool Result ----

export type ToolResult = {
  ok: true;
  summary: string;
  sceneAction: SceneAction;
};

// ---- Server Events (SSE) ----

export type ServerEvent = {
  id: string;
  type:
    | 'command_received'
    | 'command_parsed'
    | 'tool_invoking'
    | 'tool_result'
    | 'scene_update'
    | 'error';
  message: string;
  payload?: unknown;
};
