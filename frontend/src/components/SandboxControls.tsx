import { useState } from 'react';
import { Sparkles, Image, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

interface SandboxControlsProps {
  sessionId: string;
  onSubmitPrompt: (prompt: string) => Promise<void>;
  onExit: () => void;
  onSubmitFeedback: () => Promise<void>;
  loading: boolean;
  feedbackSuccess: boolean;
}

export default function SandboxControls({
  sessionId,
  onSubmitPrompt,
  onExit,
  onSubmitFeedback,
  loading,
  feedbackSuccess,
}: SandboxControlsProps) {
  const [prompt, setPrompt] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleUpdate = async () => {
    if (!prompt.trim()) return;
    await onSubmitPrompt(prompt);
  };

  const handleFeedback = async () => {
    setFeedbackLoading(true);
    await onSubmitFeedback();
    setFeedbackLoading(false);
  };

  return (
    <div
      data-testid="sandbox-controls-sidebar"
      style={{
        width: '320px',
        background: '#FFFFFF',
        borderRight: '1px solid #D2D2D7',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        padding: '24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Sandbox Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0071E3', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={14} />
          <span>Creator Sandbox Active</span>
        </div>
        <h3 style={{ fontSize: '20px', fontWeight: 600, margin: '8px 0 4px 0', color: '#1D1D1F' }}>
          Interface Sandbox
        </h3>
        <p style={{ fontSize: '12px', color: '#86868B', margin: 0, wordBreak: 'break-all' }}>
          Session: {sessionId}
        </p>
      </div>

      {/* Main Form */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: '#1D1D1F' }}>
            Instruct component updates:
          </label>
          <textarea
            data-testid="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            placeholder="e.g. 'Add a red target line at value 950' or 'Change metric title to Sales'"
            style={{
              height: '120px',
              borderRadius: '10px',
              border: '1px solid #D2D2D7',
              padding: '12px',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
              background: loading ? '#F5F5F7' : '#FFFFFF',
            }}
          />
        </div>

        {/* Update UI Button */}
        <button
          data-testid="submit-prompt-btn"
          onClick={handleUpdate}
          disabled={loading || !prompt.trim()}
          style={{
            background: '#0071E3',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
            opacity: loading || !prompt.trim() ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            outline: 'none',
            transition: 'background-color 0.2s',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span data-testid="loading-indicator">Updating UI...</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Update UI</span>
            </>
          )}
        </button>

        <div style={{ borderTop: '1px solid #E5E5EA', margin: '16px 0' }} />

        {/* Submit Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            data-testid="submit-feedback-btn"
            onClick={handleFeedback}
            disabled={feedbackLoading}
            style={{
              background: '#34C759',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: feedbackLoading ? 'not-allowed' : 'pointer',
              opacity: feedbackLoading ? 0.6 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              outline: 'none',
            }}
          >
            {feedbackLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Capturing...</span>
              </>
            ) : (
              <>
                <Image size={16} />
                <span>Submit Feedback</span>
              </>
            )}
          </button>

          {feedbackSuccess && (
            <div
              data-testid="feedback-success-msg"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#34C759',
                fontSize: '13px',
                marginTop: '4px',
              }}
            >
              <CheckCircle2 size={14} />
              <span>Feedback submitted successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Exit Button */}
      <button
        data-testid="exit-sandbox-btn"
        onClick={onExit}
        style={{
          background: 'transparent',
          border: '1px solid #D2D2D7',
          color: '#FF3B30',
          borderRadius: '8px',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginTop: 'auto',
          outline: 'none',
          transition: 'all 0.2s',
        }}
      >
        <ArrowLeft size={16} />
        <span>Exit Sandbox</span>
      </button>
    </div>
  );
}
