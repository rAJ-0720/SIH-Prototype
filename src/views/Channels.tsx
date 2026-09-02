import { useState } from 'react';
import {
  ShoppingBag,
  Package,
  Smartphone,
  MessageCircle,
  Instagram,
  Landmark,
  Plus,
  Check,
  Share2,
  Eye,
  TrendingUp,
} from 'lucide-react';
import { channels as channelData } from '@/data';

const iconMap: Record<string, typeof ShoppingBag> = {
  'shopping-bag': ShoppingBag,
  'package': Package,
  'smartphone': Smartphone,
  'message-circle': MessageCircle,
  'instagram': Instagram,
  'landmark': Landmark,
};

export function Channels() {
  const [channels, setChannels] = useState(channelData);

  const toggleConnect = (id: string) => {
    setChannels(prev => prev.map(c =>
      c.id === id ? { ...c, connected: !c.connected } : c
    ));
  };

  const connected = channels.filter(c => c.connected);
  const totalViews = connected.reduce((sum, c) => sum + c.views, 0);
  const totalProducts = connected.reduce((sum, c) => sum + c.products, 0);

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Share2 className="w-4 h-4 text-primary-600" />
            <p className="text-xs text-stone-500">Connected</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">{connected.length}<span className="text-sm text-stone-400">/{channels.length}</span></p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-secondary-600" />
            <p className="text-xs text-stone-500">Products Live</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">{totalProducts}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-accent-600" />
            <p className="text-xs text-stone-500">Total Views</p>
          </div>
          <p className="text-xl font-display font-bold text-stone-900">{totalViews.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Channel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel, idx) => {
          const Icon = iconMap[channel.icon] ?? Package;
          return (
            <div
              key={channel.id}
              className={`card p-5 animate-fade-in-up transition-all ${channel.connected ? 'border-success-200' : ''}`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${channel.connected ? 'bg-success-100 text-success-600' : 'bg-stone-100 text-stone-400'}`}>
                  <Icon className="w-6 h-6" />
                </div>
                {channel.connected ? (
                  <span className="badge bg-success-100 text-success-700">
                    <Check className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="badge bg-stone-100 text-stone-500">Not connected</span>
                )}
              </div>

              <h3 className="font-semibold text-stone-900 text-sm mb-1">{channel.name}</h3>
              {channel.connected ? (
                <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1"><Package className="w-3.5 h-3.5" /> {channel.products} products</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {channel.views.toLocaleString('en-IN')} views</span>
                </div>
              ) : (
                <p className="text-xs text-stone-500 mb-4">Connect to publish your products here.</p>
              )}

              <button
                onClick={() => toggleConnect(channel.id)}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                  channel.connected
                    ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {channel.connected ? 'Manage' : (
                  <span className="flex items-center justify-center gap-1.5"><Plus className="w-4 h-4" /> Connect</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Publish all */}
      <div className="card p-5 bg-gradient-to-br from-primary-50 to-white border-primary-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-stone-900 text-sm">Publish to All Channels</h3>
            <p className="text-xs text-stone-500 mt-0.5">Push your entire catalogue to all connected platforms with one tap. AI optimizes titles and descriptions for each platform.</p>
          </div>
          <button className="btn-primary">
            <Share2 className="w-4 h-4" /> Publish All
          </button>
        </div>
      </div>
    </div>
  );
}
