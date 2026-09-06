import React, { useState } from 'react';
import { Upload, AlertTriangle, Route, Car, TrendingUp, Sparkles, Image as ImageIcon, CheckCircle2, Droplets, Activity, Layers } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80'
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'mechanics' | 'scanner'>('overview');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Sub-segment selector tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#161b22] text-[#00f5ff] border border-[#00f5ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          1. The Feedback Loop
        </button>
        <button
          onClick={() => setActiveTab('mechanics')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            activeTab === 'mechanics'
              ? 'bg-[#161b22] text-[#00f5ff] border border-[#00f5ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          2. Asphalt Mechanics & Fatigue
        </button>
        <button
          onClick={() => setActiveTab('scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
            activeTab === 'scanner'
              ? 'bg-[#161b22] text-[#00f5ff] border border-[#00f5ff]/40 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          3. Interactive Surface Defect Scanner
        </button>
      </div>

      {/* Segment 1 & 2: Structural Breakdown & Geotechnical Mechanics */}
      {(activeTab === 'overview' || activeTab === 'mechanics') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Conceptual Breakdown */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-[#161b22] p-6 rounded-2xl border border-slate-700 shadow-xl flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Route className="w-4 h-4" />
                  <span>The Feedback Loop of Road Failure</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-white">
                  How Micro-Shortcuts Destroy Macro Infrastructure
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  When a highway slows down, algorithmic navigation redirects hundreds of commuters through residential avenues and aged overpasses. These localized streets are structurally engineered for light neighborhood traffic, not repetitive heavy peak-hour cycles.
                </p>
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-mono space-y-1">
                  <span className="font-bold uppercase tracking-wider block">Conventional Navigation Blindspot:</span>
                  <p className="text-rose-200">
                    A route saving <span className="font-bold underline text-white">35 seconds</span> can cause up to <span className="font-bold underline text-white">680% more shear fatigue</span> per axle on rain-saturated secondary aggregate bases.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-800 font-mono text-xs">
                <div className="p-3 bg-[#0d1117] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Typical Reroute Surge</span>
                  <span className="text-lg font-bold text-rose-400 mt-1 block">+340% Flow</span>
                </div>
                <div className="p-3 bg-[#0d1117] rounded-xl border border-slate-800">
                  <span className="text-slate-400 block">Subgrade Microcracks</span>
                  <span className="text-lg font-bold text-amber-400 mt-1 block">4.2x Faster</span>
                </div>
              </div>
            </div>

            {/* Bottom Sub-card: Moisture Degradation */}
            <div className="bg-[#161b22] p-5 rounded-2xl border border-slate-700 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="space-y-1 text-xs">
                <span className="font-bold text-white font-mono uppercase tracking-wider">Moisture & Hydraulic Pumping</span>
                <p className="text-slate-300">
                  Heavy truck passes over saturated pavement force trapped water upward at high velocity, blasting asphalt binder away from aggregate stones and opening rapid potholes.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative Proof Card */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="bg-[#161b22] p-6 rounded-2xl border border-slate-700 shadow-xl flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  <span>The StrataGrid AI Paradigm</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-white">
                  Cooperative Load-Balanced Routing
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  StrataGrid models dynamic structural road fatigue in real time. By dispersing commuter density across resilient corridors, it prevents sub-surface breakdown with zero perceivable delay to the driver.
                </p>

                <div className="space-y-3 font-mono text-xs pt-2">
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Pothole Outbreak Prevention</span>
                    <span className="font-bold text-teal-400">-84% Incursions</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Sub-base Elastic Fatigue</span>
                    <span className="font-bold text-emerald-400">-32.4% Shear Stress</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">Driver Commute Variance</span>
                    <span className="font-bold text-slate-200">&lt; 90 seconds</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-mono mt-6 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
                <span>Municipal infrastructure preserved without expanding highway lanes.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Segment 3: Interactive Surface Defect Scanner */}
      {(activeTab === 'overview' || activeTab === 'scanner') && (
        <div className="bg-[#161b22] p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Computer Vision & Defect Telemetry</span>
              </div>
              <h3 className="text-xl font-headline font-bold text-white mt-1">
                Visual Infrastructure Defect Inspector
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Drag-and-drop or upload field drone inspection imagery
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Image Preview / Drop Area */}
            <div className="lg:col-span-7">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-all h-72 sm:h-80 flex items-center justify-center ${
                  isDragging
                    ? 'border-[#00f5ff] bg-[#00f5ff]/10'
                    : 'border-slate-700 bg-[#0d1117]'
                }`}
              >
                {uploadedImage ? (
                  <>
                    <img
                      src={uploadedImage}
                      alt="Surface Defect Inspection"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Simulated Detection Bounding Box Overlay */}
                    <div className="absolute top-1/3 left-1/4 w-36 h-28 border-2 border-rose-500 bg-rose-500/20 rounded-lg pointer-events-none animate-pulse flex flex-col justify-between p-1.5 font-mono text-[10px] text-rose-300 font-bold">
                      <span className="bg-rose-950/80 px-1 py-0.5 rounded self-start">POTHOLE 98.4%</span>
                      <span className="self-end text-right">SHEAR DEPTH: 4.8cm</span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-[#0b1326]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-mono text-slate-300">
                      <span>Source: Autonomous Drone Telemetry Scan #408</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs font-mono text-slate-400">Drop an image here or click upload below</p>
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Information Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-[#0d1117] border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Defect Classification</span>
                  <span className="text-rose-400 font-bold">Severe Aggregate Stripping</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Sub-base Moisture Index</span>
                  <span className="text-amber-400 font-bold">78% (Critical Saturation)</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Recommended Routing Action</span>
                  <span className="text-teal-400 font-bold">Dynamic Axle Shift (&lt; 15T)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Repair Cost Avoidance</span>
                  <span className="text-emerald-400 font-bold">$18,400 (Preventative)</span>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="flex items-center gap-3">
                <label className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-mono text-xs font-medium cursor-pointer transition-colors flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 text-[#00f5ff]" />
                  <span>Upload Inspection Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
