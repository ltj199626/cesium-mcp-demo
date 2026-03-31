import type { SceneAction, StructuredCommand, ToolResult } from '../../domain/types.js';

export function executeTool(command: StructuredCommand): ToolResult {
  switch (command.type) {
    case 'fly_to': {
      const sceneAction: SceneAction = {
        type: 'camera.flyTo',
        payload: { lon: command.lon, lat: command.lat, height: command.height, label: command.label },
      };
      return {
        ok: true,
        summary: `飞向 ${command.label ?? `[${command.lon}, ${command.lat}]`}`,
        sceneAction,
      };
    }
    case 'add_marker': {
      const sceneAction: SceneAction = {
        type: 'entity.addMarker',
        payload: { name: command.name, lon: command.lon, lat: command.lat, description: command.description },
      };
      return { ok: true, summary: `添加标记: ${command.name}`, sceneAction };
    }
    case 'draw_polyline': {
      const sceneAction: SceneAction = {
        type: 'entity.drawPolyline',
        payload: { name: command.name, points: command.points },
      };
      return { ok: true, summary: `绘制折线: ${command.name ?? '未命名'}`, sceneAction };
    }
    case 'switch_base_layer': {
      const sceneAction: SceneAction = {
        type: 'layer.switch',
        payload: { layer: command.layer },
      };
      return { ok: true, summary: `切换底图: ${command.layer}`, sceneAction };
    }
    case 'clear_entities': {
      const sceneAction: SceneAction = { type: 'entity.clear', payload: {} };
      return { ok: true, summary: '清空所有实体', sceneAction };
    }
  }
}
