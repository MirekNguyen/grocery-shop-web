import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCategories, getProducts, getProductsByCategory } from "./api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};

export const useProducts = (params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  inPromotion?: boolean;
}) => {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => {
      // If a category slug is provided, we can use the specific endpoint or the general one.
      // The general endpoint supports filtering by category slug via query param.
      // Based on the spec, /api/products?category=slug works.
      return getProducts(params);
    },
    placeholderData: keepPreviousData,
  });
};

export const useCategoryProducts = (
  slug: string,
  params: { page?: number; limit?: number } = {}
) => {
  return useQuery({
    queryKey: ["category-products", slug, params],
    queryFn: () => getProductsByCategory(slug, params),
    enabled: !!slug,
  });
};