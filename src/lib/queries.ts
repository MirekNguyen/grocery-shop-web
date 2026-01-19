import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts, getProductBySlug, getStores } from "./api";
import { CategoryWithCount } from "@/types";

export const useStores = () => {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const useCategories = (store?: string | null) => {
  // We need products to calculate accurate counts if the API doesn't provide them
  const productsQuery = useQuery({
    queryKey: ["products-for-counts", store],
    queryFn: () => getProducts({ store, limit: 1000 }), // Fetch enough to count
    staleTime: 1000 * 60 * 5,
  });

  return useQuery({
    queryKey: ["categories", store],
    queryFn: async () => {
      const categoriesData = await getCategories(store);
      
      // If we have products, let's recalculate/fill in the counts
      if (productsQuery.data?.data) {
        const products = productsQuery.data.data;
        
        // Helper to count products for a category slug
        const countProductsForCategory = (slug: string) => {
          return products.filter(p => 
            p.categorySlug === slug || 
            p.categories?.some(c => c.slug === slug)
          ).length;
        };

        // Recursively update counts
        const updateCounts = (cats: CategoryWithCount[]): CategoryWithCount[] => {
          return cats.map(cat => {
            const realCount = countProductsForCategory(cat.slug);
            return {
              ...cat,
              productCount: realCount || cat.productCount || 0, // Prefer real count, fallback to API, then 0
              subcategories: cat.subcategories ? updateCounts(cat.subcategories) : undefined
            };
          });
        };

        // Handle the record structure (Record<string, CategoryWithCount[]>)
        const updatedCategories: Record<string, CategoryWithCount[]> = {};
        Object.keys(categoriesData).forEach(storeKey => {
            updatedCategories[storeKey] = updateCounts(categoriesData[storeKey]);
        });
        
        return updatedCategories;
      }

      return categoriesData;
    },
    enabled: !productsQuery.isLoading, // Wait for products
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