import html2canvas from 'html2canvas';

export async function captureSnapshot(elementId: string = 'dashboard-root'): Promise<string> {
  const element = document.getElementById(elementId) || document.body;
  const canvas = await html2canvas(element);
  return canvas.toDataURL('image/png');
}
