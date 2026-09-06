import React, { useState, useEffect } from 'react';
import { 
  Hexagon, 
  Activity, 
  Github, 
  ArrowUpRight, 
  Menu, 
  X, 
  Layers,
  Users,
  Image as ImageIcon,
  FileCheck2,
  Play
} from 'lucide-react';
import { PageId } from '../types';

interface NavbarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  onSelectPage
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (page: PageId) => {
    onSelectPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems: { id: PageId; label: string; isLive?: boolean; icon?: React.ReactNode }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'dashboard', label: '3D Command Mesh', isLive: true },
    { id: 'pipeline', label: '8-Stage Pipeline' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'gallery', label: 'Sensor Scans' },
    { id: 'team', label: 'Team' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || activePage !== 'home'
          ? 'bg-[#070d1a]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5'
          : 'bg-[#070d1a]/50 backdrop-blur-md border-b border-slate-800/30 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
            <Hexagon className="w-5 h-5 text-cyan-400" />
            <div className="absolute inset-0 rounded-xl bg-cyan-500/10 blur-sm"></div>
          </div>
          <div>
            <span className="font-sans font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              StrataGrid <span className="text-cyan-400">AI</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400 -mt-1">
              Pune 3D Infrastructure Mesh
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono font-medium">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'text-cyan-300 font-bold bg-cyan-500/15 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850 border border-transparent'
                }`}
              >
                {item.isLive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/arjitujjawal-art/Strata_Grid.git"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => handleNavClick('dashboard')}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Launch 3D Mesh</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070d1a]/98 border-b border-slate-800 px-4 py-6 space-y-2 backdrop-blur-2xl animate-in fade-in duration-200 font-mono text-sm">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  )}
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-xs text-cyan-400 font-bold">Active</span>}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-center flex items-center justify-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch 3D Command Mesh</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
