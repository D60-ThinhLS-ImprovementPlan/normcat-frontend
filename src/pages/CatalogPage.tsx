import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, RefreshCw, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { CategoryFilter } from '../components/CategoryFilter';
import { PriceFilter } from '../components/PriceFilter';
import { AttributeFacets } from '../components/AttributeFacets';
import { ProductCard } from '../components/ProductCard';
import { Pagination } from '../components/Pagination';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { categoryService } from '../services/categoryService';
import { searchService } from '../services/searchService';
import { productService } from '../services/productService';
import type { CategoryNode } from '../types/category';
import type { ProductSearchItem, ProductDetail, SearchCriteria } from '../types/product';
import type { PageResponse } from '../types/api';

interface CatalogPageProps {
  onBackendStatusChange?: (online: boolean) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onBackendStatusChange }) => {
  // Filters state
  const [keyword, setKeyword] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [activeAttrs, setActiveAttrs] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<string>('createdAt,desc');
  const [page, setPage] = useState<number>(0);
  const pageSize = 12;

  // Data state
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [categoryLoading, setCategoryLoading] = useState<boolean>(true);
  const [searchResult, setSearchResult] = useState<PageResponse<ProductSearchItem> | null>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  // Mobile sidebar toggle
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Fetch Categories once on mount
  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const tree = await categoryService.getCategoryTree();
        if (mounted) {
          setCategories(tree);
          onBackendStatusChange?.(true);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
        if (mounted) {
          onBackendStatusChange?.(false);
        }
      } finally {
        if (mounted) setCategoryLoading(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, [onBackendStatusChange]);

  // Execute Search query
  const executeSearch = useCallback(async () => {
    try {
      setSearchLoading(true);
      setError(null);

      const criteria: SearchCriteria = {
        keyword: keyword || undefined,
        categorySlug: selectedCategory,
        minPrice,
        maxPrice,
        attrs: activeAttrs,
        page,
        size: pageSize,
        sort,
      };

      const result = await searchService.searchProducts(criteria);
      setSearchResult(result);
      onBackendStatusChange?.(true);
    } catch (err: any) {
      console.error('Search failed', err);
      setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
      onBackendStatusChange?.(false);
    } finally {
      setSearchLoading(false);
    }
  }, [keyword, selectedCategory, minPrice, maxPrice, activeAttrs, page, sort, onBackendStatusChange]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  // Handle Search Input submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput.trim());
    setPage(0);
  };

  // Handle Category selection
  const handleCategorySelect = (slug: string | undefined) => {
    setSelectedCategory(slug);
    setPage(0);
  };

  // Handle Price range
  const handleApplyPrice = (min?: number, max?: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(0);
  };

  // Handle Facet toggle
  const handleToggleFacet = (attrCode: string, value: string) => {
    setActiveAttrs((prev) => {
      const updated = { ...prev };
      if (updated[attrCode] === value) {
        delete updated[attrCode];
      } else {
        updated[attrCode] = value;
      }
      return updated;
    });
    setPage(0);
  };

  const handleClearAllFacets = () => {
    setActiveAttrs({});
    setPage(0);
  };

  const handleClearAllFilters = () => {
    setKeyword('');
    setSearchInput('');
    setSelectedCategory(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setActiveAttrs({});
    setPage(0);
  };

  // Handle View Details modal
  const handleViewDetails = async (id: number) => {
    try {
      setDetailLoading(true);
      const detail = await productService.getProductById(id);
      setProductDetail(detail);
    } catch (err) {
      console.error('Failed to load product detail', err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseModal = () => {
    setProductDetail(null);
  };

  const hasActiveFilters =
    Boolean(keyword) ||
    Boolean(selectedCategory) ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    Object.keys(activeAttrs).length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Search Bar & Top Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên hoặc SKU (vd: Macbook, iPhone, M3, 512GB)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-11 pr-24 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-2xs"
            >
              Tìm kiếm
            </button>
          </form>

          {/* Sort & Mobile Filters toggle */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <button
              type="button"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Bộ lọc ({Object.keys(activeAttrs).length + (selectedCategory ? 1 : 0)})</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sắp xếp:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(0);
                }}
                className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="createdAt,desc">Mới nhất</option>
                <option value="price,asc">Giá: Thấp đến Cao</option>
                <option value="price,desc">Giá: Cao đến Thấp</option>
                <option value="name,asc">Tên: A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-400 font-medium">Đang lọc theo:</span>

            {keyword && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                <span>Từ khóa: "{keyword}"</span>
                <button
                  onClick={() => {
                    setKeyword('');
                    setSearchInput('');
                  }}
                  className="hover:text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium">
                <span>Danh mục: {selectedCategory}</span>
                <button onClick={() => setSelectedCategory(undefined)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {(minPrice !== undefined || maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <span>
                  Giá:{' '}
                  {minPrice ? `${(minPrice / 1000000).toFixed(0)}M` : '0'} -{' '}
                  {maxPrice ? `${(maxPrice / 1000000).toFixed(0)}M` : '∞'}
                </span>
                <button onClick={() => handleApplyPrice(undefined, undefined)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {Object.entries(activeAttrs).map(([code, val]) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-medium"
              >
                <span>
                  {code}: {val}
                </span>
                <button onClick={() => handleToggleFacet(code, val)} className="hover:text-rose-600">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleClearAllFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold underline underline-offset-2 ml-auto"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Main Content Layout: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filters */}
        <aside
          className={`space-y-4 md:block ${
            showMobileFilters ? 'block' : 'hidden'
          } col-span-1`}
        >
          <CategoryFilter
            categories={categories}
            selectedSlug={selectedCategory}
            onSelectCategory={handleCategorySelect}
            loading={categoryLoading}
          />

          <PriceFilter
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApplyPrice={handleApplyPrice}
          />

          <AttributeFacets
            activeAttrs={activeAttrs}
            onToggleFacet={handleToggleFacet}
            onClearAllFacets={handleClearAllFacets}
          />
        </aside>

        {/* Products Section */}
        <main className="md:col-span-3 space-y-4">
          {error ? (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-rose-500" />
              <h3 className="font-bold text-base">Lỗi kết nối Backend</h3>
              <p className="text-xs text-rose-600 max-w-md mx-auto">{error}</p>
              <button
                onClick={executeSearch}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          ) : searchLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-4 h-64 animate-pulse space-y-3"
                >
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-5 bg-slate-100 rounded w-4/5" />
                  <div className="h-6 bg-slate-100 rounded w-1/2" />
                  <div className="h-16 bg-slate-50 rounded" />
                </div>
              ))}
            </div>
          ) : searchResult && searchResult.content.length > 0 ? (
            <>
              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResult.content.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={searchResult.page}
                totalPages={searchResult.totalPages}
                totalElements={searchResult.totalElements}
                pageSize={searchResult.size}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy sản phẩm nào</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Không có sản phẩm nào khớp với tiêu chí lọc hiện tại. Hãy thử giảm bớt các thuộc tính lọc hoặc xóa tìm kiếm.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="px-4 py-2 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Product Detail / Dual Storage Modal */}
      <ProductDetailModal
        product={productDetail}
        loading={detailLoading}
        onClose={handleCloseModal}
      />
    </div>
  );
};
