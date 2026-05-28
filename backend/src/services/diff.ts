import { createPatch } from 'diff';
import fs from 'fs/promises';

export async function generateDiff(originalPath: string, sandboxPath: string): Promise<string> {
  const original = await fs.readFile(originalPath, 'utf-8');
  const sandbox = await fs.readFile(sandboxPath, 'utf-8');

  return createPatch('Dashboard.tsx', original, sandbox);
}
