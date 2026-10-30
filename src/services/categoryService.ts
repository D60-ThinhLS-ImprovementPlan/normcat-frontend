import api from './api';
import type { ApiResponse } from '../types/api';
import type { CategoryNode } from '../types/category';

export const categoryService = {
  async getCategoryTree(): Promise<CategoryNode[]> {
    const response = await api.get<ApiResponse<CategoryNode[]>>('/categories/tree');
    return response.data.data;
  },
};
