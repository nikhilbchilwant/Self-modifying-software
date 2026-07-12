import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { modifyComponent } from './src/services/ai.ts';

const orig = readFileSync(new URL('../frontend/src/components/Dashboard.tsx', import.meta.url), 'utf-8');
const prompt = 'change to German language and remove the chat';

try {
  const out = await modifyComponent(orig, prompt);
  console.log('=== SUCCESS (first 600 chars) ===');
  console.log(out.slice(0, 600));
  console.log('contains German "Analyse":', out.includes('Analyse'));
} catch (e) {
  console.log('=== THREW ===');
  console.log((e as Error).message);
}
