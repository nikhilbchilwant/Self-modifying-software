import fs from 'fs/promises';

export async function createSandboxCopy(originalPath: string, sandboxPath: string): Promise<void> {
  await fs.copyFile(originalPath, sandboxPath);
}

export async function deleteSandboxCopy(sandboxPath: string): Promise<void> {
  // Revert sandbox to a safe state instead of deleting it to avoid breaking Vite
  try {
    const baseline = 'import React from "react";\nexport const Dashboard = () => <div>Loading Sandbox...</div>;\nexport default Dashboard;';
    await fs.writeFile(sandboxPath, baseline);
  } catch (error) {
    console.error('Failed to revert sandbox file:', error);
  }
}
