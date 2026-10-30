import React from 'react';
import { Layers, ChevronRight, Folder } from 'lucide-react';
import type { CategoryNode } from '../types/category';

interface CategoryFilterProps {
  categories: CategoryNode[];
  selectedSlug: string | undefined;
  onSelectCategory: (slug: string | undefined) => void;
  loading: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedSlug,
  onSelectCategory,
  loading,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
      <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100">
        <Layers className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-slate-900">Danh mục sản phẩm</h3>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-7 bg-slate-100 rounded-md" />
          <div className="h-7 bg-slate-100 rounded-md" />
          <div className="h-7 bg-slate-100 rounded-md" />
        </div>
      ) : (
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              !selectedSlug
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>Tất cả danh mục</span>
            {!selectedSlug && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
          </button>

          {categories.map((cat) => (
            <div key={cat.id} className="space-y-0.5">
              <button
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                  selectedSlug === cat.slug
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Folder className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{cat.name}</span>
                </div>
                {cat.children && cat.children.length > 0 && (
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </button>

              {/* Subcategories */}
              {cat.children && cat.children.length > 0 && (
                <div className="pl-4 space-y-0.5 border-l-2 border-slate-100 ml-3">
                  {cat.children.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => onSelectCategory(sub.slug)}
                      className={`w-full text-left px-2 py-1 rounded-md text-xs transition-colors flex items-center justify-between ${
                        selectedSlug === sub.slug
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      {selectedSlug === sub.slug && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
