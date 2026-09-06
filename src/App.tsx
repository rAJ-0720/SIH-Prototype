import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Home } from '@/views/Home';
import { ProductUpload } from '@/views/ProductUpload';
import { Bidding } from '@/views/Bidding';
import { LoginPage } from '@/views/LoginPage';
import { BuyerHome } from '@/views/BuyerHome';
import { BuyerOrders } from '@/views/BuyerOrders';
import { BuyerAddresses } from '@/views/BuyerAddresses';
import { BuyerPayments } from '@/views/BuyerPayments';
import { LanguageProvider, useLanguage } from '@/language-context';
import type { View } from '@/types';

function AppContent({ onLogout }: { onLogout: () => void }) {
  const { role } = useLanguage();
  const [view, setView] = useState<View>(role === 'buyer' ? 'buyer_home' : 'home');

  const renderView = () => {
    switch (view) {
      case 'home': return <Home onNavigate={setView} />;
      case 'upload': return <ProductUpload />;
      case 'bidding': return <Bidding />;
      case 'buyer_home': return <BuyerHome onNavigate={setView} />;
      case 'buyer_orders': return <BuyerOrders />;
      case 'buyer_addresses': return <BuyerAddresses />;
      case 'buyer_payments': return <BuyerPayments />;
      default: return role === 'buyer' ? <BuyerHome onNavigate={setView} /> : <Home onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        onLogout={onLogout}
      />
      <div className="lg:pl-72">
        <TopBar currentView={view} />
        <main className="px-4 sm:px-6 lg:px-8 py-6 pt-20 lg:pt-6 max-w-7xl mx-auto">
          <div key={view} className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <LanguageProvider>
        <LoginPage onLogin={() => setIsLoggedIn(true)} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <AppContent onLogout={() => setIsLoggedIn(false)} />
    </LanguageProvider>
  );
}

export default App;
