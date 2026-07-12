import { getModel, complete, type Api, type Model } from '@earendil-works/pi-ai';

const DEFAULT_AI_PROVIDER = 'openrouter';
const DEFAULT_AI_MODEL = 'tencent/hy3:free';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
const OPENROUTER_FREE_SUFFIX = ':free';

// ---------------------------------------------------------------------------
// AI provider and model are configured entirely via environment variables.
// Set these in backend/.env (copy backend/.env.example as a starting point).
//
//   PI_AI_PROVIDER  — provider name (defaults to "openrouter")
//   PI_AI_MODEL     — model ID (defaults to "tencent/hy3:free")
//
// The Pi SDK reads the matching API key automatically from a provider-specific
// env var. For OpenRouter, set OPENROUTER_API_KEY in backend/.env.
// ---------------------------------------------------------------------------

type ModelLookup = (provider: string, modelId: string) => Model<Api> | undefined;

function getRegisteredModel(provider: string, modelId: string): Model<Api> | undefined {
  try {
    const lookupModel = getModel as unknown as ModelLookup;
    return lookupModel(provider, modelId);
  } catch {
    return undefined;
  }
}

function createOpenRouterModel(modelId: string): Model<'openai-completions'> {
  return {
    id: modelId,
    name: modelId,
    api: 'openai-completions',
    provider: 'openrouter',
    baseUrl: OPENROUTER_BASE_URL,
    reasoning: false,
    input: ['text'],
    cost: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
    },
    contextWindow: 128000,
    maxTokens: 8192,
  };
}

function resolveConfiguredModel(provider: string, modelId: string): Model<Api> {
  const exactModel = getRegisteredModel(provider, modelId);
  if (exactModel) {
    return exactModel;
  }

  if (provider === 'openrouter') {
    const baseModelId = modelId.endsWith(OPENROUTER_FREE_SUFFIX)
      ? modelId.slice(0, -OPENROUTER_FREE_SUFFIX.length)
      : modelId;
    const baseModel = baseModelId !== modelId ? getRegisteredModel(provider, baseModelId) : undefined;

    if (baseModel) {
      return {
        ...baseModel,
        id: modelId,
        name: `${baseModel.name} (${modelId})`,
      };
    }

    // OpenRouter can expose model IDs before this package's generated registry
    // is updated, so keep the exact configured ID and use the OpenAI-compatible API.
    return createOpenRouterModel(modelId);
  }

  throw new Error(
    `Unknown AI model "${modelId}" for provider "${provider}". ` +
      'Check PI_AI_PROVIDER and PI_AI_MODEL in backend/.env.'
  );
}

export async function modifyComponent(
  componentCode: string,
  userPrompt: string,
  verificationError?: string
): Promise<string> {
  const provider = process.env.PI_AI_PROVIDER?.trim() || DEFAULT_AI_PROVIDER;
  const modelId = process.env.PI_AI_MODEL?.trim() || DEFAULT_AI_MODEL;

  const systemPrompt = `You are an expert React and TypeScript developer. Your job is to modify the provided TSX component code based on the user's prompt.
You must output ONLY the updated code inside a single \`tsx\` markdown code block, and NO other explanation or commentary.
Your code must compile successfully, use valid TypeScript, and not have any syntax or import errors. Use standard Recharts and Lucide React elements if required.`;

  let userContent = `Here is the original TSX component code:

\`\`\`tsx
${componentCode}
\`\`\`

User Request:
${userPrompt}`;

  if (verificationError) {
    userContent += `\n\nPrevious attempt failed compilation with the following error:\n${verificationError}\n\nPlease fix this compilation/syntax error and apply the requested changes correctly. Ensure that all imports, types, and variables are valid React/TypeScript.`;
  }

  const context = {
    systemPrompt,
    messages: [
      {
        role: 'user' as const,
        content: userContent,
        timestamp: Date.now(),
      },
    ],
  };

  try {
    const model = resolveConfiguredModel(provider, modelId);
    const response = await complete(model, context);

    // Extract text content from response
    let responseText = '';
    for (const part of response.content) {
      if (part.type === 'text') {
        responseText += part.text;
      }
    }

    // Parse out the TSX block
    let code = responseText.trim();
    const match = responseText.match(/```(?:tsx|typescript|javascript|jsx|react)?\n([\s\S]*?)```/i);
    if (match) {
      code = match[1].trim();
    } else {
      const matchGeneric = responseText.match(/```\n?([\s\S]*?)```/);
      if (matchGeneric) {
        code = matchGeneric[1].trim();
      }
    }

    if (!code.trim()) {
      throw new Error('AI returned empty response or invalid code block');
    }

    return code;
  } catch (err: unknown) {
    // Re-throw as a structured error so the sandbox route surfaces a clear
    // failure to the frontend. All modifications require a live AI connection.
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `AI service unavailable: ${cause}. ` +
      `Set OPENROUTER_API_KEY (or PI_AI_PROVIDER plus its matching key) in backend/.env.`
    );
  }
}
