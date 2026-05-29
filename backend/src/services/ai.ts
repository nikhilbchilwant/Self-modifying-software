import OpenAI from 'openai';

/**
 * Generates code edits for a React component using NVIDIA's API via OpenAI SDK.
 * Uses the Llama 3.1 8B Instruct model for fast and efficient edits.
 */
export async function generateCodeEdits(prompt: string, fileContent: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY environment variable is not set');
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert React developer. Return ONLY the modified code. No explanations, no markdown blocks.',
        },
        {
          role: 'user',
          content: `Request: ${prompt}\n\nCurrent Code:\n${fileContent}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const fullResponse = response.choices[0]?.message?.content || '';
    // Strip markdown if model includes it despite instructions
    return fullResponse
      .replace(/^```[a-z]*\n/i, '')
      .replace(/\n```$/i, '')
      .trim();
  } catch (error) {
    console.error('NVIDIA AI call failed:', error);
    throw error;
  }
}

export async function runVerificationLoop(_filePath: string, _prompt: string): Promise<boolean> {
  // Verification loop placeholder - currently auto-passes
  return true;
}
