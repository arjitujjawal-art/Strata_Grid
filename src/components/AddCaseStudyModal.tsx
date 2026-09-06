import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  Image as ImageIcon, 
  Activity, 
  Layers, 
  Gauge, 
  Droplets, 
  Truck,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { CaseStudy, GalleryItem } from '../types';
import { saveVerifiedCaseStudy } from '../utils/caseStudiesStorage';
import { DecoCorners } from './common/DecoCorners';

interface AddCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (caseStudy: CaseStudy, galleryItem: GalleryItem) => void;
}

const PRESET_SAMPLE_PHOTOS = [
  {
    title: 'Severe Asphalt Fatigue & Pothole Void',
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
    type: 'pothole',
    roadType: 'arterial',
    claim: 'Localized deep aggregate stripping and pothole crater formation under high-density commercial traffic.'
  },
  {
    title: 'Subgrade Moisture Saturation & Rutting',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    type: 'traffic',
    roadType: 'freight_spur',
    claim: 'Subgrade hydraulic pumping and longitudinal rutting caused by saturated subgrade and Class 8 axle passes.'
  },
  {
    title: 'Bridge Viaduct Expansion Joint Shear',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    type: 'bridge',
    roadType: 'bridge',
    claim: 'Thermal expansion stress combined with heavy dynamic harmonic vehicle vibration along bridge deck joint.'
  },
  {
    title: 'High-Density Highway Surface Alligator Cracking',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    type: 'sensor',
    roadType: 'highway',
    claim: 'Interconnected micro-fissure mesh caused by repetitive peak tensile strain during rush hour congestion.'
  }
];

