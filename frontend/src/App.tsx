import React, { useState, useMemo, Suspense, lazy } from 'react';
import SandboxControls from './components/SandboxControls';
import { captureScreenshot, sendFeedback, exitSandbox } from './utils/snapshot';
import { Sparkles } from 'lucide-react';

// Error Boundary for Sandbox runtime errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Sandbox component crashed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function App() {
  const [isSandbox, setIsSandbox] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [metricValue, setMetricValue] = useState('1000');
  const [loading, setLoading] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // Enter sandbox session
  const handleEnterSandbox = async () => {
    try {
      const res = await fetch('/api/sandbox/enter', { method: 'POST' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setIsSandbox(true);
        setFeedbackSuccess(false);
      }
    } catch (err) {
      console.error('Failed to enter sandbox:', err);
    }
  };

  // Modify sandbox component via prompt
  const handleUpdateUI = async (prompt: string) => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/sandbox/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, prompt }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      if (data.success) {
        // Trigger a force reload of the lazy component by changing a state if needed
        // but Vite HMR handles it automatically. We can reset feedbackSuccess.
        setFeedbackSuccess(false);
      } else {
        alert(`Modification failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Failed to modify component:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit visual diff and screenshot feedback.
  // Diff is computed server-side — client only captures the screenshot.
  const handleSubmitFeedback = async () => {
    if (!sessionId) return;
    try {
      // Capture base64 screenshot via html2canvas
      const screenshot = await captureScreenshot('.dashboard-container');

      // Send to backend; server reads both files and generates the diff
      const result = await sendFeedback(
        sessionId,
        'Sandbox session modification feedback',
        screenshot
      );

      if (result.success) {
        setFeedbackSuccess(true);
      } else {
        alert(`Feedback submission failed: ${result.error}`);
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  // Exit sandbox mode and cleanup
  const handleExitSandbox = async () => {
    if (!sessionId) return;
    const success = await exitSandbox(sessionId);
    if (success) {
      setIsSandbox(false);
      setSessionId(null);
      setFeedbackSuccess(false);
    }
  };

  // Memoized dynamic import loader to prevent unnecessary remounts unless isSandbox changes
  const LazyDashboard = useMemo(() => {
    return lazy(() => {
      if (isSandbox) {
        const sandboxPath = './components/Dashboard.sandbox';
        return import(/* @vite-ignore */ sandboxPath).catch((err) => {
          console.error('Failed to load sandbox, falling back to production', err);
          return import('./components/Dashboard');
        });
      } else {
        return import('./components/Dashboard');
      }
    });
  }, [isSandbox]);

  return (
    <div 
      data-testid="app-root" 
      style={{ 
        display: 'flex', 
        minHeight: '100vh', 
        width: '100vw',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        background: '#F5F5F7',
      }}
    >
      {/* Sidebar - Sandbox Controls */}
      {isSandbox && sessionId && (
        <SandboxControls
          sessionId={sessionId}
          onSubmitPrompt={handleUpdateUI}
          onExit={handleExitSandbox}
          onSubmitFeedback={handleSubmitFeedback}
          loading={loading}
          feedbackSuccess={feedbackSuccess}
        />
      )}

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* Banner/Header when in Production mode */}
        {!isSandbox && (
          <div 
            style={{ 
              background: '#FFFFFF', 
              borderBottom: '1px solid #D2D2D7', 
              padding: '12px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#1D1D1F' }}>
              <span>Live Application</span>
            </div>
            <button
              data-testid="enter-sandbox-btn"
              onClick={handleEnterSandbox}
              style={{
                background: '#0071E3',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '980px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <Sparkles size={14} />
              <span>Enter Sandbox Mode</span>
            </button>
          </div>
        )}

        {/* Dashboard Display */}
        <div style={{ flex: 1 }}>
          <ErrorBoundary
            fallback={
              <div style={{ padding: '40px', background: '#FFF0F0', color: '#FF3B30', margin: '20px', borderRadius: '12px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Sandbox Component Error</h3>
                <p>The modified dashboard component has a runtime error. You can modify it again to fix it or exit sandbox mode.</p>
                <button 
                  onClick={handleExitSandbox}
                  style={{ background: '#FF3B30', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Exit Sandbox
                </button>
              </div>
            }
          >
            <Suspense fallback={<div data-testid="loading" style={{ padding: '40px', textAlign: 'center', fontSize: '16px', color: '#86868B' }}>Loading Dashboard...</div>}>
              <LazyDashboard 
                metricValue={metricValue} 
                setMetricValue={setMetricValue} 
              />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
