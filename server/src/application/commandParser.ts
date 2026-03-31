import { cityCatalog } from '../domain/cityCatalog.js';
import type { ParseResult } from '../domain/types.js';

const COORD_RE = /(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/;

const REGION_SHOWCASES: Record<string, { name: string; lon: number; lat: number }> = {
  长三角: { name: '长三角演示点', lon: 120.5853, lat: 31.2989 },
  珠三角: { name: '珠三角演示点', lon: 113.5, lat: 22.9 },
  华东: { name: '华东演示点', lon: 118.8, lat: 31.9 },
};

const CITY_GROUPS: Record<string, { name: string; lon: number; lat: number }> = {
  一线城市: { name: '一线城市示意点', lon: 113.264, lat: 23.129 },
  核心城市: { name: '核心城市示意点', lon: 121.473, lat: 31.23 },
};

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

  // showcase regions and city groups
  for (const [key, value] of Object.entries(REGION_SHOWCASES)) {
    if (t.includes(key) && /(看看|展示|带我|show|演示)/i.test(t)) {
      return {
        ok: true,
        command: { type: 'add_marker', name: value.name, lon: value.lon, lat: value.lat, description: `区域演示：${key}` },
      };
    }
  }

  for (const [key, value] of Object.entries(CITY_GROUPS)) {
    if (t.includes(key) && /(标出|展示|看看|show|几个)/i.test(t)) {
      return {
        ok: true,
        command: { type: 'add_marker', name: value.name, lon: value.lon, lat: value.lat, description: `城市组演示：${key}` },
      };
    }
  }

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
  if (/画|draw|线|line|连起来|连到/i.test(t)) {
    const mentioned: Array<{ name: string; lon: number; lat: number }> = [];
    for (const [name, coord] of Object.entries(cityCatalog)) {
      if (t.includes(name)) mentioned.push({ name, ...coord });
    }
    if (mentioned.length >= 2) {
      return {
        ok: true,
        command: {
          type: 'draw_polyline',
          name: mentioned.slice(0, 2).map(c => c.name).join(' → '),
          points: mentioned.slice(0, 2).map(c => ({ lon: c.lon, lat: c.lat })),
        },
      };
    }
    return {
      ok: false,
      error: '画线需要指定至少两个城市',
      examples: ['画一条从北京到上海的线'],
    };
  }

  // add marker colloquial
  if (/标记|marker|mark|添加|add|放一个点|加个点|放个点/i.test(t)) {
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

  // colloquial fly_to — city
  const city = findCity(t);
  if (city && /(飞|去|看看|跳到|定位|带我)/i.test(t)) {
    return { ok: true, command: { type: 'fly_to', lon: city.lon, lat: city.lat, label: city.name } };
  }

  // plain city fallback
  if (city) {
    return { ok: true, command: { type: 'fly_to', lon: city.lon, lat: city.lat, label: city.name } };
  }

  return {
    ok: false,
    error: `无法识别命令: "${t}"`,
    examples: [
      `飞到北京（支持: ${SUPPORTED_CITIES}）`,
      '飞到 116.397,39.908',
      '在上海放一个点',
      '画一条从北京到上海的线',
      '带我看看长三角',
      '标出几个一线城市',
      '切换到 osm',
      '清空标记',
    ],
  };
}
