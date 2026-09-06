import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Layers, 
  Activity, 
  Gauge, 
  GitFork, 
  Sliders, 
  Radio, 
  ShieldCheck, 
  Play, 
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Zap
} from 'lucide-react';
import { DecoCorners } from './common/DecoCorners';

interface PipelineStage {
  step: string;
  id: string;
  title: string;
  subtitle: string;
  phaseCategory: string;
  badge: string;
  icon: React.ElementType;
  overview: string;
  keyAction: string;
  metrics: { label: string; value: string; sub?: string }[];
  deepDive: {
    description: string;
    specs: string[];
    formula?: {
      title: string;
      equation: string;
      explanation: string;
    };
    techStack: string[];
  };
  interactiveDemoType: 'stream_logs' | 'hex_tiling' | 'geotech_physics' | 'svi_matrix' | 'pareto_solver' | 'signal_actuation' | 'api_payload' | 'lifecycle_roi';
}

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: '01',
    id: 'edge_ingestion',
    title: 'Multimodal Telemetry Ingestion',
    subtitle: 'Raw City Sensor Feeds & Real-Time Weather Radar',
    phaseCategory: 'Data Sourcing Layer',
    badge: '1.2M Events / Sec',
    icon: Database,
    overview: 'StrataGrid continuously ingests edge telemetry from piezoelectric Weigh-In-Motion (WIM) plates, municipal bus accelerometers, Doppler precipitation radars, and induction loop counters across metropolitan grids.',
    keyAction: 'Normalizes and aggregates sub-second heterogeneous streams into timestamped physical vector packets.',
    metrics: [
      { label: 'Sensor Network', value: '4,200+ Nodes', sub: 'City-wide Edge Coverage' },
      { label: 'Stream Ingestion', value: '1.2M / sec', sub: 'Sub-50ms Edge Latency' },
      { label: 'Telemetry Types', value: '7 Modalities', sub: 'WIM, Radar, GPS, Loops' }
    ],
    deepDive: {
      description: 'Before traffic can be orchestrated, the physical forces acting on the road must be measured. StrataGrid hooks directly into city ITS infrastructure, reading dynamic axle loads to single-pound accuracy.',
      specs: [
        'High-speed piezoelectric WIM dynamic axle weight classification',
        'Doppler radar integration for millimeter/hour precipitation rates',
        'Municipal fleet OBD-II / CAN-bus suspension vibration telemetry',
        'Sub-second inductive loop vehicle velocity and headway detection'
      ],
      formula: {
        title: 'Dynamic Axle Force Vector',
        equation: 'F_dynamic(t) = M_axle · (g + a_z(t)) + ΔF_suspension',
        explanation: 'Dynamic axle impact accounts for vertical road roughness amplification beyond static weight.'
      },
      techStack: ['Apache Kafka', 'MQTT Edge Gateway', 'WebSockets', 'gRPC Protocol Buffers']
    },
    interactiveDemoType: 'stream_logs'
  },
  {
    step: '02',
    id: 'h3_indexing',
    title: 'Uber H3 Geospatial Hexagonal Tiling',
    subtitle: 'Discrete Spatial Partitioning (Resolution 8 & 9)',
    phaseCategory: 'Spatial Indexing Layer',
    badge: '461 m² Hex Cells',
    icon: Layers,
    overview: 'Continuous city coordinates are mapped into hierarchical Uber H3 hexagonal cells (Resolution 8: 461m², Resolution 9: 65m²). Hexagons ensure uniform adjacency with 6 equidistant neighbors, preventing grid distortion.',
    keyAction: 'Converts unstructured GPS latitude/longitude traces into discrete O(1) topological spatial memory addresses.',
    metrics: [
      { label: 'Spatial Partition', value: 'Res 8 (461 m²)', sub: 'Micro-corridor resolution' },
      { label: 'Lookup Time', value: '0.42 ms', sub: 'O(1) Spatial Hash Table' },
      { label: 'Neighbor Symmetry', value: '6 Equidistant', sub: 'Zero diagonal distortion' }
    ],
    deepDive: {
      description: 'Square grids suffer from unequal diagonal distances (√2 corner distortion). Uber H3 hexagonal tiling guarantees every adjacent cell shares identical boundary distances, enabling exact hydrodynamic load propagation.',
      specs: [
        'Hierarchical parent-child spatial nesting (Res 7 to Res 10)',
        'Constant time O(1) k-ring spatial adjacency queries for neighbor diffusion',
        'Pavement surface material and age metadata bound to each cell ID',
        'Compact 64-bit integer cell identifiers for ultra-low memory footprints'
      ],
      formula: {
        title: 'Hexagonal Spatial Distance',
        equation: 'd(h₁, h₂) = H3GridDistance(h₁, h₂)  [Equidistant across 6 directional axes]',
        explanation: 'Guarantees uniform stress diffusion without diagonal geometric distortion.'
      },
      techStack: ['Uber H3 C/Wasm Core', 'Spatial Hash Indices', 'PostGIS', 'Turf.js']
    },
    interactiveDemoType: 'hex_tiling'
  },
  {
    step: '03',
    id: 'geotech_physics',
    title: 'Geotechnical Asphalt Physics Modeling',
    subtitle: 'AASHTO Fourth-Power Law & Shear Strain Tensors',
    phaseCategory: 'Physics Engine',
    badge: '4th Power Axle Scaling',
    icon: Activity,
    overview: 'Calculates the true microscopic mechanical damage of passing vehicles. Applies the AASHTO fourth-power fatigue law (Damage ∝ Load⁴), dynamic shear strain (τ_xy), and subgrade hydraulic pore pumping.',
    keyAction: 'Quantifies exponential structural damage: 1 heavy Class 8 truck causes the asphalt fatigue of 9,600 passenger cars.',
    metrics: [
      { label: 'Damage Law', value: 'Load⁴ Scaling', sub: 'AASHTO Empirical standard' },
      { label: 'Hydraulic Pumping', value: 'Pore Saturation', sub: 'Subgrade void formation' },
      { label: 'Tensile Strain', value: 'τ_xy Tensor', sub: 'Micro-strain (µε) tracking' }
    ],
    deepDive: {
      description: 'Potholes are not caused by car traffic—they are born when heavy axle passes coincide with moisture-saturated subgrade. Under high pore water pressure, repeated wheel loads pump fine sub-base gravel away, leaving hollow voids.',
      specs: [
        'AASHTO Equivalent Single Axle Load (ESAL = (Axle Load / 18,000 lbs)⁴)',
        'Hydrodynamic subgrade pore-water pressure (u_w) tracking during rainfall',
        'Dynamic shear strain (τ_xy) computation on bridge decks & joint seams',
        'Bituminous asphalt binder temperature-viscosity degradation curves'
      ],
      formula: {
        title: 'Asphalt Fatigue Damage Ratio',
        equation: 'D_fatigue = Σ (W_i / 18,000 lbs)⁴·² · Φ(Moisture) · Θ(Temp)',
        explanation: 'Moisture multiplier Φ surges up to 3.4x when subgrade pore water saturation exceeds 70%.'
      },
      techStack: ['Finite Element Approximations', 'NumPy/SciPy Tensors', 'Geotech Hydrology Models']
    },
    interactiveDemoType: 'geotech_physics'
  },
  {
    step: '04',
    id: 'vulnerability_scoring',
    title: 'Dynamic Road Structural Vulnerability Scoring',
    subtitle: 'Real-Time SVI & Pavement Condition Index (PCI)',
    phaseCategory: 'Intelligence & Diagnostics',
    badge: '0–100 SVI Metric',
    icon: Gauge,
    overview: 'Combines historical fatigue damage, real-time weather saturation, and current heavy axle accumulation to generate a live Structural Vulnerability Index (SVI) and Pavement Condition Index (PCI) for every H3 cell in the city.',
    keyAction: 'Flags fragile corridors and bridges before surface micro-cracks propagate into road-closing crater voids.',
    metrics: [
      { label: 'Score Scale', value: '0 – 100 SVI', sub: 'Low Risk to Critical Failure' },
      { label: 'Update Interval', value: 'Realtime (5s)', sub: 'Dynamic heat update' },
      { label: 'Predictive Lead', value: '14 – 21 Days', sub: 'Pre-crack void detection' }
    ],
    deepDive: {
      description: 'Traditional city maintenance inspects roads once every 3 to 5 years with visual vans. StrataGrid computes instantaneous structural vulnerability continuously, updating every 5 seconds as storm fronts pass.',
      specs: [
        'Continuous Pavement Condition Index (PCI) calculation per H3 cell',
        'Subgrade liquefaction and hydraulic pumping threshold alerts',
        'Bridge expansion joint resonance frequency harmonics monitoring',
        'Thermal gradient transverse contraction cracking predictions'
      ],
      formula: {
        title: 'Structural Vulnerability Index (SVI)',
        equation: 'SVI(h, t) = w₁·ESAL_cum + w₂·u_w(t) + w₃·τ_xy^peak + w₄·(100 - PCI_base)',
        explanation: 'When SVI exceeds 75, the cell is marked as High Vulnerability, triggering proactive traffic mitigation.'
      },
      techStack: ['Bayesian Updating', 'Continuous Scoring Daemon', 'Spatial Redis Cache']
    },
    interactiveDemoType: 'svi_matrix'
  },
  {
    step: '05',
    id: 'pareto_solver',
    title: 'Cooperative Game-Theoretic Routing & Pareto Optimization',
    subtitle: 'Multi-Objective Flow Balancing (Time vs. Infrastructure)',
    phaseCategory: 'Algorithmic Optimization',
    badge: 'Pareto Optimal Flow',
    icon: GitFork,
    overview: 'Conventional GPS algorithms selfishly route all traffic down fragile shortcuts, destroying local pavement. StrataGrid executes a cooperative Pareto optimization that balances travel times against infrastructure preservation.',
    keyAction: 'Shifts heavy Class 7/8 freight vehicles onto structurally reinforced arterials, adding < 90 seconds to trips while cutting road fatigue by 40%.',
    metrics: [
      { label: 'Average Trip Variance', value: '< +68 sec', sub: 'Negligible driver delay' },
      { label: 'Peak Stress Cut', value: '-38.4%', sub: 'On saturated fragile cells' },
      { label: 'Equilibrium State', value: 'Pareto-Nash', sub: 'Optimal social welfare' }
    ],
    deepDive: {
      description: 'By viewing urban traffic as a cooperative non-zero-sum game rather than a selfish free-for-all, StrataGrid finds the global Pareto Frontier: the mathematical boundary where infrastructure lifespan is maximized with minimal travel-time trade-off.',
      specs: [
        'Multi-objective cost function: C(e) = α·t_travel(e) + β·Damage(e)',
        'Vehicle-class specific routing: light passenger EVs take short paths, heavy trucks take reinforced paths',
        'Prevents the Braess Paradox where adding a shortcut worsens global congestion and pavement failure',
        'Dynamic capacity constraints update in real time based on cumulative daily tonnages'
      ],
      formula: {
        title: 'Pareto-Optimal Objective Formulation',
        equation: 'min_X Σ [ α·T_e(x_e) + (1 - α)·SVI_e·x_e^truck ]  s.t.  T_trip ≤ (1 + ε) T_min',
        explanation: 'Enforces hard bounding ε ≤ 0.05 (max 5% trip variation) while drastically suppressing damage.'
      },
      techStack: ['Mixed-Integer Linear Programming', 'Custom Dijkstra / A*', 'Pareto Solvers', 'Rust Core']
    },
    interactiveDemoType: 'pareto_solver'
  },
  {
    step: '06',
    id: 'signal_actuation',
    title: 'Edge Traffic Signal & Ramp Actuation',
    subtitle: 'Dynamic Green Waves & Heavy Braking Suppression',
    phaseCategory: 'Physical Actuation Layer',
    badge: '12ms Edge Actuation',
    icon: Sliders,
    overview: 'Translates optimal flow schedules into real-world actuation. Synchronizes municipal traffic signals for continuous "green waves" along heavy freight corridors, suppressing stop-and-go braking shear on vulnerable pavement.',
    keyAction: 'Eliminates high-torque truck braking and acceleration cycles that cause bitumen shoving and rutting.',
    metrics: [
      { label: 'Signal Actuation', value: '12 ms', sub: 'Edge Controller Response' },
      { label: 'Braking Shear Cut', value: '-42%', sub: 'Smoothed heavy vehicle speed' },
      { label: 'Idle Emissions', value: '-22% CO₂', sub: 'Eliminated stop-and-go delay' }
    ],
    deepDive: {
      description: 'A fully loaded 80,000-lb truck slamming on brakes at a red light imparts 4x the lateral shear strain (τ_xy) of a cruising truck. Coordinated green waves keep heavy vehicles at steady cruising speeds, protecting intersections.',
      specs: [
        'NTCIP 1202 standard traffic controller protocol integration',
        'Adaptive green split adjustment based on approaching heavy vehicle platoon size',
        'Freight corridor green wave progression synchronization across consecutive intersections',
        'Highway off-ramp metering to prevent heavy truck queue backup on fragile bridge spans'
      ],
      formula: {
        title: 'Braking Shear Force Reduction',
        equation: 'τ_shear = μ · (M · a_decel) / A_contact  [Green wave maintains a_decel ≈ 0]',
        explanation: 'Smoothing heavy vehicle velocity eliminates intersection asphalt shoving and deep rutting.'
      },
      techStack: ['NTCIP 1202 ITS Protocol', 'Edge TPU Inference', 'MQTT Actuators', 'Local Fail-Safe Timers']
    },
    interactiveDemoType: 'signal_actuation'
  },
  {
    step: '07',
    id: 'api_dispatch',
    title: 'Connected Fleet & Navigation API Dispatch',
    subtitle: 'Cooperative Directions for Commercial Fleets & Maps SDKs',
    phaseCategory: 'Integration & API Layer',
    badge: 'Open REST & gRPC API',
    icon: Radio,
    overview: 'Broadcasts cooperative routing vectors directly to municipal bus dispatchers, commercial freight telematics (Class 7/8 fleets), delivery routing APIs, and consumer turn-by-turn navigation applications.',
    keyAction: 'Provides turnkey REST, WebSocket, and gRPC endpoints that integrate seamlessly with Google Maps, Mapbox, and TMS software.',
    metrics: [
      { label: 'API Protocols', value: 'REST / gRPC', sub: 'JSON & Protobuf payload' },
      { label: 'Uptime SLA', value: '99.999%', sub: 'High Availability Multi-Region' },
      { label: 'Dispatch Target', value: 'Fleet + SDK', sub: 'Waze, Mapbox, Telematics' }
    ],
    deepDive: {
      description: 'StrataGrid acts as the foundational infrastructure-aware routing engine for modern logistics. Fleet operators gain eco-tax rebates and fuel savings, while cities preserve their multi-million dollar road networks.',
      specs: [
        'High-throughput /v1/route/cooperative endpoints with dynamic waypoint weighting',
        'Real-time WebSocket event feed for live spatial grid vulnerability alerts',
        'Turn-by-turn navigation SDK plugins for commercial logistics & municipal DPW trucks',
        'Comprehensive developer telemetry with API key governance and rate limiting'
      ],
      formula: {
        title: 'Dispatch Vector Encoding',
        equation: 'R_coop = { (h_i, v_i, Δt_i) | h_i ∈ H3Grid, SVI(h_i) < γ }',
        explanation: 'Guarantees freight dispatch instructions route exclusively through certified resilient corridors.'
      },
      techStack: ['Node.js / Express', 'Protobuf / gRPC', 'OpenAPI 3.1 Specification', 'Redis Pub/Sub']
    },
    interactiveDemoType: 'api_payload'
  },
  {
    step: '08',
    id: 'closed_loop',
    title: 'Closed-Loop Feedback & Predictive Asset Planning',
    subtitle: 'Empirical Verification & 400% Lifespan Extension',
    phaseCategory: 'Lifecycle & Asset Management',
    badge: '400% Lifespan Gain',
    icon: ShieldCheck,
    overview: 'Verifies the physical efficacy of rerouting interventions using post-actuation strain sensors. Syncs continuously with municipal Department of Public Works digital twins to extend road repaving cycles by up to 400%.',
    keyAction: 'Transforms road management from reactive, expensive emergency pothole patching to proactive, mathematical life-cycle preservation.',
    metrics: [
      { label: 'Base Lifespan', value: '400% Extension', sub: 'From 5 yrs to 20 yrs' },
      { label: 'Municipal Savings', value: '$3.4M / Year', sub: 'Per metro jurisdiction' },
      { label: 'Emergency Closures', value: '-88% Drop', sub: 'Unscheduled road shutdowns' }
    ],
    deepDive: {
      description: 'The loop is fully closed when post-reroute WIM sensors confirm that peak asphalt shear strain dropped in vulnerable cells, proving that load dispersal successfully halted micro-crack inception and void formation.',
      specs: [
        'Automated digital twin synchronization with municipal GIS asset databases',
        'Proactive preventative maintenance scheduling (targeted seal coating before deep rutting)',
        'Comprehensive carbon abatement and infrastructure longevity audit reports',
        'Long-term capital expenditure forecasting and bond rating improvements for cities'
      ],
      formula: {
        title: 'Municipal Capital Preservation Ratio',
        equation: 'ROI_StrataGrid = [ Σ ΔRepavingCost + ΔVehicleDamage ] / [ SaaS Implementation Cost ] ≈ 14.8×',
        explanation: 'Every dollar invested in cooperative spatial orchestration yields ~$14.80 in avoided emergency repaving.'
      },
      techStack: ['PostgreSQL / TimescaleDB', 'Digital Twin Sync', 'Automated GIS Exporter', 'Recharts Visualizer']
    },
    interactiveDemoType: 'lifecycle_roi'
  }
];

