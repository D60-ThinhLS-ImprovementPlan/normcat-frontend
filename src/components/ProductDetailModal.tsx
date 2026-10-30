import React from 'react';
import { X, CheckCircle2, AlertTriangle, Layers, FileJson } from 'lucide-react';
import type { ProductDetail } from '../types/product';

interface ProductDetailModalProps {
  product: ProductDetail | null;
  loading: boolean;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, loading, onClose }) => {
  if (!product && !loading) return null;

  const formatVnd = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                {product?.sku}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                {product?.categoryName}
              </span>
              {product?.normalizationStatus === 'NORMALIZED' ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Đã chuẩn hóa 100%</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Chuẩn hóa một phần</span>
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 line-clamp-1">{product?.name}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="py-12 text-center text-slate-500 animate-pulse">
              Đang tải thông tin chi tiết sản phẩm...
            </div>
          ) : product ? (
            <>
              {/* Meta bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block mb-0.5">Giá niêm yết</span>
                  <span className="text-sm font-bold text-slate-900">{formatVnd(product.price)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Trạng thái kho</span>
                  <span className="font-semibold text-emerald-600">
                    {product.status === 'ACTIVE' ? 'Đang kinh doanh' : product.status}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Mã danh mục</span>
                  <span className="font-medium text-slate-800">#{product.categoryId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Ngày đăng tải</span>
                  <span>{new Date(product.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>

              {/* Data Comparison Section */}
              <div className="border border-indigo-100 rounded-xl p-4 bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Đối chiếu: Dữ liệu gốc & Thuộc tính đã Chuẩn hóa
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Raw Attributes */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-800">
                      <FileJson className="w-3.5 h-3.5 text-amber-500" />
                      <span>1. Thông tin gốc từ Nhà bán hàng (Seller)</span>
                    </div>
                    <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-md overflow-x-auto max-h-48 leading-relaxed">
                      {JSON.stringify(product.rawAttributes, null, 2)}
                    </pre>
                    <p className="text-[11px] text-slate-500 mt-2">
                      Lưu giữ trọn vẹn mô tả kỹ thuật ban đầu của người bán để đối soát và bảo toàn dữ liệu.
                    </p>
                  </div>

                  {/* Right: Normalized Relational Attributes */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-slate-100 text-xs font-semibold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>2. Thuộc tính chuẩn của Sàn Thương mại</span>
                    </div>

                    {product.normalizedAttributes && product.normalizedAttributes.length > 0 ? (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {product.normalizedAttributes.map((attr, idx) => {
                          const displayVal =
                            attr.attributeDisplayValue ||
                            attr.attributeValueCode ||
                            attr.canonicalValue ||
                            '';

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100 text-xs"
                            >
                              <div>
                                <span className="font-semibold text-slate-800">{attr.attributeName}</span>
                                <span className="text-[10px] text-slate-400 ml-1.5 font-mono">
                                  ({attr.attributeCode})
                                </span>
                              </div>
                              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                {displayVal}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Chưa có thuộc tính nào được đưa về chuẩn của sàn.
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 mt-2">
                      Đã được làm sạch và quy đổi về từ điển chuẩn để người mua dễ dàng lọc và so sánh.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
