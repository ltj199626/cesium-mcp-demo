import type { StructuredCommand } from '../domain/types.js';
import { cityCatalog } from '../domain/cityCatalog.js';

export const presetActions: Record<string, StructuredCommand> = {
  flyToBeijing: { type: 'fly_to', lon: cityCatalog.Beijing.lon, lat: cityCatalog.Beijing.lat, label: '北京' },
  flyToShanghai: { type: 'fly_to', lon: cityCatalog.Shanghai.lon, lat: cityCatalog.Shanghai.lat, label: '上海' },
  flyToGuangzhou: { type: 'fly_to', lon: cityCatalog.Guangzhou.lon, lat: cityCatalog.Guangzhou.lat, label: '广州' },
  flyToShenzhen: { type: 'fly_to', lon: cityCatalog.Shenzhen.lon, lat: cityCatalog.Shenzhen.lat, label: '深圳' },
  addTiananmenMarker: { type: 'add_marker', name: '天安门', lon: 116.3972, lat: 39.9087, description: '北京天安门广场' },
  drawBeijingToShanghaiLine: {
    type: 'draw_polyline',
    name: '北京 → 上海',
    points: [
      { lon: cityCatalog.Beijing.lon, lat: cityCatalog.Beijing.lat },
      { lon: cityCatalog.Shanghai.lon, lat: cityCatalog.Shanghai.lat },
    ],
  },
  switchToOsm: { type: 'switch_base_layer', layer: 'osm' },
  switchToIon: { type: 'switch_base_layer', layer: 'ion' },
  clearEntities: { type: 'clear_entities' },
};