export const HowItWorksSection: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'continuous' | 'blueprint'>('pipeline');
  const [, setDemoState] = useState<number>(0);
  const timerRef = useRef<any>(null);

  const currentStage = PIPELINE_STAGES[activeStageIdx];

  // Auto-walkthrough playback handler
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveStageIdx((prev) => (prev + 1) % PIPELINE_STAGES.length);
      }, 4500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Periodic visual animation pulse for interactive demo states
  useEffect(() => {
    const pulse = setInterval(() => {
      setDemoState((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(pulse);
  }, []);

  const handleNext = () => {
    setActiveStageIdx((prev) => (prev + 1) % PIPELINE_STAGES.length);
    setIsPlaying(false);
  };

  const handlePrev = () => {
    setActiveStageIdx((prev) => (prev - 1 + PIPELINE_STAGES.length) % PIPELINE_STAGES.length);
    setIsPlaying(false);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn text-[#F2F0E4]">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="deco-panel p-6 sm:p-8 relative deco-crosshatch overflow-hidden">
        <DecoCorners />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                STAGE ARCHITECTURE I — VIII
              </span>
              <span className="text-xs font-mono text-[#888888] tracking-wider uppercase">
                End-to-End Autonomous Feedback Loop
              </span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#F2E8C4] tracking-[0.18em] uppercase">
              How StrataGrid AI Operates
            </h2>
            
            <p className="text-[#F2F0E4]/80 text-xs sm:text-sm leading-relaxed font-body tracking-wide">
              From raw city telemetry to geotechnical shear modeling and cooperative Pareto traffic orchestration — explore each stage of the closed-loop preservation pipeline.
            </p>
          </div>

          {/* View Mode Tabs & Play/Pause Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* View Mode Tabs */}
            <div className="p-1 bg-[#0A0A0A] border border-[#D4AF37]/40 flex items-center gap-1 font-body text-xs">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3.5 py-2 uppercase tracking-[0.15em] transition-all cursor-pointer font-bold ${
                  activeTab === 'pipeline'
                    ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'text-[#888888] hover:text-[#F2F0E4]'
                }`}
              >
                I. Walkthrough
              </button>
              <button
                onClick={() => setActiveTab('continuous')}
                className={`px-3.5 py-2 uppercase tracking-[0.15em] transition-all cursor-pointer font-bold ${
                  activeTab === 'continuous'
                    ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'text-[#888888] hover:text-[#F2F0E4]'
                }`}
              >
                II. Continuous Flow
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3.5 py-2 uppercase tracking-[0.15em] transition-all cursor-pointer font-bold ${
                  activeTab === 'blueprint'
                    ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'text-[#888888] hover:text-[#F2F0E4]'
                }`}
              >
                III. Tech Blueprint
              </button>
            </div>

            {/* Auto Playback Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2.5 text-xs font-body uppercase tracking-[0.15em] font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-[#D4AF37]/20 text-[#F2E8C4] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse'
                  : 'bg-[#141414] text-[#D4AF37] hover:text-[#F2E8C4] border-[#D4AF37]/50 hover:border-[#D4AF37]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Halt Tour</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Auto Tour Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE 8-STAGE WALKTHROUGH */}
      {activeTab === 'pipeline' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* HORIZONTAL 8-STAGE STEPPER NAVIGATION */}
          <div className="deco-panel p-5 relative overflow-x-auto">
            <DecoCorners />
            <div className="min-w-[820px] flex items-center justify-between relative py-3">
              
              {/* Connecting Gold Track Line */}
              <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[#D4AF37]/20 -translate-y-1/2 z-0"></div>
              
              {/* Active Progress Fill Line */}
              <div 
                className="absolute top-1/2 left-8 h-[2px] bg-gradient-to-r from-[#D4AF37] via-[#F2E8C4] to-[#D4AF37] -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.6)]"
                style={{ width: `${(activeStageIdx / (PIPELINE_STAGES.length - 1)) * 90}%` }}
              ></div>

              {/* Stage Nodes */}
              {PIPELINE_STAGES.map((s, idx) => {
                const isActive = activeStageIdx === idx;
                const isPassed = idx < activeStageIdx;
                const StageIcon = s.icon;
                const romanStr = ROMAN_NUMERALS[idx];

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStageIdx(idx);
                      setIsPlaying(false);
                    }}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    {/* Stepped Node Container */}
                    <div className={`w-11 h-11 flex items-center justify-center transition-all duration-300 relative ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-[0_0_20px_rgba(212,175,55,0.6)] border-2 border-[#F2E8C4] font-bold scale-110'
                        : isPassed
                        ? 'bg-[#141414] text-[#D4AF37] border-2 border-[#D4AF37]/80 hover:scale-105'
                        : 'bg-[#0A0A0A] text-[#888888] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:text-[#F2F0E4]'
                    }`}>
                      <StageIcon className="w-4 h-4" />
                    </div>

                    <div className="mt-2.5 text-center">
                      <span className={`text-[10px] font-mono font-bold block tracking-widest ${
                        isActive ? 'text-[#D4AF37]' : isPassed ? 'text-[#D4AF37]/80' : 'text-[#888888]'
                      }`}>
                        STAGE {romanStr}
                      </span>
                      <span className={`text-[11px] font-display uppercase tracking-wider block max-w-[95px] truncate leading-tight mt-0.5 ${
                        isActive ? 'text-[#F2E8C4] font-bold' : 'text-[#888888]'
                      }`}>
                        {s.title.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE STAGE DEEP-DIVE STAGE CARD */}
          <div className="deco-panel relative overflow-hidden border border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.12)]">
            <DecoCorners />
            
            {/* Stage Banner Header */}
            <div className="p-6 sm:p-8 border-b border-[#D4AF37]/30 bg-gradient-to-r from-[#141414] via-[#1C1C1C] to-[#141414] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                    STAGE {ROMAN_NUMERALS[activeStageIdx]} OF VIII
                  </span>

                  <span className="px-3 py-1 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4]/80 text-xs font-body uppercase tracking-wider">
                    {currentStage.phaseCategory}
                  </span>

                  <span className="px-3 py-1 bg-[#064E3B]/40 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold tracking-wider uppercase">
                    {currentStage.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#F2E8C4] tracking-[0.16em] uppercase">
                  {currentStage.title}
                </h3>

                <p className="text-xs sm:text-sm font-mono text-[#D4AF37] tracking-wider">
                  // {currentStage.subtitle}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handlePrev}
                  className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#D4AF37] hover:text-[#F2E8C4] border border-[#D4AF37]/50 text-xs font-body uppercase tracking-[0.15em] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#F2E8C4] text-[#0A0A0A] text-xs font-body uppercase tracking-[0.15em] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Next Stage</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stage Body Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Mechanical Explanation & Specifications */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Overview Paragraph */}
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                    Core Operational Mechanism:
                  </span>
                  <p className="text-[#F2F0E4]/90 text-sm leading-relaxed font-body tracking-wide">
                    {currentStage.overview}
                  </p>
                </div>

                {/* Key Action Callout */}
                <div className="p-4 bg-[#0A0A0A] border-l-2 border-[#D4AF37] border-y border-r border-[#D4AF37]/30 text-xs font-body flex items-start gap-3.5">
                  <div className="w-8 h-8 bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[#D4AF37] font-mono font-bold uppercase tracking-wider block mb-1">
                      Physical Impact & Actuation:
                    </span>
                    <p className="text-[#F2F0E4] leading-relaxed">{currentStage.keyAction}</p>
                  </div>
                </div>

                {/* Technical Specifications Checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                    Technical Specifications:
                  </span>
                  <div className="space-y-2.5">
                    {currentStage.deepDive.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-3 text-xs text-[#F2F0E4]/85 font-body tracking-wide">
                        <span className="text-[#D4AF37] mt-0.5 shrink-0 font-mono">◆</span>
                        <span className="leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula / Physics Callout Box */}
                {currentStage.deepDive.formula && (
                  <div className="p-5 bg-[#0A0A0A] border border-[#D4AF37]/50 space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                      <span className="text-[11px] text-[#D4AF37] font-bold uppercase tracking-[0.18em]">
                        Mathematical Formulation: {currentStage.deepDive.formula.title}
                      </span>
                    </div>
                    <div className="p-3.5 bg-[#141414] border border-[#D4AF37]/40 text-[#F2E8C4] text-xs font-bold text-center tracking-wider overflow-x-auto shadow-inner">
                      {currentStage.deepDive.formula.equation}
                    </div>
                    <p className="text-[#888888] text-[11px] font-body leading-relaxed">
                      {currentStage.deepDive.formula.explanation}
                    </p>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-mono text-[#888888] uppercase tracking-[0.2em] block">
                    Engineering Stack & Protocols:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentStage.deepDive.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] text-xs font-mono uppercase tracking-wider"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Visualizer & Telemetry Card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Metric Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  {currentStage.metrics.map((m, idx) => (
                    <div key={idx} className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/30 text-center">
                      <span className="text-[10px] text-[#888888] uppercase tracking-[0.15em] block">
                        {m.label}
                      </span>
                      <span className="text-lg font-bold text-[#D4AF37] mt-1 block">
                        {m.value}
                      </span>
                      {m.sub && (
                        <span className="text-[9px] text-[#888888] block mt-0.5 truncate">
                          {m.sub}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Dynamic Interactive Simulation Container */}
                <div className="p-5 bg-[#0A0A0A] border border-[#D4AF37]/50 space-y-4 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
                    <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#D4AF37] rotate-45 animate-pulse" />
                      Live Architecture Exhibit
                    </span>
                    <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
                      Real-Time State
                    </span>
                  </div>

                  {/* Render Contextual Demo per Stage */}
                  <div className="min-h-[220px] flex flex-col justify-center">
                    {currentStage.interactiveDemoType === 'stream_logs' && (
                      <div className="space-y-2.5 font-mono text-xs">
                        <div className="p-3 bg-[#141414] border border-[#D4AF37]/30 text-[#F2F0E4] space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-[#D4AF37]">
                            <span>[WIM-402] Dynamic Axle Load:</span>
                            <span className="font-bold">18,420 lbs</span>
                          </div>
                          <div className="flex items-center justify-between text-[#F2E8C4]">
                            <span>[RADAR] Rain Intensity:</span>
                            <span className="font-bold">14.8 mm/hr (Heavy)</span>
                          </div>
                          <div className="flex items-center justify-between text-[#D4AF37]/90">
                            <span>[LOOP-88] Vehicle Headway:</span>
                            <span className="font-bold">1.4s @ 42 mph</span>
                          </div>
                          <div className="flex items-center justify-between text-[#888888]">
                            <span>[BUS-CAN] Z-Axis Vibration:</span>
                            <span className="font-bold">+0.38g (Roughness)</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#888888] text-center font-mono uppercase tracking-wider">
                          ✓ Aggregating 4,200 telemetry streams at 12ms edge cycle
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'hex_tiling' && (
                      <div className="space-y-3 font-mono text-xs text-center">
                        <div className="grid grid-cols-3 gap-2">
                          {['8828308281fffff', '8828308283fffff', '8828308285fffff'].map((h, i) => (
                            <div key={i} className="p-3 bg-[#141414] border border-[#D4AF37]/40 text-[#D4AF37]">
                              <span className="text-[9px] text-[#888888] uppercase tracking-wider block">Hex Res 8</span>
                              <span className="font-bold text-[11px] text-[#F2E8C4]">{h.slice(0, 8)}...</span>
                              <span className="text-[9px] text-[#888888] block mt-0.5">Area: 461m²</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-[#141414] border border-[#D4AF37]/30 text-[11px] text-[#F2F0E4]/90 text-left font-body">
                          <span className="text-[#D4AF37] font-mono font-bold uppercase tracking-wider block mb-1">Spatial Topological Properties:</span>
                          • Distance between adjacent centroids: exactly 24.3 meters<br/>
                          • Equidistant 6-neighbor adjacency graph: zero distortion
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'geotech_physics' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3.5 bg-[#141414] border border-[#D4AF37]/40 space-y-2 text-[11px]">
                          <div className="flex items-center justify-between text-[#D4AF37]">
                            <span>Axle Load Exponential Ratio:</span>
                            <span className="font-bold">9,600 : 1 damage vs Car</span>
                          </div>
                          <div className="flex items-center justify-between text-rose-300">
                            <span>Subgrade Pore Saturation:</span>
                            <span className="font-bold">78% (Pumping Threshold)</span>
                          </div>
                          <div className="flex items-center justify-between text-[#F2E8C4]">
                            <span>Dynamic Shear Tensor (τxy):</span>
                            <span className="font-bold">480 µε (Elevated)</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#141414] border border-[#D4AF37]/30 overflow-hidden flex">
                          <div className="bg-[#D4AF37] h-full w-[65%]"></div>
                          <div className="bg-rose-600 h-full w-[35%] animate-pulse"></div>
                        </div>
                        <span className="text-[10px] text-[#888888] block text-center font-mono uppercase tracking-wider">
                          Pore pressure surge active: hydraulic void formation imminent
                        </span>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'svi_matrix' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-4 bg-[#141414] border border-rose-900/60 text-center">
                            <span className="text-[10px] text-[#888888] uppercase tracking-wider block">SVI Metric</span>
                            <span className="text-2xl font-bold text-rose-400 mt-1 block">78.4</span>
                            <span className="text-[10px] text-rose-300 uppercase tracking-widest">High Fragility</span>
                          </div>
                          <div className="p-4 bg-[#141414] border border-[#D4AF37]/40 text-center">
                            <span className="text-[10px] text-[#888888] uppercase tracking-wider block">Pavement PCI</span>
                            <span className="text-2xl font-bold text-[#D4AF37] mt-1 block">52 / 100</span>
                            <span className="text-[10px] text-[#F2E8C4] uppercase tracking-widest">Degraded Base</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#141414] border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] text-center uppercase tracking-wider">
                          ⚠ SVI &gt; 75 Threshold Reached: Pareto Router Activated
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'pareto_solver' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-4 bg-[#141414] border border-[#D4AF37]/40 space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#888888] font-bold">Route A (Selfish Highway):</span>
                            <span className="text-rose-400 font-bold">+180 µε Damage</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#D4AF37] font-bold">Route B (Cooperative Dispersal):</span>
                            <span className="text-emerald-400 font-bold">-42% Peak Fatigue</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#888888] border-t border-[#D4AF37]/20 pt-2">
                            <span>Travel Time Delta:</span>
                            <span className="text-[#F2E8C4] font-bold">+52 seconds</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-[#888888] text-center uppercase tracking-wider font-mono">
                          Pareto-Nash Frontier Achieved: Negligible driver delay
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'signal_actuation' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-3 bg-[#141414] border border-emerald-500/50">
                            <span className="text-[9px] text-[#888888] uppercase block">Signal 1</span>
                            <span className="text-xs font-bold text-emerald-400">GREEN</span>
                            <span className="text-[9px] text-[#888888] block mt-0.5">45s Wave</span>
                          </div>
                          <div className="p-3 bg-[#141414] border border-emerald-500/50">
                            <span className="text-[9px] text-[#888888] uppercase block">Signal 2</span>
                            <span className="text-xs font-bold text-emerald-400">GREEN</span>
                            <span className="text-[9px] text-[#888888] block mt-0.5">Synced 0s</span>
                          </div>
                          <div className="p-3 bg-[#141414] border border-[#D4AF37]/50">
                            <span className="text-[9px] text-[#888888] uppercase block">Signal 3</span>
                            <span className="text-xs font-bold text-[#D4AF37]">HOLD</span>
                            <span className="text-[9px] text-[#888888] block mt-0.5">+6s Freight</span>
                          </div>
                        </div>
                        <div className="p-2.5 bg-[#141414] border border-[#D4AF37]/30 text-[10px] text-[#D4AF37] text-center uppercase tracking-wider">
                          ✓ Stop-and-go braking shear suppressed by 42%
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'api_payload' && (
                      <div className="space-y-2 font-mono text-xs">
                        <div className="p-3.5 bg-[#141414] border border-[#D4AF37]/40 text-[10px] text-[#F2E8C4] overflow-x-auto">
                          <span className="text-[#D4AF37] font-bold">POST /v1/route/cooperative</span>
                          <pre className="text-emerald-400 mt-2 font-mono text-[10px] leading-relaxed">
{`{
  "vehicleClass": "CLASS_8_HEAVY",
  "recommendedCorridor": "ARTERIAL_SPUR_4",
  "etaSeconds": 748,
  "sviAvoidanceFactor": 0.88,
  "carbonCreditIssued": true
}`}
                          </pre>
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'lifecycle_roi' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-4 bg-[#141414] border border-[#D4AF37]/50 space-y-3 text-center">
                          <span className="text-[10px] text-[#888888] uppercase tracking-[0.2em]">
                            Long-Term Infrastructure Lifecycle
                          </span>
                          <div className="flex items-center justify-around">
                            <div>
                              <span className="text-[10px] text-[#888888] uppercase block">Traditional</span>
                              <span className="text-sm font-bold text-rose-400">5-Yr Repave</span>
                            </div>
                            <span className="text-[#D4AF37] text-lg font-display">→</span>
                            <div>
                              <span className="text-[10px] text-[#D4AF37] uppercase block">With StrataGrid</span>
                              <span className="text-sm font-bold text-[#F2E8C4]">20-Yr Lifespan</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#D4AF37] block font-bold tracking-wider uppercase border-t border-[#D4AF37]/20 pt-2">
                            +400% Base Durability ($3.4M/yr Saved per metro)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage Progress Indicator */}
                <div className="flex items-center justify-between text-xs font-mono text-[#888888] pt-2 border-t border-[#D4AF37]/20">
                  <span className="uppercase tracking-wider">Architecture Progress: {activeStageIdx + 1} / 8</span>
                  <div className="flex gap-2">
                    {PIPELINE_STAGES.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rotate-45 transition-all ${
                          i === activeStageIdx ? 'bg-[#D4AF37] scale-125 shadow-[0_0_8px_rgba(212,175,55,0.8)]' : i < activeStageIdx ? 'bg-[#F2E8C4]' : 'bg-[#1C1C1C] border border-[#D4AF37]/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: CONTINUOUS FLOW TIMELINE */}
      {activeTab === 'continuous' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="deco-panel p-6 sm:p-8 relative">
            <DecoCorners />
            <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F2E8C4] tracking-[0.16em] uppercase mb-2">
              Continuous 8-Stage Data Pipeline Architecture
            </h3>
            <p className="text-xs sm:text-sm font-body text-[#F2E8C4]/80 max-w-3xl leading-relaxed mb-8">
              Follow the physical telemetry flow from initial piezoelectric edge sensing through geotechnical tensor computation, Pareto game-theoretic rerouting, and municipal asset preservation.
            </p>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37] via-[#F2E8C4] to-[#D4AF37]">
              {PIPELINE_STAGES.map((stage, idx) => {
                const StageIcon = stage.icon;
                const romanStr = ROMAN_NUMERALS[idx];
                return (
                  <div key={stage.id} className="relative flex items-start gap-6 group">
                    
                    {/* Stepped Node Diamond */}
                    <div className="w-16 h-16 bg-[#0A0A0A] border-2 border-[#D4AF37] group-hover:border-[#F2E8C4] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] flex items-center justify-center text-[#D4AF37] shrink-0 z-10 transition-all duration-300">
                      <StageIcon className="w-6 h-6" />
                    </div>

                    {/* Stage Card */}
                    <div className="flex-1 p-6 bg-[#141414] border border-[#D4AF37]/40 group-hover:border-[#D4AF37] transition-all space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
                            STAGE {romanStr}
                          </span>
                          <span className="text-xs font-body uppercase text-[#888888]">
                            • {stage.phaseCategory}
                          </span>
                        </div>
                        <span className="px-3 py-0.5 bg-[#064E3B]/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold uppercase">
                          {stage.badge}
                        </span>
                      </div>

                      <h4 className="text-lg sm:text-xl font-display font-bold text-[#F2E8C4] tracking-wider uppercase">
                        {stage.title}
                      </h4>

                      <p className="text-xs font-body text-[#F2E8C4]/85 leading-relaxed">
                        {stage.overview}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#D4AF37]/20 font-mono text-xs">
                        {stage.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="p-3 bg-[#0A0A0A] border border-[#D4AF37]/30">
                            <span className="text-[10px] text-[#888888] uppercase tracking-wider block">{m.label}</span>
                            <span className="text-sm font-bold text-[#D4AF37] mt-0.5 block">{m.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: TECH BLUEPRINT & SYSTEM LAYERS */}
      {activeTab === 'blueprint' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="deco-panel p-6 sm:p-8 relative space-y-8">
            <DecoCorners />
            <div>
              <span className="text-xs font-mono text-[#D4AF37] font-bold uppercase tracking-[0.2em] block">
                Technical Stack & Infrastructure Topology
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em] mt-1">
                StrataGrid Full-Stack Architecture Blueprint
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
              
              {/* Layer 1 */}
              <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/40 space-y-3 relative hover:border-[#D4AF37] transition-all">
                <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] block text-[11px]">
                  I. Edge Sourcing Layer
                </span>
                <p className="text-[#F2E8C4]/80 font-body text-xs leading-relaxed">
                  Sub-50ms ingestion of piezoelectric WIM, Doppler radar, and loop counters.
                </p>
                <div className="space-y-1.5 text-[#888888] text-[11px] pt-3 border-t border-[#D4AF37]/20 font-mono">
                  <div>• Kafka / MQTT Gateways</div>
                  <div>• WebSockets & gRPC</div>
                  <div>• Doppler Radar Feeds</div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/40 space-y-3 relative hover:border-[#D4AF37] transition-all">
                <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] block text-[11px]">
                  II. Spatial Tiling Core
                </span>
                <p className="text-[#F2E8C4]/80 font-body text-xs leading-relaxed">
                  Uber H3 Resolution 8/9 hexagonal discretization with O(1) hash tables.
                </p>
                <div className="space-y-1.5 text-[#888888] text-[11px] pt-3 border-t border-[#D4AF37]/20 font-mono">
                  <div>• Uber H3 C/Wasm Engine</div>
                  <div>• PostGIS Spatial Indexing</div>
                  <div>• 461m² Micro-Corridors</div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/40 space-y-3 relative hover:border-[#D4AF37] transition-all">
                <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] block text-[11px]">
                  III. Geotechnical Physics
                </span>
                <p className="text-[#F2E8C4]/80 font-body text-xs leading-relaxed">
                  AASHTO 4th-power fatigue law and subgrade pore water pressure (u_w).
                </p>
                <div className="space-y-1.5 text-[#888888] text-[11px] pt-3 border-t border-[#D4AF37]/20 font-mono">
                  <div>• Finite Element Math</div>
                  <div>• Dynamic Shear Tensors</div>
                  <div>• SVI & PCI Scoring Daemons</div>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/40 space-y-3 relative hover:border-[#D4AF37] transition-all">
                <span className="text-[#D4AF37] font-bold uppercase tracking-[0.2em] block text-[11px]">
                  IV. Pareto Orchestration
                </span>
                <p className="text-[#F2E8C4]/80 font-body text-xs leading-relaxed">
                  Multi-objective game-theoretic routing and NTCIP 1202 signal actuation.
                </p>
                <div className="space-y-1.5 text-[#888888] text-[11px] pt-3 border-t border-[#D4AF37]/20 font-mono">
                  <div>• Mixed-Integer LP Solver</div>
                  <div>• NTCIP Traffic Controllers</div>
                  <div>• Fleet Turn-by-Turn APIs</div>
                </div>
              </div>
            </div>

            {/* Verification and Closed Loop Summary Box */}
            <div className="p-6 bg-[#0A0A0A] border border-[#D4AF37]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[#F2E8C4] font-bold uppercase tracking-[0.15em] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
                  Closed-Loop Autonomous Assurance:
                </span>
                <p className="text-[#888888] font-body text-xs leading-relaxed">
                  The system continuously compares pre-rerouting predictions with post-rerouting WIM sensor strain, retraining AI models every 24 hours.
                </p>
              </div>
              <div className="px-4 py-2 bg-[#064E3B]/40 text-emerald-300 border border-emerald-500/50 shrink-0 font-bold uppercase tracking-wider text-center">
                99.999% SLA • Zero Edge Drift
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
