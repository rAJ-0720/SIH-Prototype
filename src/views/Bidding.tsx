import { useState } from 'react';
import {
  Gavel,
  MapPin,
  IndianRupee,
  Users,
  Clock,
  TrendingUp,
  Plus,
  Search,
  Flame,
  Check,
  ArrowUp,
} from 'lucide-react';
import { bids as initialBids, artisan } from '@/data';
import { useLanguage } from '@/language-context';
import type { Bid } from '@/types';
import type { TKey } from '@/i18n';

const states = ['All States', 'Uttar Pradesh', 'Rajasthan', 'Madhya Pradesh', 'Delhi', 'Maharashtra', 'Tamil Nadu'];

const statusKeys: Record<Bid['status'], { bg: string; text: string; labelKey: TKey; icon: typeof Flame }> = {
  active: { bg: 'bg-success-100', text: 'text-success-700', labelKey: 'active', icon: Check },
  closing: { bg: 'bg-error-100', text: 'text-error-700', labelKey: 'closing_soon', icon: Flame },
  sold: { bg: 'bg-stone-100', text: 'text-stone-500', labelKey: 'sold', icon: Check },
};

export function Bidding() {
  const { t } = useLanguage();
  const [bids, setBids] = useState<Bid[]>(initialBids);
  const [stateFilter, setStateFilter] = useState('All States');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [bidAmount, setBidAmount] = useState('');

  const filtered = bids.filter(b => {
    const matchesState = stateFilter === 'All States' || b.state === stateFilter;
    const matchesSearch = b.productName.toLowerCase().includes(search.toLowerCase()) ||
                          b.craft.toLowerCase().includes(search.toLowerCase());
    return matchesState && matchesSearch;
  });

  const handlePlaceBid = () => {
    if (!selectedBid || !bidAmount) return;
    const amount = parseInt(bidAmount);
    if (amount <= selectedBid.currentBid) return;
    setBids(prev => prev.map(b => b.id === selectedBid.id ? { ...b, currentBid: amount, bids: b.bids + 1 } : b));
    setSelectedBid(null);
    setBidAmount('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display font-bold text-lg text-stone-900">{t('live_bidding')}</h3>
          <p className="text-sm text-stone-500">{t('live_bidding_desc')}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> {t('list_my_product')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gavel className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-stone-500">{t('active_bids')}</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">{bids.filter(b => b.status === 'active').length}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-secondary-600" />
            <p className="text-xs text-stone-500">{t('total_bidders')}</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">{bids.reduce((s, b) => s + b.bids, 0)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-success-600" />
            <p className="text-xs text-stone-500">{t('avg_premium')}</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">+18%</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 flex-1">
          <Search className="w-4 h-4 text-stone-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search_product')} className="bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none flex-1" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {states.map(s => (
            <button key={s} onClick={() => setStateFilter(s)} className={`px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${stateFilter === s ? 'bg-stone-900 text-white' : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'}`}>
              {s === 'All States' ? t('all') : s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((bid, idx) => {
          const style = statusKeys[bid.status];
          const StatusIcon = style.icon;
          const premium = Math.round(((bid.currentBid - bid.basePrice) / bid.basePrice) * 100);
          return (
            <div key={bid.id} className="card card-hover overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex gap-4 p-4">
                <div className="relative w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={bid.productImage} alt={bid.productName} className="w-full h-full object-cover" />
                  {bid.status === 'closing' && (
                    <div className="absolute top-1.5 left-1.5 bg-error-500 rounded-md px-1.5 py-0.5 flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5 text-white" />
                      <span className="text-[9px] text-white font-bold">HOT</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-stone-900 text-sm leading-snug">{bid.productName}</h3>
                      <span className={`badge ${style.bg} ${style.text} flex-shrink-0`}>
                        <StatusIcon className="w-3 h-3" /> {t(style.labelKey)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-2">{bid.craft} · {t('by')} {bid.artisan}</p>
                    <div className="flex items-center gap-3 text-[11px] text-stone-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {bid.location}, {bid.state}</span>
                    </div>
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div>
                      <p className="text-[10px] text-stone-400">{t('current_bid')}</p>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-success-600" />
                        <span className="text-xl font-display font-bold text-stone-900">{bid.currentBid.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-stone-400">{t('base')}: ₹{bid.basePrice}</span>
                        {premium > 0 && (
                          <span className="badge bg-success-100 text-success-700 text-[10px] py-0.5">
                            <ArrowUp className="w-2.5 h-2.5" /> +{premium}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                        <Users className="w-3 h-3" /> {bid.bids} {t('bids')}
                      </div>
                      <div className={`flex items-center gap-1 text-[11px] font-medium ${bid.status === 'closing' ? 'text-error-600' : 'text-stone-500'}`}>
                        <Clock className="w-3 h-3" /> {bid.timeLeft}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <p className="text-xs text-stone-500">{t('min_next_bid')}: ₹{(bid.currentBid + 50).toLocaleString('en-IN')}</p>
                <button onClick={() => { setSelectedBid(bid); setBidAmount((bid.currentBid + 50).toString()); }} className="btn-primary text-xs px-4 py-2">
                  <Gavel className="w-3.5 h-3.5" /> {t('place_bid')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-stone-400 text-sm">{t('no_bids')}</p>
        </div>
      )}

      {selectedBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm" onClick={() => setSelectedBid(null)}>
          <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-5">
              <img src={selectedBid.productImage} alt={selectedBid.productName} className="w-16 h-16 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-display font-bold text-stone-900">{selectedBid.productName}</h3>
                <p className="text-sm text-stone-500">{selectedBid.craft} · {selectedBid.location}</p>
              </div>
            </div>
            <div className="bg-stone-50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-500">{t('current_highest')}</span>
                <span className="text-lg font-bold text-stone-900">₹{selectedBid.currentBid.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>{t('base_price')}</span>
                <span>₹{selectedBid.basePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
                <span>{t('total_bids')}</span>
                <span>{selectedBid.bids} {t('bids')}</span>
              </div>
            </div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">{t('your_bid')}</label>
            <div className="relative mb-4">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
              <input type="number" value={bidAmount} onChange={e => setBidAmount(e.target.value)} min={selectedBid.currentBid + 50} className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 text-lg font-semibold text-stone-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedBid(null)} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={handlePlaceBid} className="btn-primary flex-1">
                <Gavel className="w-4 h-4" /> {t('confirm_bid')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-card-hover w-full max-w-md p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg text-stone-900 mb-1">{t('list_product_bidding')}</h3>
            <p className="text-sm text-stone-500 mb-5">{t('list_product_desc')}</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('product_name')}</label>
                <input type="text" placeholder="e.g. Hand-painted Ceramic Vase" className="input-field" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('craft_category')}</label>
                <select className="input-field">
                  <option>{t('pottery')}</option>
                  <option>{t('jewellery')}</option>
                  <option>{t('textiles')}</option>
                  <option>{t('home_decor')}</option>
                  <option>{t('wood_craft')}</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('base_price_label')}</label>
                  <input type="number" placeholder="1200" className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">{t('your_location')}</label>
                  <input type="text" defaultValue={artisan.village} className="input-field" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">{t('cancel')}</button>
              <button onClick={() => setShowAddModal(false)} className="btn-primary flex-1">
                <Check className="w-4 h-4" /> {t('list_for_bidding')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
