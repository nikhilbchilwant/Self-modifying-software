import React, { useState, Suspense } from 'react';
import { SandboxControls } from './components/SandboxControls';
import { Dashboard as DefaultDashboard } from './components/Dashboard';
import { captureSnapshot } from './utils/snapshot';

// Use React.lazy for dynamic import of sandbox component
const SandboxDashboard = React.lazy(() => {
  // @ts-expect-error dynamic import
  return import('./components/Dashboard.sandbox.tsx');
});

function App() {
  const [isInSandbox, setIsInSandbox] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  const [sandboxKey, setSandboxKey] = useState(0);
  const [currentDiff, setCurrentDiff] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string>('');

  const handleEnterSandbox = async () => {
    try {
      const res = await fetch('/api/sandbox/enter', { method: 'POST' });
      const data = await res.json();
      setSessionId(data.sessionId);
      setIsInSandbox(true);
    } catch (error) {
      console.error('Failed to enter sandbox', error);
    }
  };

  const handleExitSandbox = async () => {
    if (!sessionId) return;
    try {
      await fetch('/api/sandbox/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      setIsInSandbox(false);
      setSessionId(null);
    } catch (error) {
      console.error('Failed to exit sandbox', error);
    }
  };

  const handleModify = async (prompt: string) => {
    if (!sessionId) return;
    setIsModifying(true);
    setLastPrompt(prompt);
    try {
      const res = await fetch('/api/sandbox/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, prompt }),
      });
      const data = await res.json();
      setCurrentDiff(data.diff);
      // Force reload the sandbox component
      setSandboxKey((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to modify component', error);
    } finally {
      setIsModifying(false);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      const screenshot = await captureSnapshot();
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: lastPrompt,
          screenshot,
          diff: currentDiff,
        }),
      });
      const data = await res.json();
      alert(`Feedback submitted! ID: ${data.requestId}`);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <div className={`transition-all duration-500 ${isInSandbox ? 'mr-80' : ''}`}>
        <main>
          {isInSandbox ? (
            <Suspense
              fallback={
                <div className="p-20 text-center font-medium text-[#86868b]">
                  Loading Sandbox Experience...
                </div>
              }
            >
              <SandboxDashboard key={sandboxKey} />
            </Suspense>
          ) : (
            <DefaultDashboard />
          )}
        </main>
      </div>

      <SandboxControls
        isInSandbox={isInSandbox}
        isModifying={isModifying}
        onEnter={handleEnterSandbox}
        onExit={handleExitSandbox}
        onModify={handleModify}
        onSubmitFeedback={handleSubmitFeedback}
      />
    </div>
  );
}

export default App;
