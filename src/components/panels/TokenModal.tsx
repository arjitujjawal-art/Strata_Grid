import React, { useState } from 'react';
import { Radio, X, Check, ShieldCheck, Globe, ExternalLink, Key } from 'lucide-react';
import { DecoCorners } from '../common/DecoCorners';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProvider?: 'esri' | 'carto';
  cartoApiKey?: string;
  onSaveBasemapConfig?: (provider: 'esri' | 'carto', key: string) => void;
  // Legacy props
  currentToken?: string;
  onSaveToken?: (token: string) => void;
}

export const TokenModal: React.FC<TokenModalProps> = ({
  isOpen,
  onClose,
  activeProvider = 'esri',
  cartoApiKey = '',
  onSaveBasemapConfig,
  onSaveToken
}) => {
  const [provider, setProvider] = useState<'esri' | 'carto'>(activeProvider);
  const [inputKey, setInputKey] = useState(cartoApiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSaveBasemapConfig) {
      onSaveBasemapConfig(provider, inputKey.trim());
    } else if (onSaveToken) {
      onSaveToken(inputKey.trim());
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 select-none font-body">
      <div className="bg-[#141414] border-2 border-[#D4AF37] w-full max-w-lg p-6 sm:p-7 text-[#F2F0E4] shadow-[0_0_50px_rgba(212,175,55,0.3)] space-y-5 relative">
        <DecoCorners />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/40 pb-3.5">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-display font-bold text-sm sm:text-base tracking-[0.2em] uppercase text-[#F2F0E4]">
              GEOSPATIAL BASEMAP CONFIGURATION
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#888888] hover:text-[#D4AF37] p-1.5 transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Basemap Selection */}
        <div className="space-y-3">
          <label className="text-xs font-display uppercase tracking-[0.15em] text-[#D4AF37] block">
            Select Basemap Provider:
          </label>

          {/* Option 1: ESRI Dark Gray Canvas (Default - 100% Free, No Key, No Watermark) */}
          <div
            onClick={() => setProvider('esri')}
            className={`p-3.5 border cursor-pointer transition-all ${
              provider === 'esri'
                ? 'bg-[#0E2015] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-[#0A0A0A] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${provider === 'esri' ? 'border-[#10B981] bg-[#10B981]' : 'border-[#888888]'}`}>
                  {provider === 'esri' && <Check className="w-2.5 h-2.5 text-black" />}
                </span>
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#F2F0E4]">
                  ESRI World Dark Gray Canvas
                </span>
              </div>
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 text-[9px] font-display font-bold px-2 py-0.5 uppercase tracking-wider">
                Recommended / Zero Watermark
              </span>
            </div>
            <p className="text-[11px] text-[#F2F0E4]/70 mt-1.5 pl-5.5 leading-relaxed">
              100% Free & Open. <strong>No API key required</strong>. High-contrast dark charcoal tiles designed specifically for spatial data overlay.
            </p>
          </div>

          {/* Option 2: CARTO Dark Matter (Requires Free Key to eliminate watermark) */}
          <div
            onClick={() => setProvider('carto')}
            className={`p-3.5 border cursor-pointer transition-all ${
              provider === 'carto'
                ? 'bg-[#1C1608] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'bg-[#0A0A0A] border-[#D4AF37]/30 hover:border-[#D4AF37]/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${provider === 'carto' ? 'border-[#D4AF37] bg-[#D4AF37]' : 'border-[#888888]'}`}>
                  {provider === 'carto' && <Check className="w-2.5 h-2.5 text-black" />}
                </span>
                <span className="font-display font-bold text-xs uppercase tracking-wider text-[#F2F0E4]">
                  CARTO Dark Matter (High-Res)
                </span>
              </div>
              <span className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 text-[9px] font-display font-bold px-2 py-0.5 uppercase tracking-wider">
                Free Key Required
              </span>
            </div>
            <p className="text-[11px] text-[#F2F0E4]/70 mt-1.5 pl-5.5 leading-relaxed">
              CARTO now requires a free API key to remove the &ldquo;API KEY REQUIRED&rdquo; watermark.
            </p>
          </div>
        </div>

        {/* CARTO Key Input (Shown if Carto selected or key exists) */}
        {provider === 'carto' && (
          <div className="bg-[#0A0A0A] border border-[#D4AF37]/40 p-3.5 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-display font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                CARTO Free API Key:
              </label>
              <a
                href="https://carto.com/basemaps/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-body tracking-wider"
              >
                Get Free Key (carto.com)
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Paste your free Carto API key here..."
              className="w-full bg-[#141414] border border-[#D4AF37]/50 px-3 py-2 text-xs font-mono text-[#F2F0E4] focus:border-[#D4AF37] focus:outline-none"
            />
            <p className="text-[10px] text-[#888888]">
              Free tier includes 5,000,000 requests/month without credit card.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 flex items-center justify-between border-t border-[#D4AF37]/30">
          <span className="text-[10px] text-[#888888] font-mono">
            ENGINE: MapLibre GL JS v6
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-display uppercase tracking-wider text-[#888888] hover:text-[#F2F0E4] border border-transparent hover:border-[#D4AF37]/30 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="deco-btn-solid px-5 py-2 text-xs font-display font-bold uppercase tracking-[0.18em] cursor-pointer"
            >
              Apply & Save Basemap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
