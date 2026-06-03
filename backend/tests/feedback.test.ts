import { app } from '../src/index';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Server } from 'http';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('Feedback Routing API', () => {
  let server: Server;
  let port: number;
  const feedbackDir = path.resolve(__dirname, '../../.specify/feedback');

  beforeAll(async () => {
    // Start Express server on ephemeral port
    await new Promise<void>((resolve) => {
      server = app.listen(0, () => {
        const address = server.address();
        if (address && typeof address !== 'string') {
          port = address.port;
        }
        resolve();
      });
    });
  });

  afterAll(async () => {
    // Stop Express server
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });

    // Cleanup any files in .specify/feedback created during the test
    try {
      const files = await fs.readdir(feedbackDir);
      for (const file of files) {
        if (file.startsWith('test-request-')) {
          await fs.unlink(path.join(feedbackDir, file));
        }
      }
    } catch (e) {
      // Ignore if directory doesn't exist
    }
  });

  it('should successfully save feedback and return 201 or 200', async () => {
    // Mock base64 PNG (1x1 pixel white dot)
    const base64Screenshot = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const userPrompt = 'Add a nice layout';
    const diffContent = '--- original\n+++ sandbox\n+ new line';

    const res = await fetch(`http://localhost:${port}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt,
        screenshot: base64Screenshot,
        diffContent,
        sessionId: 'test-session-id',
      }),
    });

    // Since implementation is not complete, we expect a 404 now or 201/200 when done.
    // In actual test file, we're writing the expected successful outcomes.
    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('requestId');

    const requestId = data.requestId;
    const jsonPath = path.join(feedbackDir, `${requestId}.json`);
    const pngPath = path.join(feedbackDir, `${requestId}.png`);

    const jsonExists = await fs.access(jsonPath).then(() => true).catch(() => false);
    const pngExists = await fs.access(pngPath).then(() => true).catch(() => false);

    expect(jsonExists).toBe(true);
    expect(pngExists).toBe(true);

    // Clean up these specific files
    await fs.unlink(jsonPath).catch(() => {});
    await fs.unlink(pngPath).catch(() => {});
  });

  it('should return 400 Bad Request when userPrompt is missing', async () => {
    const res = await fetch(`http://localhost:${port}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        screenshot: 'data:image/png;base64,...',
        diffContent: 'diff',
        sessionId: 'test-session-id',
      }),
    });
    expect(res.status).toBe(400);
  });

  it('should return 400 Bad Request when screenshot is missing', async () => {
    const res = await fetch(`http://localhost:${port}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userPrompt: 'Add widgets',
        diffContent: 'diff',
        sessionId: 'test-session-id',
      }),
    });
    expect(res.status).toBe(400);
  });
});
