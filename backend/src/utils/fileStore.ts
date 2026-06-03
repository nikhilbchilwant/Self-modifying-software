import * as fs from 'fs/promises';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const getFeedbackDir = () => {
  const cwd = process.cwd();
  if (cwd.endsWith('backend')) {
    return path.resolve(cwd, '../.specify/feedback');
  } else {
    return path.resolve(cwd, '.specify/feedback');
  }
};

const FEEDBACK_DIR = getFeedbackDir();

export async function saveFeedback(
  userPrompt: string,
  screenshotBase64: string,
  diffContent: string,
  sessionId: string
): Promise<string> {
  // Ensure feedback directory exists
  await fs.mkdir(FEEDBACK_DIR, { recursive: true });

  // Generate request ID
  const isTest = sessionId.startsWith('test');
  const requestId = isTest ? `test-request-${uuidv4()}` : `request-${uuidv4()}`;

  // Process PNG screenshot
  let base64Data = screenshotBase64;
  if (screenshotBase64.includes(',')) {
    base64Data = screenshotBase64.split(',')[1];
  }
  const buffer = Buffer.from(base64Data, 'base64');
  const pngPath = path.join(FEEDBACK_DIR, `${requestId}.png`);
  await fs.writeFile(pngPath, buffer);

  // Process JSON metadata
  const metadata = {
    requestId,
    sessionId,
    userPrompt,
    diffContent,
    timestamp: new Date().toISOString(),
  };
  const jsonPath = path.join(FEEDBACK_DIR, `${requestId}.json`);
  await fs.writeFile(jsonPath, JSON.stringify(metadata, null, 2), 'utf-8');

  return requestId;
}
