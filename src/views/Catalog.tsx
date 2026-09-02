import { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, IndianRupee, Eye, MapPin, Languages, Sparkles } from 'lucide-react';
import { products } from '@/data';
import type { Product } from '@/types';

const statusStyles: Record<Product['status'], string> = {
  published: 'bg-success-100 text-success-700',
  listed: 'bg-primary-100 text-primary-700',
  draft: 'bg-stone-100 text-stone-500',
};

export function Catalog() {
  const [filter, setFilter] = useState<'all' | Product['status']>('all');
  const [search, setSearch] = useState('');

  const filtered = products.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filterTabs: { id: 'all' | Product['status']; label: string; count: number }[] = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'published', label: 'Published', count: products.filter(p => p.status === 'published').length },
    { id: 'listed', label: 'Listed', count: products.filter(p => p.status === 'listed').length },
    { id: 'draft', label: 'Drafts', count: products.filter(p => p.status === 'draft').length },
  ];

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === tab.id
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {tab.label} <span className={`text-xs ml-1 ${filter === tab.id ? 'text-stone-300' : 'text-stone-400'}`}>({tab.count})</span>
            </button>
          ))}
        </div>
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by product name..."
          className="bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none flex-1"
        />
        <button className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
          <Filter className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(product => (
          <div key={product.id} className="card card-hover overflow-hidden group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className={`badge ${statusStyles[product.status]} backdrop-blur-md`}>{product.status}</span>
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-stone-600" />
              </button>
              {product.suggestedPrice > product.price && (
                <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-md rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-accent-400" />
                  <span className="text-[11px] text-white font-medium">AI suggests ₹{product.suggestedPrice}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-stone-100 text-stone-600">{product.category}</span>
              </div>
              <h3 className="font-semibold text-stone-900 text-sm leading-snug mb-3 line-clamp-2">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-stone-900">
                  <IndianRupee className="w-4 h-4 text-stone-400" />
                  <span className="text-lg font-bold">{product.price}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {product.views}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {product.markets}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-3 border-t border-stone-100">
                <Languages className="w-3.5 h-3.5 text-stone-400" />
                <div className="flex flex-wrap gap-1">
                  {product.languages.map(lang => (
                    <span key={lang} className="text-[10px] text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded">{lang}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-stone-400 text-sm">No products found. Try a different search or filter.</p>
        </div>
      )}
    </div>
  );
}
