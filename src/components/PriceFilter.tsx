import React, { useState, useEffect } from 'react';
import { DollarSign } from 'lucide-react';

interface PriceFilterProps {
  minPrice?: number;
  maxPrice?: number;
  onApplyPrice: (min?: number, max?: number) => void;
}

const PRESETS = [
  { label: 'Dưới 15 triệu', min: undefined, max: 15000000 },
  { label: '15 - 30 triệu', min: 15000000, max: 30000000 },
  { label: '30 - 50 triệu', min: 30000000, max: 50000000 },
  { label: 'Trên 50 triệu', min: 50000000, max: undefined },
];

export const PriceFilter: React.FC<PriceFilterProps> = ({ minPrice, maxPrice, onApplyPrice }) => {
  const [minInput, setMinInput] = useState<string>(minPrice !== undefined ? String(minPrice) : '');
  const [maxInput, setMaxInput] = useState<string>(maxPrice !== undefined ? String(maxPrice) : '');

  useEffect(() => {
    setMinInput(minPrice !== undefined ? String(minPrice) : '');
    setMaxInput(maxPrice !== undefined ? String(maxPrice) : '');
  }, [minPrice, maxPrice]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minInput ? Number(minInput) : undefined;
    const maxVal = maxInput ? Number(maxInput) : undefined;
    onApplyPrice(minVal, maxVal);
  };

  const handleClear = () => {
    setMinInput('');
    setMaxInput('');
    onApplyPrice(undefined, undefined);
  };

  const isPresetActive = (pMin?: number, pMax?: number) => {
    return minPrice === pMin && maxPrice === pMax;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-slate-900">Khoảng giá (VNĐ)</h3>
        </div>
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Quick Presets */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onApplyPrice(p.min, p.max)}
            className={`px-2 py-1.5 text-xs rounded-md border text-center transition-colors truncate ${
              isPresetActive(p.min, p.max)
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-medium'
                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom Inputs */}
      <form onSubmit={handleApply} className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Từ VNĐ"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-slate-400 text-xs">-</span>
          <input
            type="number"
            placeholder="Đến VNĐ"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="w-full text-xs py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-colors"
        >
          Áp dụng khoảng giá
        </button>
      </form>
    </div>
  );
};
