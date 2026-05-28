import React, { useState } from 'react';
import { Play, Square, Send, Camera, Sparkles } from 'lucide-react';

interface SandboxControlsProps {
  onEnter: () => void;
  onExit: () => void;
  onModify: (prompt: string) => void;
  onSubmitFeedback: () => void;
  isInSandbox: boolean;
  isModifying: boolean;
}

export const SandboxControls: React.FC<SandboxControlsProps> = ({
  onEnter,
  onExit,
  onModify,
  onSubmitFeedback,
  isInSandbox,
  isModifying,
}) => {
  const [prompt, setPrompt] = useState('');

  const handleModify = () => {
    if (prompt.trim()) {
      onModify(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl border-l border-[#e3e3e7] shadow-[0_0_40px_rgba(0,0,0,0.05)] z-50 flex flex-col p-8 transition-all duration-500 ease-in-out">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-[#0071e3]" size={20} />
          <h2 className="text-xl font-bold text-[#1d1d1f] tracking-tight">Sandbox</h2>
        </div>
        <p className="text-sm text-[#86868b] font-medium leading-relaxed">
          Unleash AI to evolve your interface in real-time.
        </p>
      </div>

      {!isInSandbox ? (
        <button
          onClick={onEnter}
          className="keynote-btn-primary flex items-center justify-center gap-2 w-full py-4 shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Play size={18} fill="currentColor" />
          Enter Sandbox
        </button>
      ) : (
        <>
          <div className="flex-grow flex flex-col">
            <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-[0.1em] mb-3">
              AI Command
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Add a target line to the chart' or 'Apply a dark sleek theme'"
              className="keynote-input w-full h-40 resize-none leading-relaxed text-sm"
              disabled={isModifying}
            />
            <button
              onClick={handleModify}
              disabled={isModifying || !prompt.trim()}
              className="flex items-center justify-center gap-2 w-full mt-4 py-4 bg-[#1d1d1f] text-white rounded-xl font-semibold hover:bg-black transition-all active:scale-95 disabled:opacity-30"
            >
              {isModifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Evolving...</span>
                </div>
              ) : (
                <>
                  <Send size={16} />
                  Execute
                </>
              )}
            </button>

            <div className="mt-auto pt-8 border-t border-[#e3e3e7]">
              <p className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest mb-4">
                Finalize
              </p>
              <button
                onClick={onSubmitFeedback}
                className="flex items-center justify-center gap-2 w-full py-3 keynote-card bg-white hover:bg-gray-50 text-[#1d1d1f] font-semibold transition-all active:scale-95 mb-4"
              >
                <Camera size={18} />
                Snapshot & Submit
              </button>
            </div>
          </div>

          <button
            onClick={onExit}
            className="flex items-center justify-center gap-2 w-full py-3 text-red-500 font-bold text-xs uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            <Square size={14} fill="currentColor" />
            End Session
          </button>
        </>
      )}
    </div>
  );
};
