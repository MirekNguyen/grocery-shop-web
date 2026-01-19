import { useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getCategories,
  getProductBySlug,
  getProductsByCategory,
} from "./api";
import { StoreType } from "@/types";

export const useProducts = (params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  inPromotion?: boolean;
  store?: StoreType;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
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
  params?: { page?: number; limit?: number; store?: StoreType }
) => {
  return useQuery({
    queryKey: ["products-by-category", slug, params],
    queryFn: () => getProductsByCategory(slug, params),
    enabled: !!slug,
  });
};