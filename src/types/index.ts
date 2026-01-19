export interface Category {
  id: number;
  key: string;
  name: string;
  slug: string;
  orderHint: string | null;
  productCount?: number;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
  store?: string;
  parentId?: number | null;
}

export interface CategoryWithCount extends Category {
  productCount: number;
  subcategories?: CategoryWithCount[];
}

export type CategoriesResponse = Record<string, CategoryWithCount[]>;

export interface Product {
  id: number;
  productId: string;
  sku: string;
  slug: string;
  name: string;
  descriptionShort: string | null;
  descriptionLong: string | null;
  regulatedProductName: string | null;
  
  // Category info
  category: string;
  categorySlug: string;
  
  // Brand info
  brand: string | null;
  brandSlug: string | null;
  
  // Pricing
  price: number | null; // Cents
  pricePerUnit: number | null; // Cents
  unitPrice: number | null; // Decimal (legacy/display)
  regularPrice: number | null; // Cents
  discountPrice: number | null; // Cents
  lowestPrice: number | null; // Cents
  
  // Status & Properties
  inPromotion: boolean;
  published: boolean;
  medical?: boolean;
  weightArticle?: boolean;
  
  // Measurements
  amount: string;
  weight?: number | null;
  packageLabel: string | null;
  packageLabelKey?: string | null;
  volumeLabelKey?: string | null;
  volumeLabelShort: string | null;
  baseUnitShort?: string | null;
  baseUnitLong?: string | null;
  
  // Content
  images: string[];
  productMarketing: string | null;
  brandMarketing: string | null;
  
  // Metadata
  scrapedAt: string | Date | null;
  updatedAt: string | Date | null;
  
  // Store info
  store?: string;
}

export interface ProductWithCategories extends Product {
  categories?: Category[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedProductResponse {
  data: ProductWithCategories[];
  pagination: Pagination;
}

export interface StoreInfo {
  store: string;
  count: number;
}