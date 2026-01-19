import { Button } from "@/components/ui/button";
import { CategoryWithCount } from "@/types";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";

interface CategoryNavProps {
  categories: CategoryWithCount[];
}

export const CategoryNav = ({ categories }: CategoryNavProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategorySlug = searchParams.get("category");

  const handleCategorySelect = (slug: string | undefined) => {
    if (selectedCategorySlug === slug) {
      searchParams.delete("category");
    } else if (slug) {
      searchParams.set("category", slug);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-fade-right">
      <Button 
        variant={!selectedCategorySlug ? "default" : "outline"}
        onClick={() => handleCategorySelect(undefined)}
        className="rounded-full shadow-sm whitespace-nowrap"
      >
        Vše
      </Button>
      {categories.map((category) => (
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
  );
};