export const AddCaseStudyModal: React.FC<AddCaseStudyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  // Form Inputs
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [roadType, setRoadType] = useState<'arterial' | 'highway' | 'bridge' | 'urban_corridor' | 'freight_spur'>('arterial');
  const [timeframe, setTimeframe] = useState('6-Month Field Study');
  const [pavementConditionClaim, setPavementConditionClaim] = useState('');
  const [description, setDescription] = useState('');
  const [trafficVolume, setTrafficVolume] = useState<number>(3800);
  const [heavyVehiclePct, setHeavyVehiclePct] = useState<number>(34);
  const [subgradeMoisturePct, setSubgradeMoisturePct] = useState<number>(55);
  const [imageData, setImageData] = useState<string>(PRESET_SAMPLE_PHOTOS[0].url);
  const [quoteText, setQuoteText] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [quoteRole, setQuoteRole] = useState('');

  // Verification Processing States
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState<string>('');
  const [verificationResponse, setVerificationResponse] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageData(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_SAMPLE_PHOTOS[0]) => {
    setImageData(preset.url);
    if (!pavementConditionClaim) setPavementConditionClaim(preset.claim);
    setRoadType(preset.roadType as any);
  };

  const handleRunVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) {
      setErrorMsg('Please complete the title, location, and detailed road quality description.');
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);
    setVerificationResponse(null);

    // Visual animated inspection stages
    setVerificationStage('Ingesting image texture & asphalt surface morphology...');
    await new Promise(r => setTimeout(r, 600));
    setVerificationStage('Correlating axle tonnages with AASHTO fourth-power fatigue mechanics...');
    await new Promise(r => setTimeout(r, 600));
    setVerificationStage('Auditing hydraulic pore pumping & subgrade moisture saturation...');

    try {
      const payload = {
        title,
        location,
        roadType,
        timeframe,
        pavementConditionClaim,
        description,
        trafficVolume,
        heavyVehiclePct,
        subgradeMoisturePct,
        imageData,
        quoteText,
        quoteAuthor,
        quoteRole
      };

      const resp = await fetch('/api/verify-case-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        throw new Error(`Server returned status ${resp.status}`);
      }

      const data = await resp.json();
      setVerificationResponse(data);
    } catch (err: any) {
      console.error('Verification error:', err);
      setErrorMsg(err?.message || 'Failed to complete verification inspection.');
    } finally {
      setIsVerifying(false);
      setVerificationStage('');
    }
  };

  const handlePublishCaseStudy = () => {
    if (!verificationResponse || !verificationResponse.caseStudy) return;

    const { caseStudy, galleryItem } = verificationResponse;
    saveVerifiedCaseStudy(caseStudy, galleryItem);
    onSuccess(caseStudy, galleryItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#141414] border-2 border-[#D4AF37] w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.25)] flex flex-col my-auto relative">
        <DecoCorners />
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#D4AF37]/30 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-[#D4AF37]/15 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                  AI Forensic Engine
                </span>
                <span className="text-xs font-mono text-[#888888] uppercase tracking-wider">
                  Pavement Quality Validation
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em] mt-0.5">
                Submit Road Quality Case Study
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2E8C4] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#F2F0E4]">
          
          {errorMsg && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!verificationResponse ? (
            <form onSubmit={handleRunVerification} className="space-y-6">
              
              {/* SECTION 1: Location & Classification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em] border-b border-[#D4AF37]/20 pb-2">
                  <Layers className="w-4 h-4 text-[#D4AF37]" />
                  <span>I. Corridor & Field Location Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                      Case Study Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Grand Ave Viaduct Deck Spalling & Rutting Study"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] text-xs font-body focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                      Location / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Metropolis Civic Corridor, Sector 7-B"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] text-xs font-body focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                      Road Classification
                    </label>
                    <select
                      value={roadType}
                      onChange={(e) => setRoadType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] text-xs font-body uppercase tracking-wider focus:outline-none focus:border-[#D4AF37] transition-all"
                    >
                      <option value="arterial">Major Arterial Road</option>
                      <option value="highway">High-Speed Highway / Expressway</option>
                      <option value="bridge">Bridge / Elevated Viaduct</option>
                      <option value="urban_corridor">Dense Urban Transit Corridor</option>
                      <option value="freight_spur">Industrial Freight Spur / Port Access</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                      Pilot Duration / Timeframe
                    </label>
                    <input
                      type="text"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="e.g. 6-Month Field Pilot"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] text-xs font-body focus:outline-none focus:border-[#D4AF37] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Road Quality Photo & Distress Capture */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em] border-b border-[#D4AF37]/20 pb-2">
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>II. Road Quality Photo & Visual Distress Capture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Photo Preview / Upload Area */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="relative h-44 border border-[#D4AF37]/40 bg-black overflow-hidden flex items-center justify-center group">
                      {imageData ? (
                        <>
                          <img
                            src={imageData}
                            alt="Road Inspection Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1.5 bg-black/80 px-2.5 py-1 border border-emerald-500/40">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Ready for Forensic Scan
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-[#888888]">
                          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-mono">No image attached</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-4 py-2.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#D4AF37] hover:text-[#F2E8C4] text-xs font-body uppercase tracking-[0.15em] font-bold border border-[#D4AF37]/50 text-center cursor-pointer transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Upload Custom Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Preset Geotechnical Photos Quick-Select */}
                  <div className="md:col-span-6 space-y-2">
                    <label className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                      Or select a benchmark road distress sample:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-2.5 border text-left text-xs transition-all cursor-pointer flex flex-col justify-between h-20 ${
                            imageData === preset.url
                              ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-white shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                              : 'bg-[#0A0A0A] border-[#D4AF37]/30 text-[#888888] hover:border-[#D4AF37] hover:text-[#F2E8C4]'
                          }`}
                        >
                          <span className="font-display font-semibold line-clamp-2 text-[11px] leading-tight text-[#F2E8C4]">
                            {preset.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#D4AF37] uppercase mt-1">
                            {preset.type}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Geotechnical Distress & Structural Claims */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em] border-b border-[#D4AF37]/20 pb-2">
                  <Activity className="w-4 h-4 text-[#D4AF37]" />
                  <span>III. Pavement Distress Claim & Telemetry Variables</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                    Observed Pavement Quality & Distress Claim *
                  </label>
                  <input
                    type="text"
                    required
                    value={pavementConditionClaim}
                    onChange={(e) => setPavementConditionClaim(e.target.value)}
                    placeholder="e.g. Longitudinal rutting with 65mm pothole and subgrade moisture pumping"
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] text-xs font-body focus:outline-none focus:border-[#D4AF37] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-body font-bold text-[#D4AF37] uppercase tracking-[0.15em] block">
                    Detailed Field Notes & Structural Engineering Observation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific physical symptoms: cracking width, void depths, drainage condition, heavy vehicle frequency, and impact of traffic loads on the road base."
                    className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] text-xs font-body focus:outline-none focus:border-[#D4AF37] transition-all leading-relaxed"
                  />
                </div>

                {/* Physics Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888] flex items-center gap-1.5 uppercase">
                        <Gauge className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Traffic Flow:
                      </span>
                      <span className="text-[#D4AF37] font-bold">{trafficVolume} veh/day</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={10000}
                      step={100}
                      value={trafficVolume}
                      onChange={(e) => setTrafficVolume(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888] flex items-center gap-1.5 uppercase">
                        <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Heavy Axles:
                      </span>
                      <span className="text-[#F2E8C4] font-bold">{heavyVehiclePct}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={80}
                      step={1}
                      value={heavyVehiclePct}
                      onChange={(e) => setHeavyVehiclePct(Number(e.target.value))}
                      className="w-full accent-[#D4AF37]"
                    />
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#888888] flex items-center gap-1.5 uppercase">
                        <Droplets className="w-3.5 h-3.5 text-[#D4AF37]" />
                        Pore Moisture:
                      </span>
                      <span className="text-teal-400 font-bold">{subgradeMoisturePct}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={95}
                      step={1}
                      value={subgradeMoisturePct}
                      onChange={(e) => setSubgradeMoisturePct(Number(e.target.value))}
                      className="w-full accent-teal-400"
                    />
                  </div>
                </div>

                {/* Optional Quote / Attestation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                      Attestation Statement / Field Quote (Optional)
                    </label>
                    <input
                      type="text"
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder="e.g. Dynamic load balancing averted an emergency viaduct closure."
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] text-xs font-body focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-[#888888] uppercase tracking-wider block">
                      Engineer Name / Title
                    </label>
                    <input
                      type="text"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      placeholder="e.g. Lead Geotech Engineer"
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] text-xs font-body focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Run Verification */}
              <div className="pt-5 border-t border-[#D4AF37]/30 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2F0E4] text-xs font-body uppercase tracking-[0.15em] border border-[#D4AF37]/40 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="deco-btn-solid text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 px-6 py-2.5"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0A0A0A]" />
                      <span>{verificationStage || 'Analyzing Telemetry & Mechanics...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
                      <span>Run AI Forensic Verification</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0A]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* VERIFICATION RESULT INSPECTION CARD */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Verdict Header Banner */}
              <div className={`p-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                verificationResponse.isVerified
                  ? 'bg-[#064E3B]/30 border-emerald-500/50 text-emerald-200 shadow-[0_0_20px_rgba(6,78,59,0.3)]'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200 shadow-[0_0_20px_rgba(153,27,27,0.3)]'
              }`}>
                <div className="flex items-center gap-4">
                  {verificationResponse.isVerified ? (
                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 shrink-0">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest ${
                        verificationResponse.isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {verificationResponse.verdict}
                      </span>
                      <span className="text-xs font-mono opacity-80 uppercase tracking-wider">
                        {verificationResponse.confidencePct}% Forensic Confidence
                      </span>
                    </div>
                    <h4 className="text-lg font-display font-bold text-white mt-1 uppercase tracking-wider">
                      {verificationResponse.isVerified
                        ? 'Case Study Authenticated & Geotechnically Verified'
                        : 'Submission Rejected: Physical Anomaly Detected'}
                    </h4>
                  </div>
                </div>

                <div className="text-right font-mono text-xs opacity-75 uppercase tracking-wider">
                  <span>Engine: {verificationResponse.verification?.modelUsed || 'Gemini 3.7 Flash'}</span>
                </div>
              </div>

              {/* Forensic Metric Grid */}
              {verificationResponse.isVerified && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Pavement Condition</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] mt-1 block">
                      {verificationResponse.verification?.pavementConditionIndex}/100
                    </span>
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider">{verificationResponse.verification?.pciCategory}</span>
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Peak Shear Strain</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#F2E8C4] mt-1 block">
                      {verificationResponse.verification?.dynamicShearStrainMicrostrain} µε
                    </span>
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider">τxy Tensor</span>
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Pumping Risk</span>
                    <span className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 block">
                      {verificationResponse.verification?.subgradePumpingRisk}
                    </span>
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider">Pore Pressure</span>
                  </div>

                  <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
                    <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Fatigue Saved</span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 block">
                      -{verificationResponse.verification?.fatigueReductionPct}%
                    </span>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-wider">StrataGrid Balancing</span>
                  </div>
                </div>
              )}

              {/* Scientific & Engineering Forensic Breakdown */}
              <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/30 space-y-4 text-xs font-body">
                <div>
                  <span className="text-[11px] font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] block mb-2">
                    Detected Pavement Distress Categories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {verificationResponse.verification?.detectedDistressTypes?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#141414] border border-[#D4AF37]/40 text-[#F2F0E4] font-mono text-[11px] uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#888888] font-bold uppercase tracking-[0.2em] block mb-1">
                    Scientific & Geotechnical Basis:
                  </span>
                  <p className="text-[#F2F0E4]/90 leading-relaxed tracking-wide">
                    {verificationResponse.verification?.scientificBasis}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] block mb-1">
                    Recommended StrataGrid Cooperative Mitigation:
                  </span>
                  <p className="text-[#F2F0E4]/90 leading-relaxed tracking-wide">
                    {verificationResponse.verification?.recommendedMitigation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setVerificationResponse(null)}
                  className="px-5 py-2.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2E8C4] text-xs font-body uppercase tracking-[0.15em] border border-[#D4AF37]/40 transition-colors cursor-pointer"
                >
                  ← Edit Study Input
                </button>

                {verificationResponse.isVerified ? (
                  <button
                    type="button"
                    onClick={handlePublishCaseStudy}
                    className="deco-btn-solid text-xs font-bold flex items-center gap-2 cursor-pointer px-6 py-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#0A0A0A]" />
                    <span>Approve & Add to Case Studies + Gallery</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 bg-[#0A0A0A] text-[#888888] hover:text-[#F2F0E4] border border-[#D4AF37]/30 text-xs font-body uppercase tracking-wider"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
