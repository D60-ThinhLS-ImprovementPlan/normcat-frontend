export interface ProductSearchItem {
  id: number;
  sku: string;
  name: string;
  price: number;
  categoryName: string;
  normalizedAttributes: Record<string, string>;
}

export interface NormalizedProductAttributeResponse {
  attributeId: number;
  attributeCode: string;
  attributeName: string;
  dataType?: string;
  attributeValueId: number;
  attributeValueCode?: string;
  attributeDisplayValue?: string;
  canonicalValue?: string;
}

export interface ProductDetail {
  id: number;
  sku: string;
  name: string;
  categoryId: number;
  categoryName: string;
  price: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  normalizationStatus: 'NORMALIZED' | 'PARTIALLY_NORMALIZED' | 'FAILED';
  version: number;
  rawAttributes: Record<string, any>;
  normalizedAttributes: NormalizedProductAttributeResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface IngestProductRequest {
  sku: string;
  name: string;
  categoryId: number;
  price: number;
  rawAttributes: Record<string, any>;
}

export interface SearchCriteria {
  keyword?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  attrs?: Record<string, string>;
  page?: number;
  size?: number;
  sort?: string;
}
