import { useState } from 'react';
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Layers,
  Database,
  FileJson,
  Info,
} from 'lucide-react';
import { productService } from '../services/productService';
import type { ProductDetail, IngestProductRequest } from '../types/product';

const PRESETS: { title: string; desc: string; data: IngestProductRequest }[] = [
  {
    title: 'MacBook Pro M3 (Đầy đủ Alias)',
    desc: 'Các thuộc tính có alias đầy đủ trong từ điển chuẩn',
    data: {
      sku: 'MACBOOK-PRO-M3-16-512',
      name: 'Apple MacBook Pro 14 M3 16GB 512GB Space Gray',
      categorySlug: 'laptop',
      price: 49990000,
      rawAttributes: {
        'Bộ nhớ RAM': '16 gig',
        'Ổ đĩa cứng': '512 GB SSD',
        'Màu sắc thân máy': 'Space Gray',
        'Kích thước màn hình': '14 inch',
      },
    },
  },
  {
    title: 'Dell XPS 13 (Thuộc tính viết tắt)',
    desc: 'Dữ liệu viết tắt thông dụng: 16G, 1TB, Black',
    data: {
      sku: 'DELL-XPS-13-16-1TB',
      name: 'Dell XPS 13 9340 Core Ultra 7 16GB 1TB',
      categorySlug: 'laptop',
      price: 42500000,
      rawAttributes: {
        'RAM': '16G',
        'Storage': '1 TB',
        'Color': 'Black',
        'Screen': '13.3 inch',
      },
    },
  },
  {
    title: 'Sản phẩm mới (Chưa có trong từ điển)',
    desc: 'Thuộc tính lạ để kiểm tra cơ chế PARTIALLY_NORMALIZED',
    data: {
      sku: 'CUSTOM-PRO-TEST-01',
      name: 'Sản phẩm thử nghiệm chuẩn hóa một phần',
      categorySlug: 'laptop',
      price: 15990000,
      rawAttributes: {
        'Bộ nhớ': '16GB',
        'Chất liệu vỏ máy': 'Hợp kim Titan siêu nhẹ',
        'Tần số quét': '165Hz ProMotion',
      },
    },
  },
];

