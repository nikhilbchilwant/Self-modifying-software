import fs from 'fs/promises';

export async function createSandboxCopy(originalPath: string, sandboxPath: string): Promise<void> {
  await fs.copyFile(originalPath, sandboxPath);
}

export async function deleteSandboxCopy(sandboxPath: string): Promise<void> {
  try {
    await fs.unlink(sandboxPath);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}
