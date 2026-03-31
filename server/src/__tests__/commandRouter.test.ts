import { describe, expect, it } from 'vitest';
import { createApp } from '../api/createApp';

describe('createApp', () => {
  it('creates an express app instance', () => {
    const app = createApp();
    expect(app).toBeTruthy();
  });
});
