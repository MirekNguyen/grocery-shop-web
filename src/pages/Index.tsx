import { useState, useEffect } from "react";
import { useCategories, useProducts } from "@/lib/queries";
import { ProductList } from "@/components/ProductList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  
  // URL state management could be added here (useSearchParams), but keeping it local for now
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 24;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategorySlug]);

  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  
  const { 
    data: productsData, 
    isLoading: isLoadingProducts, 
    isFetching: isFetchingProducts,
    isError
  } = useProducts({
    category: selectedCategorySlug,
    search: debouncedSearch || undefined,
    page,
    limit,
  });

  const products = productsData?.data || [];
  const pagination = productsData?.pagination;
  const totalProducts = pagination?.total || 0;

  const handleCategorySelect = (slug: string | undefined) => {
    if (selectedCategorySlug === slug) {
        setSelectedCategorySlug(undefined);
    } else {
        setSelectedCategorySlug(slug);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary cursor-pointer" onClick={() => {
                setSelectedCategorySlug(undefined);
                setSearchQuery("");
            }}>
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                    G
                </div>
                Grocer<span className="text-primary/70">App</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Hledat produkty..." 
                    className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

             <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="md:hidden">
                     <Search className="h-5 w-5" />
                 </Button>
                 <Button variant="outline" size="sm" className="hidden md:flex">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtry
                 </Button>
                 <div className="h-8 w-px bg-border mx-2" />
                 <Button size="sm">Košík (0)</Button>
             </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8 space-y-8">
        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Hledat produkty..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Categories Scroller */}
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Kategorie</h2>
            </div>
            
            {isLoadingCategories ? (
                <div className="flex gap-2 overflow-hidden pb-4">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="h-9 w-24 bg-muted animate-pulse rounded-full shrink-0" />
                    ))}
                </div>
            ) : (
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-fade-right">
                    <Button 
                        variant={selectedCategorySlug === undefined ? "default" : "outline"}
                        onClick={() => handleCategorySelect(undefined)}
                        className="rounded-full shadow-sm whitespace-nowrap"
                    >
                        Vše
                    </Button>
                    {categoriesData?.map((category) => (
                        <Button
                            key={category.id}
                            variant={selectedCategorySlug === category.slug ? "default" : "outline"}
                            onClick={() => handleCategorySelect(category.slug)}
                            className={cn(
                                "rounded-full shadow-sm whitespace-nowrap border-muted-foreground/20",
                                selectedCategorySlug === category.slug && "bg-primary text-primary-foreground"
                            )}
                        >
                            {category.name}
                            <span className="ml-2 text-xs opacity-70">({category.productCount})</span>
                        </Button>
                    ))}
                </div>
            )}
        </section>

        {/* Product Grid */}
        <section className="space-y-4 min-h-[50vh]">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                    {selectedCategorySlug 
                        ? categoriesData?.find(c => c.slug === selectedCategorySlug)?.name 
                        : "Všechny produkty"}
                    
                    {!isLoadingProducts && (
                        <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground text-xs align-middle">
                            {totalProducts}
                        </Badge>
                    )}
                </h2>
                {isFetchingProducts && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
             </div>
             
             {isError ? (
                 <div className="text-center py-20 text-destructive">
                     Chyba při načítání produktů. Zkontrolujte připojení k API.
                 </div>
             ) : isLoadingProducts ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {[1,2,3,4,5,6,7,8].map(i => (
                         <div key={i} className="h-[400px] bg-muted animate-pulse rounded-lg" />
                     ))}
                 </div>
             ) : (
                 <>
                    <ProductList products={products} />
                    
                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-8 py-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1 || isFetchingProducts}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium mx-2">
                                Strana {page} z {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages || isFetchingProducts}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                 </>
             )}
        </section>
      </main>

      <footer className="border-t bg-white py-12 mt-12">
        <div className="container px-4 text-center text-muted-foreground text-sm">
             <p className="mb-4">&copy; 2024 GrocerApp. Premium Grocery Experience.</p>
             <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;