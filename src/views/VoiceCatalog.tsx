import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, Check, Languages, FileText, IndianRupee } from 'lucide-react';

interface TranscriptEntry {
  lang: string;
  text: string;
}

const languages = [
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
];

const sampleTranscript: TranscriptEntry = {
  lang: 'Hindi',
  text: 'Yeh haath se bani blue mitti ka vase hai. Isme traditional Khurja design hai. Isko banane mein 3 din lagte hain. Price 1,200 rupees hai.',
};

const sampleCatalog = {
  name: 'Hand-painted Blue Ceramic Vase',
  category: 'Pottery',
  description: 'A handcrafted blue ceramic vase featuring traditional Khurja design. Each piece is individually shaped and painted by skilled artisans over 3 days, making every vase unique. The intricate patterns reflect the rich heritage of Indian pottery.',
  materials: 'Natural clay, lead-free glaze, mineral pigments',
  dimensions: 'Height: 25cm, Diameter: 12cm',
  price: 1200,
  suggestedPrice: 1450,
  translations: ['English', 'Hindi', 'Bengali', 'Tamil'],
};

export function VoiceCatalog() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry | null>(null);
  const [catalog, setCatalog] = useState<typeof sampleCatalog | null>(null);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [time, setTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [recording]);

  const handleRecord = () => {
    if (recording) {
      setRecording(false);
      setTranscript(sampleTranscript);
      setTimeout(() => setCatalog(sampleCatalog), 1000);
    } else {
      setRecording(true);
      setTime(0);
      setTranscript(null);
      setCatalog(null);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-5">
      {/* Language selector */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-primary-600" />
          <h3 className="font-display font-semibold text-stone-900">Choose Your Language</h3>
        </div>
        <p className="text-xs text-stone-500 mb-4">Speak in your language. The AI understands 8 Indian languages.</p>
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedLang === lang.code
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span className="mr-1.5">{lang.flag}</span>{lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recording interface */}
      <div className="card p-8 text-center">
        <button
          onClick={handleRecord}
          className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
            recording
              ? 'bg-error-500 scale-110 shadow-lg shadow-error-500/30'
              : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30'
          }`}
        >
          {recording ? <Square className="w-7 h-7 text-white" fill="white" /> : <Mic className="w-8 h-8 text-white" />}
        </button>
        <p className="mt-4 font-display font-semibold text-stone-900">
          {recording ? 'Recording...' : transcript ? 'Recorded!' : 'Tap to speak'}
        </p>
        <p className="text-sm text-stone-500 mt-1">
          {recording ? formatTime(time) : 'Describe your product in your own words'}
        </p>
        {recording && (
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary-500 rounded-full animate-pulse-soft"
                style={{ height: `${12 + (i % 3) * 10}px`, animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="card p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <Mic className="w-4 h-4 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">Voice Transcript</h3>
              <p className="text-[11px] text-stone-500">{transcript.lang} · Auto-detected</p>
            </div>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 rounded-xl p-4 italic">"{transcript.text}"</p>
        </div>
      )}

      {/* AI-generated catalogue */}
      {catalog && (
        <div className="card p-5 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-success-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-success-600" />
            </div>
            <div>
              <h3 className="font-semibold text-stone-900 text-sm">AI-Generated Catalogue</h3>
              <p className="text-[11px] text-stone-500">Created from your voice description</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Product name */}
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1 block">Product Name</label>
              <p className="text-sm font-semibold text-stone-900 bg-stone-50 rounded-lg px-3 py-2">{catalog.name}</p>
            </div>

            {/* Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">Category</label>
                <p className="text-sm text-stone-800 bg-stone-50 rounded-lg px-3 py-2">{catalog.category}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">Price</label>
                <div className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
                  <IndianRupee className="w-4 h-4 text-stone-400" />
                  <span className="text-sm font-semibold text-stone-900">{catalog.price}</span>
                  <span className="ml-auto badge bg-accent-100 text-accent-700">
                    <Sparkles className="w-3 h-3" /> AI: ₹{catalog.suggestedPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1 block flex items-center gap-1.5">
                <FileText className="w-3 h-3" /> AI-Generated Description
              </label>
              <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-3 py-2.5 leading-relaxed">{catalog.description}</p>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">Materials</label>
                <p className="text-sm text-stone-800 bg-stone-50 rounded-lg px-3 py-2">{catalog.materials}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">Dimensions</label>
                <p className="text-sm text-stone-800 bg-stone-50 rounded-lg px-3 py-2">{catalog.dimensions}</p>
              </div>
            </div>

            {/* Translations */}
            <div>
              <label className="text-xs font-medium text-stone-500 mb-1 block">Auto-Translated To</label>
              <div className="flex flex-wrap gap-2">
                {catalog.translations.map(lang => (
                  <span key={lang} className="badge bg-secondary-100 text-secondary-700">
                    <Check className="w-3 h-3" /> {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button className="btn-secondary flex-1">Edit Details</button>
              <button className="btn-primary flex-1">
                <Check className="w-4 h-4" /> Add to Catalogue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
