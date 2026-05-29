import OpenAI from 'openai';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execPromise = promisify(exec);

/**
 * Generates code edits for a React component using NVIDIA's API via OpenAI SDK.
 * Uses the Llama 3.1 8B Instruct model for fast and efficient edits.
 */
export async function generateCodeEdits(
  prompt: string,
  fileContent: string,
  errorContext?: string,
): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    throw new Error('NVIDIA_API_KEY environment variable is not set');
  }

  const client = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1',
  });

  const systemPrompt = `You are an expert React developer. Your task is to modify a React component based on a user's natural language request.
Return ONLY the modified code. No explanations, no markdown blocks. Just the code.
If provided with error context, fix the errors while maintaining the requested change.`;

  const userMessage = `Request: ${prompt}
${errorContext ? `\nPrevious attempt failed with errors:\n${errorContext}\nPlease fix these errors.` : ''}

Current Code:
${fileContent}`;

  try {
    const response = await client.chat.completions.create({
      model: 'meta/llama-3.1-8b-instruct',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    });

    const fullResponse = response.choices[0]?.message?.content || '';
    return fullResponse
      .replace(/^```[a-z]*\n/i, '')
      .replace(/\n```$/i, '')
      .trim();
  } catch (error) {
    console.error('NVIDIA AI call failed:', error);
    throw error;
  }
}

/**
 * Verifies if the provided code is valid TypeScript/React code.
 * Runs npx tsc on a temporary file.
 */
export async function runVerificationLoop(filePath: string, prompt: string): Promise<boolean> {
  let currentContent = await fs.readFile(filePath, 'utf-8');
  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    const tempCheckFile = path.join(path.dirname(filePath), `check_${Date.now()}.tsx`);
    await fs.writeFile(tempCheckFile, currentContent);

    try {
      // We use --noEmit and --jsx preserve to just check syntax/types
      await execPromise(
        `npx tsc ${tempCheckFile} --noEmit --jsx react-jsx --esModuleInterop --skipLibCheck --target esnext`,
      );
      await fs.unlink(tempCheckFile);
      return true;
    } catch (tscError) {
      await fs.unlink(tempCheckFile);
      const errorMsg = tscError instanceof Error ? ((tscError as { stdout?: string }).stdout || "") : String(tscError);
      console.warn(`Verification failed (attempt ${retries + 1}):`, errorMsg);

      if (retries < maxRetries) {
        console.log('Requesting AI to fix errors...');
        currentContent = await generateCodeEdits(prompt, currentContent, errorMsg);
        await fs.writeFile(filePath, currentContent);
        retries++;
      } else {
        return false;
      }
    }
  }

  return false;
}
