import { describe, expect, it } from 'vitest';
import { parseCommand } from '../application/commandParser';

describe('parseCommand', () => {
  it('parses fly_to for city name', () => {
    const r = parseCommand('飞到北京');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.command.type).toBe('fly_to');
      if (r.command.type === 'fly_to') {
        expect(r.command.lon).toBeCloseTo(116.397);
      }
    }
  });

  it('parses fly_to for coordinates', () => {
    const r = parseCommand('飞到 121.47,31.23');
    expect(r.ok).toBe(true);
    if (r.ok && r.command.type === 'fly_to') {
      expect(r.command.lon).toBeCloseTo(121.47);
    }
  });

  it('parses clear_entities', () => {
    const r = parseCommand('清空标记');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.command.type).toBe('clear_entities');
  });

  it('parses switch_base_layer', () => {
    const r = parseCommand('切换到 osm');
    expect(r.ok).toBe(true);
    if (r.ok && r.command.type === 'switch_base_layer') {
      expect(r.command.layer).toBe('osm');
    }
  });

  it('parses draw_polyline between two cities', () => {
    const r = parseCommand('画一条从北京到上海的线');
    expect(r.ok).toBe(true);
    if (r.ok && r.command.type === 'draw_polyline') {
      expect(r.command.points.length).toBe(2);
    }
  });

  it('returns error for empty input', () => {
    const r = parseCommand('');
    expect(r.ok).toBe(false);
  });

  it('returns error for unrecognized input', () => {
    const r = parseCommand('做一杯咖啡');
    expect(r.ok).toBe(false);
  });
});
