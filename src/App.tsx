import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { NormalizationStudioPage } from './pages/NormalizationStudioPage';

export function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'simulator'>('catalog');
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        backendOnline={backendOnline}
      />

      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <CatalogPage onBackendStatusChange={(online) => setBackendOnline(online)} />
        ) : (
          <NormalizationStudioPage />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">NormCat E-Commerce Platform</span> — DAY 06 Frontend Integration
          </div>
          <div className="flex items-center gap-4">
            <span>Spring Boot 3.3.4 (Java 21)</span>
            <span>•</span>
            <span>PostgreSQL 16 & JSONB</span>
            <span>•</span>
            <span>React & Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
