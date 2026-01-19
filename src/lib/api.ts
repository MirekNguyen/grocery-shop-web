import axios from "axios";
import {
  CategoriesResponse,
  PaginatedProductResponse,
  ProductWithCategories,
  StoreInfo,
} from "@/types";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStores = async (): Promise<StoreInfo[]> => {
  const { data } = await api.get("/api/stores");
  return data;
};

export const getProducts = async (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  inPromotion?: boolean;
  store?: string | null;
}): Promise<PaginatedProductResponse> => {
  const { data } = await api.get("/api/products", { params });
  return data;
};

export const getCategories = async (store?: string | null): Promise<CategoriesResponse> => {
  const params = store ? { store } : {};
  const { data } = await api.get("/api/categories", { params });
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
  params?: { page?: number; limit?: number; store?: string | null }
): Promise<PaginatedProductResponse> => {
  const { data } = await api.get(`/api/categories/${slug}/products`, {
    params,
  });
  return data;
};