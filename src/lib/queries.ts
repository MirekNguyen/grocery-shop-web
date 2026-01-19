import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getCategories,
  getProductBySlug,
  getProductsByCategory,
  getStores,
} from "./api";

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });
};

export const useProducts = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  inPromotion?: boolean;
  store?: string | null;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useCategories = (store?: string | null) => {
  return useQuery({
    queryKey: ["categories", store],
    queryFn: () => getCategories(store),
  });
};

export const useProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
  });
};

export const useProductsByCategory = (
  slug: string,
  params?: { page?: number; limit?: number; store?: string | null }
) => {
  return useQuery({
    queryKey: ["products-by-category", slug, params],
    queryFn: () => getProductsByCategory(slug, params),
    enabled: !!slug,
  });
};