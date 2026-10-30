import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { ProductSearchItem } from '../types/product';

interface ProductCardProps {
  product: ProductSearchItem;
  onViewDetails: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const formatVnd = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const attributeEntries = Object.entries(product.normalizedAttributes || {});

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Banner / Category & SKU */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 truncate max-w-[150px]">
            {product.categoryName}
          </span>
          <span className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">
            {product.sku}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 min-h-[40px] group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h4>
      </div>

      {/* Price */}
      <div className="px-4 py-1">
        <div className="text-base font-extrabold text-slate-900 tracking-tight">
          {formatVnd(product.price)}
        </div>
      </div>

      {/* Normalized Attributes Chips */}
      <div className="px-4 py-3 flex-1">
        <div className="text-[11px] font-medium text-slate-400 mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Thuộc tính chuẩn hóa:</span>
        </div>

        {attributeEntries.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {attributeEntries.map(([code, value]) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80"
              >
                <span className="font-medium text-slate-500">{code}:</span>
                <span className="font-semibold text-slate-900">{value}</span>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-slate-400 italic">Chưa có thuộc tính chuẩn</span>
        )}
      </div>

      {/* Card Footer / Action */}
      <div className="p-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Đã chuẩn hóa
        </span>

        <button
          onClick={() => onViewDetails(product.id)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>Lưu trữ kép</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
