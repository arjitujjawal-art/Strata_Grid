import React, { useState, useEffect } from 'react';
import { 
  Hexagon, 
  Github, 
  Menu, 
  X, 
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

  const navItems: { id: PageId; label: string; isLive?: boolean }[] = [
    { id: 'home', label: 'OVERVIEW' },
    { id: 'dashboard', label: '3D MESH', isLive: true },
    { id: 'pipeline', label: 'ARCHITECTURE' },
    { id: 'case-studies', label: 'PILOTS' },
    { id: 'gallery', label: 'PROFILOMETRY' },
    { id: 'team', label: 'FELLOWSHIP' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled || activePage !== 'home'
          ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b-2 border-[#D4AF37] shadow-[0_4px_25px_rgba(0,0,0,0.8)] py-3'
          : 'bg-[#0A0A0A]/80 backdrop-blur-sm border-b border-[#D4AF37]/40 py-4'
      }`}
    >
      {/* Decorative top gold micro-accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo in Rotated Diamond Frame */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 cursor-pointer group shrink-0 select-none"
        >
          <div className="w-8 h-8 deco-diamond bg-[#141414] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <div className="deco-diamond-inner">
              <Hexagon className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-[0.2em] text-[#F2F0E4] flex items-center gap-1.5">
              STRATAGRID <span className="text-[#D4AF37]">AI</span>
            </span>
            <span className="hidden sm:block text-[9px] font-body uppercase tracking-[0.25em] text-[#888888] -mt-1">
              PUNE METROPOLITAN DIGITAL TWIN
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-[11px] font-body tracking-[0.2em]">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3.5 py-1.5 transition-all duration-300 flex items-center gap-2 cursor-pointer uppercase font-semibold ${
                  isActive
                    ? 'text-[#D4AF37] bg-[#141414] border border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]'
                    : 'text-[#F2F0E4]/80 hover:text-[#D4AF37] hover:bg-[#141414]/60 border border-transparent'
                }`}
              >
                {item.isLive && (
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45 animate-pulse" />
                )}
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-[-1px] left-2 right-2 h-[2px] bg-[#D4AF37]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href="https://github.com/arjitujjawal-art/Strata_Grid.git"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#141414] border border-[#D4AF37]/50 text-[11px] font-body tracking-[0.15em] text-[#F2F0E4] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all flex items-center gap-1.5 uppercase"
          >
            <Github className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>ARCHIVE</span>
          </a>

          <button
            onClick={() => handleNavClick('dashboard')}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F2E8C4] text-[#0A0A0A] font-body font-bold text-[11px] tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(212,175,55,0.35)] flex items-center gap-2 uppercase cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#0A0A0A]" />
            <span>COMMAND MESH</span>
          </button>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#D4AF37] bg-[#141414] border border-[#D4AF37]/60"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b-2 border-[#D4AF37] px-4 py-6 space-y-2 font-body text-xs tracking-[0.2em] animate-in fade-in duration-200">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-[#141414] text-[#D4AF37] font-bold border-l-2 border-[#D4AF37]'
                    : 'text-[#F2F0E4]/80 hover:bg-[#141414] hover:text-[#D4AF37]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.isLive && (
                    <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45 animate-pulse" />
                  )}
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="text-[10px] text-[#D4AF37]">ACTIVE</span>}
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#D4AF37]/30">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full py-3 bg-[#D4AF37] text-[#0A0A0A] font-bold text-center flex items-center justify-center gap-2 tracking-[0.2em] uppercase"
            >
              <Play className="w-4 h-4 fill-[#0A0A0A]" />
              <span>LAUNCH COMMAND MESH</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
