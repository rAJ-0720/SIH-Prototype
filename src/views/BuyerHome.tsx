import {
  Gavel,
  Package,
  IndianRupee,
  ArrowRight,
  Clock,
  MapPin,
  ShoppingBag,
} from 'lucide-react';
import { buyer, buyerOrders, bids } from '@/data';
import { useLanguage } from '@/language-context';
import type { View, BuyerOrder } from '@/types';
import type { TKey } from '@/i18n';

interface BuyerHomeProps {
  onNavigate: (view: View) => void;
}

const statusKeyMap: Record<BuyerOrder['status'], TKey> = {
  delivered: 'delivered',
  shipped: 'shipped',
  processing: 'processing',
  won: 'won',
};

const statusStyles: Record<BuyerOrder['status'], string> = {
  delivered: 'bg-success-100 text-success-700',
  shipped: 'bg-primary-100 text-primary-700',
  processing: 'bg-accent-100 text-accent-700',
  won: 'bg-secondary-100 text-secondary-700',
};

export function BuyerHome({ onNavigate }: BuyerHomeProps) {
  const { t } = useLanguage();
  const recentOrders = buyerOrders.slice(0, 3);
  const activeBids = bids.filter(b => b.status === 'active' || b.status === 'closing').slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingBag className="w-4 h-4 text-secondary-400" />
            <span className="text-xs font-medium text-secondary-400 uppercase tracking-wider">{t('buyer_dashboard')}</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 text-balance">
            {t('welcome_buyer')}, {buyer.name}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
            {t('buyer_greeting')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
              <Package className="w-4.5 h-4.5 text-primary-600" />
            </div>
          </div>
          <p className="text-xs text-stone-500">{t('total_orders')}</p>
          <p className="text-2xl font-display font-bold text-stone-900">{buyer.totalOrders}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-100 flex items-center justify-center">
              <Gavel className="w-4.5 h-4.5 text-secondary-600" />
            </div>
          </div>
          <p className="text-xs text-stone-500">{t('active_bids_count')}</p>
          <p className="text-2xl font-display font-bold text-stone-900">{buyer.activeBids}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-success-100 flex items-center justify-center">
              <IndianRupee className="w-4.5 h-4.5 text-success-600" />
            </div>
          </div>
          <p className="text-xs text-stone-500">{t('total_spent')}</p>
          <p className="text-2xl font-display font-bold text-stone-900">₹{buyer.totalSpent.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <button onClick={() => onNavigate('bidding')} className="card card-hover p-6 text-left w-full group">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform flex-shrink-0">
            <Gavel className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-bold text-lg text-stone-900 mb-1">{t('browse_market')}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{t('browse_market_desc')}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-secondary-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
        </div>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-stone-900 text-sm">{t('recent_orders')}</h3>
            <button onClick={() => onNavigate('buyer_orders')} className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
              {t('view_all')} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-3">
                <img src={order.productImage} alt={order.productName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{order.productName}</p>
                  <p className="text-[11px] text-stone-400">{t('by')} {order.artisan} · ₹{order.amount}</p>
                </div>
                <span className={`badge ${statusStyles[order.status]} flex-shrink-0`}>{t(statusKeyMap[order.status])}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-stone-900 text-sm">{t('recent_bids')}</h3>
            <button onClick={() => onNavigate('bidding')} className="text-xs text-secondary-600 hover:text-secondary-700 font-medium flex items-center gap-1">
              {t('view_all')} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {activeBids.map(bid => (
              <div key={bid.id} className="flex items-center gap-3">
                <img src={bid.productImage} alt={bid.productName} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{bid.productName}</p>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400">
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {bid.location}</span>
                    <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {bid.timeLeft}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-stone-900">₹{bid.currentBid}</p>
                  <p className="text-[10px] text-stone-400">{bid.bids} {t('bids')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
