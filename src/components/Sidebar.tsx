import { useState } from 'react';
import {
  Home,
  Upload,
  Gavel,
  Sparkles,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import type { View } from '@/types';

interface NavItem {
  id: View;
  label: string;
  icon: typeof Home;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, description: 'Your AI Manager' },
  { id: 'upload', label: 'Add Product', icon: Upload, description: 'Upload & get AI insights' },
  { id: 'bidding', label: 'Bidding Market', icon: Gavel, description: 'Sell to buyers near you' },
];

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
}

export function Sidebar({ currentView, onNavigate, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (view: View) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile header bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-stone-900">KARIGAR<span className="text-primary-600"> AI</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6 text-stone-700" /> : <Menu className="w-6 h-6 text-stone-700" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-stone-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-soft">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-stone-900 leading-none">KARIGAR<span className="text-primary-600"> AI</span></h1>
            <p className="text-[10px] text-stone-400 font-medium tracking-wide uppercase mt-0.5">AI Business Manager</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-hide">
          <p className="px-3 mb-2 text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Menu</p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    active ? 'bg-primary-600 text-white' : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                  }`}>
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-semibold ${active ? 'text-primary-700' : 'text-stone-700'}`}>{item.label}</p>
                    <p className="text-[11px] text-stone-400">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-500 hover:bg-error-50 hover:text-error-600 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center">
              <LogOut className="w-4.5 h-4.5" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
