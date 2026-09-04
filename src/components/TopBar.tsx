import { Bell, Star } from 'lucide-react';
import { artisan } from '@/data';
import type { View } from '@/types';

const viewTitles: Record<View, { title: string; subtitle: string }> = {
  home: { title: 'Home', subtitle: 'Your AI Business Manager' },
  upload: { title: 'Add Product', subtitle: 'Upload a product and get instant AI insights' },
  bidding: { title: 'Bidding Market', subtitle: 'Location-based marketplace for artisans & buyers' },
};

interface TopBarProps {
  currentView: View;
}

export function TopBar({ currentView }: TopBarProps) {
  const { title, subtitle } = viewTitles[currentView];

  return (
    <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="lg:hidden w-16" />
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-lg sm:text-xl text-stone-900 truncate">{title}</h2>
          <p className="text-xs sm:text-sm text-stone-500 truncate hidden sm:block">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 transition-colors">
            <Bell className="w-4.5 h-4.5 text-stone-600" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500 ring-2 ring-white" />
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 sm:border-l sm:border-stone-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-800 leading-none">{artisan.name}</p>
              <div className="flex items-center justify-end gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-accent-400 text-accent-400" />
                <span className="text-[11px] text-stone-500">{artisan.rating} · {artisan.craft}</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-soft">
              {artisan.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