export const NormalizationStudioPage: React.FC = () => {
  const [sku, setSku] = useState<string>(PRESETS[0].data.sku);
  const [name, setName] = useState<string>(PRESETS[0].data.name);
  const [categorySlug, setCategorySlug] = useState<string>(PRESETS[0].data.categorySlug);
  const [price, setPrice] = useState<number>(PRESETS[0].data.price);
  const [rawAttributesText, setRawAttributesText] = useState<string>(
    JSON.stringify(PRESETS[0].data.rawAttributes, null, 2)
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    setSku(`${preset.data.sku}-${Math.floor(100 + Math.random() * 900)}`);
    setName(preset.data.name);
    setCategorySlug(preset.data.categorySlug);
    setPrice(preset.data.price);
    setRawAttributesText(JSON.stringify(preset.data.rawAttributes, null, 2));
    setResult(null);
    setError(null);
  };

  const handleRunNormalization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      let parsedRawAttributes: Record<string, any>;
      try {
        parsedRawAttributes = JSON.parse(rawAttributesText);
      } catch (jsonErr) {
        throw new Error('Dữ liệu JSON thuộc tính thô không hợp lệ. Vui lòng kiểm tra lại cú pháp.');
      }

      const request: IngestProductRequest = {
        sku: sku.trim(),
        name: name.trim(),
        categorySlug: categorySlug.trim(),
        price: Number(price),
        rawAttributes: parsedRawAttributes,
      };

      const res = await productService.ingestProduct(request);
      setResult(res);
    } catch (err: any) {
      console.error('Normalization ingestion failed', err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Có lỗi xảy ra khi gọi API Ingestion. Vui lòng kiểm tra lại backend.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Introduction */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
            <Cpu className="w-3.5 h-3.5" />
            <span>Deterministic 2-Phase Resolution Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Normalization Studio & Ingestion Simulator
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Thử nghiệm trực tiếp luồng Ingestion của <strong>NormCat</strong>: Nhập dữ liệu thô với các alias phong phú.
            Bộ máy chuẩn hóa 2 pha (Key & Value Resolution) sẽ tự động làm sạch và ánh xạ vào cơ sở dữ liệu quan hệ với cơ chế lưu trữ kép.
          </p>
        </div>
      </div>

      {/* Preset Quick Chooser */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Chọn dữ liệu mẫu thử nghiệm nhanh:
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {preset.title}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{preset.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form vs Output Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Ingestion Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">1. Dữ liệu đầu vào từ Vendor / Crawler</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">POST /api/v1/products</span>
          </div>

          <form onSubmit={handleRunNormalization} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Mã SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Danh mục Slug</label>
                <input
                  type="text"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  required
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Tên sản phẩm</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700 block mb-1">Giá bán niêm yết (VNĐ)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">
                  Thuộc tính thô dạng JSON (`raw_attributes`)
                </label>
                <span className="text-[10px] text-slate-400">JSONB Key-Value</span>
              </div>
              <textarea
                rows={7}
                value={rawAttributesText}
                onChange={(e) => setRawAttributesText(e.target.value)}
                required
                className="w-full font-mono text-xs p-3 rounded-lg border border-slate-200 bg-slate-900 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý Normalization Engine...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Kích hoạt Chuẩn hóa & Lưu trữ kép</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Execution Result & Dual-Storage Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">2. Kết quả từ Database sau Chuẩn hóa</h3>
            </div>
            {result && (
              <span className="text-[11px] font-mono text-slate-500">ID: #{result.id}</span>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Lỗi Ingestion:</span>
              </div>
              <p className="pl-5 text-rose-600">{error}</p>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <Cpu className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <div className="text-xs">
                Nhấn <strong>"Kích hoạt Chuẩn hóa"</strong> ở bên trái để theo dõi luồng giải quyết thuộc tính 2 pha.
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Status Header */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Trạng thái chuẩn hóa</span>
                  <div className="mt-1">
                    {result.normalizationStatus === 'NORMALIZED' ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>NORMALIZED (100% Thuộc tính khớp)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>{result.normalizationStatus} (Một phần)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Optimistic Version</span>
                  <span className="text-xs font-mono font-bold text-slate-800">v{result.version}</span>
                </div>
              </div>

              {/* 2-Phase Resolution Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Chi tiết ánh xạ bảng quan hệ (`product_attribute_values`):</span>
                </div>

                {result.normalizedAttributes && result.normalizedAttributes.length > 0 ? (
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
                        <tr>
                          <th className="py-2 px-3 font-semibold">Mã thuộc tính</th>
                          <th className="py-2 px-3 font-semibold">Tên thuộc tính</th>
                          <th className="py-2 px-3 font-semibold text-right">Giá trị chuẩn hóa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.normalizedAttributes.map((attr, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2 px-3 font-mono text-slate-600">{attr.attributeCode}</td>
                            <td className="py-2 px-3 font-medium text-slate-800">{attr.attributeName}</td>
                            <td className="py-2 px-3 text-right">
                              <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                {attr.canonicalValue}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    Chưa có thuộc tính nào được ánh xạ vào bảng quan hệ.
                  </div>
                )}
              </div>

              {/* Raw Snapshot in JSONB */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FileJson className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dữ liệu lưu trữ bất biến (JSONB Snapshot):</span>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-36 leading-relaxed">
                  {JSON.stringify(result.rawAttributes, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Sản phẩm vừa tạo đã sẵn sàng hiển thị tại trang <strong>Catalog & Facets</strong> và có thể tìm kiếm theo từng thuộc tính chuẩn vừa được ánh xạ!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
