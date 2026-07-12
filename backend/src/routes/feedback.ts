import { Router } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { saveFeedback } from '../utils/fileStore.js';
import { generateDiff } from '../services/diff.js';

const router = Router();

const getPaths = () => {
  const cwd = process.cwd();
  if (cwd.endsWith('backend')) {
    return {
      originalPath: path.resolve(cwd, '../frontend/src/components/Dashboard.tsx'),
      sandboxPath: path.resolve(cwd, '../frontend/src/components/Dashboard.sandbox.tsx'),
    };
  } else {
    return {
      originalPath: path.resolve(cwd, 'frontend/src/components/Dashboard.tsx'),
      sandboxPath: path.resolve(cwd, 'frontend/src/components/Dashboard.sandbox.tsx'),
    };
  }
};

router.post('/', async (req, res) => {
  try {
    const { userPrompt, screenshot, sessionId } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }
    if (!screenshot) {
      return res.status(400).json({ error: 'screenshot is required' });
    }

    // Compute diff server-side using the installed `diff` library
    const { originalPath, sandboxPath } = getPaths();
    let diffContent = '';
    try {
      const [originalCode, sandboxCode] = await Promise.all([
        fs.readFile(originalPath, 'utf-8'),
        fs.readFile(sandboxPath, 'utf-8'),
      ]);
      diffContent = generateDiff(originalCode, sandboxCode);
    } catch (diffErr: any) {
      // Non-fatal: sandbox file may not exist if called outside an active session
      console.warn('Could not generate diff:', diffErr.message);
      diffContent = '(diff unavailable — sandbox file not found)';
    }

    const requestId = await saveFeedback(
      userPrompt,
      screenshot,
      diffContent,
      sessionId || ''
    );

    res.status(201).json({
      success: true,
      requestId,
    });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
