import { useState, useRef } from 'react';
import {
  Upload,
  Sparkles,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Minus,
  Check,
  Loader2,
  Tag,
  Languages,
  Lightbulb,
  Image as ImageIcon,
  X,
  Star,
  ShoppingBag,
} from 'lucide-react';
import { sampleInsight } from '@/data';
import { useLanguage } from '@/language-context';
import type { ProductInsight } from '@/types';
import type { TKey } from '@/i18n';

type Phase = 'upload' | 'analyzing' | 'results';

const stepKeys: TKey[] = [
  'scanning', 'identifying', 'checking_demand', 'comparing', 'generating_desc', 'calculating_price',
];

export function ProductUpload() {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('upload');
  const [image, setImage] = useState<string | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [insight, setInsight] = useState<ProductInsight | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => { setImage(ev.target?.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const useSampleImage = () => {
    setImage('https://images.pexels.com/photos/18646120/pexels-photo-18646120.jpeg?auto=compress&cs=tinysrgb&h=650&w=940');
  };

  const startAnalysis = () => {
    if (!image) return;
    setPhase('analyzing');
    setAnalyzeStep(0);
    stepKeys.forEach((_, i) => {
      setTimeout(() => {
        setAnalyzeStep(i);
        if (i === stepKeys.length - 1) {
          setTimeout(() => { setInsight(sampleInsight); setPhase('results'); }, 800);
        }
      }, i * 700);
    });
  };

  const reset = () => { setPhase('upload'); setImage(null); setInsight(null); setAnalyzeStep(0); };

  const insightCards: { icon: typeof IndianRupee; labelKey: TKey; descKey: TKey; color: string }[] = [
    { icon: IndianRupee, labelKey: 'smart_price', descKey: 'smart_price_desc', color: 'success' },
    { icon: Tag, labelKey: 'auto_desc', descKey: 'auto_desc_desc', color: 'primary' },
    { icon: TrendingUp, labelKey: 'market_demand', descKey: 'market_demand_desc', color: 'secondary' },
    { icon: Star, labelKey: 'quality_score', descKey: 'quality_score_desc', color: 'accent' },
    { icon: ShoppingBag, labelKey: 'competitor_price', descKey: 'competitor_price_desc', color: 'primary' },
    { icon: Lightbulb, labelKey: 'tips_sell', descKey: 'tips_sell_desc', color: 'accent' },
  ];

  const colors: Record<string, string> = {
    success: 'bg-success-100 text-success-600',
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
  };

  return (
    <div className="space-y-5">
      {phase === 'upload' && (
        <div className="animate-fade-in-up space-y-5">
          <div className="card p-6">
            <h3 className="font-display font-semibold text-stone-900 mb-1">{t('upload_photo')}</h3>
            <p className="text-sm text-stone-500 mb-5">{t('upload_photo_desc')}</p>

            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

            {!image ? (
              <button onClick={() => fileRef.current?.click()} className="w-full border-2 border-dashed border-stone-300 hover:border-primary-400 hover:bg-primary-50/50 rounded-2xl p-12 text-center transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-stone-100 group-hover:bg-primary-100 flex items-center justify-center mx-auto mb-4 transition-colors">
                  <ImageIcon className="w-8 h-8 text-stone-400 group-hover:text-primary-500 transition-colors" />
                </div>
                <p className="font-semibold text-stone-700 text-sm mb-1">{t('tap_upload')}</p>
                <p className="text-xs text-stone-400">{t('jpg_png')}</p>
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={image} alt="Product preview" className="w-full max-h-80 object-cover" />
                <button onClick={() => setImage(null)} className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-stone-900/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-stone-900/80 transition-colors">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <button onClick={() => fileRef.current?.click()} className="btn-secondary flex-1">
                <Upload className="w-4 h-4" /> {image ? t('change_photo') : t('choose_photo')}
              </button>
              {!image && (
                <button onClick={useSampleImage} className="btn-ghost flex-1">
                  <Sparkles className="w-4 h-4" /> {t('use_sample')}
                </button>
              )}
              {image && (
                <button onClick={startAnalysis} className="btn-primary flex-1">
                  <Sparkles className="w-4 h-4" /> {t('analyze_ai')}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {insightCards.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.labelKey} className="card p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${colors[item.color]}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <p className="text-sm font-semibold text-stone-800">{t(item.labelKey)}</p>
                  <p className="text-[11px] text-stone-500">{t(item.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'analyzing' && (
        <div className="animate-fade-in flex flex-col items-center justify-center py-16">
          {image && (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-6 shadow-card">
              <img src={image} alt="Analyzing" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary-500/20 animate-pulse-soft" />
              <div className="absolute inset-0 border-4 border-primary-500/50 rounded-2xl animate-pulse" />
            </div>
          )}
          <div className="w-12 h-12 rounded-full border-4 border-primary-100 border-t-primary-600 animate-spin mb-5" />
          <h3 className="font-display font-bold text-lg text-stone-900 mb-2">{t('ai_analyzing')}</h3>
          <p className="text-sm text-stone-500 mb-6">{t('powered_gemini')}</p>

          <div className="space-y-2.5 w-full max-w-md">
            {stepKeys.map((stepKey, i) => {
              const done = i < analyzeStep;
              const current = i === analyzeStep;
              return (
                <div key={stepKey} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${done ? 'bg-success-50' : current ? 'bg-primary-50' : 'bg-stone-50'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-success-500' : current ? 'bg-primary-500' : 'bg-stone-200'}`}>
                    {done ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} /> : current ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />}
                  </div>
                  <span className={`text-sm ${done ? 'text-success-700' : current ? 'text-primary-700 font-medium' : 'text-stone-400'}`}>{t(stepKey)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'results' && insight && (
        <div className="animate-fade-in-up space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {image && <img src={image} alt="Product" className="w-14 h-14 rounded-xl object-cover" />}
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">{insight.suggestedName}</h3>
                <p className="text-sm text-stone-500">{insight.category}</p>
              </div>
            </div>
            <button onClick={reset} className="btn-secondary text-xs">
              <Upload className="w-3.5 h-3.5" /> {t('upload_another')}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 bg-gradient-to-br from-success-50 to-white border-success-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-success-500 flex items-center justify-center">
                  <IndianRupee className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t('ai_suggested_price')}</p>
                  <p className="text-2xl font-display font-bold text-stone-900">₹{insight.suggestedPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <span>{t('price_range')}: ₹{insight.priceRange.min} – ₹{insight.priceRange.max}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-success-100 flex items-center justify-between text-xs">
                <span className="text-stone-500">{t('competitor_avg')}: ₹{insight.competitorPrice}</span>
                <span className="badge bg-success-100 text-success-700">
                  <TrendingUp className="w-3 h-3" /> +₹{insight.suggestedPrice - insight.competitorPrice}
                </span>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${insight.marketDemand === 'high' ? 'bg-success-100 text-success-600' : 'bg-accent-100 text-accent-600'}`}>
                  {insight.demandTrend === 'rising' ? <TrendingUp className="w-4.5 h-4.5" /> : insight.demandTrend === 'declining' ? <TrendingDown className="w-4.5 h-4.5" /> : <Minus className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <p className="text-xs text-stone-500">{t('market_demand')}</p>
                  <p className="text-lg font-display font-bold text-stone-900">{t(insight.marketDemand as TKey)} · {t(insight.demandTrend as TKey)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="bg-stone-50 rounded-lg p-2.5">
                  <p className="text-[11px] text-stone-500">{t('similar_products')}</p>
                  <p className="text-sm font-bold text-stone-800">{insight.similarProducts}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2.5">
                  <p className="text-[11px] text-stone-500">{t('quality_score')}</p>
                  <p className="text-sm font-bold text-stone-800">{insight.qualityScore}/100</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-semibold text-stone-900 text-sm">{t('ai_generated_desc')}</h3>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 rounded-xl p-4">{insight.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">{t('materials')}</label>
                <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-3 py-2">{insight.materials}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 mb-1 block">{t('dimensions')}</label>
                <p className="text-sm text-stone-700 bg-stone-50 rounded-lg px-3 py-2">{insight.dimensions}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-stone-400" />
                <h3 className="font-semibold text-stone-900 text-sm">{t('smart_tags')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insight.tags.map(tag => (
                  <span key={tag} className="badge bg-primary-50 text-primary-700 border border-primary-100">{tag}</span>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-stone-400" />
                <h3 className="font-semibold text-stone-900 text-sm">{t('available_in')}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insight.languages.map(lang => (
                  <span key={lang} className="badge bg-secondary-100 text-secondary-700">
                    <Check className="w-3 h-3" /> {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-accent-50 to-white border-accent-200">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                <Lightbulb className="w-4 h-4 text-accent-600" />
              </div>
              <h3 className="font-semibold text-stone-900 text-sm">{t('ai_tips')}</h3>
            </div>
            <div className="space-y-2.5">
              {insight.improvementTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-accent-700">{i + 1}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={reset} className="btn-secondary flex-1">
              <Upload className="w-4 h-4" /> {t('upload_another')}
            </button>
            <button className="btn-primary flex-1">
              <Check className="w-4 h-4" /> {t('add_to_catalogue')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
