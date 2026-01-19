import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { ProductCard } from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface StoreViewProps {
  searchQuery?: string;
}

export const StoreView = ({ searchQuery }: StoreViewProps) => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category");
  const { selectedStore } = useStore();

  const { data, isLoading, isError, refetch } = useProducts({
    store: selectedStore,
    category: categorySlug || undefined,
    search: searchQuery,
    limit: 50
  });

  // Re-fetch when filters change
  useEffect(() => {
    refetch();
  }, [selectedStore, categorySlug, searchQuery, refetch]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
        <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
            <p className="text-muted-foreground">Nepodařilo se načíst produkty.</p>
            <Button onClick={() => refetch()} variant="outline">Zkusit znovu</Button>
        </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2 text-center">
        <h2 className="text-xl font-semibold">Žádné produkty nenalezeny</h2>
        <p className="text-muted-foreground">
            {searchQuery 
                ? `Pro výraz "${searchQuery}" jsme nic nenašli.` 
                : "V této kategorii momentálně nejsou žádné produkty."}
        </p>
        {selectedStore && (
            <p className="text-sm text-muted-foreground">Zkuste změnit obchod nebo kategorii.</p>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
            {categorySlug ? "Kategorie" : (searchQuery ? `Výsledky hledání: "${searchQuery}"` : "Doporučené produkty")}
        </h1>
        <span className="text-muted-foreground text-sm">
            Nalezeno {data.pagination?.total || data.data.length} produktů
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {data.data.map((product) => (
          <ProductCard key={`${product.store}-${product.id}`} product={product} />
        ))}
      </div>
      
      {/* Simple pagination load more could go here */}
    </div>
  );
};