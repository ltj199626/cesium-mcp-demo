import { cityCatalog } from '../domain/cityCatalog.js';
import type { ParseResult, StructuredCommand } from '../domain/types.js';

const COORD_RE = /(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/;

function findCity(text: string) {
  for (const [name, coord] of Object.entries(cityCatalog)) {
    if (text.includes(name)) return { name, ...coord };
  }
  return null;
}

const SUPPORTED_CITIES = Object.keys(cityCatalog).join(' / ');

export function parseCommand(input: string): ParseResult {
  const t = input.trim();
  if (!t) return { ok: false, error: '命令为空', examples: ['飞到北京', '添加天安门标记', '清空标记'] };

  // clear
  if (/清空|clear/i.test(t)) {
    return { ok: true, command: { type: 'clear_entities' } };
  }

  // switch layer
  if (/切换|switch/i.test(t)) {
    const layer = /osm/i.test(t) ? 'osm' : /imagery/i.test(t) ? 'imagery' : 'ion';
    return { ok: true, command: { type: 'switch_base_layer', layer } };
  }

  // draw polyline between two cities
  if (/画|draw|线|line/i.test(t)) {
    const mentioned: Array<{ name: string; lon: number; lat: number }> = [];
    for (const [name, coord] of Object.entries(cityCatalog)) {
      if (t.includes(name)) mentioned.push({ name, ...coord });
    }
    if (mentioned.length >= 2) {
      return {
        ok: true,
        command: {
          type: 'draw_polyline',
          name: mentioned.map(c => c.name).join(' → '),
          points: mentioned.map(c => ({ lon: c.lon, lat: c.lat })),
        },
      };
    }
    return {
      ok: false,
      error: '画线需要指定至少两个城市',
      examples: ['画一条从北京到上海的线'],
    };
  }

  // add marker
  if (/标记|marker|mark|添加|add/i.test(t)) {
    const city = findCity(t);
    if (city) {
      return {
        ok: true,
        command: { type: 'add_marker', name: city.name, lon: city.lon, lat: city.lat },
      };
    }
    const coordMatch = t.match(COORD_RE);
    if (coordMatch) {
      return {
        ok: true,
        command: {
          type: 'add_marker',
          name: '自定义标记',
          lon: parseFloat(coordMatch[1]),
          lat: parseFloat(coordMatch[2]),
        },
      };
    }
    return {
      ok: false,
      error: '添加标记需要指定位置',
      examples: ['添加天安门标记在北京', '添加标记在 116.4,39.9'],
    };
  }

  // fly to — coordinate
  const coordMatch = t.match(COORD_RE);
  if (coordMatch) {
    return {
      ok: true,
      command: {
        type: 'fly_to',
        lon: parseFloat(coordMatch[1]),
        lat: parseFloat(coordMatch[2]),
      },
    };
  }

  // fly to — city
  const city = findCity(t);
  if (city) {
    return { ok: true, command: { type: 'fly_to', lon: city.lon, lat: city.lat, label: city.name } };
  }

  return {
    ok: false,
    error: `无法识别命令: "${t}"`,
    examples: [
      `飞到北京（支持: ${SUPPORTED_CITIES}）`,
      '飞到 116.397,39.908',
      '添加上海标记',
      '画一条从北京到上海的线',
      '切换到 osm',
      '清空标记',
    ],
  };
}
