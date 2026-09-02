export type View =
  | 'dashboard'
  | 'catalog'
  | 'photo-studio'
  | 'voice-catalog'
  | 'market-linkage'
  | 'channels'
  | 'insights';

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  suggestedPrice: number;
  status: 'draft' | 'listed' | 'published';
  languages: string[];
  markets: number;
  views: number;
  createdAt: string;
}

export interface MarketMatch {
  id: string;
  name: string;
  type: string;
  location: string;
  matchScore: number;
  demand: 'high' | 'medium' | 'low';
  avgPrice: number;
  buyers: number;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  products: number;
  views: number;
}

export interface ActivityItem {
  id: string;
  type: 'photo' | 'voice' | 'price' | 'market' | 'publish' | 'view';
  title: string;
  description: string;
  time: string;
}

export interface Artisan {
  name: string;
  craft: string;
  village: string;
  state: string;
  rating: number;
  totalProducts: number;
  totalSales: number;
  monthlyEarnings: number;
  growth: number;
}
