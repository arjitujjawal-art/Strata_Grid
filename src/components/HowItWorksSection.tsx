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
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Droplets, 
  Truck, 
  Zap, 
  BarChart3, 
  Code, 
  Share2, 
  Eye, 
  Flame, 
  CornerDownRight,
  Info,
  Clock
} from 'lucide-react';

interface PipelineStage {
  step: string;
  id: string;
  title: string;
  subtitle: string;
  phaseCategory: string;
  badge: string;
  accentColor: 'teal' | 'emerald' | 'amber' | 'cyan' | 'purple';
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

const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: '01',
    id: 'edge_ingestion',
    title: 'Multimodal Telemetry Ingestion',
    subtitle: 'Raw City Sensor Feeds & Real-Time Weather Radar',
    phaseCategory: 'Data Sourcing Layer',
    badge: '1.2M Events / Sec',
    accentColor: 'cyan',
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
        equation: 'F_dynamic(t) = M_axle \\cdot (g + a_{z}(t)) + \\Delta F_{suspension}',
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
    accentColor: 'teal',
    icon: Layers,
    overview: 'Continuous city coordinates are mapped into hierarchical Uber H3 hexagonal cells (Resolution 8: 461m², Resolution 9: 65m²). Hexagons ensure uniform adjacency with 6 equidistant neighbors, preventing grid distortion.',
    keyAction: 'Converts unstructured GPS latitude/longitude traces into discrete O(1) topological spatial memory addresses.',
    metrics: [
      { label: 'Spatial Partition', value: 'Res 8 (461 m²)', sub: 'Micro-corridor resolution' },
      { label: 'Lookup Time', value: '0.42 ms', sub: 'O(1) Spatial Hash Table' },
      { label: 'Neighbor Symmetry', value: '6 Equidistant', sub: 'Zero diagonal distortion' }
    ],
    deepDive: {
      description: 'Square grids suffer from unequal diagonal distances ($\sqrt{2} \\times$ corner distortion). Uber H3 hexagonal tiling guarantees every adjacent cell shares identical boundary distances, enabling exact hydrodynamic load propagation.',
      specs: [
        'Hierarchical parent-child spatial nesting (Res 7 to Res 10)',
        'Constant time O(1) k-ring spatial adjacency queries for neighbor diffusion',
        'Pavement surface material and age metadata bound to each cell ID',
        'Compact 64-bit integer cell identifiers for ultra-low memory footprints'
      ],
      formula: {
        title: 'Hexagonal Spatial Distance',
        equation: 'd(h_1, h_2) = \\text{H3GridDistance}(h_1, h_2) \\quad [\\text{Equidistant across 6 directional axes}]',
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
    accentColor: 'amber',
    icon: Activity,
    overview: 'Calculates the true microscopic mechanical damage of passing vehicles. Applies the AASHTO fourth-power fatigue law ($Damage \\propto Load^4$), dynamic shear strain ($\tau_{xy}$), and subgrade hydraulic pore pumping.',
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
        'Hydrodynamic subgrade pore-water pressure ($u_w$) tracking during rainfall',
        'Dynamic shear strain ($\tau_{xy}$) computation on bridge decks & joint seams',
        'Bituminous asphalt binder temperature-viscosity degradation curves'
      ],
      formula: {
        title: 'Asphalt Fatigue Damage Ratio',
        equation: 'D_{fatigue} = \\sum_{i=1}^{N} \\left( \\frac{W_i}{18{,}000\\,\\text{lbs}} \\right)^{4.2} \\cdot \\Phi(\\text{Moisture}) \\cdot \\Theta(\\text{Temp})',
        explanation: 'Moisture multiplier $\\Phi$ surges up to 3.4x when subgrade pore water saturation exceeds 70%.'
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
    accentColor: 'purple',
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
        equation: '\\text{SVI}(h, t) = w_1 \\cdot \\text{ESAL}_{cum} + w_2 \\cdot u_w(t) + w_3 \\cdot \\tau_{xy}^{\\text{peak}} + w_4 \\cdot (100 - \\text{PCI}_{base})',
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
    accentColor: 'emerald',
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
        'Multi-objective cost function: $C(e) = \\alpha \\cdot t_{\\text{travel}}(e) + \\beta \\cdot \\text{Damage}(e)$',
        'Vehicle-class specific routing: light passenger EVs take short paths, heavy trucks take reinforced paths',
        'Prevents the Braess Paradox where adding a shortcut worsens global congestion and pavement failure',
        'Dynamic capacity constraints update in real time based on cumulative daily tonnages'
      ],
      formula: {
        title: 'Pareto-Optimal Objective Formulation',
        equation: '\\min_{X} \\quad \\sum_{e \\in E} \\left( \\alpha \\cdot T_e(x_e) + (1 - \\alpha) \\cdot \\text{SVI}_e \\cdot x_e^{\\text{truck}} \\right) \\quad \\text{s.t.} \\quad T_{\\text{trip}} \\le (1 + \\epsilon) T_{\\text{min}}',
        explanation: 'Enforces hard bounding $\\epsilon \\le 0.05$ (max 5% trip variation) while drastically suppressing damage.'
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
    accentColor: 'amber',
    icon: Sliders,
    overview: 'Translates optimal flow schedules into real-world actuation. Synchronizes municipal traffic signals for continuous "green waves" along heavy freight corridors, suppressing stop-and-go braking shear on vulnerable pavement.',
    keyAction: 'Eliminates high-torque truck braking and acceleration cycles that cause bitumen shoving and rutting.',
    metrics: [
      { label: 'Signal Actuation', value: '12 ms', sub: 'Edge Controller Response' },
      { label: 'Braking Shear Cut', value: '-42%', sub: 'Smoothed heavy vehicle speed' },
      { label: 'Idle Emissions', value: '-22% CO₂', sub: 'Eliminated stop-and-go delay' }
    ],
    deepDive: {
      description: 'A fully loaded 80,000-lb truck slamming on brakes at a red light imparts 4x the lateral shear strain ($\tau_{xy}$) of a cruising truck. Coordinated green waves keep heavy vehicles at steady cruising speeds, protecting intersections.',
      specs: [
        'NTCIP 1202 standard traffic controller protocol integration',
        'Adaptive green split adjustment based on approaching heavy vehicle platoon size',
        'Freight corridor green wave progression synchronization across consecutive intersections',
        'Highway off-ramp metering to prevent heavy truck queue backup on fragile bridge spans'
      ],
      formula: {
        title: 'Braking Shear Force Reduction',
        equation: '\\tau_{\\text{shear}} = \\mu \\cdot \\frac{M \\cdot a_{\\text{decel}}}{A_{\\text{contact}}} \\quad [\\text{Green wave maintains } a_{\\text{decel}} \\approx 0]',
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
    accentColor: 'cyan',
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
        'High-throughput `/v1/route/cooperative` endpoints with dynamic waypoint weighting',
        'Real-time WebSocket event feed for live spatial grid vulnerability alerts',
        'Turn-by-turn navigation SDK plugins for commercial logistics & municipal DPW trucks',
        'Comprehensive developer telemetry with API key governance and rate limiting'
      ],
      formula: {
        title: 'Dispatch Vector Encoding',
        equation: '\\mathbf{R}_{\\text{coop}} = \\{ (h_i, v_i, \\Delta t_i) \\mid h_i \\in \\text{H3Grid}, \\, \\text{SVI}(h_i) < \\gamma \\}',
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
    accentColor: 'emerald',
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
        equation: '\\text{ROI}_{\\text{StrataGrid}} = \\frac{\\sum \\Delta \\text{RepavingCost} + \\Delta \\text{VehicleDamage}}{\\text{SaaS Implementation Cost}} \\approx 14.8\\times',
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
  const [demoState, setDemoState] = useState<number>(0);
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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* SECTION HEADER & CONTROL BAR */}
      <div className="bg-[#121826] p-5 sm:p-6 rounded-2xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        {/* Subtle Hexagonal Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#00f5ff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#00f5ff]/15 border border-[#00f5ff]/40 text-[#00f5ff] text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                8-Stage Full Architecture
              </span>
              <span className="text-xs font-mono text-slate-400">
                End-to-End Autonomous Feedback Loop
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
              How StrataGrid AI Works
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans">
              From raw city telemetry to geotechnical shear modeling and cooperative Pareto traffic orchestration — explore each stage of the closed-loop preservation pipeline.
            </p>
          </div>

          {/* View Mode Tabs & Play/Pause Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* View Mode Pills */}
            <div className="p-1 rounded-xl bg-[#090d16] border border-slate-700 flex items-center gap-1 font-mono text-xs">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'pipeline'
                    ? 'bg-[#00f5ff] text-[#002021] font-bold shadow-md shadow-[#00f5ff]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Interactive Walkthrough
              </button>
              <button
                onClick={() => setActiveTab('continuous')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'continuous'
                    ? 'bg-[#00f5ff] text-[#002021] font-bold shadow-md shadow-[#00f5ff]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Continuous Flow
              </button>
              <button
                onClick={() => setActiveTab('blueprint')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'blueprint'
                    ? 'bg-[#00f5ff] text-[#002021] font-bold shadow-md shadow-[#00f5ff]/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tech Blueprint
              </button>
            </div>

            {/* Auto Playback Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pause Walkthrough</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#00f5ff]" />
                  <span>Auto Tour Pipeline</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE 8-STAGE WALKTHROUGH */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* HORIZONTAL 8-STAGE CIRCUIT STEPPER NAVIGATION */}
          <div className="bg-[#121826] p-4 rounded-2xl border border-slate-700/80 shadow-xl overflow-x-auto">
            <div className="min-w-[760px] flex items-center justify-between relative py-2">
              
              {/* Connecting Background Circuit Line */}
              <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
              
              {/* Active Progress Fill Line */}
              <div 
                className="absolute top-1/2 left-6 h-0.5 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 -translate-y-1/2 z-0 transition-all duration-500"
                style={{ width: `${(activeStageIdx / (PIPELINE_STAGES.length - 1)) * 92}%` }}
              ></div>

              {/* Stage Nodes */}
              {PIPELINE_STAGES.map((s, idx) => {
                const isActive = activeStageIdx === idx;
                const isPassed = idx < activeStageIdx;
                const StageIcon = s.icon;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStageIdx(idx);
                      setIsPlaying(false);
                    }}
                    className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-[#00f5ff] text-[#002021] scale-110 shadow-lg shadow-[#00f5ff]/40 ring-4 ring-[#00f5ff]/20 font-bold'
                        : isPassed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 hover:scale-105'
                        : 'bg-[#090d16] text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200'
                    }`}>
                      <StageIcon className="w-4 h-4" />
                    </div>

                    <div className="mt-2 text-center">
                      <span className={`text-[10px] font-mono font-bold block ${
                        isActive ? 'text-[#00f5ff]' : isPassed ? 'text-emerald-400' : 'text-slate-400'
                      }`}>
                        Stage {s.step}
                      </span>
                      <span className={`text-[11px] font-headline font-semibold block max-w-[90px] truncate leading-tight ${
                        isActive ? 'text-white' : 'text-slate-400'
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
          <div className="bg-[#121826] rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
            
            {/* Stage Banner Header */}
            <div className="p-6 sm:p-8 border-b border-slate-800 bg-gradient-to-r from-[#162033] via-[#121826] to-[#162033] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-[#00f5ff]/20 border border-[#00f5ff]/50 text-[#00f5ff] text-xs font-mono font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Stage {currentStage.step} of 08
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
                    {currentStage.phaseCategory}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                    {currentStage.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-headline font-bold text-white tracking-tight">
                  {currentStage.title}
                </h3>

                <p className="text-sm font-mono text-[#00f5ff]">
                  {currentStage.subtitle}
                </p>
              </div>

              {/* Step Navigation Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-mono transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-4 py-2 rounded-xl bg-[#00f5ff] hover:bg-[#38f8ff] text-[#002021] text-xs font-mono font-bold shadow-lg shadow-[#00f5ff]/20 transition-all flex items-center gap-1 cursor-pointer"
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
                  <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider block">
                    Core Operational Mechanism:
                  </span>
                  <p className="text-slate-200 text-sm leading-relaxed font-sans">
                    {currentStage.overview}
                  </p>
                </div>

                {/* Key Action Callout */}
                <div className="p-4 rounded-xl bg-[#090d16] border border-slate-800 text-xs font-mono flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] shrink-0 mt-0.5">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Physical Impact / Action:</span>
                    <p className="text-white leading-relaxed">{currentStage.keyAction}</p>
                  </div>
                </div>

                {/* Technical Specifications Checklist */}
                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#00f5ff] font-bold uppercase tracking-wider block">
                    Technical Specifications:
                  </span>
                  <div className="space-y-2">
                    {currentStage.deepDive.specs.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-sans">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Formula / Physics Callout Box (if present) */}
                {currentStage.deepDive.formula && (
                  <div className="p-4 rounded-xl bg-[#0b121e] border border-slate-700/80 space-y-2 font-mono text-xs">
                    <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                      Mathematical & Physics Formulation: {currentStage.deepDive.formula.title}
                    </span>
                    <div className="p-3 rounded-lg bg-black/60 border border-slate-800 text-[#00f5ff] text-xs font-bold text-center tracking-wide overflow-x-auto">
                      {currentStage.deepDive.formula.equation}
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                      {currentStage.deepDive.formula.explanation}
                    </p>
                  </div>
                )}

                {/* Tech Stack Chips */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                    Technologies & Protocols:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentStage.deepDive.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono"
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
                    <div key={idx} className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        {m.label}
                      </span>
                      <span className="text-base font-bold text-[#00f5ff] mt-1 block">
                        {m.value}
                      </span>
                      {m.sub && (
                        <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                          {m.sub}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Live Dynamic Interactive Simulation Container */}
                <div className="p-5 rounded-2xl bg-[#090d16] border border-slate-800 space-y-4 shadow-inner">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-mono text-[#00f5ff] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#00f5ff] animate-pulse" />
                      Live Stage Demonstration
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Auto-Telemetry
                    </span>
                  </div>

                  {/* Render Contextual Demo per Stage */}
                  <div className="min-h-[220px] flex flex-col justify-center">
                    {currentStage.interactiveDemoType === 'stream_logs' && (
                      <div className="space-y-2 font-mono text-xs">
                        <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-slate-300 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-cyan-400">
                            <span>[WIM-402] Class 8 Axle Weight:</span>
                            <span className="font-bold">18,420 lbs</span>
                          </div>
                          <div className="flex items-center justify-between text-teal-400">
                            <span>[DOPPLER] Precipitation Intensity:</span>
                            <span className="font-bold">14.8 mm/hr (High)</span>
                          </div>
                          <div className="flex items-center justify-between text-amber-400">
                            <span>[LOOP-88] Vehicle Headway:</span>
                            <span className="font-bold">1.4s @ 42 mph</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400">
                            <span>[GPS-BUS] Dynamic Z-Axis Accel:</span>
                            <span className="font-bold">+0.38g (Roughness)</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 text-center font-mono">
                          ✓ Normalizing 4,200 concurrent telemetry sockets at 12ms edge cycle
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'hex_tiling' && (
                      <div className="space-y-3 font-mono text-xs text-center">
                        <div className="grid grid-cols-3 gap-2">
                          {['8828308281fffff', '8828308283fffff', '8828308285fffff'].map((h, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-teal-950/40 border border-teal-500/40 text-teal-300">
                              <span className="text-[9px] text-teal-400 block">Hex Res 8</span>
                              <span className="font-bold text-[10px]">{h.slice(0, 8)}...</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">Area: 461m²</span>
                            </div>
                          ))}
                        </div>
                        <div className="p-2.5 rounded-lg bg-black/60 border border-slate-800 text-[11px] text-slate-300 text-left">
                          <span className="text-teal-400 font-bold block mb-1">Spatial Topological Properties:</span>
                          • Distance between adjacent centroids: exactly 24.3 meters<br/>
                          • Equidistant 6-neighbor adjacency graph: zero distortion
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'geotech_physics' && (
                      <div className="space-y-2.5 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/40 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-amber-300">
                            <span>Axle Load Exponential Ratio:</span>
                            <span className="font-bold">9,600 : 1 damage vs Car</span>
                          </div>
                          <div className="flex items-center justify-between text-rose-300">
                            <span>Subgrade Moisture Saturation:</span>
                            <span className="font-bold">78% (Pumping Threshold)</span>
                          </div>
                          <div className="flex items-center justify-between text-cyan-300">
                            <span>Dynamic Shear Tensor (τxy):</span>
                            <span className="font-bold">480 µε (Elevated)</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                          <div className="bg-amber-400 h-full w-[65%]"></div>
                          <div className="bg-rose-500 h-full w-[35%] animate-pulse"></div>
                        </div>
                        <span className="text-[10px] text-slate-400 block text-center">
                          Pore pressure amplification active: hydraulic void formation imminent
                        </span>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'svi_matrix' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block">SVI Score</span>
                            <span className="text-2xl font-bold text-rose-400 mt-1 block">78.4</span>
                            <span className="text-[9px] text-rose-300">High Fragility</span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                            <span className="text-[10px] text-slate-400 block">Pavement PCI</span>
                            <span className="text-2xl font-bold text-amber-400 mt-1 block">52 / 100</span>
                            <span className="text-[9px] text-amber-300">Fair / Degraded</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-black/60 border border-slate-800 text-[10px] text-slate-300 text-center">
                          ⚠ SVI &gt; 75 threshold reached: Auto-alert dispatched to Pareto Router
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'pareto_solver' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-bold">Route A (Selfish Highway):</span>
                            <span className="text-rose-400 font-bold">+180 µε Damage</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-emerald-300 font-bold">Route B (Pareto Dispersal):</span>
                            <span className="text-emerald-400 font-bold">-42% Peak Fatigue</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1.5">
                            <span>Travel Time Delta:</span>
                            <span className="text-white font-bold">+52 seconds</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 text-center">
                          Nash-Pareto frontier achieved: Zero noticeable driver penalty
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'signal_actuation' && (
                      <div className="space-y-3 font-mono text-xs">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                            <span className="text-[9px] text-slate-400 block">Signal 1</span>
                            <span className="text-xs font-bold text-emerald-400">GREEN</span>
                            <span className="text-[9px] text-slate-400 block">45s Wave</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40">
                            <span className="text-[9px] text-slate-400 block">Signal 2</span>
                            <span className="text-xs font-bold text-emerald-400">GREEN</span>
                            <span className="text-[9px] text-slate-400 block">Synced 0s</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40">
                            <span className="text-[9px] text-slate-400 block">Signal 3</span>
                            <span className="text-xs font-bold text-amber-400">HOLD</span>
                            <span className="text-[9px] text-slate-400 block">+6s Freight</span>
                          </div>
                        </div>
                        <div className="p-2 rounded-lg bg-black/60 border border-slate-800 text-[10px] text-slate-300 text-center">
                          ✓ Stop-and-go braking shear suppressed by 42% on intersection approach
                        </div>
                      </div>
                    )}

                    {currentStage.interactiveDemoType === 'api_payload' && (
                      <div className="space-y-2 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-black/80 border border-slate-800 text-[10px] text-slate-300 overflow-x-auto">
                          <span className="text-cyan-400 font-bold">POST /v1/route/cooperative</span>
                          <pre className="text-emerald-400 mt-1 font-mono text-[10px]">
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
                        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 text-center">
                          <span className="text-[10px] text-slate-400 uppercase">Long-Term Infrastructure Lifecycle</span>
                          <div className="flex items-center justify-around">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Traditional</span>
                              <span className="text-sm font-bold text-rose-400">5-Yr Repave</span>
                            </div>
                            <span className="text-slate-500 text-lg">→</span>
                            <div>
                              <span className="text-[10px] text-emerald-400 block">With StrataGrid</span>
                              <span className="text-sm font-bold text-emerald-400">20-Yr Lifespan</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-emerald-300 block font-bold">
                            +400% Pavement Base Durability ($3.4M/yr saved)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stage Progress Indicator */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <span>Architecture Progress: {activeStageIdx + 1} / 8</span>
                  <div className="flex gap-1.5">
                    {PIPELINE_STAGES.map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i === activeStageIdx ? 'bg-[#00f5ff]' : i < activeStageIdx ? 'bg-emerald-400' : 'bg-slate-700'
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
          <div className="bg-[#121826] p-6 rounded-2xl border border-slate-700/80 shadow-2xl">
            <h3 className="text-lg font-headline font-bold text-white mb-2">
              Continuous 8-Stage Data Pipeline Architecture
            </h3>
            <p className="text-xs font-sans text-slate-300 max-w-3xl leading-relaxed mb-6">
              Follow the physical telemetry flow from initial piezoelectric edge sensing through geotechnical tensor computation, Pareto game-theoretic rerouting, and municipal asset preservation.
            </p>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-teal-400 before:to-emerald-500">
              {PIPELINE_STAGES.map((stage, idx) => {
                const StageIcon = stage.icon;
                return (
                  <div key={stage.id} className="relative flex items-start gap-6 group">
                    
                    {/* Node Number Circle */}
                    <div className="w-16 h-16 rounded-2xl bg-[#090d16] border-2 border-slate-700 group-hover:border-[#00f5ff] flex items-center justify-center text-[#00f5ff] shrink-0 z-10 transition-all duration-300 shadow-xl">
                      <StageIcon className="w-6 h-6" />
                    </div>

                    {/* Stage Card */}
                    <div className="flex-1 p-6 rounded-2xl bg-[#162033]/80 border border-slate-700/80 hover:border-[#00f5ff]/60 transition-all space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-[#00f5ff] uppercase">
                            STAGE {stage.step}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            • {stage.phaseCategory}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
                          {stage.badge}
                        </span>
                      </div>

                      <h4 className="text-lg font-headline font-bold text-white">
                        {stage.title}
                      </h4>

                      <p className="text-xs font-sans text-slate-300 leading-relaxed">
                        {stage.overview}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 font-mono text-xs">
                        {stage.metrics.map((m, mIdx) => (
                          <div key={mIdx} className="p-2.5 rounded-lg bg-[#090d16] border border-slate-800">
                            <span className="text-[10px] text-slate-400 uppercase block">{m.label}</span>
                            <span className="text-sm font-bold text-[#00f5ff] mt-0.5 block">{m.value}</span>
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
          <div className="bg-[#121826] p-6 sm:p-8 rounded-2xl border border-slate-700/80 shadow-2xl space-y-6">
            <div>
              <span className="text-xs font-mono text-[#00f5ff] font-bold uppercase tracking-wider block">
                Technical Stack & Infrastructure Topology
              </span>
              <h3 className="text-xl sm:text-2xl font-headline font-bold text-white mt-1">
                StrataGrid Full-Stack Architecture Blueprint
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
              
              {/* Layer 1 */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-cyan-500/30 space-y-3">
                <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[11px]">
                  1. Edge Sourcing Layer
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  Sub-50ms ingestion of piezoelectric WIM, Doppler radar, and loop counters.
                </p>
                <div className="space-y-1 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                  <div>• Kafka / MQTT Gateways</div>
                  <div>• WebSockets & gRPC</div>
                  <div>• Doppler Radar APIs</div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-teal-500/30 space-y-3">
                <span className="text-teal-400 font-bold uppercase tracking-wider block text-[11px]">
                  2. Spatial Tiling Core
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  Uber H3 Resolution 8/9 hexagonal discretization with O(1) hash tables.
                </p>
                <div className="space-y-1 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                  <div>• Uber H3 C/Wasm Engine</div>
                  <div>• PostGIS Spatial Indexing</div>
                  <div>• 461m² Resolution Cells</div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-amber-500/30 space-y-3">
                <span className="text-amber-400 font-bold uppercase tracking-wider block text-[11px]">
                  3. Geotechnical Physics
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  AASHTO 4th-power fatigue law and subgrade pore water pressure ($u_w$).
                </p>
                <div className="space-y-1 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                  <div>• Finite Element Math</div>
                  <div>• Dynamic Shear Tensors</div>
                  <div>• SVI & PCI Scoring Daemon</div>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="p-5 rounded-2xl bg-[#090d16] border border-emerald-500/30 space-y-3">
                <span className="text-emerald-400 font-bold uppercase tracking-wider block text-[11px]">
                  4. Pareto Orchestration
                </span>
                <p className="text-slate-300 font-sans text-xs">
                  Multi-objective game-theoretic routing and NTCIP 1202 signal actuation.
                </p>
                <div className="space-y-1 text-slate-400 text-[11px] pt-2 border-t border-slate-800">
                  <div>• Mixed-Integer LP Solver</div>
                  <div>• NTCIP Traffic Controllers</div>
                  <div>• Fleet Turn-by-Turn APIs</div>
                </div>
              </div>
            </div>

            {/* Verification and Closed Loop Summary Box */}
            <div className="p-5 rounded-2xl bg-[#0b121e] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-white font-bold">Closed-Loop Autonomous Assurance:</span>
                <p className="text-slate-400 font-sans text-xs">
                  The system continuously compares pre-rerouting predictions with post-rerouting WIM sensor strain, retraining AI models every 24 hours.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 font-bold text-center">
                99.999% SLA • Zero Edge Drift
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
