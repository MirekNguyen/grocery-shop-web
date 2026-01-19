import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts, useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { ProductList } from "@/components/ProductList";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { CategoryWithCount } from "@/types";

interface StoreViewProps {
  searchQuery: string;
}

export const StoreView = ({ searchQuery }: StoreViewProps) => {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const { selectedStore } = useStore();
  const topRef = useRef<HTMLDivElement>(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 24;

  // Reset page when filters change (category, search, or store)
  useEffect(() => {
    setPage(1);
  }, [categorySlug, searchQuery, selectedStore]);

  // Scroll to top when page changes
  useEffect(() => {
    if (page > 1) {
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  const { 
    data: productsData, 
    isLoading, 
    isFetching,
    isError 
  } = useProducts({
    category: categorySlug,
    search: searchQuery,
    page,
    limit,
    store: selectedStore,
  });

  // Fetch categories to resolve slug to name
  const { data: categoriesData } = useCategories(selectedStore);

  const categoryName = useMemo(() => {
    if (!categorySlug || !categoriesData) return undefined;
    
    const findCategory = (categories: CategoryWithCount[]): string | undefined => {
        for (const cat of categories) {
            if (cat.slug === categorySlug) return cat.name;
            if (cat.subcategories) {
                const found = findCategory(cat.subcategories);
                if (found) return found;
            }
        }
        return undefined;
    };

    return findCategory(Object.values(categoriesData).flat());
  }, [categoriesData, categorySlug]);

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;
  const totalProducts = pagination?.total || 0;

  const handlePageChange = (newPage: number) => {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container py-6 space-y-8 min-h-[calc(100vh-4rem)]" ref={topRef}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                {searchQuery ? `Výsledky pro "${searchQuery}"` : 
                 categorySlug ? (categoryName || "Produkty v kategorii") : 
                 "Všechny produkty"}
                
                {!isLoading && (
                    <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground text-sm font-normal">
                        {totalProducts}
                    </Badge>
                )}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
                {selectedStore ? (selectedStore === 'BILLA' ? 'Billa' : 'Foodora Market') : 'Všechny obchody'}
            </p>
        </div>

        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden md:flex">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Seřadit
            </Button>
        </div>
      </div>

      {/* Content Section */}
      {isError ? (
         <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="text-destructive font-medium">Chyba při načítání produktů</div>
             <p className="text-muted-foreground">Zkontrolujte připojení k internetu a zkuste to znovu.</p>
             <Button variant="outline" onClick={() => window.location.reload()}>Zkusit znovu</Button>
         </div>
      ) : isLoading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {Array.from({ length: 12 }).map((_, i) => (
                 <div key={i} className="h-[380px] bg-muted/50 animate-pulse rounded-xl" />
             ))}
         </div>
      ) : products.length === 0 ? (
         <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
             <h3 className="text-lg font-medium">Nebyly nalezeny žádné produkty</h3>
             <p className="text-muted-foreground mt-1">Zkuste změnit filtry nebo hledaný výraz.</p>
             {categorySlug && (
                 <Button variant="link" onClick={() => window.location.href = '/'}>
                     Zobrazit všechny produkty
                 </Button>
             )}
         </div>
      ) : (
         <>
            <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                <ProductList products={products} />
            </div>
            
            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 py-6 border-t">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.max(1, page - 1))}
                        disabled={page === 1 || isFetching}
                        className="h-10 w-10"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Předchozí strana</span>
                    </Button>
                    
                    <div className="flex items-center gap-1 mx-2 text-sm font-medium">
                        <span className="text-muted-foreground">Strana</span>
                        <span className="text-foreground min-w-[1.5rem] text-center">{page}</span>
                        <span className="text-muted-foreground">z</span>
                        <span className="text-foreground min-w-[1.5rem] text-center">{pagination.totalPages}</span>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
                        disabled={page === pagination.totalPages || isFetching}
                        className="h-10 w-10"
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Další strana</span>
                    </Button>
                </div>
            )}

            {isFetching && products.length > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur shadow-lg border rounded-full px-4 py-2 flex items-center gap-2 z-50">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-xs font-medium">Načítání...</span>
                </div>
            )}
         </>
      )}
    </div>
  );
};