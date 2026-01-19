import { useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const CategorySidebar = () => {
  const { selectedStore } = useStore();
  const { data: categoriesData, isLoading } = useCategories(selectedStore);
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const categories = useMemo(() => {
    if (!categoriesData) return [];

    if (selectedStore) {
      // Strictly return categories for the selected store
      return categoriesData[selectedStore] || [];
    }

    // If no store is selected, show all categories flattened
    return Object.values(categoriesData)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData, selectedStore]);

  if (isLoading) {
    return (
      <div className="pb-12 w-64 hidden lg:block border-r min-h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Kategorie</h2>
            <div className="space-y-1 px-2">
                {Array.from({ length: 15 }).map((_, i) => (
                    <Skeleton key={i} className="h-9 w-full" />
                ))}
            </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 w-64 hidden lg:block border-r min-h-[calc(100vh-4rem)]">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Kategorie
            {selectedStore && (
                <span className="text-xs font-normal text-muted-foreground ml-2">
                    ({categories.length})
                </span>
            )}
          </h2>
          <ScrollArea className="h-[calc(100vh-10rem)] px-1">
            <div className="space-y-1 p-2">
               <Link to="/">
                <Button 
                    variant={!activeCategory ? "secondary" : "ghost"} 
                    className="w-full justify-start font-normal"
                >
                    Všechny produkty
                </Button>
              </Link>
              
              {categories.length === 0 && selectedStore && (
                  <div className="px-4 py-4 text-sm text-muted-foreground text-center">
                      Žádné kategorie pro tento obchod.
                  </div>
              )}

              {categories.map((category) => (
                <Link 
                    key={`${category.store}-${category.id}`} 
                    to={`/?category=${category.slug}`}
                >
                    <Button
                    variant={activeCategory === category.slug ? "secondary" : "ghost"}
                    className={cn(
                        "w-full justify-start font-normal truncate",
                        activeCategory === category.slug && "bg-muted font-medium"
                    )}
                    title={category.name}
                    >
                    <span className="truncate flex-1 text-left">{category.name}</span>
                    <span className="ml-2 text-xs text-muted-foreground shrink-0">{category.productCount}</span>
                    </Button>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};