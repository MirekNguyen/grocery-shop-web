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
  
  // Base Unit Fields (New)
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
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

// Adding the missing interface that was requested
export interface CategoryWithCount extends Category {
  // Category already has productCount, but if the API expects a separate type, 
  // we can extend it here. If productCount is the only difference and it's 
  // already on Category, this is just an alias or extension.
  // Based on the error, it seems this type was expected but missing.
}

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

// Adding the missing alias
export type PaginatedProductResponse = PaginatedResponse<ProductWithCategories>;