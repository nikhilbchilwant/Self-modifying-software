import 'dotenv/config';
import { getModel, complete } from '@earendil-works/pi-ai';
console.log('OPENROUTER_API_KEY loaded:', !!process.env.OPENROUTER_API_KEY);

const provider = 'openrouter';
const modelId = process.env.MODEL || 'tencent/hy3-preview:free';

function getModelSafe(p, m) {
  try {
    return getModel(p, m);
  } catch (e) {
    return undefined;
  }
}

let model = getModelSafe(provider, modelId);
if (!model) {
  const base = getModelSafe(provider, 'tencent/hy3-preview');
  if (base) {
    model = { ...base, id: modelId, name: `${base.name} (${modelId})` };
  } else {
    model = {
      id: modelId, name: modelId, api: 'openai-completions', provider: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1', reasoning: false, input: ['text'],
      cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
      contextWindow: 128000, maxTokens: 8192,
    };
  }
}
console.log('USING MODEL:', JSON.stringify({ id: model.id, api: model.api, provider: model.provider, baseUrl: model.baseUrl }, null, 2));

import { readFileSync } from 'node:fs';
const orig = readFileSync(new URL('../frontend/src/components/Dashboard.tsx', import.meta.url), 'utf-8');
const context = {
  systemPrompt: 'You are an expert React and TypeScript developer. Your job is to modify the provided TSX component code based on the user\'s prompt. You must output ONLY the updated code inside a single ```tsx markdown code block, and NO other explanation or commentary. Your code must compile successfully, use valid TypeScript, and not have any syntax or import errors. Use standard Recharts and Lucide React elements if required.',
  messages: [{ role: 'user', content: `Here is the original TSX component code:\n\n\`\`\`tsx\n${orig}\n\`\`\`\n\nUser Request:\nchange to German language and remove the chat`, timestamp: Date.now() }],
};

try {
  const response = await complete(model, context);
  console.log('STOP REASON:', response.stopReason);
  console.log('RAW CONTENT:', JSON.stringify(response.content, null, 2));
  if (response.errorMessage) console.log('ERROR MSG:', response.errorMessage);
  if (response.usage) console.log('USAGE:', JSON.stringify(response.usage));
} catch (e) {
  console.log('THREW:', e?.message || String(e));
}
