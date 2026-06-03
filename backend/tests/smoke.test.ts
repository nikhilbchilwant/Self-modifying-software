import { app } from '../src/index';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';

describe('Sandbox Smoke Tests', () => {
  let server: Server;
  let port: number;

  beforeAll(() => {
    return new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address !== 'string') {
          port = address.port;
        }
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
  });

  it('should respond to sandbox enter route', async () => {
    const res = await fetch(`http://localhost:${port}/api/sandbox/enter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data).toHaveProperty('sessionId');
    expect(data.status).toBe('active');
  });

  it('should respond to sandbox modify route', async () => {
    const res = await fetch(`http://localhost:${port}/api/sandbox/modify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-id',
        prompt: 'Change title to customized dashboard',
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data).toHaveProperty('success');
  });

  it('should respond to sandbox exit route', async () => {
    const res = await fetch(`http://localhost:${port}/api/sandbox/exit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: 'test-session-id',
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.status).toBe('terminated');
  });
});
