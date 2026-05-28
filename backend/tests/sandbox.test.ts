import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { createSandboxCopy, deleteSandboxCopy } from '../src/services/sandbox';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Sandbox File Utilities', () => {
  const testDir = path.resolve(__dirname, 'temp-test');
  const originalPath = path.join(testDir, 'Dashboard.tsx');
  const sandboxPath = path.join(testDir, 'Dashboard.sandbox.tsx');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    await fs.writeFile(originalPath, 'export const Dashboard = () => <div>Original</div>;');
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  it('should copy file to sandbox path', async () => {
    await createSandboxCopy(originalPath, sandboxPath);
    const exists = await fs.stat(sandboxPath).catch(() => false);
    expect(exists).toBeTruthy();
    const content = await fs.readFile(sandboxPath, 'utf-8');
    expect(content).toContain('Original');
  });

  it('should delete sandbox file', async () => {
    await fs.writeFile(sandboxPath, 'sandbox content');
    await deleteSandboxCopy(sandboxPath);
    const exists = await fs.stat(sandboxPath).catch(() => false);
    expect(exists).toBeFalsy();
  });
});
