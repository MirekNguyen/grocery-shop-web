import { useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  
  // Check if any descendant is active
  const isChildActive = useMemo(() => {
    if (!hasSubcategories) return false;
    const findActive = (cats: CategoryWithCount[]): boolean => {
        return cats.some(c => isActive(c.slug) || (c.subcategories && findActive(c.subcategories)));
    };
    return findActive(category.subcategories!);
  }, [category, hasSubcategories, isActive]);

  // Sync expansion state with active children
  useEffect(() => {
      if (isChildActive) {
          setIsExpanded(true);
      }
  }, [isChildActive]);

  const handleToggle = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full">
      <div 
        className={cn(
            "flex items-center w-full group relative rounded-md transition-colors",
            active ? "bg-accent/50" : "hover:bg-accent/20"
        )}
      >
        {/* Indentation Line for nested items */}
        {level > 0 && (
            <div className="absolute left-[-12px] top-0 bottom-0 w-[1px] bg-border/50" />
        )}

        <Link 
            to={`/?category=${category.slug}`}
            onClick={onSelect}
            className={cn(
                "flex-1 flex items-center min-w-0 py-2 pl-2 pr-1 text-sm select-none",
                active ? "font-medium text-accent-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title={category.name}
        >
            <span className="truncate flex-1">
                {category.name}
            </span>
            <span className="ml-2 text-[10px] text-muted-foreground/60 tabular-nums bg-muted/50 px-1.5 py-0.5 rounded-full">
                {category.productCount}
            </span>
        </Link>
        
        {hasSubcategories && (
             <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 mr-1 hover:bg-background/80 active:translate-y-0.5 transition-transform"
                onClick={handleToggle}
             >
                 {isExpanded ? 
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : 
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                 }
             </Button>
        )}
      </div>

      {hasSubcategories && isExpanded && (
        <div className={cn(
            "mt-1 space-y-0.5 animate-in slide-in-from-top-2 duration-200",
            level === 0 ? "pl-2" : "pl-3 border-l ml-2" 
        )}>
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

  const categories = useMemo(() => {
    if (!categoriesData) return [];

    if (selectedStore && categoriesData[selectedStore]) {
      return categoriesData[selectedStore];
    }

    return Object.values(categoriesData)
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categoriesData, selectedStore]);

  // Memoize the isActive function to prevent unnecessary re-renders in children
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

  return (
    <div className={cn("bg-background flex flex-col h-full", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight flex items-center justify-between">
            Kategorie
          </h2>
          <ScrollArea className="h-[calc(100vh-10rem)] px-1">
            <div className="space-y-1 pb-10">
               <Link 
                to="/"
                onClick={onSelect}
                className={cn(
                    buttonVariants({ variant: !activeCategorySlug ? "secondary" : "ghost" }),
                    "w-full justify-start font-medium mb-4"
                )}
               >
                    Všechny produkty
                </Link>
              
              {categories.length === 0 && selectedStore && (
                  <div className="px-4 py-4 text-sm text-muted-foreground text-center border border-dashed rounded-lg">
                      Žádné kategorie
                  </div>
              )}

              {categories.map((category) => (
                <CategoryItem 
                    key={`${category.store}-${category.id}`} 
                    category={category} 
                    isActive={isActive} 
                    onSelect={onSelect}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};