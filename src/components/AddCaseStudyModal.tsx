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
  RefreshCw,
  Eye
} from 'lucide-react';
import { CaseStudy, GalleryItem } from '../types';
import { saveVerifiedCaseStudy } from '../utils/caseStudiesStorage';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#121720] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-[#161d28]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  AI Forensic Engine
                </span>
                <span className="text-xs font-mono text-slate-400">Pavement Quality Validation</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-white mt-0.5">
                Submit Road Quality Case Study
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!verificationResponse ? (
            <form onSubmit={handleRunVerification} className="space-y-6">
              
              {/* SECTION 1: Location & Classification */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f5ff] uppercase tracking-wider border-b border-slate-800/80 pb-2">
                  <Layers className="w-4 h-4" />
                  <span>1. Corridor & Field Location Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold block">
                      Case Study Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Grand Ave Viaduct Deck Spalling & Rutting Study"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#00f5ff] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold block">
                      Location / District *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Metropolis Civic Corridor, Sector 7-B"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#00f5ff] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold block">
                      Road Classification
                    </label>
                    <select
                      value={roadType}
                      onChange={(e) => setRoadType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white text-xs focus:outline-none focus:border-[#00f5ff] transition-all"
                    >
                      <option value="arterial">Major Arterial Road</option>
                      <option value="highway">High-Speed Highway / Expressway</option>
                      <option value="bridge">Bridge / Elevated Viaduct</option>
                      <option value="urban_corridor">Dense Urban Transit Corridor</option>
                      <option value="freight_spur">Industrial Freight Spur / Port Access</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 font-bold block">
                      Pilot Duration / Timeframe
                    </label>
                    <input
                      type="text"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="e.g. 6-Month Field Pilot"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#00f5ff] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Road Quality Photo & Distress Capture */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f5ff] uppercase tracking-wider border-b border-slate-800/80 pb-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>2. Road Quality Photo & Visual Distress Capture</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Photo Preview / Upload Area */}
                  <div className="md:col-span-6 space-y-3">
                    <div className="relative h-44 rounded-xl border border-slate-700 bg-black overflow-hidden flex items-center justify-center group">
                      {imageData ? (
                        <>
                          <img
                            src={imageData}
                            alt="Road Inspection Preview"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              Ready for Forensic Scan
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-4 text-slate-500">
                          <Upload className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs">No image attached</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold border border-slate-700 text-center cursor-pointer transition-colors flex items-center justify-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#00f5ff]" />
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
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Or select a benchmark road distress sample:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex flex-col justify-between h-20 ${
                            imageData === preset.url
                              ? 'bg-emerald-500/10 border-emerald-500/60 text-white'
                              : 'bg-[#0d1117] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <span className="font-semibold line-clamp-2 text-[11px] leading-tight text-white">
                            {preset.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#00f5ff] uppercase mt-1">
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
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00f5ff] uppercase tracking-wider border-b border-slate-800/80 pb-2">
                  <Activity className="w-4 h-4" />
                  <span>3. Pavement Distress Claim & Telemetry Variables</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-bold block">
                    Observed Pavement Quality & Distress Claim *
                  </label>
                  <input
                    type="text"
                    required
                    value={pavementConditionClaim}
                    onChange={(e) => setPavementConditionClaim(e.target.value)}
                    placeholder="e.g. Longitudinal rutting with 65mm pothole and subgrade moisture pumping"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#00f5ff] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300 font-bold block">
                    Detailed Field Notes & Structural Engineering Observation *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe specific physical symptoms: cracking width, void depths, drainage condition, heavy vehicle frequency, and impact of traffic loads on the road base."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#00f5ff] transition-all leading-relaxed"
                  />
                </div>

                {/* Physics Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Gauge className="w-3.5 h-3.5 text-[#00f5ff]" />
                        Traffic Flow:
                      </span>
                      <span className="text-white font-bold">{trafficVolume} veh/day</span>
                    </div>
                    <input
                      type="range"
                      min={500}
                      max={10000}
                      step={100}
                      value={trafficVolume}
                      onChange={(e) => setTrafficVolume(Number(e.target.value))}
                      className="w-full accent-[#00f5ff]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5 text-amber-400" />
                        Heavy Axles:
                      </span>
                      <span className="text-white font-bold">{heavyVehiclePct}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={80}
                      step={1}
                      value={heavyVehiclePct}
                      onChange={(e) => setHeavyVehiclePct(Number(e.target.value))}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-teal-400" />
                        Pore Moisture:
                      </span>
                      <span className="text-white font-bold">{subgradeMoisturePct}%</span>
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
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Attestation Statement / Field Quote (Optional)
                    </label>
                    <input
                      type="text"
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder="e.g. Dynamic load balancing averted an emergency viaduct closure."
                      className="w-full px-3 py-2 rounded-xl bg-[#0d1117] border border-slate-700 text-white text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      Engineer Name / Title
                    </label>
                    <input
                      type="text"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      placeholder="e.g. Lead Geotech Engineer"
                      className="w-full px-3 py-2 rounded-xl bg-[#0d1117] border border-slate-700 text-white text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button: Run Verification */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{verificationStage || 'Analyzing Telemetry & Mechanics...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Run AI Forensic Verification</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* VERIFICATION RESULT INSPECTION CARD */
            <div className="space-y-6 animate-fadeIn">
              
              {/* Verdict Header Banner */}
              <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                verificationResponse.isVerified
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center gap-3.5">
                  {verificationResponse.isVerified ? (
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                      <XCircle className="w-7 h-7" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        verificationResponse.isVerified
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {verificationResponse.verdict}
                      </span>
                      <span className="text-xs font-mono opacity-80">
                        {verificationResponse.confidencePct}% Forensic Confidence
                      </span>
                    </div>
                    <h4 className="text-lg font-headline font-bold text-white mt-1">
                      {verificationResponse.isVerified
                        ? 'Case Study Authenticated & Geotechnically Verified'
                        : 'Submission Rejected: Physical Anomaly / Contradiction'}
                    </h4>
                  </div>
                </div>

                <div className="text-right font-mono text-xs opacity-75">
                  <span>Engine: {verificationResponse.verification?.modelUsed || 'Gemini 3.7 Flash'}</span>
                </div>
              </div>

              {/* Forensic Metric Grid */}
              {verificationResponse.isVerified && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pavement Condition</span>
                    <span className="text-xl sm:text-2xl font-bold text-[#00f5ff] mt-1 block">
                      {verificationResponse.verification?.pavementConditionIndex}/100
                    </span>
                    <span className="text-[10px] text-slate-400">{verificationResponse.verification?.pciCategory}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Peak Shear Strain</span>
                    <span className="text-xl sm:text-2xl font-bold text-amber-400 mt-1 block">
                      {verificationResponse.verification?.dynamicShearStrainMicrostrain} µε
                    </span>
                    <span className="text-[10px] text-slate-400">τxy Tensor</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pumping Risk</span>
                    <span className="text-xl sm:text-2xl font-bold text-rose-400 mt-1 block">
                      {verificationResponse.verification?.subgradePumpingRisk}
                    </span>
                    <span className="text-[10px] text-slate-400">Hydraulic Pore Pressure</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fatigue Saved</span>
                    <span className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1 block">
                      -{verificationResponse.verification?.fatigueReductionPct}%
                    </span>
                    <span className="text-[10px] text-emerald-400">StrataGrid Rerouting</span>
                  </div>
                </div>
              )}

              {/* Scientific & Engineering Forensic Breakdown */}
              <div className="p-5 rounded-2xl bg-[#0d1117] border border-slate-800 space-y-4 text-xs font-sans">
                <div>
                  <span className="text-[11px] font-mono text-[#00f5ff] font-bold uppercase tracking-wider block mb-1">
                    Detected Pavement Distress Categories:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {verificationResponse.verification?.detectedDistressTypes?.map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Scientific & Geotechnical Basis:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {verificationResponse.verification?.scientificBasis}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono text-teal-400 font-bold uppercase tracking-wider block mb-1">
                    Recommended StrataGrid Cooperative Mitigation:
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {verificationResponse.verification?.recommendedMitigation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setVerificationResponse(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  ← Edit Study Input
                </button>

                {verificationResponse.isVerified ? (
                  <button
                    type="button"
                    onClick={handlePublishCaseStudy}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Add to Case Studies + Inspection Gallery</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
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
