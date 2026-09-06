import {
  Package,
  MapPin,
  Calendar,
  IndianRupee,
  Check,
  Truck,
  Loader2,
  Trophy,
} from 'lucide-react';
import { buyerOrders } from '@/data';
import { useLanguage } from '@/language-context';
import type { BuyerOrder } from '@/types';
import type { TKey } from '@/i18n';

const statusKeyMap: Record<BuyerOrder['status'], TKey> = {
  delivered: 'delivered',
  shipped: 'shipped',
  processing: 'processing',
  won: 'won',
};

const statusConfig: Record<BuyerOrder['status'], { bg: string; text: string; icon: typeof Check }> = {
  delivered: { bg: 'bg-success-100', text: 'text-success-700', icon: Check },
  shipped: { bg: 'bg-primary-100', text: 'text-primary-700', icon: Truck },
  processing: { bg: 'bg-accent-100', text: 'text-accent-700', icon: Loader2 },
  won: { bg: 'bg-secondary-100', text: 'text-secondary-700', icon: Trophy },
};

export function BuyerOrders() {
  const { t } = useLanguage();

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display font-bold text-lg text-stone-900">{t('my_orders')}</h3>
        <p className="text-sm text-stone-500">{t('my_orders_desc')}</p>
      </div>

      {buyerOrders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-stone-300" />
          </div>
          <p className="text-sm font-medium text-stone-600 mb-1">{t('no_orders')}</p>
          <p className="text-xs text-stone-400">{t('no_orders_desc')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {buyerOrders.map((order, idx) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="card card-hover overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex gap-4 p-4">
                  <img src={order.productImage} alt={order.productName} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-stone-900 text-sm leading-snug">{order.productName}</h3>
                      <span className={`badge ${status.bg} ${status.text} flex-shrink-0`}>
                        <StatusIcon className={`w-3 h-3 ${order.status === 'processing' ? 'animate-spin' : ''}`} />
                        {t(statusKeyMap[order.status])}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mb-3">{order.craft} · {t('by')} {order.artisan}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Calendar className="w-3 h-3" /><span>{t('order_date')}: {order.orderDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500">
                        <Truck className="w-3 h-3" /><span>{t('delivery_date')}: {order.deliveryDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-500 col-span-2">
                        <MapPin className="w-3 h-3" /><span>{order.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-mono">#{order.id.toUpperCase()}</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-success-600" />
                    <span className="text-lg font-display font-bold text-stone-900">{order.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
