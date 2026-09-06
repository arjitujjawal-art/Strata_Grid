import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { 
  Camera, 
  Upload, 
  MapPin, 
  Eye, 
  Tag, 
  Sparkles, 
  Filter, 
  X, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  Activity, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { getAllGalleryItems, saveVerifiedCaseStudy, subscribeToStudiesSync } from '../utils/caseStudiesStorage';

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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Action Bar: Category Filter Tabs & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'verified', 'sensor', 'traffic', 'pothole', 'bridge'].map((cat) => {
            const isVerifiedTab = cat === 'verified';
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  filter === cat
                    ? isVerifiedTab
                      ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                      : 'bg-[#00f5ff] text-[#002021] font-bold shadow-md shadow-[#00f5ff]/20'
                    : 'bg-[#161b22] text-slate-400 hover:text-white border border-slate-700/80'
                }`}
              >
                {isVerifiedTab && <ShieldCheck className="w-3.5 h-3.5 text-black" />}
                <span>
                  {cat === 'all' 
                    ? 'All Field Telemetry' 
                    : cat === 'verified' 
                    ? `AI-Verified Studies (${verifiedCount})` 
                    : `${cat}s`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#case-studies"
            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Submit Case Study + AI Scan</span>
          </a>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00f5ff]" />
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
            className="bg-[#161b22] rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl hover:border-[#00f5ff]/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-48 sm:h-52 overflow-hidden bg-[#0d1117]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-transparent to-transparent opacity-80"></div>
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-[#0b1326]/90 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold uppercase tracking-wider text-[#00f5ff]">
                  {item.category}
                </span>

                {item.isUserVerified && (
                  <span className="px-2 py-1 rounded-md bg-emerald-950/90 backdrop-blur-md border border-emerald-500/50 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    AI Verified
                  </span>
                )}
              </div>

              {item.pciRating !== undefined && (
                <span className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono font-bold text-white">
                  PCI: <span className="text-[#00f5ff]">{item.pciRating}/100</span>
                </span>
              )}
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-headline font-bold text-white text-base group-hover:text-[#00f5ff] transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {item.caption}
                </p>

                {item.distressTags && item.distressTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.distressTags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1 truncate max-w-[170px]">
                  <MapPin className="w-3.5 h-3.5 text-[#00f5ff] shrink-0" />
                  <span className="truncate">{item.location || 'Metro Grid'}</span>
                </span>
                <span className="text-[#00f5ff] group-hover:underline shrink-0">Inspect Scan →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#161b22] max-w-2xl w-full rounded-2xl border border-slate-700 overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#00f5ff] uppercase tracking-wider font-bold">
                    {activeModalItem.category} Inspection Telemetry
                  </span>
                  {activeModalItem.isUserVerified && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      AI Verified Case Study
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-headline font-bold text-white mt-0.5">
                  {activeModalItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-64 sm:h-80 rounded-xl overflow-hidden bg-black relative">
              <img
                src={activeModalItem.imageUrl}
                alt={activeModalItem.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {activeModalItem.pciRating !== undefined && (
                <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-slate-700 font-mono text-xs text-white flex items-center gap-1.5">
                  <span>Pavement Condition:</span>
                  <span className="font-bold text-[#00f5ff]">{activeModalItem.pciRating}/100</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activeModalItem.caption}
              </p>

              {activeModalItem.distressTags && activeModalItem.distressTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase mr-1 flex items-center">Distress Types:</span>
                  {activeModalItem.distressTags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[11px] font-mono">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              <span>Location: {activeModalItem.location}</span>
              
              <div className="flex items-center gap-2">
                <a
                  href="#case-studies"
                  onClick={() => setActiveModalItem(null)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono flex items-center gap-1.5 transition-colors"
                >
                  <span>Go to Case Studies</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-1.5 rounded-lg bg-[#00f5ff] text-[#002021] font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <form onSubmit={handleCreateItem} className="bg-[#161b22] max-w-md w-full rounded-2xl border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-headline font-bold text-white">
                Upload Telemetry Scan
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Piezoelectric Sensor Installation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white focus:outline-none focus:border-[#00f5ff]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white focus:outline-none focus:border-[#00f5ff]"
                >
                  <option value="sensor">Sensor</option>
                  <option value="traffic">Traffic</option>
                  <option value="pothole">Pothole</option>
                  <option value="bridge">Bridge</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g., Harbor Gate 4"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white focus:outline-none focus:border-[#00f5ff]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Image URL or Local Upload</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white focus:outline-none focus:border-[#00f5ff] mb-2"
                />
                <label className="block text-center py-2 bg-slate-800 rounded-xl border border-slate-700 text-slate-300 hover:text-white cursor-pointer">
                  <span>Browse Device Files</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Caption</label>
                <textarea
                  rows={2}
                  placeholder="Description of telemetry scan..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0d1117] border border-slate-700 text-white focus:outline-none focus:border-[#00f5ff]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#00f5ff] text-[#002021] font-bold text-xs font-mono shadow-md"
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
