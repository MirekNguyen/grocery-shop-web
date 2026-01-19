import { useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";

interface CategoryItemProps {
  category: CategoryWithCount;
  isActive: (slug: string) => boolean;
  level?: number;
  onSelect?: () => void;
}

const CategoryItem = ({ category, isActive, level = 0, onSelect }: CategoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const active = isActive(category.slug);
  
  const shouldAutoExpand = useMemo(() => {
    if (active && hasSubcategories) return true;
    if (!hasSubcategories) return false;
    
    const findActive = (cats: CategoryWithCount[]): boolean => {
        return cats.some(c => isActive(c.slug) || (c.subcategories && findActive(c.subcategories)));
    };
    return findActive(category.subcategories!);
  }, [category, hasSubcategories, isActive, active]);

  useEffect(() => {
      if (shouldAutoExpand) {
          setIsExpanded(true);
      }
  }, [shouldAutoExpand]);

  const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
      if (onSelect) onSelect();
      if (active && hasSubcategories) {
          e.preventDefault(); 
          setIsExpanded(prev => !prev);
      }
  };

  return (
    <div className="w-full text-sm">
      <div 
        className={cn(
            "flex items-center w-full group relative rounded-md transition-colors min-h-[32px]",
            active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            level > 0 && "mt-0.5"
        )}
      >
        <Link 
            to={`/?category=${category.slug}`}
            onClick={handleLinkClick}
            className={cn(
                "flex-1 flex items-center min-w-0 py-1.5 pr-2 select-none cursor-pointer",
            )}
            style={{ paddingLeft: level === 0 ? '0.75rem' : `${(level * 0.75) + 0.75}rem` }}
            title={category.name}
        >
            <span className="truncate flex-1">
                {category.name}
            </span>
            
            <span className={cn(
                "ml-2 text-[10px] tabular-nums opacity-60",
                active ? "opacity-100" : "group-hover:opacity-100"
            )}>
                {category.productCount}
            </span>
        </Link>
        
        {hasSubcategories && (
             <div
                role="button"
                className={cn(
                    "h-8 w-8 flex items-center justify-center shrink-0 cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/5",
                    active ? "text-accent-foreground" : "text-muted-foreground"
                )}
                onClick={handleToggle}
             >
                 {isExpanded ? 
                    <ChevronDown className="h-3.5 w-3.5" /> : 
                    <ChevronRight className="h-3.5 w-3.5" />
                 }
             </div>
        )}
      </div>

      {hasSubcategories && isExpanded && (
        <div className="animate-in slide-in-from-top-1 duration-200 fade-in-0">
            {category.subcategories!.map((sub) => (
                <CategoryItem 
                    key={`${sub.store}-${sub.id}`} 
                    category={sub} 
                    isActive={isActive} 
                    level={level + 1} 
                    onSelect={onSelect}
                />
            ))}
        </div>
      )}
    </div>
  );
};

interface CategorySidebarProps {
  className?: string;
  onSelect?: () => void;
}

export const CategorySidebar = ({ className, onSelect }: CategorySidebarProps) => {
  const { selectedStore } = useStore();
  const { data: categoriesData, isLoading } = useCategories(selectedStore);
  const [searchParams] = useSearchParams();
  const activeCategorySlug = searchParams.get("category");

  // If no store is selected, we don't show the sidebar at all
  if (!selectedStore) {
      return null;
  }

  const categories = useMemo(() => {
    if (!categoriesData) return [];

    if (categoriesData[selectedStore]) {
      return categoriesData[selectedStore];
    }
    return [];
  }, [categoriesData, selectedStore]);

  const isActive = useCallback((slug: string) => {
      return activeCategorySlug === slug;
  }, [activeCategorySlug]);

  if (isLoading) {
    return (
      <div className={cn("bg-background", className)}>
        <div className="space-y-4 py-4">
            <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Kategorie</h2>
            <div className="space-y-2 px-2">
                {Array.from({ length: 15 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-md" />
                ))}
            </div>
            </div>
        </div>
      </div>
    );
  }

  const isAllProductsActive = !activeCategorySlug;

  return (
    <div className={cn("bg-background flex flex-col h-full border-r", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight">
             Kategorie
          </h2>
          <ScrollArea className="h-[calc(100vh-10rem)] px-1">
            <div className="space-y-1 pb-10 pr-2">
               {/* "All Products" Link styled exactly like a Category Item */}
               <div className="w-full text-sm">
                  <div 
                    className={cn(
                        "flex items-center w-full group relative rounded-md transition-colors min-h-[32px]",
                        isAllProductsActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <Link 
                        to="/"
                        onClick={onSelect}
                        className="flex-1 flex items-center min-w-0 py-1.5 pr-2 pl-3 select-none cursor-pointer"
                        title="Všechny produkty"
                    >
                        <LayoutGrid className="mr-2 h-4 w-4 opacity-70" />
                        <span className="truncate flex-1">
                            Všechny produkty
                        </span>
                    </Link>
                  </div>
               </div>

                {categories.length === 0 && (
                    <div className="px-4 py-8 text-sm text-muted-foreground text-center border border-dashed rounded-lg bg-muted/20 mt-2">
                        Žádné kategorie
                    </div>
                )}

                <div className="mt-2">
                    {categories.map((category) => (
                    <CategoryItem 
                        key={`${category.store}-${category.id}`} 
                        category={category} 
                        isActive={isActive} 
                        onSelect={onSelect}
                    />
                    ))}
                </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};