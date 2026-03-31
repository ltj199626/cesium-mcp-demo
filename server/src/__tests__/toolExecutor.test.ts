import { describe, expect, it } from 'vitest';
import { cityCatalog } from '../domain/cityCatalog';

describe('cityCatalog', () => {
  it('contains Beijing coordinates', () => {
    expect(cityCatalog.Beijing.lon).toBeCloseTo(116.397);
    expect(cityCatalog.Beijing.lat).toBeCloseTo(39.908);
  });
});
