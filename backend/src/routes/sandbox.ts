import { Router } from 'express';
import * as path from 'path';
import * as fs from 'fs/promises';
import { createSandbox, cleanupSandbox } from '../services/sandbox.js';
import { modifyComponent } from '../services/ai.js';
import { verifyTypeScriptCode } from '../utils/compiler.js';
import { v4 as uuidv4 } from 'uuid';

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

router.post('/enter', async (req, res) => {
  try {
    const { originalPath, sandboxPath } = getPaths();
    await createSandbox(originalPath, sandboxPath);
    const sessionId = uuidv4();
    res.json({ sessionId, status: 'active' });
  } catch (error: any) {
    console.error('Error entering sandbox:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/modify', async (req, res) => {
  try {
    const { sessionId, prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const { originalPath, sandboxPath } = getPaths();

    // 1. Read existing sandbox code or fallback to original
    let sandboxExistsBefore = true;
    let currentCode = '';
    try {
      currentCode = await fs.readFile(sandboxPath, 'utf-8');
    } catch {
      sandboxExistsBefore = false;
      try {
        currentCode = await fs.readFile(originalPath, 'utf-8');
      } catch (readErr) {
        // If frontend project doesn't have the original dashboard file yet, write a stub
        currentCode = `import React from 'react';
export default function Dashboard() {
  return (
    <div data-testid="dashboard-container">
      <h2>Analytics Dashboard</h2>
      <input data-testid="dashboard-input-metric" value="1000" readOnly />
    </div>
  );
}`;
      }
    }

    const backupCode = currentCode;
    let codeToVerify = currentCode;
    let verificationError: string | undefined = undefined;
    let success = false;

    // Retry loop up to 3 times (4 attempts total)
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const modifiedCode = await modifyComponent(codeToVerify, prompt, verificationError);
        
        // Write temporarily to sandbox path to compile
        await fs.writeFile(sandboxPath, modifiedCode, 'utf-8');

        // Compile and verify
        const err = verifyTypeScriptCode(sandboxPath);
        if (!err) {
          success = true;
          break;
        } else {
          verificationError = err;
          // Use the modified code as base for next attempt to allow incremental fixing
          codeToVerify = modifiedCode;
        }
      } catch (err: any) {
        verificationError = err.message || String(err);
      }
    }

    if (success) {
      res.json({ success: true, sandboxFilePath: 'Dashboard.sandbox.tsx' });
    } else {
      // Revert to backup
      if (sandboxExistsBefore) {
        await fs.writeFile(sandboxPath, backupCode, 'utf-8');
      } else {
        await cleanupSandbox(sandboxPath);
      }
      res.json({ success: false, error: verificationError || 'Compilation failed after maximum retries' });
    }
  } catch (error: any) {
    console.error('Error modifying sandbox component:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/exit', async (req, res) => {
  try {
    const { sandboxPath } = getPaths();
    await cleanupSandbox(sandboxPath);
    res.json({ status: 'terminated' });
  } catch (error: any) {
    console.error('Error exiting sandbox:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
