import api from './api';
import type { ApiResponse, PageResponse } from '../types/api';
import type { ProductSearchItem, SearchCriteria } from '../types/product';

export const searchService = {
  async searchProducts(criteria: SearchCriteria): Promise<PageResponse<ProductSearchItem>> {
    const params: Record<string, any> = {
      page: criteria.page ?? 0,
      size: criteria.size ?? 12,
      sort: criteria.sort ?? 'createdAt,desc',
    };

    if (criteria.keyword && criteria.keyword.trim().length > 0) {
      params.keyword = criteria.keyword.trim();
    }
    if (criteria.categorySlug && criteria.categorySlug.trim().length > 0) {
      params.categorySlug = criteria.categorySlug.trim();
    }
    if (criteria.minPrice !== undefined && criteria.minPrice !== null) {
      params.minPrice = criteria.minPrice;
    }
    if (criteria.maxPrice !== undefined && criteria.maxPrice !== null) {
      params.maxPrice = criteria.maxPrice;
    }
    if (criteria.attrs) {
      Object.entries(criteria.attrs).forEach(([attrCode, value]) => {
        if (value && value.trim().length > 0) {
          params[`attrs[${attrCode}]`] = value.trim();
        }
      });
    }

    const response = await api.get<ApiResponse<PageResponse<ProductSearchItem>>>('/search/products', {
      params,
    });
    return response.data.data;
  },
};
