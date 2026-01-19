import { useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState, useCallback, useEffect } from "react";
import { ChevronDown, ChevronRight, Folder, CornerDownRight } from "lucide-react";

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
  const isChild = level > 0;

  // Calculate if we should auto-expand based on active state
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
    <div className="w-full relative">
      <div 
        className={cn(
            "flex items-center w-full group relative rounded-md transition-all duration-200 border",
            // Active State
            active 
                ? "bg-primary/10 border-primary/20 text-primary z-10" 
                : "border-transparent hover:bg-accent hover:text-accent-foreground",
            // Level spacing
            isChild ? "mt-1" : "mb-1"
        )}
      >
        <Link 
            to={`/?category=${category.slug}`}
            onClick={handleLinkClick}
            className={cn(
                "flex-1 flex items-center min-w-0 py-2.5 pr-2 select-none cursor-pointer",
                // Indentation based on level
                level === 0 ? "pl-3" : "pl-3"
            )}
            title={category.name}
        >
            {/* Icon indicating depth/type */}
            {level > 0 ? (
                <CornerDownRight className={cn(
                    "w-3.5 h-3.5 mr-2 shrink-0 opacity-50",
                    active ? "text-primary" : "text-muted-foreground"
                )} />
            ) : (
                // Optional: Folder icon for top level, or just rely on font weight
                 null 
            )}

            <span className={cn(
                "truncate flex-1",
                // Visual hierarchy: Top level is bolder and slightly larger
                level === 0 ? "font-semibold text-sm" : "font-normal text-sm"
            )}>
                {category.name}
            </span>
            
            {/* Product Count - Enhanced Visibility */}
            <span className={cn(
                "ml-2 text-xs tabular-nums px-2 py-0.5 rounded-full shrink-0 font-medium",
                active 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground group-hover:bg-background/80"
            )}>
                {category.productCount}
            </span>
        </Link>
        
        {hasSubcategories && (
             <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-9 w-9 shrink-0 mr-0.5 hover:bg-transparent",
                    active ? "text-primary" : "text-muted-foreground"
                )}
                onClick={handleToggle}
             >
                 {isExpanded ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                 }
             </Button>
        )}
      </div>

      {hasSubcategories && isExpanded && (
        <div className="relative">
            {/* Tree Line */}
            <div className={cn(
                "absolute left-[1.1rem] top-0 bottom-2 w-px bg-border",
                level > 0 && "left-[1.8rem]" // Shift line for deeper levels
            )} />
            
            <div className={cn(
                "animate-in slide-in-from-top-1 duration-200",
                "pl-6" // Indent container for children
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
                    <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
            </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-background flex flex-col h-full border-r", className)}>
      <div className="space-y-4 py-4 flex-1">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-2 text-lg font-bold tracking-tight flex items-center gap-2">
             <Folder className="w-5 h-5" />
             Kategorie
          </h2>
          <ScrollArea className="h-[calc(100vh-10rem)] px-1">
            <div className="space-y-1 pb-10 pr-3">
               <Link 
                to="/"
                onClick={onSelect}
                className={cn(
                    buttonVariants({ variant: !activeCategorySlug ? "secondary" : "ghost" }),
                    "w-full justify-start font-bold mb-6 h-10 border border-transparent",
                    !activeCategorySlug && "border-border shadow-sm"
                )}
               >
                    Všechny produkty
                </Link>
              
              {categories.length === 0 && selectedStore && (
                  <div className="px-4 py-8 text-sm text-muted-foreground text-center border border-dashed rounded-lg bg-muted/20">
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