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
  Image as ImageIcon, 
  ExternalLink,
  Activity,
  Gauge,
  Layers,
  AlertCircle
} from 'lucide-react';
import { CaseStudy } from '../types';
import { getAllCaseStudies, deleteCustomCaseStudy, subscribeToStudiesSync } from '../utils/caseStudiesStorage';
import { AddCaseStudyModal } from './AddCaseStudyModal';

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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center justify-between gap-3 shadow-xl backdrop-blur-md animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
            Case Studies ({caseStudies.length} Total • {userStudiesCount} User & AI Verified)
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-black" />
          <span>Add Your Own Case Study (AI Verified)</span>
        </button>
      </div>

      {/* Pilot Selection Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {caseStudies.map((c) => {
          const isActive = selectedCaseId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? 'bg-[#161b22] text-[#00f5ff] border border-[#00f5ff]/50 shadow-md font-bold'
                  : 'bg-[#161b22]/60 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-slate-800'
              }`}
            >
              {c.isUserSubmitted ? (
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <MapPin className="w-3.5 h-3.5 text-[#00f5ff]" />
              )}
              <span className="truncate max-w-[200px]">{c.title}</span>
              {c.isUserSubmitted && (
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AI Verified
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Focus Pilot Card */}
      <div className="bg-[#161b22] p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Header and Badges */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              {activeCase.isUserSubmitted ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  AI Forensically Verified Field Study
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold">
                  Municipal Pilot Deployment
                </span>
              )}

              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00f5ff]" />
                <span>{activeCase.location}</span>
              </span>

              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{activeCase.timeframe}</span>
              </span>

              {activeCase.roadType && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                  {activeCase.roadType.replace('_', ' ')}
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-headline font-bold text-white">
              {activeCase.title}
            </h3>

            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              {activeCase.summary}
            </p>
          </div>

          {/* User Submitted Options */}
          {activeCase.isUserSubmitted && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={(e) => handleDeleteCase(activeCase.id, e)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Study</span>
              </button>
            </div>
          )}
        </div>

        {/* Case Image & Inspection Telemetry split (if image is available) */}
        {activeCase.imageUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 rounded-2xl bg-[#0d1117] border border-slate-800 items-center">
            <div className="lg:col-span-5 h-56 rounded-xl overflow-hidden bg-black relative group">
              <img
                src={activeCase.imageUrl}
                alt={activeCase.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-mono text-emerald-300 bg-black/70 px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Synced to Inspection Gallery
                </span>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00f5ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Field Distress Scan & Forensic Audit
                </span>
                <a
                  href="#gallery"
                  className="text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1"
                >
                  <span>View in Gallery</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {activeCase.verification && (
                <div className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">PCI Rating</span>
                      <span className="text-sm font-bold text-[#00f5ff]">
                        {activeCase.verification.pavementConditionIndex}/100 ({activeCase.verification.pciCategory})
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Shear Strain (τxy)</span>
                      <span className="text-sm font-bold text-amber-400">
                        {activeCase.verification.dynamicShearStrainMicrostrain} µε
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Pumping Risk</span>
                      <span className="text-sm font-bold text-rose-400">
                        {activeCase.verification.subgradePumpingRisk}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 font-sans leading-relaxed text-xs">
                    <strong className="text-slate-200">Scientific Finding: </strong>
                    {activeCase.verification.scientificBasis}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Problem vs Solution Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-[#0d1117] border border-rose-500/20 space-y-2.5">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider block">
              The Structural Challenge:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCase.problem}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0d1117] border border-teal-500/20 space-y-2.5">
            <span className="text-xs font-mono font-bold text-teal-400 uppercase tracking-wider block">
              The StrataGrid AI Solution:
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeCase.solution}
            </p>
          </div>
        </div>

        {/* Empirical Verified Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          {activeCase.metrics.map((m, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {m.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#00f5ff] mt-1 block">
                {m.value}
              </span>
            </div>
          ))}
        </div>

        {/* Direct Municipal Quote Card */}
        {activeCase.quote && (
          <div className="p-5 rounded-2xl bg-[#0b101c] border border-slate-800 flex items-start gap-4">
            <Quote className="w-6 h-6 text-[#00f5ff] shrink-0 opacity-60 mt-1" />
            <div className="space-y-1 text-xs">
              <p className="text-slate-200 italic leading-relaxed text-sm">
                "{activeCase.quote.text}"
              </p>
              <div className="pt-2 flex items-center gap-2 font-mono text-slate-400">
                <span className="font-bold text-white">{activeCase.quote.author}</span>
                <span>•</span>
                <span>{activeCase.quote.role}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid of all case study cards */}
      <div className="space-y-3 pt-4">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
          All Case Study Deployments & Field Scans
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStudies.map((c) => {
            const isSelected = c.id === selectedCaseId;
            return (
              <div
                key={c.id}
                onClick={() => setSelectedCaseId(c.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#161b22] border-[#00f5ff]/60 shadow-lg'
                    : 'bg-[#161b22]/70 hover:bg-[#161b22] border-slate-700/80'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {c.location}
                    </span>
                    {c.isUserSubmitted && (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        AI Verified
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-headline font-bold text-white">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2">
                    {c.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-[#00f5ff]">
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
