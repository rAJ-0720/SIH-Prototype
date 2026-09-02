import { TrendingUp, MapPin, Users, IndianRupee, Sparkles, ArrowRight, Star } from 'lucide-react';
import { marketMatches } from '@/data';

const demandStyles: Record<string, { bg: string; text: string; label: string }> = {
  high: { bg: 'bg-success-100', text: 'text-success-700', label: 'High Demand' },
  medium: { bg: 'bg-accent-100', text: 'text-accent-700', label: 'Medium Demand' },
  low: { bg: 'bg-stone-100', text: 'text-stone-500', label: 'Low Demand' },
};

export function MarketLinkage() {
  return (
    <div className="space-y-5">
      {/* AI insight banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary-600 to-secondary-800 p-5 sm:p-6">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base mb-1">AI Market Analysis</h3>
            <p className="text-secondary-100 text-sm leading-relaxed">
              Based on your craft (Blue Pottery) and location (Uttar Pradesh), I've found <span className="font-semibold text-white">5 markets</span> that match your products. Dilli Haat has the highest demand right now — your pottery fits perfectly.
            </p>
          </div>
        </div>
      </div>

      {/* Market matches */}
      <div className="space-y-4">
        {marketMatches.map((market, idx) => {
          const demand = demandStyles[market.demand];
          return (
            <div key={market.id} className="card card-hover p-5 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Match score */}
                <div className="flex items-center gap-3 sm:flex-shrink-0">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#F5F5F4" strokeWidth="5" />
                      <circle
                        cx="32" cy="32" r="28" fill="none"
                        stroke={market.matchScore >= 90 ? '#16A34A' : market.matchScore >= 80 ? '#F59E0B' : '#78716C'}
                        strokeWidth="5"
                        strokeDasharray={`${(market.matchScore / 100) * 176} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-lg font-bold text-stone-900">{market.matchScore}%</span>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <span className={`badge ${demand.bg} ${demand.text}`}>{demand.label}</span>
                  </div>
                </div>

                {/* Market info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-stone-900 text-sm">{market.name}</h3>
                    <span className={`badge ${demand.bg} ${demand.text} hidden sm:inline-flex`}>{demand.label}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-2">{market.type}</p>
                  <div className="flex flex-wrap gap-4 text-xs text-stone-600">
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-stone-400" /> {market.location}</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-stone-400" /> {market.buyers} buyers</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-3.5 h-3.5 text-stone-400" /> Avg ₹{market.avgPrice}</span>
                  </div>
                </div>

                {/* Action */}
                <button className="btn-primary text-xs px-4 py-2 sm:flex-shrink-0">
                  Connect <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="card p-5 bg-gradient-to-br from-accent-50 to-white">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-4.5 h-4.5 text-accent-600" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900 text-sm mb-1">AI Tip</h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Markets with 85%+ match score are most likely to buy. Consider listing your draft products first — the "Moroccan-style Decorative Plate" matches 3 of these markets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
