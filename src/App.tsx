import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { Dashboard } from '@/views/Dashboard';
import { Catalog } from '@/views/Catalog';
import { PhotoStudio } from '@/views/PhotoStudio';
import { VoiceCatalog } from '@/views/VoiceCatalog';
import { MarketLinkage } from '@/views/MarketLinkage';
import { Channels } from '@/views/Channels';
import { Insights } from '@/views/Insights';
import type { View } from '@/types';

function App() {
  const [view, setView] = useState<View>('dashboard');

  const renderView = () => {
    switch (view) {
      case 'dashboard': return <Dashboard onNavigate={setView} />;
      case 'catalog': return <Catalog />;
      case 'photo-studio': return <PhotoStudio />;
      case 'voice-catalog': return <VoiceCatalog />;
      case 'market-linkage': return <MarketLinkage />;
      case 'channels': return <Channels />;
      case 'insights': return <Insights />;
      default: return <Dashboard onNavigate={setView} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Sidebar currentView={view} onNavigate={setView} />
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
