import React from 'react';
import { Activity, Radio, Cpu, HardDrive, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react';

export const NetworkStatusSection: React.FC = () => {
  return (
    <section id="network-status" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-700/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/30 text-teal-400 font-mono text-xs uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Infrastructure Health</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-white tracking-tight">
            Live Telemetry Grid Status & Cluster SLA
          </h2>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>ALL 49 CLUSTERS NOMINAL — 99.998% UPTIME</span>
        </div>
      </div>

      {/* Bento Grid Status Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Main Status Metric Bento */}
        <div className="md:col-span-8 bg-[#161b22] p-6 rounded-2xl border border-slate-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-teal-400 uppercase font-bold tracking-wider">
              Edge Telemetry Mesh Health
            </span>
            <span className="font-mono text-xs text-slate-400">
              Last Heartbeat: <span className="text-white">0.4s ago</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Active H3 Nodes</span>
              <span className="text-2xl font-mono font-bold text-white">4,281,904</span>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 block">100% Online</span>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Avg Edge Latency</span>
              <span className="text-2xl font-mono font-bold text-teal-400">12.4ms</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">p99: 18.1ms</span>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Axle Stress Load</span>
              <span className="text-2xl font-mono font-bold text-amber-400">Balanced</span>
              <span className="text-[10px] font-mono text-teal-400 mt-1 block">1,432 Diverted</span>
            </div>

            <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Data Throughput</span>
              <span className="text-2xl font-mono font-bold text-white">4.2 GB/s</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1 block">Zero Backpressure</span>
            </div>
          </div>

          {/* Subsystem Health Progress Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Sub-surface Moisture Sensor Grid (Acoustic)</span>
                <span className="text-teal-400 font-bold">99.4% Operational</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: '99.4%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Dynamic Bridge Resonance Monitors</span>
                <span className="text-emerald-400 font-bold">100% Calibrated</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                <span>Connected Vehicle Cooperative Dispatch API</span>
                <span className="text-teal-400 font-bold">99.98% SLA</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: '99.98%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Diagnostic Bento Card */}
        <div className="md:col-span-4 bg-[#161b22] p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs uppercase font-bold text-amber-400">
                Active Edge Node: ALPHA-01
              </span>
            </div>
            <h4 className="font-headline font-bold text-white text-lg">
              Metropolis Core Telemetry Hub
            </h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Autonomous micro-controller handling real-time load dispatch across 49 H3 spatial cells. Synchronized with municipal traffic controllers.
            </p>
          </div>

          <div className="bg-[#0d1117] p-3 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Core Engine:</span>
              <span className="text-white">StrataGrid Core v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Failover Mode:</span>
              <span className="text-emerald-400">Zero-Downtime Mesh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">API Protocol:</span>
              <span className="text-teal-400">gRPC / WebSockets</span>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#live-demo"
              className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-mono text-xs font-bold rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simulate Edge Traffic</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
