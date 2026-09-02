import { useState } from 'react';
import { Camera, Upload, Sparkles, Check, X, Wand2, Sun, Crop, Contrast, Eraser } from 'lucide-react';

type Enhancement = 'cleanup' | 'background' | 'lighting' | 'sharpen';

const enhancements: { id: Enhancement; label: string; icon: typeof Sun; desc: string }[] = [
  { id: 'cleanup', label: 'Remove Clutter', icon: Eraser, desc: 'AI removes dust, spots & distractions' },
  { id: 'background', label: 'Clean Background', icon: Crop, desc: 'Replace with a studio-white backdrop' },
  { id: 'lighting', label: 'Fix Lighting', icon: Sun, desc: 'Balance shadows & highlights' },
  { id: 'sharpen', label: 'Sharpen Details', icon: Contrast, desc: 'Enhance texture & fine details' },
];

export function PhotoStudio() {
  const [selected, setSelected] = useState<Set<Enhancement>>(new Set(['cleanup', 'lighting']));
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const toggle = (id: Enhancement) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    setDone(false);
  };

  const handleProcess = () => {
    setProcessing(true);
    setDone(false);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 2200);
  };

  return (
    <div className="space-y-5">
      {/* Before / After preview */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-primary-600" />
          <h3 className="font-display font-semibold text-stone-900">AI Photo Enhancer</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">Before</p>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src="https://images.pexels.com/photos/35473885/pexels-photo-35473885.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Before enhancement"
                className={`w-full h-full object-cover transition-all duration-700 ${done ? 'opacity-0' : 'opacity-100'} ${processing ? 'scale-105' : ''}`}
              />
              {processing && (
                <div className="absolute inset-0 bg-stone-900/40 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-white text-sm font-medium">Enhancing...</p>
                  </div>
                </div>
              )}
              {!processing && !done && (
                <div className="absolute bottom-3 left-3 bg-stone-900/70 backdrop-blur-md rounded-lg px-3 py-1.5">
                  <p className="text-xs text-white font-medium">Original photo</p>
                </div>
              )}
            </div>
          </div>
          {/* After */}
          <div>
            <p className="text-xs font-medium text-stone-500 mb-2">After</p>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src="https://images.pexels.com/photos/35473885/pexels-photo-35473885.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="After enhancement"
                className={`w-full h-full object-cover transition-all duration-700 ${done ? 'opacity-100 brightness-110 contrast-110 saturate-150' : 'opacity-30 brightness-110 contrast-110 saturate-150'}`}
              />
              {done && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-success-500 rounded-full w-14 h-14 flex items-center justify-center animate-scale-in shadow-lg">
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
              {done && (
                <div className="absolute bottom-3 left-3 bg-success-600 rounded-lg px-3 py-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                  <p className="text-xs text-white font-medium">Enhanced by AI</p>
                </div>
              )}
              {!done && !processing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Wand2 className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs text-stone-400">Select options & enhance</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhancement options */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-stone-900 mb-1">AI Enhancements</h3>
        <p className="text-xs text-stone-500 mb-4">Choose what the AI should fix. Your photo stays yours — we only improve it.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enhancements.map(opt => {
            const Icon = opt.icon;
            const active = selected.has(opt.id);
            return (
              <button
                key={opt.id}
                onClick={() => toggle(opt.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  active ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100' : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-600 text-white' : 'bg-stone-100 text-stone-500'}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${active ? 'text-primary-700' : 'text-stone-700'}`}>{opt.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{opt.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-600' : 'border border-stone-300'}`}>
                  {active && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button className="btn-secondary flex-1 sm:flex-none">
          <Upload className="w-4 h-4" /> Upload New Photo
        </button>
        <button
          onClick={handleProcess}
          disabled={selected.size === 0 || processing}
          className="btn-primary flex-1"
        >
          <Sparkles className="w-4 h-4" />
          {processing ? 'Enhancing...' : done ? 'Re-enhance' : 'Enhance with AI'}
        </button>
        {done && (
          <button className="btn-primary bg-success-600 hover:bg-success-700">
            <Check className="w-4 h-4" /> Save to Catalogue
          </button>
        )}
      </div>
    </div>
  );
}
