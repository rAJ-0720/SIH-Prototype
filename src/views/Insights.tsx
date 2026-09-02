import { TrendingUp, Eye, IndianRupee, Package, Star, BarChart3 } from 'lucide-react';
import { artisan, products, channels } from '@/data';

export function Insights() {
  const connectedChannels = channels.filter(c => c.connected);
  const totalViews = products.reduce((sum, p) => sum + p.views, 0);
  const avgPrice = Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length);

  const topProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 4);
  const maxViews = Math.max(...products.map(p => p.views));

  const monthlyData = [
    { month: 'Apr', sales: 12, earnings: 18200 },
    { month: 'May', sales: 18, earnings: 22400 },
    { month: 'Jun', sales: 15, earnings: 19800 },
    { month: 'Jul', sales: 22, earnings: 25600 },
    { month: 'Aug', sales: 28, earnings: 28400 },
    { month: 'Sep', sales: 19, earnings: 21200 },
  ];
  const maxEarnings = Math.max(...monthlyData.map(d => d.earnings));

  const categoryData = [
    { name: 'Pottery', count: 3, color: 'bg-primary-500' },
    { name: 'Jewellery', count: 2, color: 'bg-secondary-500' },
    { name: 'Textiles', count: 1, color: 'bg-accent-500' },
  ];
  const totalCat = categoryData.reduce((s, c) => s + c.count, 0);

  return (
    <div className="space-y-5">
      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sales', value: artisan.totalSales, icon: Package, color: 'primary' },
          { label: 'Total Earnings', value: `₹${(artisan.monthlyEarnings * 6).toLocaleString('en-IN')}`, icon: IndianRupee, color: 'success' },
          { label: 'Product Views', value: totalViews.toLocaleString('en-IN'), icon: Eye, color: 'secondary' },
          { label: 'Avg. Price', value: `₹${avgPrice}`, icon: TrendingUp, color: 'accent' },
        ].map(stat => {
          const Icon = stat.icon;
          const colors: Record<string, string> = {
            primary: 'bg-primary-100 text-primary-600',
            success: 'bg-success-100 text-success-600',
            secondary: 'bg-secondary-100 text-secondary-600',
            accent: 'bg-accent-100 text-accent-600',
          };
          return (
            <div key={stat.label} className="card p-4">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${colors[stat.color]}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <p className="text-xl font-display font-bold text-stone-900">{stat.value}</p>
              <p className="text-xs text-stone-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Earnings chart */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h3 className="font-display font-semibold text-stone-900">Monthly Earnings</h3>
          <span className="ml-auto badge bg-success-100 text-success-700">+{artisan.growth}% growth</span>
        </div>
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-48">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex-1 flex items-end">
                <div
                  className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-500 hover:from-primary-700 hover:to-primary-500 group relative"
                  style={{ height: `${(d.earnings / maxEarnings) * 100}%`, animationDelay: `${i * 80}ms` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-semibold text-stone-700 bg-white rounded-md px-1.5 py-0.5 shadow-soft whitespace-nowrap">₹{d.earnings.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-stone-500 font-medium">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top products */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-stone-900 mb-4">Top Products by Views</h3>
          <div className="space-y-3">
            {topProducts.map((product, idx) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-400 w-4">{idx + 1}</span>
                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(product.views / maxViews) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-stone-500 flex-shrink-0">{product.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="card p-5">
          <h3 className="font-display font-semibold text-stone-900 mb-4">Products by Category</h3>
          <div className="space-y-4">
            {categoryData.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-stone-700">{cat.name}</span>
                  <span className="text-xs text-stone-500">{cat.count} products ({Math.round((cat.count / totalCat) * 100)}%)</span>
                </div>
                <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${(cat.count / totalCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent-500 fill-accent-400" />
              <span className="text-sm font-semibold text-stone-800">{artisan.rating} Rating</span>
              <span className="text-xs text-stone-500">across {artisan.totalSales} sales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel performance */}
      <div className="card p-5">
        <h3 className="font-display font-semibold text-stone-900 mb-4">Channel Performance</h3>
        <div className="space-y-3">
          {connectedChannels.map(channel => (
            <div key={channel.id} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-stone-600">
                <Package className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-800">{channel.name}</p>
                <p className="text-[11px] text-stone-500">{channel.products} products live</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-stone-900">{channel.views.toLocaleString('en-IN')}</p>
                <p className="text-[11px] text-stone-500">views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
