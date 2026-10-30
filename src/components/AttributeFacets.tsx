import React from 'react';
import { SlidersHorizontal, Check, X } from 'lucide-react';

interface FacetDefinition {
  code: string;
  name: string;
  options: string[];
}

const AVAILABLE_FACETS: FacetDefinition[] = [
  {
    code: 'RAM',
    name: 'Dung lượng RAM',
    options: ['8GB', '16GB', '32GB', '64GB'],
  },
  {
    code: 'STORAGE',
    name: 'Bộ nhớ lưu trữ',
    options: ['256GB', '512GB', '1TB', '2TB'],
  },
  {
    code: 'COLOR',
    name: 'Màu sắc chuẩn',
    options: ['Black', 'White', 'Silver', 'Space Gray', 'Blue', 'Red', 'Gold'],
  },
  {
    code: 'SCREEN_SIZE',
    name: 'Kích thước màn hình',
    options: ['13.3 inch', '14 inch', '15.6 inch', '16 inch'],
  },
];

interface AttributeFacetsProps {
  activeAttrs: Record<string, string>;
  onToggleFacet: (attrCode: string, value: string) => void;
  onClearAllFacets: () => void;
}

export const AttributeFacets: React.FC<AttributeFacetsProps> = ({
  activeAttrs,
  onToggleFacet,
  onClearAllFacets,
}) => {
  const activeCount = Object.keys(activeAttrs).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm font-semibold text-slate-900">Thuộc tính chuẩn hóa</h3>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAllFacets}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Xóa hết</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {AVAILABLE_FACETS.map((facet) => {
          const selectedValue = activeAttrs[facet.code];

          return (
            <div key={facet.code} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700">{facet.name}</span>
                {selectedValue && (
                  <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 px-1.5 py-0.2 rounded">
                    {selectedValue}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {facet.options.map((option) => {
                  const isSelected = selectedValue === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onToggleFacet(facet.code, option)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all flex items-center gap-1 ${
                        isSelected
                          ? 'bg-violet-600 text-white border-violet-600 font-medium shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
