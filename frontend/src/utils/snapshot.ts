import html2canvas from 'html2canvas';

export async function captureScreenshot(selector: string = 'body'): Promise<string> {
  const element = document.querySelector(selector) || document.body;
  const canvas = await html2canvas(element as HTMLElement, {
    useCORS: true,
    logging: false,
    backgroundColor: '#F5F5F7', // Match Apple Keynote Light background
  });
  return canvas.toDataURL('image/png');
}

export function calculateDiff(original: string, modified: string): string {
  const originalLines = original.split('\n');
  const modifiedLines = modified.split('\n');
  let diff = '--- production\n+++ sandbox\n';
  
  const max = Math.max(originalLines.length, modifiedLines.length);
  for (let i = 0; i < max; i++) {
    const orig = originalLines[i];
    const mod = modifiedLines[i];
    
    if (orig !== mod) {
      if (orig !== undefined) {
        diff += `- ${orig}\n`;
      }
      if (mod !== undefined) {
        diff += `+ ${mod}\n`;
      }
    } else {
      if (orig !== undefined) {
        diff += `  ${orig}\n`;
      }
    }
  }
  return diff;
}

export async function sendFeedback(
  sessionId: string,
  userPrompt: string,
  screenshot: string,
  diffContent: string
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        userPrompt,
        screenshot,
        diffContent,
      }),
    });
    
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error('Error sending feedback:', error);
    return { success: false, error: error.message };
  }
}

export async function exitSandbox(sessionId: string): Promise<boolean> {
  try {
    const response = await fetch('/api/sandbox/exit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.status === 'terminated';
  } catch (error) {
    console.error('Error exiting sandbox:', error);
    return false;
  }
}
