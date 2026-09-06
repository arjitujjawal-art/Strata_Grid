import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  ArrowUpRight, 
  Plus, 
  Quote, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon
} from 'lucide-react';
import { CaseStudy } from '../types';
import { getAllCaseStudies, deleteCustomCaseStudy, subscribeToStudiesSync } from '../utils/caseStudiesStorage';
import { AddCaseStudyModal } from './AddCaseStudyModal';
import { DecoCorners } from './common/DecoCorners';

export const CaseStudiesSection: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(getAllCaseStudies);
  const [selectedCaseId, setSelectedCaseId] = useState<string>(() => caseStudies[0]?.id || 'cs-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync state with storage changes
  useEffect(() => {
    const refresh = () => {
      const all = getAllCaseStudies();
      setCaseStudies(all);
      if (!all.some(c => c.id === selectedCaseId) && all[0]) {
        setSelectedCaseId(all[0].id);
      }
    };
    return subscribeToStudiesSync(refresh);
  }, [selectedCaseId]);

  const activeCase = caseStudies.find(c => c.id === selectedCaseId) || caseStudies[0];

  const handleStudyCreated = (newStudy: CaseStudy) => {
    setCaseStudies(getAllCaseStudies());
    setSelectedCaseId(newStudy.id);
    setSuccessToast(`Field study "${newStudy.title}" authenticated by AI and added to both Case Studies and the Inspection Gallery!`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this user-submitted case study and its gallery inspection scan?')) {
      deleteCustomCaseStudy(id);
      const remaining = getAllCaseStudies();
      setCaseStudies(remaining);
      if (selectedCaseId === id && remaining[0]) {
        setSelectedCaseId(remaining[0].id);
      }
    }
  };

  const userStudiesCount = caseStudies.filter(c => c.isUserSubmitted).length;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn text-[#F2F0E4]">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-[#064E3B]/80 border-2 border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3 shadow-[0_0_25px_rgba(6,78,59,0.5)] animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="tracking-wide">{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-300 hover:text-white text-xs font-bold uppercase tracking-widest px-2 py-1 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#D4AF37] rotate-45" />
          <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
            Field Archives ({caseStudies.length} Exhibits • {userStudiesCount} Verified)
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="deco-btn-solid text-xs font-bold flex items-center justify-center gap-2 cursor-pointer px-5 py-2.5"
        >
          <Plus className="w-4 h-4 text-[#0A0A0A]" />
          <span>Submit Field Case Study (AI Verified)</span>
        </button>
      </div>

      {/* Pilot Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {caseStudies.map((c) => {
          const isActive = selectedCaseId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-4 py-2.5 text-xs font-body uppercase tracking-[0.15em] transition-all cursor-pointer flex items-center gap-2.5 border ${
                isActive
                  ? 'bg-[#D4AF37] text-[#0A0A0A] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold'
                  : 'bg-[#0A0A0A] text-[#888888] hover:text-[#F2F0E4] border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              {c.isUserSubmitted ? (
                <Sparkles className={`w-3.5 h-3.5 ${isActive ? 'text-[#0A0A0A]' : 'text-emerald-400'}`} />
              ) : (
                <span className={`w-1.5 h-1.5 rotate-45 ${isActive ? 'bg-[#0A0A0A]' : 'bg-[#D4AF37]'}`} />
              )}
              <span className="truncate max-w-[220px]">{c.title}</span>
              {c.isUserSubmitted && (
                <span className={`px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider ${
                  isActive ? 'bg-[#0A0A0A]/20 text-[#0A0A0A]' : 'bg-[#064E3B]/40 text-emerald-300 border border-emerald-500/40'
                }`}>
                  AI Verified
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Focus Pilot Card */}
      <div className="deco-panel p-6 sm:p-8 relative space-y-8 deco-crosshatch overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
        <DecoCorners />
        
        {/* Header and Badges */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-[#D4AF37]/30 pb-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              {activeCase.isUserSubmitted ? (
                <span className="px-3 py-1 bg-[#064E3B]/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Forensically Verified Field Study
                </span>
              ) : (
                <span className="px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                  Municipal Deployment Exhibit
                </span>
              )}

              <span className="text-xs font-mono text-[#888888] flex items-center gap-1.5 tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="text-[#F2F0E4]">{activeCase.location}</span>
              </span>

              <span className="text-xs font-mono text-[#888888] flex items-center gap-1.5 tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#888888]" />
                <span>{activeCase.timeframe}</span>
              </span>

              {activeCase.roadType && (
                <span className="text-[11px] font-mono px-2.5 py-0.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#D4AF37] uppercase tracking-wider">
                  {activeCase.roadType.replace('_', ' ')}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-4xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em]">
              {activeCase.title}
            </h3>

            <p className="text-[#F2F0E4]/90 text-sm max-w-3xl leading-relaxed font-body tracking-wide">
              {activeCase.summary}
            </p>
          </div>

          {/* User Submitted Options */}
          {activeCase.isUserSubmitted && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleDeleteCase(activeCase.id, e)}
                className="px-3.5 py-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 border border-rose-500/40 text-xs font-body uppercase tracking-[0.15em] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Study</span>
              </button>
            </div>
          )}
        </div>

        {/* Case Image & Inspection Telemetry split */}
        {activeCase.imageUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 bg-[#0A0A0A] border border-[#D4AF37]/40 items-center">
            <div className="lg:col-span-5 h-60 border border-[#D4AF37]/50 overflow-hidden bg-black relative group">
              <img
                src={activeCase.imageUrl}
                alt={activeCase.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 bg-black/80 px-2.5 py-1 border border-emerald-500/40 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Synced to Inspection Gallery
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Field Distress Scan & Forensic Audit
                </span>
                <a
                  href="#gallery"
                  className="text-xs font-body uppercase tracking-wider text-[#D4AF37] hover:text-[#F2E8C4] hover:underline flex items-center gap-1"
                >
                  <span>View in Gallery</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {activeCase.verification && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                    <div className="p-3 bg-[#141414] border border-[#D4AF37]/30">
                      <span className="text-[10px] text-[#888888] uppercase tracking-wider block">PCI Rating</span>
                      <span className="text-sm font-bold text-[#D4AF37]">
                        {activeCase.verification.pavementConditionIndex}/100 ({activeCase.verification.pciCategory})
                      </span>
                    </div>
                    <div className="p-3 bg-[#141414] border border-[#D4AF37]/30">
                      <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Shear Strain (τxy)</span>
                      <span className="text-sm font-bold text-[#F2E8C4]">
                        {activeCase.verification.dynamicShearStrainMicrostrain} µε
                      </span>
                    </div>
                    <div className="p-3 bg-[#141414] border border-[#D4AF37]/30">
                      <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Pumping Risk</span>
                      <span className="text-sm font-bold text-rose-400">
                        {activeCase.verification.subgradePumpingRisk}
                      </span>
                    </div>
                  </div>

                  <p className="text-[#F2F0E4]/85 font-body leading-relaxed text-xs">
                    <strong className="text-[#D4AF37] uppercase tracking-wider">Scientific Finding: </strong>
                    {activeCase.verification.scientificBasis}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-[#0A0A0A] border-l-2 border-rose-700 border-y border-r border-[#D4AF37]/20 space-y-2.5">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-[0.18em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-500 rotate-45" />
              The Structural Challenge:
            </span>
            <p className="text-xs font-body text-[#F2F0E4]/90 leading-relaxed tracking-wide">
              {activeCase.problem}
            </p>
          </div>

          <div className="p-6 bg-[#0A0A0A] border-l-2 border-[#D4AF37] border-y border-r border-[#D4AF37]/20 space-y-2.5">
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-[0.18em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
              The StrataGrid AI Solution:
            </span>
            <p className="text-xs font-body text-[#F2F0E4]/90 leading-relaxed tracking-wide">
              {activeCase.solution}
            </p>
          </div>
        </div>

        {/* Empirical Verified Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {activeCase.metrics.map((m, idx) => (
            <div key={idx} className="p-5 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
              <span className="text-[11px] text-[#888888] uppercase tracking-[0.15em] block">
                {m.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] mt-1 block">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Direct Municipal Quote Card */}
        {activeCase.quote && (
          <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/40 flex items-start gap-5 relative">
            <Quote className="w-7 h-7 text-[#D4AF37] shrink-0 opacity-70 mt-1" />
            <div className="space-y-2 text-xs">
              <p className="text-[#F2E8C4] italic leading-relaxed text-sm font-display tracking-wide">
                "{activeCase.quote.text}"
              </p>
              <div className="pt-2 flex items-center gap-2 font-mono text-[#888888] uppercase tracking-wider">
                <span className="font-bold text-[#D4AF37]">{activeCase.quote.author}</span>
                <span>•</span>
                <span>{activeCase.quote.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of all case study cards */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
          <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
            All Case Study Deployments & Field Scans
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {caseStudies.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-6 border transition-all cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? 'bg-[#141414] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]'
                    : 'bg-[#0A0A0A] hover:bg-[#141414] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider block">
                      {c.location}
                    </span>
                    {c.isUserSubmitted && (
                      <span className="text-[9px] font-mono px-2 py-0.5 bg-[#064E3B]/40 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider">
                        AI Verified
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-display font-bold text-[#F2E8C4] uppercase tracking-wider">
                    {c.title}
                  </h4>
                  <p className="text-xs text-[#F2F0E4]/80 line-clamp-2 font-body leading-relaxed">
                    {c.summary}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs font-body uppercase tracking-[0.15em] text-[#D4AF37]">
                  <span>Inspect Forensic Telemetry</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Case Study Modal */}
      <AddCaseStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleStudyCreated}
      />
    </div>
  );
};
