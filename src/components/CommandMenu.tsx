import * as React from "react";
import {
  CreditCard,
  Search,
  ShoppingBag,
  Home,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useProducts, useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebounce(query, 300);
  
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  
  // Use the hook to search products based on the input
  // We disable the hook's internal limit if we want "best matches" or keep it to 5-10
  const { data: productsData, isLoading } = useProducts({ 
    search: debouncedQuery,
    limit: 10 // Only show top 10 results in the menu
  });
  
  const { data: categoriesData } = useCategories(selectedStore);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
          if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
              e.preventDefault();
              setOpen((open) => !open);
          }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Reset query when closed
  React.useEffect(() => {
    if (!open) {
        setQuery("");
    }
  }, [open]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  // Flatten categories
  const categories = React.useMemo(() => {
    if (!categoriesData) return [];
    
    const flatten = (cats: CategoryWithCount[]): CategoryWithCount[] => {
        return cats.reduce((acc, cat) => {
            acc.push(cat);
            if (cat.subcategories && cat.subcategories.length > 0) {
                acc.push(...flatten(cat.subcategories));
            }
            return acc;
        }, [] as CategoryWithCount[]);
    };

    const rootCategories = Object.values(categoriesData).flat();
    return flatten(rootCategories);
  }, [categoriesData]);

  // Filter categories client-side since the API might not support category search
  const filteredCategories = React.useMemo(() => {
      if (!query) return categories.slice(0, 5);
      return categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
  }, [categories, query]);

  return (
    <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        // Disable cmkd's internal filtering because we are filtering via API/Hooks
        commandProps={{ shouldFilter: false }}
    >
      <CommandInput 
        placeholder="Hledat produkty..." 
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
            {isLoading ? "Hledám..." : "Žádné výsledky."}
        </CommandEmpty>
        
        {/* Only show navigation when not searching or if query matches loosely */}
        {!query && (
            <CommandGroup heading="Navigace">
            <CommandItem value="home" onSelect={() => runCommand(() => navigate("/"))}>
                <Home className="mr-2 h-4 w-4" />
                <span>Domů</span>
            </CommandItem>
            <CommandItem value="checkout" onSelect={() => runCommand(() => navigate("/checkout"))}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Pokladna</span>
            </CommandItem>
            </CommandGroup>
        )}

        {filteredCategories.length > 0 && (
             <>
                <CommandSeparator />
                <CommandGroup heading="Kategorie">
                    {filteredCategories.map((category) => (
                        <CommandItem 
                            key={`${category.id}-${category.slug}`}
                            value={category.name}
                            onSelect={() => runCommand(() => navigate(`/?category=${category.slug}`))}
                        >
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>{category.name}</span>
                        </CommandItem>
                    ))}
                    {!query && (
                        <CommandItem value="all-categories" onSelect={() => runCommand(() => navigate("/"))}>
                            <Search className="mr-2 h-4 w-4" />
                            <span>Zobrazit všechny kategorie</span>
                        </CommandItem>
                    )}
                </CommandGroup>
             </>
        )}

        <CommandSeparator />

        <CommandGroup heading="Produkty">
            {productsData?.data.map((product) => (
                <CommandItem
                    key={product.id}
                    value={product.name}
                    onSelect={() => runCommand(() => navigate(`/product/${product.slug}`))}
                >
                    <div className="mr-2 h-8 w-8 flex items-center justify-center rounded border bg-white p-1">
                        <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
                    </div>
                    <div className="flex flex-col">
                        <span>{product.name}</span>
                        {product.descriptionShort && (
                            <span className="text-xs text-muted-foreground line-clamp-1">{product.descriptionShort}</span>
                        )}
                    </div>
                </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}