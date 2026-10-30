import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './pages/CatalogPage';
import { NormalizationStudioPage } from './pages/NormalizationStudioPage';

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
            <span className="font-semibold text-slate-800">NormCat Platform</span> — Hệ thống Quản lý Danh mục và Chuẩn hóa Dữ liệu Sản phẩm TMĐT
          </div>
          <div className="text-slate-400">
            © 2026 NormCat. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
