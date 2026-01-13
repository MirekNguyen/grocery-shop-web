export interface Category {
  id: number;
  key: string;
  name: string;
  slug: string;
  orderHint: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CategoryWithCount extends Category {
  productCount: number;
}

export interface Product {
  id: number;
  productId: string;
  sku: string;
  slug: string;
  name: string;
  descriptionShort: string | null;
  descriptionLong: string | null;
  regulatedProductName: string | null;
  category: string;
  categorySlug: string;
  brand: string | null;
  brandSlug: string | null;
  price: number | null; // Cents
  pricePerUnit: number | null; // Cents
  unitPrice: number | null; // Decimal
  regularPrice: number | null; // Cents
  discountPrice: number | null; // Cents
  lowestPrice: number | null; // Cents
  inPromotion: boolean;
  amount: string;
  weight: number | null;
  packageLabel: string | null;
  packageLabelKey: string | null;
  volumeLabelKey: string | null;
  volumeLabelShort: string | null;
  images: string[];
  productMarketing: string | null;
  brandMarketing: string | null;
  published: boolean;
  medical: boolean;
  weightArticle: boolean;
  scrapedAt: string | null;
  updatedAt: string | null;
}

export interface ProductWithCategories extends Product {
  categories: Category[];
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

export interface CategoryProductsResponse {
  category: Category | null;
  data: ProductWithCategories[];
  pagination: Pagination;
}