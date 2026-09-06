import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_TEAM_MEMBERS } from '../data/mockData';
import { TeamMember } from '../types';
import { Users, Github, Linkedin, Edit2, Check, ShieldCheck, Camera, UploadCloud, RotateCcw } from 'lucide-react';
import { DecoCorners } from './common/DecoCorners';

const STORAGE_KEY = 'stratagrid_custom_team_members';

export const TeamSection: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with initial members to ensure icons/paths exist
        return INITIAL_TEAM_MEMBERS.map(initM => {
          const found = parsed.find((p: TeamMember) => p.id === initM.id);
          return found ? { ...initM, ...found } : initM;
        });
      }
    } catch {
      // Fallback
    }
    return INITIAL_TEAM_MEMBERS;
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBio, setEditBio] = useState('');
  const [editRole, setEditRole] = useState('');
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Sync to local storage whenever members change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.warn('Storage limit reached or unavailable', e);
    }
  }, [members]);

  const handleStartEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setEditBio(m.bio || '');
    setEditRole(m.role);
  };

  const handleSaveEdit = (id: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, bio: editBio, role: editRole };
      }
      return m;
    }));
    setEditingId(null);
  };

  const handleImageFile = (memberId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setMembers(prev => prev.map(m => {
          if (m.id === memberId) {
            return { ...m, avatarUrl: dataUrl };
          }
          return m;
        }));
        const targetMember = members.find(m => m.id === memberId);
        setUploadFeedback(`Photo updated for ${targetMember?.name || 'team member'}!`);
        setTimeout(() => setUploadFeedback(null), 3500);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleResetPhoto = (memberId: string) => {
    const original = INITIAL_TEAM_MEMBERS.find(m => m.id === memberId);
    if (original) {
      setMembers(prev => prev.map(m => m.id === memberId ? { ...m, avatarUrl: original.avatarUrl } : m));
      setUploadFeedback(`Reset photo for ${original.name}`);
      setTimeout(() => setUploadFeedback(null), 3000);
    }
  };

  const triggerFileInput = (memberId: string) => {
    fileInputRefs.current[memberId]?.click();
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn text-[#F2F0E4]">
      
      {/* Team Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-[#D4AF37] rotate-45" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              Foundational Research & Systems Architecture
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em]">
            The Engineering Directorate
          </h2>
          <p className="text-xs sm:text-sm text-[#888888] font-body max-w-3xl leading-relaxed">
            Multidisciplinary architects bridging distributed systems, discrete spatial computing, finite-element asphalt physics, and geotechnical hydrology.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {uploadFeedback && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-[#064E3B]/60 px-3 py-1.5 border border-emerald-500/40 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadFeedback}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] bg-[#0A0A0A] px-4 py-2 border border-[#D4AF37]/40 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>{members.length} Active Contributors</span>
          </div>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {members.map((member) => {
          const isEditing = editingId === member.id;
          const isDragOver = dragOverId === member.id;
          const initialMember = INITIAL_TEAM_MEMBERS.find(m => m.id === member.id);
          const hasCustomPhoto = initialMember && member.avatarUrl !== initialMember.avatarUrl;

          return (
            <div
              key={member.id}
              className="deco-panel p-6 flex flex-col justify-between shadow-[0_0_20px_rgba(212,175,55,0.08)] space-y-5 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] transition-all duration-300 group relative"
            >
              <DecoCorners />

              <div className="space-y-4">
                
                {/* Photo & Actions Header */}
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[member.id] = el; }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageFile(member.id, file);
                      }
                      e.target.value = '';
                    }}
                  />

                  {/* Sharp Double-Framed Avatar Frame */}
                  <div
                    id={`team-avatar-${member.id}`}
                    onClick={() => triggerFileInput(member.id)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverId(member.id);
                    }}
                    onDragLeave={() => setDragOverId(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOverId(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        handleImageFile(member.id, file);
                      }
                    }}
                    title="Click or drag & drop to upload a new portrait"
                    className={`w-20 h-20 sm:w-24 sm:h-24 overflow-hidden border-2 bg-black shrink-0 cursor-pointer relative transition-all duration-300 ${
                      isDragOver
                        ? 'border-[#F2E8C4] shadow-[0_0_20px_rgba(242,232,196,0.6)] scale-105'
                        : 'border-[#D4AF37] hover:border-[#F2E8C4] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    }`}
                  >
                    {/* Centered, Auto-Cropped Photo */}
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-center aspect-square transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Camera Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/75 opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200">
                      <Camera className="w-5 h-5 text-[#D4AF37] mb-1" />
                      <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-[#F2E8C4]">
                        Replace
                      </span>
                    </div>
                  </div>

                  {/* Top-Right Card Controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => isEditing ? handleSaveEdit(member.id) : handleStartEdit(member)}
                      className="p-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer"
                      title={isEditing ? 'Save Details' : 'Edit Details'}
                    >
                      {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Edit2 className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => triggerFileInput(member.id)}
                      className="p-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-colors cursor-pointer text-xs"
                      title="Upload custom portrait photo"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                    </button>

                    {hasCustomPhoto && (
                      <button
                        onClick={() => handleResetPhoto(member.id)}
                        className="p-1.5 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 transition-colors text-[10px] cursor-pointer"
                        title="Revert to original portrait"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Name & Role Text Fields */}
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-[#F2E8C4] text-lg group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider leading-snug">
                    {member.name}
                  </h4>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full mt-1 p-2 bg-[#0A0A0A] border border-[#D4AF37] text-xs font-mono text-[#D4AF37] focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-mono text-[#D4AF37] font-semibold block uppercase tracking-wider">
                      {member.role}
                    </span>
                  )}

                  <div className="pt-2">
                    <span className="text-[11px] font-mono text-[#888888] block bg-[#0A0A0A] px-2.5 py-1.5 border border-[#D4AF37]/20 leading-relaxed">
                      <strong className="text-[#D4AF37] uppercase tracking-wider">Domain:</strong> {member.specialty}
                    </span>
                  </div>
                </div>

                {/* Bio text area or display */}
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2.5 bg-[#0A0A0A] border border-[#D4AF37] text-xs text-[#F2F0E4] font-body focus:outline-none leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-[#F2F0E4]/80 font-body leading-relaxed line-clamp-4 tracking-wide">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Card Footer with Social Links and Core Badge */}
              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs font-mono text-[#888888]">
                <div className="flex items-center gap-3">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D4AF37] transition-colors p-1 border border-transparent hover:border-[#D4AF37]/40"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#D4AF37] transition-colors p-1 border border-transparent hover:border-[#D4AF37]/40"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 border border-[#D4AF37]/30 font-bold uppercase tracking-wider">
                  Core Architect
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
