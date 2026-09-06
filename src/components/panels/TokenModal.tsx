import React, { useState } from 'react';
import { Key, X, ExternalLink, Check } from 'lucide-react';
import { setMapboxToken } from '../../config/env';
import { DecoCorners } from '../common/DecoCorners';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none font-body">
      <div className="bg-[#141414] border-2 border-[#D4AF37] w-full max-w-md p-6 text-[#F2F0E4] shadow-[0_0_40px_rgba(212,175,55,0.25)] space-y-4 relative">
        <DecoCorners />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-bold text-sm tracking-[0.2em] uppercase text-[#F2F0E4]">
              MAPBOX 3D ACCESS KEY
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#D4AF37] p-1 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#F2F0E4]/80 leading-relaxed tracking-wide">
          StrataGrid AI uses <strong className="text-[#D4AF37] font-bold">Mapbox GL JS v3</strong> to render 3D terrain,
          building extrusions, and real-time H3 spatial hexagonal overlays for Pune.
        </p>

        <div className="bg-[#0A0A0A] border border-[#D4AF37]/40 p-4 space-y-2 text-xs">
          <div className="font-display font-bold text-[#D4AF37] uppercase tracking-[0.15em]">
            Procedure for Free Access Token:
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-[#888888] text-[11px] leading-relaxed">
            <li>
              Navigate to{' '}
              <a
                href="https://www.mapbox.com/"
                target="_blank"
                rel="noreferrer"
                className="text-[#D4AF37] underline inline-flex items-center gap-0.5 font-semibold"
              >
                mapbox.com <ExternalLink className="w-2.5 h-2.5" />
              </a>{' '}
              and create a free account.
            </li>
            <li>Copy your public access token beginning with <code className="text-[#F2E8C4] font-mono">pk.eyJ1...</code></li>
            <li>Paste your token below or add it to <code className="text-[#F2E8C4] font-mono">.env</code></li>
          </ol>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div>
            <label className="block text-[10px] font-display font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
              PASTE YOUR PUBLIC TOKEN (pk.*)
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="pk.eyJ1..."
              className="deco-input w-full text-xs font-mono placeholder-[#888888]/50"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D4AF37]/30">
            <button
              type="button"
              onClick={onClose}
              className="deco-btn-outline px-4 py-2 text-[10px] tracking-[0.2em] cursor-pointer"
            >
              CANCEL
            </button>

            <button
              type="submit"
              disabled={!inputVal.trim() || isSaved}
              className="deco-btn-solid px-5 py-2 text-[10px] tracking-[0.2em] cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" /> SAVED
                </>
              ) : (
                'INITIALIZE ENGINE'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
