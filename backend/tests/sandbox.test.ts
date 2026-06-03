import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs/promises';
import * as path from 'path';
import { createSandbox, cleanupSandbox } from '../src/services/sandbox';

describe('Sandbox File Utilities', () => {
  const tempDir = path.join(__dirname, 'temp_test');
  const originalFile = path.join(tempDir, 'Dashboard.tsx');
  const sandboxFile = path.join(tempDir, 'Dashboard.sandbox.tsx');

  beforeEach(async () => {
    // Create a temporary directory and an original file for testing
    await fs.mkdir(tempDir, { recursive: true });
    await fs.writeFile(originalFile, 'export default function Dashboard() { return "Original"; }');
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it('should copy original file to sandbox path', async () => {
    await createSandbox(originalFile, sandboxFile);
    
    // Check if the sandbox file exists
    const exists = await fs.access(sandboxFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);

    const content = await fs.readFile(sandboxFile, 'utf-8');
    expect(content).toContain('Original');
  });

  it('should delete sandbox file on cleanup', async () => {
    // Create the sandbox file first
    await fs.writeFile(sandboxFile, 'export default function Dashboard() { return "Sandbox"; }');
    
    await cleanupSandbox(sandboxFile);

    const exists = await fs.access(sandboxFile).then(() => true).catch(() => false);
    expect(exists).toBe(false);
  });

  it('should not throw if trying to cleanup a non-existent sandbox file', async () => {
    await expect(cleanupSandbox(sandboxFile)).resolves.not.toThrow();
  });
});
