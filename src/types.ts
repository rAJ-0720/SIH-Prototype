export type View = 'home' | 'upload' | 'bidding';

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

export interface ProductInsight {
  suggestedName: string;
  category: string;
  description: string;
  materials: string;
  dimensions: string;
  suggestedPrice: number;
  priceRange: { min: number; max: number };
  marketDemand: 'high' | 'medium' | 'low';
  demandTrend: 'rising' | 'stable' | 'declining';
  similarProducts: number;
  competitorPrice: number;
  languages: string[];
  tags: string[];
  qualityScore: number;
  improvementTips: string[];
}

export interface Bid {
  id: string;
  productName: string;
  productImage: string;
  artisan: string;
  craft: string;
  basePrice: number;
  currentBid: number;
  bids: number;
  location: string;
  state: string;
  timeLeft: string;
  status: 'active' | 'closing' | 'sold';
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

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}
