import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts, getProductBySlug, getStores } from "./api";

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useCategories = (store?: string | null) => {
  return useQuery({
    queryKey: ["categories", store],
    queryFn: () => getCategories(store),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    placeholderData: (previousData) => previousData,
  });
};

export const useProduct = (slug?: string) => {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });
};