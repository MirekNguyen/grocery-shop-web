import { useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CategoryItemProps {
  category: CategoryWithCount;
  isActive: (slug: string) => boolean;
  level?: number;
}

const CategoryItem = ({ category, isActive, level = 0 }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const active = isActive(category.slug);
  
  // Automatically expand if a child is active
  const isChildActive = useMemo(() => {
    if (!hasSubcategories) return false;
    const findActive = (cats: CategoryWithCount[]): boolean => {
        return cats.some(c => isActive(c.slug) || (c.subcategories && findActive(c.subcategories)));
    };
    return findActive(category.subcategories!);
  }, [category, hasSubcategories, isActive]);

  // Sync expansion state with active children on mount/update
  useMemo(() => {
      if (isChildActive) setIsExpanded(true);
  }, [isChildActive]);

  return (
    <div className="w-full">
      <div className={cn("flex items-center w-full group", level > 0 && "ml-3 border-l pl-2")}>
        <Link 
            to={`/?category=${category.slug}`}
            className="flex-1 min-w-0"
        >
            <Button
                variant={active ? "secondary" : "ghost"}
                className={cn(
                    "w-full justify-start font-normal h-auto py-2",
                    active && "bg-muted font-medium",
                    level > 0 && "text-sm"
                )}
                title={category.name}
            >
                <span className="truncate text-left flex-1 break-words whitespace-normal leading-tight">
                    {category.name}
                </span>
                <span className="ml-2 text-xs text-muted-foreground shrink-0 tabular-nums">
                    {category.productCount}
                </span>
            </Button>
        </Link>
        
        {hasSubcategories && (
             <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 ml-1 hover:bg-muted"
                onClick={(e) => {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                }}
             >
                 {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
             </Button>
        )}
      </div>

      {hasSubcategories && isExpanded && (
        <div className="mt-1 space-y-1">
          {category.subcategories!.map((sub) => (
            <CategoryItem 
                key={`${sub.store}-${sub.id}`} 
                category={sub} 
                isActive={isActive} 
                level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const CategorySidebar = () => {
  const { selectedStore } = useStore();
  const { data: categoriesData, isLoading } = useCategories(selectedStore);
  const [searchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  const categories = useMemo(() => {
    if (!categoriesData) return [];

    if (selectedStore && categoriesData[selectedStore]) {
      return categoriesData[selectedStore];
    }

    // Fallback: If no store selected, we show root categories from all stores.
    // Note: This might be huge list if not careful, but consistent with previous behavior.
    return Object.values(categoriesData)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData, selectedStore]);

  const isActive = (slug: string) => activeCategorySlug === slug;

  if (isLoading) {
    return (
      <div className="pb-12 w-64 hidden lg:block border-r min-h-[calc(100vh-4rem)] bg-background">
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
    <div className="pb-12 w-64 hidden lg:block border-r min-h-[calc(100vh-4rem)] bg-background">
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
                    variant={!activeCategorySlug ? "secondary" : "ghost"} 
                    className="w-full justify-start font-normal mb-2"
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
                <CategoryItem 
                    key={`${category.store}-${category.id}`} 
                    category={category} 
                    isActive={isActive} 
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};