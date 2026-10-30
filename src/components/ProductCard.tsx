import React from 'react';
import { Sparkles, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
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
  
  // A product is partially normalized if status says so, or if it has 0 normalized attributes mapped
  const isPartiallyNormalized =
    product.normalizationStatus === 'PARTIALLY_NORMALIZED' ||
    (!product.normalizationStatus && attributeEntries.length === 0);

  const isFailed = product.normalizationStatus === 'FAILED';

  return (
    <div className={`group bg-white rounded-xl border transition-all duration-200 flex flex-col overflow-hidden ${
      isPartiallyNormalized
        ? 'border-amber-200 hover:border-amber-400 hover:shadow-md'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
    }`}>
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
          <div className="space-y-1.5">
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
            {isPartiallyNormalized && (
              <span className="text-[10px] text-amber-600 font-medium block">
                * Có thông số chưa khớp từ điển sàn
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200/80">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Chờ duyệt từ điển thuộc tính</span>
          </div>
        )}
      </div>

      {/* Card Footer / Action */}
      <div className={`p-3 border-t flex items-center justify-between ${
        isPartiallyNormalized ? 'bg-amber-50/40 border-amber-100' : 'bg-slate-50/70 border-slate-100'
      }`}>
        {/* Dynamic Status Badge */}
        {isPartiallyNormalized ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Chuẩn hóa một phần</span>
          </span>
        ) : isFailed ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Chưa chuẩn hóa</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Đã chuẩn hóa 100%</span>
          </span>
        )}

        <button
          onClick={() => onViewDetails(product.id)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition-all"
        >
          <span>So sánh dữ liệu</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
