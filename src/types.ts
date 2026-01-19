export interface Product {
  id: number;
  name: string;
  slug: string;
  categorySlug: string;
  category: string;
  
  // Pricing
  price: number; // Current price in cents
  regularPrice?: number; // Regular price if discounted
  pricePerUnit?: number; // Price per base unit in cents
  unitPrice?: number; // Legacy field, kept for compatibility if needed
  
  // Base Unit Fields
  baseUnitShort: string | null;     // "kg", "l", "ks"
  baseUnitLong: string | null;      // "Kilogram", "Liter", "Kus"
  
  // Product details
  amount: string;
  volumeLabelShort: string | null;
  volumeLabelLong: string | null;
  packageLabel: string | null;
  
  // Descriptions
  descriptionShort: string | null;
  descriptionLong: string | null;
  brand: string | null;
  regulatedProductName: string | null;
  productMarketing: string | null;
  
  // Status
  inPromotion: boolean;
  published: boolean;
  
  // Media
  images: string[];
  
  // Identifiers
  sku: string;
  
  // Store
  store?: "BILLA" | "FOODORA";
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface CategoryWithCount extends Category {}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type ProductWithCategories = Product;

export type PaginatedProductResponse = PaginatedResponse<ProductWithCategories>;

export type StoreType = "BILLA" | "FOODORA" | null;