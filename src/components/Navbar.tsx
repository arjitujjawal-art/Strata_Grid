import React, { useState, useEffect } from 'react';
import { 
  Hexagon, 
  Activity, 
  Github, 
  ArrowUpRight, 
  Menu, 
  X, 
  Palette, 
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { PageId, ThemePalette } from '../types';

interface NavbarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  currentTheme: ThemePalette;
  onSelectTheme: (theme: ThemePalette) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activePage, 
  onSelectPage,
  currentTheme,
  onSelectTheme
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteDropdownOpen, setPaletteDropdownOpen] = useState(false);

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

  const navItems: { id: PageId; label: string; isLive?: boolean }[] = [
    { id: 'home', label: 'Overview' },
    { id: 'demo', label: 'Live Demo', isLive: true },
    { id: 'problem', label: 'The Problem' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'case-studies', label: 'Case Studies' },
    { id: 'impact', label: 'Urban Impact' },
    { id: 'gallery', label: 'Sensors' },
    { id: 'team', label: 'Team' }
  ];

  const themeOptions: { id: ThemePalette; name: string; primaryColor: string; bgBadge: string }[] = [
    { id: 'emerald', name: 'Neo Emerald', primaryColor: '#10b981', bgBadge: 'bg-emerald-500' },
    { id: 'indigo', name: 'Cyber Indigo', primaryColor: '#6366f1', bgBadge: 'bg-indigo-500' },
    { id: 'amber', name: 'Titanium Amber', primaryColor: '#f59e0b', bgBadge: 'bg-amber-500' },
    { id: 'cyan', name: 'Oceanic Cyan', primaryColor: '#06b6d4', bgBadge: 'bg-cyan-500' },
  ];

  const currentThemeObj = themeOptions.find(t => t.id === currentTheme) || themeOptions[0];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090d16]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-2.5'
          : 'bg-[#090d16]/80 backdrop-blur-md border-b border-slate-800/40 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all">
            <Hexagon className="w-5 h-5 text-emerald-400" />
            <div className="absolute inset-0 rounded-xl bg-emerald-500/10 blur-sm"></div>
          </div>
          <div>
            <span className="font-headline font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
              StrataGrid <span className="text-emerald-400">AI</span>
            </span>
            <span className="hidden sm:block text-[10px] font-mono text-slate-400 -mt-1">
              H3 Spatial Infrastructure AI
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-mono font-medium">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-400 rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact Nav for Large Screens */}
        <nav className="hidden lg:flex xl:hidden items-center gap-1.5 text-xs font-mono">
          {navItems.slice(0, 5).map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-400 font-bold bg-emerald-500/15 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <button
            onClick={() => handleNavClick('impact')}
            className={`px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white ${
              ['impact', 'gallery', 'team'].includes(activePage) ? 'text-emerald-400 font-bold bg-emerald-500/15' : ''
            }`}
          >
            More...
          </button>
        </nav>

        {/* Right Controls: Palette Switcher + Demo CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Palette Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPaletteDropdownOpen(!paletteDropdownOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
              title="Change Color Palette Theme"
            >
              <Palette className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{currentThemeObj.name}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${currentThemeObj.bgBadge} shadow-sm`} />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {paletteDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-xl bg-[#101726] border border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn font-mono text-xs space-y-1"
                onMouseLeave={() => setPaletteDropdownOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Select Theme Palette
                </div>
                {themeOptions.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      onSelectTheme(theme.id);
                      setPaletteDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between text-left transition-colors cursor-pointer ${
                      currentTheme === theme.id
                        ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{theme.name}</span>
                    <span className={`w-3 h-3 rounded-full ${theme.bgBadge} border border-slate-700`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-1.5"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <button
            onClick={() => handleNavClick('demo')}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Live Demo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Quick theme cycle button on mobile */}
          <button
            onClick={() => {
              const themes: ThemePalette[] = ['emerald', 'indigo', 'amber', 'cyan'];
              const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
              onSelectTheme(themes[nextIndex]);
            }}
            className="p-2 text-slate-300 rounded-lg bg-slate-800 border border-slate-700"
            title="Switch Theme"
          >
            <span className={`w-3 h-3 rounded-full block ${currentThemeObj.bgBadge}`} />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/80 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090d16]/98 border-b border-slate-800 px-4 py-6 space-y-2 backdrop-blur-2xl animate-fadeIn font-mono text-sm">
          <div className="text-xs text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Select Webpage View:</span>
            <span className="text-[10px] text-emerald-400">Theme: {currentThemeObj.name}</span>
          </div>
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 rounded-xl flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.isLive && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-xs text-emerald-400 font-bold">Active</span>}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('demo')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-center flex items-center justify-center gap-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>Launch Live Interactive Demo</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
