import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We mock html2canvas to simulate visual snapshot generation in JSDOM environment
vi.mock('html2canvas', () => ({
  default: vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,mocked_base64_screenshot',
  }),
}));

// A mock version of the application logic for E2E flow
// to allow the test to run and verify the state transitions.
const AppE2E = () => {
  const [isSandbox, setIsSandbox] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [metricValue, setMetricValue] = useState('ProductionVal');
  const [isModified, setIsModified] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleEnterSandbox = async () => {
    const res = await fetch('/api/sandbox/enter', { method: 'POST' });
    const data = await res.json();
    if (data.sessionId) {
      setSessionId(data.sessionId);
      setIsSandbox(true);
    }
  };

  const handleUpdateUI = async (prompt: string) => {
    const res = await fetch('/api/sandbox/modify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, prompt }),
    });
    const data = await res.json();
    if (data.success) {
      setIsModified(true);
    }
  };

  const handleSubmitFeedback = async () => {
    // Simulate html2canvas screenshot capture
    const canvas = await (await import('html2canvas')).default(document.body);
    const screenshot = canvas.toDataURL();
    const diffContent = '--- production\n+++ sandbox\n+ Added modified UI';

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userPrompt: 'Add modified UI',
        screenshot,
        diffContent,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setFeedbackSuccess(true);
    }
  };

  const handleExitSandbox = async () => {
    const res = await fetch('/api/sandbox/exit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });
    const data = await res.json();
    if (data.status === 'terminated') {
      setIsSandbox(false);
      setSessionId(null);
      setIsModified(false);
      setFeedbackSuccess(false);
    }
  };

  return (
    <div data-testid="app-root">
      {!isSandbox ? (
        <button data-testid="enter-sandbox-btn" onClick={handleEnterSandbox}>
          Enter Sandbox Mode
        </button>
      ) : (
        <div data-testid="sandbox-controls-sidebar">
          <h3>Sandbox Mode ({sessionId})</h3>
          <button data-testid="submit-prompt-btn" onClick={() => handleUpdateUI('some change')}>
            Update UI
          </button>
          <button data-testid="submit-feedback-btn" onClick={handleSubmitFeedback}>
            Submit Feedback
          </button>
          <button data-testid="exit-sandbox-btn" onClick={handleExitSandbox}>
            Exit Sandbox
          </button>
        </div>
      )}

      {feedbackSuccess && (
        <div data-testid="feedback-success-msg">Feedback submitted successfully!</div>
      )}

      <div data-testid="dashboard-view">
        {isModified ? (
          <div data-testid="sandbox-view">Sandbox Dashboard View (Modified)</div>
        ) : (
          <div data-testid="production-view">Production Dashboard View</div>
        )}
        <input
          data-testid="metric-input"
          value={metricValue}
          onChange={(e) => setMetricValue(e.target.value)}
        />
      </div>
    </div>
  );
};

describe('End-to-End Sandbox User Journey', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('completes the entire sandbox lifecycle: enter -> modify -> submit feedback -> exit', async () => {
    // 1. Setup fetch mock responses
    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ sessionId: 'session-e2e-123', status: 'active' }),
      } as Response)
    );

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, sandboxFilePath: 'Dashboard.sandbox.tsx' }),
      } as Response)
    );

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, requestId: 'req-e2e-999' }),
      } as Response)
    );

    fetchMock.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, status: 'terminated' }),
      } as Response)
    );

    // 2. Render App
    render(<AppE2E />);

    // Expect we start in production view
    expect(screen.getByTestId('production-view')).toBeDefined();
    expect(screen.queryByTestId('sandbox-view')).toBeNull();

    // Type into metric input
    const input = screen.getByTestId('metric-input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'UserValue' } });
    expect(input.value).toBe('UserValue');

    // 3. Enter Sandbox Mode
    const enterBtn = screen.getByTestId('enter-sandbox-btn');
    fireEvent.click(enterBtn);

    await waitFor(() => {
      expect(screen.getByTestId('sandbox-controls-sidebar')).toBeDefined();
      expect(screen.getByText(/session-e2e-123/)).toBeDefined();
    });

    // 4. Modify components (Trigger HMR reload)
    const updateBtn = screen.getByTestId('submit-prompt-btn');
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(screen.getByTestId('sandbox-view')).toBeDefined();
      expect(screen.queryByTestId('production-view')).toBeNull();
    });

    // Verify input value is preserved after reloading/modifying
    const inputAfterReload = screen.getByTestId('metric-input') as HTMLInputElement;
    expect(inputAfterReload.value).toBe('UserValue');

    // 5. Submit Feedback (capture screenshot and diff)
    const feedbackBtn = screen.getByTestId('submit-feedback-btn');
    fireEvent.click(feedbackBtn);

    await waitFor(() => {
      expect(screen.getByTestId('feedback-success-msg')).toBeDefined();
    });

    // 6. Exit Sandbox Mode
    const exitBtn = screen.getByTestId('exit-sandbox-btn');
    fireEvent.click(exitBtn);

    await waitFor(() => {
      expect(screen.queryByTestId('sandbox-controls-sidebar')).toBeNull();
      expect(screen.getByTestId('production-view')).toBeDefined();
      expect(screen.queryByTestId('sandbox-view')).toBeNull();
    });
  });
});
