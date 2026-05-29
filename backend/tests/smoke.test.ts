import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('Sandbox Smoke Tests', () => {
  it('should have a health check endpoint', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return 404 for non-existent sandbox session', async () => {
    const res = await request(app).get('/api/sandbox/status/invalid-id');
    expect(res.status).toBe(404);
  });
});
