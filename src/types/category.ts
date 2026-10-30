export interface CategoryNode {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  children: CategoryNode[];
}

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  parentId?: number | null;
  description?: string;
  isActive: boolean;
}
