import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Home } from '@/views/Home';
import { ProductUpload } from '@/views/ProductUpload';
import { Bidding } from '@/views/Bidding';
import { LoginPage } from '@/views/LoginPage';
import type { View } from '@/types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState<View>('home');

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderView = () => {
    switch (view) {
      case 'home': return <Home onNavigate={setView} />;
      case 'upload': return <ProductUpload />;
      case 'bidding': return <Bidding />;
      default: return <Home onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar
        currentView={view}
        onNavigate={setView}
        onLogout={() => setIsLoggedIn(false)}
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

export default App;
