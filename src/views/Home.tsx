import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Upload,
  Gavel,
  IndianRupee,
  Package,
  TrendingUp,
  ArrowRight,
  Bot,
} from 'lucide-react';
import { artisan, products, initialChatMessages, aiSuggestions } from '@/data';
import type { View, ChatMessage } from '@/types';

interface HomeProps {
  onNavigate: (view: View) => void;
}

const aiResponses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['price', 'pricing', 'cost', 'rate', 'kitna', 'kimat'],
    reply: 'Based on current market data for blue pottery in your region, I recommend pricing your vase between ₹1,200 and ₹1,800. Similar products on Amazon Karigar are selling at ₹1,450 average. Your craftsmanship quality scores 87/100, so you can price slightly above average. Would you like me to list it at ₹1,450?',
  },
  {
    keywords: ['buyer', 'buy', 'market', 'sell', 'customer', 'grahak'],
    reply: 'I found 5 buyer matches for your pottery!\n\n1. Dilli Haat, New Delhi — 94% match, 320 active buyers\n2. Urban Artisan Store, Mumbai — 88% match\n3. Crafts Council Expo, Chennai — 82% match\n\nDilli Haat has the highest demand for blue pottery right now. Shall I connect you with them?',
  },
  {
    keywords: ['description', 'write', 'listing', 'catalog', 'details'],
    reply: 'Here\'s a product description I generated for your vase:\n\n"A handcrafted blue ceramic vase featuring traditional Khurja designs. Each piece is individually shaped and painted by skilled artisans over 3 days. The intricate floral patterns reflect centuries of Indian pottery heritage. Made with natural clay and lead-free glaze."\n\nI can translate this into Hindi, Bengali, Tamil, and Telugu. Want me to add it to your catalogue?',
  },
  {
    keywords: ['brass', 'metal', 'moradabad'],
    reply: 'Brass items are in high demand in Moradabad and export markets! Current trends show:\n\n- Brass earrings: ₹850-1,200 range\n- Decorative brass plates: ₹600-1,500\n- Export demand growing 18% this quarter\n\nI recommend listing brass products on Government e-Marketplace for bulk buyers. Shall I set that up?',
  },
];

function getAiResponse(userText: string): string {
  const lower = userText.toLowerCase();
  for (const r of aiResponses) {
    if (r.keywords.some(k => lower.includes(k))) return r.reply;
  }
  return 'I can help you with pricing your products, finding buyers in your area, writing product descriptions, and managing your catalogue. Try asking me about prices, buyers, or product listings!';
}

export function Home({ onNavigate }: HomeProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, aiTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAiTyping(true);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: `a${Date.now()}`,
        sender: 'ai',
        text: getAiResponse(text),
        time: 'Just now',
      };
      setMessages(prev => [...prev, aiMsg]);
      setAiTyping(false);
    }, 1500);
  };

  const topProducts = [...products].sort((a, b) => b.views - a.views).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs font-medium text-primary-400 uppercase tracking-wider">Your AI Business Manager</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 text-balance">
            Namaste, {artisan.name}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
            I'm here to help you sell more. Ask me anything, or pick an action below to get started.
          </p>
        </div>
      </div>

      {/* Two big action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('upload')}
          className="card card-hover p-6 text-left group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform">
            <Upload className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-stone-900 mb-1">Add a Product</h3>
          <p className="text-sm text-stone-500 leading-relaxed">Upload a photo and I'll instantly analyze it — price, description, market demand, everything you need to know.</p>
          <div className="flex items-center gap-1 mt-3 text-primary-600 text-sm font-medium">
            Get started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <button
          onClick={() => onNavigate('bidding')}
          className="card card-hover p-6 text-left group"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center mb-4 shadow-soft group-hover:scale-110 transition-transform">
            <Gavel className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display font-bold text-lg text-stone-900 mb-1">Bidding Market</h3>
          <p className="text-sm text-stone-500 leading-relaxed">See live bids from buyers near you. Place your products and let buyers compete to give you the best price.</p>
          <div className="flex items-center gap-1 mt-3 text-secondary-600 text-sm font-medium">
            View market <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* AI Chat + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Chat */}
        <div className="lg:col-span-2 card overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Chat header */}
          <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success-500 ring-2 ring-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-stone-900 text-sm">Karigar AI</h3>
              <p className="text-[11px] text-success-600 font-medium">Online · Powered by HuggingFace</p>
            </div>
          </div>

          {/* Chat messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  msg.sender === 'ai' ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-stone-200'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-stone-600">{artisan.name[0]}</span>}
                </div>
                <div className={`max-w-[75%] ${msg.sender === 'user' ? 'items-end' : ''}`}>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                    msg.sender === 'ai'
                      ? 'bg-stone-100 text-stone-800 rounded-tl-sm'
                      : 'bg-primary-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-[10px] text-stone-400 mt-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</p>
                </div>
              </div>
            ))}

            {/* AI typing indicator */}
            {aiTyping && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-stone-400 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestion chips */}
          {messages.length <= 1 && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {aiSuggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs text-stone-600 bg-stone-50 hover:bg-primary-50 hover:text-primary-700 border border-stone-200 rounded-full px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-stone-100">
            <div className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200 pr-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(input); }}
                placeholder="Ask me anything about your business..."
                className="flex-1 bg-transparent px-4 py-3 text-sm text-stone-700 placeholder:text-stone-400 outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-success-100 flex items-center justify-center">
                <IndianRupee className="w-4.5 h-4.5 text-success-600" />
              </div>
              <div>
                <p className="text-xs text-stone-500">This month's earnings</p>
                <p className="text-xl font-display font-bold text-stone-900">₹{artisan.monthlyEarnings.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-success-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +{artisan.growth}% from last month
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center">
                <Package className="w-4.5 h-4.5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-stone-500">Products in catalogue</p>
                <p className="text-xl font-display font-bold text-stone-900">{artisan.totalProducts} products</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Sparkles className="w-3.5 h-3.5 text-primary-500" /> {artisan.totalSales} total sales
            </div>
          </div>

          {/* Top products mini list */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-stone-900 text-sm mb-3">Your Top Products</h3>
            <div className="space-y-2.5">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-stone-300 w-4">{i + 1}</span>
                  <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-700 truncate">{p.name}</p>
                    <p className="text-[10px] text-stone-400">₹{p.price} · {p.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
