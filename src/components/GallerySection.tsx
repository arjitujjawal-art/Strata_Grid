import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { 
  Upload, 
  MapPin, 
  X, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink
} from 'lucide-react';
import { getAllGalleryItems, saveVerifiedCaseStudy, subscribeToStudiesSync } from '../utils/caseStudiesStorage';
import { DecoCorners } from './common/DecoCorners';

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>(getAllGalleryItems);
  const [filter, setFilter] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);

  // New Image Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('sensor');
  const [newLocation, setNewLocation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Sync state with storage updates
  useEffect(() => {
    const refresh = () => setItems(getAllGalleryItems());
    return subscribeToStudiesSync(refresh);
  }, []);

  const filteredItems = filter === 'all' 
    ? items 
    : filter === 'verified'
    ? items.filter(i => i.isUserVerified)
    : items.filter(i => i.category === filter);

  const verifiedCount = items.filter(i => i.isUserVerified).length;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) return;

    const newItem: GalleryItem = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      caption: newCaption || 'Field telemetry inspection capture.',
      category: newCategory,
      location: newLocation || 'Metropolis Metropolitan Area',
      imageUrl: newImageUrl
    };

    saveVerifiedCaseStudy(
      {
        id: `study-${Date.now()}`,
        title: newTitle,
        summary: newCaption || 'Field inspection capture.',
        problem: newCaption || 'Localized surface degradation.',
        solution: 'StrataGrid AI Cooperative Routing applied.',
        location: newLocation || 'Metropolis Grid',
        timeframe: 'Field Telemetry Scan',
        metrics: [{ label: 'Status', value: 'Captured' }],
        quote: { text: 'Field scan recorded.', author: 'Field Tech', role: 'DPW' },
        imageUrl: newImageUrl
      },
      newItem
    );

    setItems(getAllGalleryItems());
    setNewTitle('');
    setNewCaption('');
    setNewImageUrl('');
    setNewLocation('');
    setShowUploadModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fadeIn text-[#F2F0E4]">
      {/* Action Bar: Category Filter Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D4AF37]/30 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'verified', 'sensor', 'traffic', 'pothole', 'bridge'].map((cat) => {
            const isVerifiedTab = cat === 'verified';
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-body uppercase tracking-[0.18em] transition-all cursor-pointer flex items-center gap-2 border ${
                  filter === cat
                    ? 'bg-[#D4AF37] text-[#0A0A0A] font-bold border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : 'bg-[#0A0A0A] text-[#888888] hover:text-[#F2F0E4] border-[#D4AF37]/30 hover:border-[#D4AF37]'
                }`}
              >
                {isVerifiedTab && <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A]" />}
                <span>
                  {cat === 'all' 
                    ? 'All Field Telemetry' 
                    : cat === 'verified' 
                    ? `AI Verified (${verifiedCount})` 
                    : `${cat}s`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#case-studies"
            className="px-4 py-2.5 bg-[#0A0A0A] hover:bg-[#141414] text-[#D4AF37] hover:text-[#F2E8C4] border border-[#D4AF37]/50 text-xs font-body uppercase tracking-[0.15em] font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Submit Field Study</span>
          </a>

          <button
            onClick={() => setShowUploadModal(true)}
            className="deco-btn-solid text-xs font-bold flex items-center justify-center gap-2 cursor-pointer px-5 py-2.5"
          >
            <Plus className="w-4 h-4 text-[#0A0A0A]" />
            <span>Upload Scan</span>
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalItem(item)}
            className="deco-panel relative overflow-hidden group cursor-pointer flex flex-col justify-between border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)] transition-all duration-300"
          >
            <DecoCorners />

            <div className="relative h-52 sm:h-56 overflow-hidden bg-black border-b border-[#D4AF37]/30">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-85"></div>
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                  {item.category}
                </span>

                {item.isUserVerified && (
                  <span className="px-2.5 py-1 bg-[#064E3B]/90 backdrop-blur-md border border-emerald-500/50 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    AI Verified
                  </span>
                )}
              </div>

              {item.pciRating !== undefined && (
                <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/90 backdrop-blur-md border border-[#D4AF37]/40 text-[10px] font-mono font-bold text-[#F2E8C4]">
                  PCI: <span className="text-[#D4AF37]">{item.pciRating}/100</span>
                </span>
              )}
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-[#F2E8C4] text-base group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#F2F0E4]/80 mt-1.5 font-body line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>

                {item.distressTags && item.distressTags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.distressTags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-[#0A0A0A] border border-[#D4AF37]/20 text-[#888888] uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs font-body uppercase tracking-[0.15em] text-[#888888]">
                <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate text-[#F2F0E4]/80">{item.location || 'Metro Grid'}</span>
                </span>
                <span className="text-[#D4AF37] group-hover:underline shrink-0">Inspect Scan →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141414] max-w-2xl w-full border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.25)] relative p-6 sm:p-8 space-y-5 overflow-hidden">
            <DecoCorners />

            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-[0.2em] font-bold">
                    {activeModalItem.category} Inspection Telemetry
                  </span>
                  {activeModalItem.isUserVerified && (
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-[#064E3B]/40 text-emerald-300 border border-emerald-500/40 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      AI Verified
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em] mt-1">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2E8C4] border border-[#D4AF37]/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 sm:h-80 border border-[#D4AF37]/40 overflow-hidden bg-black relative">
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {activeModalItem.pciRating !== undefined && (
                <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/90 backdrop-blur-md border border-[#D4AF37]/50 font-mono text-xs text-[#F2F0E4] flex items-center gap-2">
                  <span className="uppercase tracking-wider">Pavement Condition:</span>
                  <span className="font-bold text-[#D4AF37]">{activeModalItem.pciRating}/100</span>
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <p className="text-xs sm:text-sm text-[#F2F0E4]/90 font-body leading-relaxed tracking-wide">
                {activeModalItem.caption}
              </p>

              {activeModalItem.distressTags && activeModalItem.distressTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider mr-1 flex items-center">Distress Types:</span>
                  {activeModalItem.distressTags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 bg-[#0A0A0A] border border-[#D4AF37]/30 text-[#F2F0E4] text-[11px] font-mono uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#D4AF37]/30 text-xs font-mono text-[#888888] uppercase tracking-wider">
              <span>Location: {activeModalItem.location}</span>
              
              <div className="flex items-center gap-3">
                <a
                  href="#case-studies"
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#D4AF37] border border-[#D4AF37]/40 font-body uppercase tracking-[0.15em] flex items-center gap-1.5 transition-colors"
                >
                  <span>Case Studies</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2 bg-[#D4AF37] hover:bg-[#F2E8C4] text-[#0A0A0A] font-body uppercase tracking-[0.15em] font-bold transition-colors cursor-pointer"
                >
                  Close Scan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Telemetry Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateItem} className="bg-[#141414] max-w-md w-full border-2 border-[#D4AF37] p-6 sm:p-8 space-y-5 shadow-[0_0_50px_rgba(212,175,55,0.25)] relative">
            <DecoCorners />

            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-4">
              <h3 className="text-xl font-display font-bold text-[#F2E8C4] uppercase tracking-[0.16em]">
                Upload Telemetry Scan
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2E8C4] border border-[#D4AF37]/30 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-body">
              <div>
                <label className="text-[#D4AF37] font-bold uppercase tracking-[0.15em] block mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Piezoelectric Sensor Installation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[#D4AF37] font-bold uppercase tracking-[0.15em] block mb-1.5">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] uppercase tracking-wider focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="sensor">Sensor</option>
                  <option value="traffic">Traffic</option>
                  <option value="pothole">Pothole</option>
                  <option value="bridge">Bridge</option>
                </select>
              </div>

              <div>
                <label className="text-[#D4AF37] font-bold uppercase tracking-[0.15em] block mb-1.5">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Harbor Gate 4"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-[#D4AF37] font-bold uppercase tracking-[0.15em] block mb-1.5">Image URL or Local Upload</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] focus:outline-none focus:border-[#D4AF37] mb-2.5"
                />
                <label className="block text-center py-2.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] border border-[#D4AF37]/40 text-[#D4AF37] hover:text-[#F2E8C4] uppercase tracking-widest font-bold cursor-pointer transition-colors">
                  <span>Browse Device Files</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-[#D4AF37] font-bold uppercase tracking-[0.15em] block mb-1.5">Caption</label>
                <textarea
                  rows={2}
                  placeholder="Description of telemetry scan..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full p-3 bg-[#0A0A0A] border border-[#D4AF37]/40 text-[#F2F0E4] placeholder:text-[#888888] focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/30">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#888888] hover:text-[#F2E8C4] text-xs font-body uppercase tracking-[0.15em] border border-[#D4AF37]/40 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="deco-btn-solid text-xs font-bold px-6 py-2 cursor-pointer"
              >
                Save Scan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
