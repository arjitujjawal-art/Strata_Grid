import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProblemSection } from './components/ProblemSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { DemoDashboard } from './components/DemoDashboard';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { ImpactSection } from './components/ImpactSection';
import { GallerySection } from './components/GallerySection';
import { TeamSection } from './components/TeamSection';
import { Footer } from './components/Footer';
import { PageHeaderBanner } from './components/PageHeaderBanner';
import { AiChatbot } from './components/AiChatbot';
import { PageId, ThemePalette } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('home');
  const [currentTheme, setCurrentTheme] = useState<ThemePalette>(() => {
    const saved = localStorage.getItem('stratagrid_theme') as ThemePalette;
    return (saved && ['emerald', 'indigo', 'amber', 'cyan'].includes(saved)) ? saved : 'emerald';
  });

  // Apply theme class to document body
  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
    localStorage.setItem('stratagrid_theme', currentTheme);
  }, [currentTheme]);

  // Handle URL hash changes for direct linking & back/forward browser navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PageId;
      const validPages: PageId[] = ['home', 'demo', 'problem', 'how-it-works', 'case-studies', 'impact', 'gallery', 'team'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      }
    };

    // Initial check
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTheme = (newTheme: ThemePalette) => {
    setCurrentTheme(newTheme);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-canvas)] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased overflow-x-hidden flex flex-col justify-between transition-colors duration-300">
      {/* Top Fixed Sticky Header Navigation with Palette Switcher */}
      <Navbar 
        activePage={activePage} 
        onSelectPage={handleSelectPage}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      {/* Main Dedicated Webpage Content Rendering */}
      <main className="flex-1 pb-20 pt-16">
        {/* WEBPAGE 1: HOME / PLATFORM OVERVIEW */}
        {activePage === 'home' && (
          <div className="animate-fadeIn">
            <HeroSection onNavigate={handleSelectPage} />
          </div>
        )}

        {/* WEBPAGE 2: LIVE SIMULATION & COMMAND CENTER */}
        {activePage === 'demo' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="demo"
              category="Interactive Command Center"
              title="Live H3 Hexagonal Grid Simulation & Cooperative Routing"
              explanation="This live command center demonstrates real-time traffic stress modeling across a 49-cell municipal H3 grid. Adjust precipitation and traffic volume to watch dynamic shear strain accumulate, switch between selfish and cooperative routing algorithms, or trigger emergency road closures to test real-time failover flow."
              metrics={[
                { label: 'Grid Topology', value: '49 H3 Cells', color: 'text-emerald-400' },
                { label: 'Live Telemetry', value: '1.2M events/s', color: 'text-emerald-400' },
                { label: 'Stress Mitigation', value: '-32.4% Peak', color: 'text-emerald-400' },
                { label: 'Inference Delay', value: '12ms Edge', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DemoDashboard />
            </div>
          </div>
        )}

        {/* WEBPAGE 3: THE CORE URBAN DILEMMA & PROBLEM */}
        {activePage === 'problem' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="problem"
              category="Geotechnical & Urban Dilemma"
              title="The Feedback Loop of Road Failure: Selfish Navigation vs. Asphalt Physics"
              explanation="Conventional GPS applications optimize purely for individual travel seconds, funneling thousands of vehicles onto fragile residential streets and aged overpasses. This concentrated axle loading causes hydraulic sub-base pumping and rapid pothole generation."
              metrics={[
                { label: 'Fatigue Acceleration', value: '6.8x Faster', color: 'text-rose-400' },
                { label: 'Annual Repairs', value: '$3.4M/Yr', color: 'text-amber-400' },
                { label: 'Sub-base Pumping', value: '84% Moisture', color: 'text-rose-400' },
                { label: 'Predictability', value: '100% Risk', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <ProblemSection />
          </div>
        )}

        {/* WEBPAGE 4: HOW IT WORKS / 8-STAGE ARCHITECTURE */}
        {activePage === 'how-it-works' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="how-it-works"
              category="Algorithmic Pipeline"
              title="How StrataGrid AI Works"
              explanation="From raw city data to smarter, healthier traffic — in 8 stages. Explore our closed-loop architecture connecting multimodal edge ingestion, Uber H3 spatial tiling, geotechnical shear physics, and cooperative Pareto rerouting."
              metrics={[
                { label: 'Pipeline Depth', value: '8 Stages', color: 'text-[#00f5ff]' },
                { label: 'Spatial Hex Grid', value: 'Uber H3 Res 8', color: 'text-emerald-400' },
                { label: 'Inference Cycle', value: '12ms Realtime', color: 'text-[#00f5ff]' },
                { label: 'Lifespan Gain', value: '+400% Base', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <HowItWorksSection />
          </div>
        )}

        {/* WEBPAGE 5: FIELD CASE STUDIES */}
        {activePage === 'case-studies' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="case-studies"
              category="Proven Field Pilots"
              title="Municipal Field Case Studies & Measurable Structural Deployments"
              explanation="Explore empirical deployment data from long-term municipal pilots. See how real-time moisture-aware load balancing protected the Metropolis Core viaduct, mitigated subgrade hydraulic pumping during monsoon seasons at Harbor Port terminals, and preserved commuter arterial networks."
              metrics={[
                { label: 'Monitored Corridors', value: '128 Sectors', color: 'text-emerald-400' },
                { label: 'Pothole Incursions', value: '-84%', color: 'text-emerald-400' },
                { label: 'Heavy Axle Compliance', value: '98.2%', color: 'text-emerald-400' },
                { label: 'Annual Pilot Savings', value: '$1.9M', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <CaseStudiesSection />
          </div>
        )}

        {/* WEBPAGE 6: URBAN IMPACT & MACRO ROI */}
        {activePage === 'impact' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="impact"
              category="Economic & Structural ROI"
              title="Urban Impact"
              explanation="Real-world benefits, grounded in how the system actually works."
              metrics={[
                { label: 'Fatigue Strain', value: '-32.4%', color: 'text-emerald-400' },
                { label: 'Metro Savings', value: '$3.8M/Yr', color: 'text-amber-400' },
                { label: 'Base Lifespan', value: '4.0x', color: 'text-emerald-400' },
                { label: 'CO₂ Abated', value: '14.2k t/Yr', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <ImpactSection />
          </div>
        )}

        {/* WEBPAGE 7: SENSOR TELEMETRY & GALLERY */}
        {activePage === 'gallery' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="gallery"
              category="Field Telemetry Scans"
              title="Sensors, Profilometry & Drone Inspection Gallery"
              explanation="A high-resolution visual repository of the IoT sensors, LiDAR profilometry drones, ground-penetrating radar scans, and weigh-in-motion stations feeding raw structural data into the StrataGrid AI network. Upload and inspect custom field images with automated spatial tagging."
              metrics={[
                { label: 'Active Sensors', value: '4,280+', color: 'text-emerald-400' },
                { label: 'Thermal Scans', value: '24/7 Live', color: 'text-emerald-400' },
                { label: 'WIM Accuracy', value: '99.4%', color: 'text-emerald-400' },
                { label: 'Drone Profilometry', value: 'Sub-mm LiDAR', color: 'text-emerald-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <GallerySection />
          </div>
        )}

        {/* WEBPAGE 8: ENGINEERING TEAM & RESEARCH */}
        {activePage === 'team' && (
          <div className="animate-fadeIn space-y-4">
            <PageHeaderBanner
              pageId="team"
              category="Core Engineering Team"
              title="Researchers, Systems Architects & Civil Engineers"
              explanation="StrataGrid AI is engineered by a multidisciplinary team bridging geotechnical engineering, spatial graph neural networks, and high-throughput real-time distributed systems. Meet the team, explore their technical specialties, and customize bio information."
              metrics={[
                { label: 'Domain Mix', value: 'Geotech + AI', color: 'text-emerald-400' },
                { label: 'Research Papers', value: '14 Published', color: 'text-emerald-400' },
                { label: 'Municipal Pilots', value: '3 Active', color: 'text-emerald-400' },
                { label: 'System SLA', value: '99.998%', color: 'text-amber-400' }
              ]}
              activePage={activePage}
              onSelectPage={handleSelectPage}
            />
            <TeamSection />
          </div>
        )}
      </main>

      {/* Persistent AI Infrastructure Copilot Chatbot Docked at Right Bottom */}
      <AiChatbot onNavigatePage={handleSelectPage} />

      {/* Footer with Persistent Telemetry Status & Multi-Page Navigation */}
      <Footer onSelectPage={handleSelectPage} />
    </div>
  );
}
