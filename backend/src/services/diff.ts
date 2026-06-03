import { createTwoFilesPatch } from 'diff';

export function generateDiff(originalCode: string, modifiedCode: string): string {
  return createTwoFilesPatch(
    'Dashboard.tsx',
    'Dashboard.sandbox.tsx',
    originalCode,
    modifiedCode,
    'Production',
    'Sandbox'
  );
}
