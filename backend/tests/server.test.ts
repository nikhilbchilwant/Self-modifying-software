import { app } from '../src/index';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';

describe('Express Server Setup', () => {
  let server: Server;
  let port: number;

  beforeAll(() => {
    return new Promise<void>((resolve) => {
      // Listen on an ephemeral port
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

  it('should respond to health check endpoint with ok status', async () => {
    const res = await fetch(`http://localhost:${port}/api/health`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ status: 'ok' });
  });
});
