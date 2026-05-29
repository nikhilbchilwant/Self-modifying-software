import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FEEDBACK_DIR = path.resolve(__dirname, '../../../.specify/feedback');

export interface FeedbackDetails {
  requestId: string;
  timestamp: Date;
  prompt: string;
  diff: string | null;
}

export async function saveFeedbackFiles(requestId: string, screenshot: string, details: FeedbackDetails): Promise<{ screenshotPath: string, detailsPath: string }> {
  await fs.mkdir(FEEDBACK_DIR, { recursive: true });

  const screenshotPath = path.join(FEEDBACK_DIR, `${requestId}.png`);
  const detailsPath = path.join(FEEDBACK_DIR, `${requestId}.json`);

  const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
  await fs.writeFile(screenshotPath, base64Data, 'base64');

  await fs.writeFile(detailsPath, JSON.stringify(details, null, 2));

  return { screenshotPath, detailsPath };
}
