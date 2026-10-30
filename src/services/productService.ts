import api from './api';
import type { ApiResponse } from '../types/api';
import type { IngestProductRequest, ProductDetail } from '../types/product';

export const productService = {
  async ingestProduct(request: IngestProductRequest): Promise<ProductDetail> {
    const response = await api.post<ApiResponse<ProductDetail>>('/products', request);
    return response.data.data;
  },

  async getProductById(id: number): Promise<ProductDetail> {
    const response = await api.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    return response.data.data;
  },

  async getProductBySku(sku: string): Promise<ProductDetail> {
    const response = await api.get<ApiResponse<ProductDetail>>(`/products/sku/${sku}`);
    return response.data.data;
  },
};
