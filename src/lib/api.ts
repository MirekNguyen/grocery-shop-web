import axios from "axios";
import {
  CategoryWithCount,
  PaginatedProductResponse,
  ProductWithCategories,
} from "@/types";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  inPromotion?: boolean;
}): Promise<PaginatedProductResponse> => {
  const { data } = await api.get("/api/products", { params });
  return data;
};

export const getCategories = async (): Promise<CategoryWithCount[]> => {
  const { data } = await api.get("/api/categories");
  return data;
};

export const getProductBySlug = async (
  slug: string
): Promise<ProductWithCategories> => {
  const { data } = await api.get(`/api/products/slug/${slug}`);
  return data;
};

export const getProductsByCategory = async (
  slug: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedProductResponse> => {
  // Note: The API endpoint structure is slightly different for category-specific products
  // /api/categories/{slug}/products
  const { data } = await api.get(`/api/categories/${slug}/products`, {
    params,
  });
  return data;
};