import React, { useState } from 'react';
import { Key, X, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { setMapboxToken } from '../../config/env';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentToken: string;
  onSaveToken: (token: string) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  currentToken,
  onSaveToken
}) => {
  const [inputVal, setInputVal] = useState(currentToken);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setMapboxToken(inputVal.trim());
    onSaveToken(inputVal.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl shadow-cyan-950/80 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base font-mono">MAPBOX 3D ACCESS KEY</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          StrataGrid AI uses <strong className="text-white">Mapbox GL JS v3</strong> to render 3D terrain,
          building extrusions, and real-time H3 spatial hexagonal overlays for Pune.
        </p>

        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-2 text-xs text-slate-300">
          <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
            <span>How to get your free token in 60 seconds:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
            <li>
              Go to{' '}
              <a
                href="https://www.mapbox.com/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 underline inline-flex items-center gap-0.5"
              >
                mapbox.com <ExternalLink className="w-2.5 h-2.5" />
              </a>{' '}
              and sign up for free.
            </li>
            <li>Copy your public default access token starting with <code className="text-cyan-300">pk.eyJ1...</code></li>
            <li>Paste it below or add it to <code className="text-cyan-300">.env</code> as <code className="text-cyan-300">VITE_MAPBOX_TOKEN</code></li>
          </ol>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-400 mb-1">
              PASTE YOUR MAPBOX PUBLIC TOKEN (pk.*)
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="pk.eyJ1..."
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-mono transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim() || isSaved}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-mono font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" /> SAVED!
                </>
              ) : (
                'SAVE & INITIALIZE MAP'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
