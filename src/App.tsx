import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { MapDashboard } from './components/MapDashboard';
import { HowItWorksSection } from './components/HowItWorksSection';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { GallerySection } from './components/GallerySection';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { AiChatbot } from './components/AiChatbot';
import { PageId, PuneHexCell } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = ['home', 'dashboard', 'pipeline', 'case-studies', 'gallery', 'team'];
      // Support legacy demo hash as alias to dashboard
      if ((hash as string) === 'demo') return 'dashboard';
      if (validPages.includes(hash)) return hash;
    }
    return 'dashboard'; // Default to the 3D map centerpiece!
  });

  // Handle URL hash changes for back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = ['home', 'dashboard', 'pipeline', 'case-studies', 'gallery', 'team'];
      if ((hash as string) === 'demo') {
        setActivePage('dashboard');
        return;
      }
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAiAboutCell = (cell: PuneHexCell) => {
    // Dispatch custom event to trigger chatbot with cell query
    const prompt = `Can you analyze the geotechnical risk for ${cell.name} (${cell.district}) with base stress ${cell.baseStress}% and current moisture ${cell.moisturePct}%?`;
    window.dispatchEvent(
      new CustomEvent('stratagrid_ask_ai', {
        detail: { prompt, mode: 'geotech' }
      })
    );
  };

  const isMapActive = activePage === 'dashboard';

  return (
    <div className="min-h-screen bg-[#070d1a] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-300 font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      {/* Top Header Navigation */}
      <Navbar activePage={activePage} onSelectPage={handleSelectPage} />

      {/* Main Content Area */}
      <main className={`flex-1 ${isMapActive ? 'p-0' : 'pt-16 pb-12'}`}>
        {/* VIEW 1: 3D COMMAND MESH (CENTERPIECE) */}
        {activePage === 'dashboard' && (
          <div className="w-full h-screen">
            <MapDashboard onAskAiAboutCell={handleAskAiAboutCell} />
          </div>
        )}

        {/* VIEW 2: OVERVIEW / LANDING HERO */}
        {activePage === 'home' && (
          <div className="animate-in fade-in duration-300">
            <LandingHero onNavigate={handleSelectPage} />
          </div>
        )}

        {/* VIEW 3: 8-STAGE ARCHITECTURE PIPELINE */}
        {activePage === 'pipeline' && (
          <div className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                System Blueprint
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
                The 8-Stage Architecture Pipeline
              </h1>
              <p className="text-sm text-slate-400">
                Closed-loop infrastructure orchestration connecting edge sensing, H3 DGGS spatial tiling, AASHTO fatigue physics, and Pareto pathfinding.
              </p>
            </div>
            <HowItWorksSection />
          </div>
        )}

        {/* VIEW 4: EMPIRICAL CASE STUDIES & MULTIMODAL AI EVALUATION */}
        {activePage === 'case-studies' && (
          <div className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                Empirical Deployments
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
                Municipal Field Case Studies & Forensic AI
              </h1>
              <p className="text-sm text-slate-400">
                Field validation data from monitored corridors, complete with automated multimodal Gemini 3.7 Flash forensic pavement distress evaluation.
              </p>
            </div>
            <CaseStudiesSection />
          </div>
        )}

        {/* VIEW 5: SENSOR SCANS & GALLERY */}
        {activePage === 'gallery' && (
          <div className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                Edge Ingestion
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
                Sensor Profilometry & Defect Gallery
              </h1>
              <p className="text-sm text-slate-400">
                High-resolution repository of weigh-in-motion (WIM), acoustic strain gauges, and drone LiDAR inspections powering the digital twin.
              </p>
            </div>
            <GallerySection />
          </div>
        )}

        {/* VIEW 6: CORE ENGINEERING TEAM */}
        {activePage === 'team' && (
          <div className="animate-in fade-in duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2 mb-8">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full uppercase tracking-wider">
                Core Contributors
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white font-sans">
                Engineering, Geotechnical & AI Team
              </h1>
              <p className="text-sm text-slate-400">
                The multidisciplinary team behind StrataGrid AI bridging civil pavement mechanics, spatial graph intelligence, and real-time systems.
              </p>
            </div>
            <TeamSection />
          </div>
        )}
      </main>

      {/* Persistent Docked AI Copilot Chatbot */}
      <AiChatbot onNavigatePage={handleSelectPage} />

      {/* Footer on non-map views */}
      {!isMapActive && <Footer onSelectPage={handleSelectPage} />}
    </div>
  );
}
