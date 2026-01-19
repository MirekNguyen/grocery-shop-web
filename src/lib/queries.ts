import { useQuery } from "@tanstack/react-query";
import { PaginatedProductResponse, CategoryWithCount, Store, ProductWithCategories } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

interface UseProductsOptions {
  store?: string | null;
  category?: string | null;
  search?: string;
  page?: number;
  limit?: number;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { store, category, search, page = 1, limit = 24 } = options;
  
  return useQuery<PaginatedProductResponse>({
    queryKey: ["products", store, category, search, page, limit],
    queryFn: () => {
      const params = new URLSearchParams();
      if (store) params.append("store", store);
      if (category) params.append("category", category);
      if (search) params.append("q", search);
      if (page) params.append("page", page.toString());
      if (limit) params.append("limit", limit.toString());
      
      return fetcher(`/api/products?${params.toString()}`);
    },
  });
};

export const useCategories = (storeId?: string | null) => {
  return useQuery<Record<string, CategoryWithCount[]>>({
    queryKey: ["categories", storeId],
    queryFn: () => {
      const url = storeId ? `/api/categories?store=${storeId}` : "/api/categories";
      return fetcher(url);
    },
  });
};

export const useProduct = (slug: string | undefined) => {
  return useQuery<ProductWithCategories>({
    queryKey: ["product", slug],
    queryFn: () => fetcher(`/api/products/slug/${slug}`),
    enabled: !!slug,
  });
};

export const useStores = () => {
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: () => fetcher("/api/stores"),
  });
};