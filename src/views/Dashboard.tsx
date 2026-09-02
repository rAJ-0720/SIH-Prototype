import {
  Package,
  IndianRupee,
  Eye,
  TrendingUp,
  Camera,
  Mic,
  Share2,
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  MessageCircle,
  Star,
  ChevronRight,
} from 'lucide-react';
import { artisan, products, recentActivity, channels } from '@/data';
import type { View, ActivityItem } from '@/types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const activityIcons: Record<ActivityItem['type'], typeof Camera> = {
  photo: Camera,
  voice: Mic,
  price: IndianRupee,
  market: TrendingUp,
  publish: Share2,
  view: Eye,
};

const activityColors: Record<ActivityItem['type'], string> = {
  photo: 'bg-secondary-100 text-secondary-600',
  voice: 'bg-primary-100 text-primary-600',
  price: 'bg-accent-100 text-accent-600',
  market: 'bg-success-100 text-success-600',
  publish: 'bg-stone-200 text-stone-600',
  view: 'bg-primary-100 text-primary-600',
};

export function Dashboard({ onNavigate }: DashboardProps) {
  const connectedChannels = channels.filter(c => c.connected).length;

  const stats = [
    { label: 'Total Products', value: artisan.totalProducts, icon: Package, color: 'primary', change: '+3 this week' },
    { label: 'Monthly Earnings', value: `₹${artisan.monthlyEarnings.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'success', change: `+${artisan.growth}%` },
    { label: 'Product Views', value: '1,896', icon: Eye, color: 'secondary', change: '+12%' },
    { label: 'Active Channels', value: `${connectedChannels}/${channels.length}`, icon: Share2, color: 'accent', change: '2 pending' },
  ];

  const statColors: Record<string, string> = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    accent: 'bg-accent-100 text-accent-600',
  };

  const quickActions: { view: View; icon: typeof Camera; label: string; desc: string; color: string }[] = [
    { view: 'photo-studio', icon: Camera, label: 'Enhance Photos', desc: 'AI photo cleanup', color: 'from-secondary-500 to-secondary-700' },
    { view: 'voice-catalog', icon: Mic, label: 'Voice Catalogue', desc: 'Speak to create', color: 'from-primary-500 to-primary-700' },
    { view: 'market-linkage', icon: TrendingUp, label: 'Find Markets', desc: 'AI buyer matching', color: 'from-success-500 to-success-700' },
    { view: 'channels', icon: Share2, label: 'Publish', desc: 'Share to platforms', color: 'from-accent-500 to-accent-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">AI Business Manager</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 text-balance">
            Namaste, {artisan.name} 👋
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Your AI manager has found <span className="text-secondary-400 font-semibold">3 new buyer matches</span> for your pottery,
            and suggests listing <span className="text-primary-400 font-semibold">2 draft products</span> to increase earnings by ~15%.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <button onClick={() => onNavigate('market-linkage')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors">
              <TrendingUp className="w-4 h-4" /> View Buyer Matches
            </button>
            <button onClick={() => onNavigate('catalog')} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors">
              Go to Catalogue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statColors[stat.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-success-600 bg-success-50 px-2 py-0.5 rounded-full">{stat.change}</span>
              </div>
              <p className="text-2xl font-display font-bold text-stone-900">{stat.value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="font-display font-semibold text-stone-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.view}
                onClick={() => onNavigate(action.view)}
                className="card card-hover p-5 text-left group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-soft group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-stone-900 text-sm">{action.label}</p>
                <p className="text-xs text-stone-500 mt-0.5">{action.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent products */}
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-stone-900">Recent Products</h3>
            <button onClick={() => onNavigate('catalog')} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer">
                <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="badge bg-stone-100 text-stone-600">{product.category}</span>
                    <span className={`badge ${product.status === 'published' ? 'bg-success-100 text-success-700' : product.status === 'listed' ? 'bg-primary-100 text-primary-700' : 'bg-stone-100 text-stone-500'}`}>
                      {product.status}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-stone-900">₹{product.price}</p>
                  <p className="text-[11px] text-stone-400">{product.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-stone-900 mb-4">AI Activity</h3>
          <div className="space-y-1">
            {recentActivity.slice(0, 5).map((activity) => {
              const Icon = activityIcons[activity.type];
              return (
                <div key={activity.id} className="flex gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activityColors[activity.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 leading-snug">{activity.title}</p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-snug">{activity.description}</p>
                    <p className="text-[10px] text-stone-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Channel preview */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-stone-900">Connected Channels</h3>
          <button onClick={() => onNavigate('channels')} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {channels.map((channel) => {
            const Icon = channel.icon === 'shopping-bag' ? ShoppingBag : channel.icon === 'message-circle' ? MessageCircle : Star;
            return (
              <div key={channel.id} className={`p-3 rounded-xl border text-center transition-all ${channel.connected ? 'border-success-200 bg-success-50/50' : 'border-stone-200 bg-stone-50'}`}>
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2 ${channel.connected ? 'bg-success-100 text-success-600' : 'bg-stone-200 text-stone-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-[11px] font-medium text-stone-700 truncate">{channel.name}</p>
                <p className={`text-[10px] mt-0.5 ${channel.connected ? 'text-success-600' : 'text-stone-400'}`}>
                  {channel.connected ? `${channel.products} products` : 'Not connected'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
