import { Router } from 'express';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createSandboxCopy, deleteSandboxCopy } from '../services/sandbox';
import { generateCodeEdits } from '../services/ai';
import { generateDiff } from '../services/diff';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = Router();
const sessions = new Map<string, Record<string, string | Date>>();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/enter', async (req, res) => {
  const sessionId = uuidv4();
  const originalPath = path.resolve(__dirname, '../../../frontend/src/components/Dashboard.tsx');
  const sandboxPath = path.resolve(__dirname, '../../../frontend/src/components/Dashboard.sandbox.tsx');

  try {
    await createSandboxCopy(originalPath, sandboxPath);
    sessions.set(sessionId, {
      sessionId,
      startTime: new Date(),
      originalPath,
      sandboxPath,
      status: 'active',
    });
    res.json({ sessionId, status: 'active' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enter sandbox mode' });
  }
});

router.post('/modify', async (req, res) => {
  const { sessionId, prompt } = req.body;
  const session = sessions.get(sessionId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    const content = await fs.readFile(session.sandboxPath as string, 'utf-8');
    const newContent = await generateCodeEdits(prompt, content);
    await fs.writeFile(session.sandboxPath as string, newContent);
    const diff = await generateDiff(session.originalPath as string, session.sandboxPath as string);
    res.json({ success: true, diff });
  } catch (error) {
    console.error('Modification failed:', error);
    res.status(500).json({ error: 'Failed to modify component' });
  }
});

router.post('/exit', async (req, res) => {
  const { sessionId } = req.body;
  const session = sessions.get(sessionId);

  if (session) {
    await deleteSandboxCopy(session.sandboxPath as string);
    sessions.delete(sessionId);
  }
  res.json({ success: true });
});

router.get('/status/:sessionId', (req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json(session);
});

export default router;
