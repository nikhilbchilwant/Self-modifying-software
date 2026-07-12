import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

const piAi = vi.hoisted(() => ({
  getModel: vi.fn(),
  complete: vi.fn(),
}));

vi.mock('@earendil-works/pi-ai', () => ({
  getModel: piAi.getModel,
  complete: piAi.complete,
}));

import { modifyComponent } from '../src/services/ai';

const baseOpenRouterModel = {
  id: 'tencent/hy3',
  name: 'Tencent Hunyuan 3D Preview',
  api: 'openai-completions',
  provider: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  reasoning: true,
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

const responseWithCodeBlock = {
  content: [
    {
      type: 'text',
      text: '```tsx\nexport default function Dashboard() { return <div>OpenRouter configured</div>; }\n```',
    },
  ],
};

describe('AI service configuration', () => {
  const originalProvider = process.env.PI_AI_PROVIDER;
  const originalModel = process.env.PI_AI_MODEL;

  beforeEach(() => {
    delete process.env.PI_AI_PROVIDER;
    delete process.env.PI_AI_MODEL;
    piAi.getModel.mockReset();
    piAi.complete.mockReset();
    piAi.complete.mockResolvedValue(responseWithCodeBlock);
  });

  afterEach(() => {
    if (originalProvider === undefined) {
      delete process.env.PI_AI_PROVIDER;
    } else {
      process.env.PI_AI_PROVIDER = originalProvider;
    }

    if (originalModel === undefined) {
      delete process.env.PI_AI_MODEL;
    } else {
      process.env.PI_AI_MODEL = originalModel;
    }
  });

  it('defaults to the OpenRouter free Tencent model when env vars are not set', async () => {
    piAi.getModel.mockReturnValue({ ...baseOpenRouterModel, id: 'tencent/hy3:free' });

    const result = await modifyComponent('export default function Dashboard() { return <div />; }', 'Change title');

    expect(piAi.getModel).toHaveBeenCalledWith('openrouter', 'tencent/hy3:free');
    expect(piAi.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'openrouter',
        id: 'tencent/hy3:free',
      }),
      expect.objectContaining({
        systemPrompt: expect.stringContaining('React and TypeScript'),
      })
    );
    expect(result).toContain('OpenRouter configured');
  });

  it('resolves OpenRouter :free model IDs even when the generated registry only has the base model', async () => {
    piAi.getModel.mockImplementation((_provider: string, modelId: string) => {
      if (modelId === 'tencent/hy3') {
        return baseOpenRouterModel;
      }
      return undefined;
    });

    await modifyComponent('export default function Dashboard() { return <div />; }', 'Change title');

    expect(piAi.getModel).toHaveBeenNthCalledWith(1, 'openrouter', 'tencent/hy3:free');
    expect(piAi.getModel).toHaveBeenNthCalledWith(2, 'openrouter', 'tencent/hy3');
    expect(piAi.complete).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'openrouter',
        api: 'openai-completions',
        baseUrl: 'https://openrouter.ai/api/v1',
        id: 'tencent/hy3:free',
      }),
      expect.any(Object)
    );
  });
});
