import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_TEAM_MEMBERS } from '../data/mockData';
import { TeamMember } from '../types';
import { Users, Github, Linkedin, Mail, Sparkles, Award, Edit2, Check, X, ShieldCheck, Camera, UploadCloud, RotateCcw } from 'lucide-react';

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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn text-slate-200">
      
      {/* Team Header Sub-Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00f5ff]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00f5ff]">
              Core Engineering & Research Team
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Multidisciplinary architects bridging distributed systems, discrete spatial computing, finite-element asphalt physics, and geotechnical hydrology.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {uploadFeedback && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-500/30 animate-fadeIn">
              <Check className="w-3.5 h-3.5" />
              <span>{uploadFeedback}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#161b22] px-3.5 py-1.5 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
              className="bg-[#161b22] rounded-2xl border border-slate-700/80 p-6 flex flex-col justify-between shadow-xl space-y-4 hover:border-[#00f5ff]/50 transition-all duration-300 group relative"
            >
              <div className="space-y-4">
                
                {/* Photo & Actions Header */}
                <div className="flex items-start justify-between gap-3">
                  
                  {/* Hidden File Input for this specific team member slot */}
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
                      // Reset target value so selecting the same file triggers change again
                      e.target.value = '';
                    }}
                  />

                  {/* Circular Avatar Frame with Hover Overlay & Drag-Drop */}
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
                    title="Click or drag & drop to upload a new photo"
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 bg-slate-900 shrink-0 shadow-xl cursor-pointer relative transition-all duration-300 ${
                      isDragOver
                        ? 'border-[#00f5ff] ring-4 ring-[#00f5ff]/30 scale-105'
                        : 'border-slate-600 hover:border-[#00f5ff] hover:shadow-[#00f5ff]/20'
                    }`}
                  >
                    {/* Centered, Auto-Cropped Circular Photo */}
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-full h-full object-cover object-center aspect-square rounded-full transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />

                    {/* Camera Overlay on Hover */}
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] opacity-0 hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200 rounded-full">
                      <Camera className="w-5 h-5 text-[#00f5ff] mb-0.5" />
                      <span className="text-[9px] font-mono tracking-tight font-bold text-slate-200">
                        Change
                      </span>
                    </div>
                  </div>

                  {/* Top-Right Card Controls */}
                  <div className="flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => isEditing ? handleSaveEdit(member.id) : handleStartEdit(member)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#00f5ff] transition-colors shadow-sm"
                      title={isEditing ? 'Save Details' : 'Edit Details'}
                    >
                      {isEditing ? <Check className="w-4 h-4 text-emerald-400" /> : <Edit2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => triggerFileInput(member.id)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-[#00f5ff] transition-colors text-xs"
                      title="Upload custom headshot photo"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>

                    {hasCustomPhoto && (
                      <button
                        onClick={() => handleResetPhoto(member.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors text-[10px]"
                        title="Revert to original photo"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Name & Role Text Fields */}
                <div className="space-y-1">
                  <h4 className="font-headline font-bold text-white text-lg group-hover:text-[#00f5ff] transition-colors leading-snug">
                    {member.name}
                  </h4>
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full mt-1 p-1.5 rounded-lg bg-[#0d1117] border border-[#00f5ff] text-xs font-mono text-[#00f5ff] focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-mono text-[#00f5ff] font-semibold block">
                      {member.role}
                    </span>
                  )}

                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-slate-400 block bg-[#0d1117] px-2.5 py-1.5 rounded-lg border border-slate-800 leading-relaxed">
                      <strong className="text-slate-300">Specialty:</strong> {member.specialty}
                    </span>
                  </div>
                </div>

                {/* Bio text area or display */}
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-[#00f5ff] text-xs text-slate-200 font-sans focus:outline-none leading-relaxed"
                  />
                ) : (
                  <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-4">
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Card Footer with Social Links and Core Badge */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-3">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors p-1 rounded hover:bg-slate-800"
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
                      className="hover:text-[#00f5ff] transition-colors p-1 rounded hover:bg-slate-800"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                  Verified Core
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

