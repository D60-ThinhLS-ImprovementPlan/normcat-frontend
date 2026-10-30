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
    title: 'MacBook Pro M3 (Đầy đủ từ đồng nghĩa)',
    desc: 'Các thuộc tính có từ đồng nghĩa tương ứng trong từ điển',
    data: {
      sku: 'MACBOOK-PRO-M3-16-512',
      name: 'Apple MacBook Pro 14 M3 16GB 512GB Space Gray',
      categoryId: 3, // Laptop
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
      categoryId: 3, // Laptop
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
    title: 'Sản phẩm mới (Có thuộc tính lạ)',
    desc: 'Thuộc tính chưa có trong từ điển để kiểm tra cơ chế phân loại',
    data: {
      sku: 'CUSTOM-PRO-TEST-01',
      name: 'Sản phẩm thử nghiệm chuẩn hóa một phần',
      categoryId: 3, // Laptop
      price: 15990000,
      rawAttributes: {
        'Bộ nhớ': '16GB',
        'Chất liệu vỏ máy': 'Hợp kim Titan siêu nhẹ',
        'Tần số quét': '165Hz ProMotion',
      },
    },
  },
];

const CATEGORY_OPTIONS = [
  { id: 3, name: 'Máy tính xách tay (Laptop)' },
  { id: 2, name: 'Điện thoại thông minh' },
  { id: 4, name: 'Thời trang & May mặc' },
  { id: 1, name: 'Điện tử & Công nghệ (Gốc)' },
];

export const NormalizationStudioPage: React.FC = () => {
  const [sku, setSku] = useState<string>(PRESETS[0].data.sku);
  const [name, setName] = useState<string>(PRESETS[0].data.name);
  const [categoryId, setCategoryId] = useState<number>(PRESETS[0].data.categoryId);
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
    setCategoryId(preset.data.categoryId);
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
        throw new Error('Dữ liệu thông số kỹ thuật không đúng định dạng. Vui lòng kiểm tra lại.');
      }

      const request: IngestProductRequest = {
        sku: sku.trim(),
        name: name.trim(),
        categoryId: Number(categoryId),
        price: Number(price),
        rawAttributes: parsedRawAttributes,
      };

      const res = await productService.ingestProduct(request);
      setResult(res);
    } catch (err: any) {
      console.error('Normalization ingestion failed', err);
      let msg = 'Có lỗi xảy ra khi gửi dữ liệu sản phẩm. Vui lòng thử lại.';
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors) && err.response.data.errors.length > 0) {
        msg = err.response.data.errors.map((e: any) => `${e.field}: ${e.message}`).join(', ');
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
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
            <span>Bộ máy Tự động Chuẩn hóa Dữ liệu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Khu vực Thử nghiệm Chuẩn hóa Sản phẩm
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
            Thử nghiệm quy trình tiếp nhận và làm sạch dữ liệu của <strong>NormCat</strong>: Khi người bán gửi thông số sản phẩm với cách viết tắt hoặc từ đồng nghĩa phong phú, hệ thống sẽ tự động đối chiếu từ điển để chuẩn hóa thuộc tính về tiêu chuẩn chung của sàn.
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
        {/* Left Column: Input Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">1. Thông tin từ Người bán / Đối tác</h3>
            </div>
            <span className="text-[11px] text-slate-400">Đăng sản phẩm mới</span>
          </div>

          <form onSubmit={handleRunNormalization} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Mã sản phẩm (SKU)</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  required
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">Danh mục sản phẩm</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
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
                  Thông số kỹ thuật thô của sản phẩm
                </label>
                <span className="text-[10px] text-slate-400">Các cách gọi tùy ý</span>
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
                  <span>Đang phân tích & chuẩn hóa thuộc tính...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Tiến hành Phân tích & Chuẩn hóa</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Execution Result */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">2. Kết quả sau khi Chuẩn hóa</h3>
            </div>
            {result && (
              <span className="text-[11px] font-mono text-slate-500">Mã: #{result.id}</span>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Không thể tiếp nhận sản phẩm:</span>
              </div>
              <p className="pl-5 text-rose-600">{error}</p>
            </div>
          )}

          {!result && !error && !loading && (
            <div className="py-16 text-center space-y-3 text-slate-400">
              <Cpu className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <div className="text-xs">
                Nhấn <strong>"Tiến hành Phân tích & Chuẩn hóa"</strong> ở bên trái để theo dõi quy trình làm sạch dữ liệu.
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
                        <span>Đã chuẩn hóa 100%</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Chuẩn hóa một phần</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Danh mục</span>
                  <span className="text-xs font-semibold text-slate-800">{result.categoryName}</span>
                </div>
              </div>

              {/* Resolution Breakdown */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Các thuộc tính đã được đưa về chuẩn của sàn:</span>
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
                        {result.normalizedAttributes.map((attr, idx) => {
                          const displayVal =
                            attr.attributeDisplayValue ||
                            attr.attributeValueCode ||
                            attr.canonicalValue ||
                            '';

                          return (
                            <tr key={idx} className="hover:bg-slate-50/60">
                              <td className="py-2 px-3 font-mono text-slate-600">{attr.attributeCode}</td>
                              <td className="py-2 px-3 font-medium text-slate-800">{attr.attributeName}</td>
                              <td className="py-2 px-3 text-right">
                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                  {displayVal}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                    Chưa có thuộc tính nào được đưa về chuẩn của sàn.
                  </div>
                )}
              </div>

              {/* Raw Snapshot */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <FileJson className="w-3.5 h-3.5 text-amber-500" />
                  <span>Dữ liệu gốc của người bán (Lưu giữ để đối soát):</span>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto max-h-36 leading-relaxed">
                  {JSON.stringify(result.rawAttributes, null, 2)}
                </pre>
              </div>

              <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 text-[11px] text-indigo-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  Sản phẩm vừa tạo đã sẵn sàng hiển thị tại trang <strong>Khám phá sản phẩm</strong> và có thể tìm kiếm theo từng thuộc tính chuẩn vừa được ánh xạ!
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
