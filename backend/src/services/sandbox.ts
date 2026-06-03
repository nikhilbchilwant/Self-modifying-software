import * as fs from 'fs/promises';
import * as path from 'path';

export async function createSandbox(originalPath: string, sandboxPath: string): Promise<void> {
  // Ensure the destination directory exists
  const destDir = path.dirname(sandboxPath);
  await fs.mkdir(destDir, { recursive: true });
  
  // Copy original file to sandbox path
  await fs.copyFile(originalPath, sandboxPath);
}

export async function cleanupSandbox(sandboxPath: string): Promise<void> {
  try {
    await fs.unlink(sandboxPath);
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }
}
