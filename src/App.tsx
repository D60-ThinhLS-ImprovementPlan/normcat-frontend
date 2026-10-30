import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { NormalizationStudioPage } from './pages/NormalizationStudioPage';
import { ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'simulator'>('catalog');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      <main className="flex-1">
        {activeTab === 'catalog' ? (
          <CatalogPage />
        ) : (
          <NormalizationStudioPage />
        )}
      </main>

      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-800">NormCat E-Commerce Platform</span> — Hệ thống quản lý Catalog và Chuẩn hóa thuộc tính sản phẩm
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Spring Boot 3.3.4 (Java 21)</span>
            <span>•</span>
            <span>PostgreSQL 16 & JSONB</span>
            <span>•</span>
            <span>React & Tailwind CSS</span>
            <span>•</span>
            <a
              href="http://localhost:8080/swagger-ui.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <span>Tài liệu API (Swagger)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
