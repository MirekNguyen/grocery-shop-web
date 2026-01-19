import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Search,
  ShoppingBag,
  Home,
  UtensilsCrossed,
  Apple,
  Carrot,
  Store
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useProducts, useCategories } from "@/lib/queries";
import { useStore } from "@/lib/context/store-context";
import { CategoryWithCount } from "@/types";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  const { data: productsData } = useProducts({ limit: 100 }); // Pre-fetch some products for search
  const { data: categoriesData } = useCategories(selectedStore);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
          // Only open if not typing in an input
          if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
              e.preventDefault();
              setOpen((open) => !open);
          }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Zadejte příkaz nebo hledejte..." />
      <CommandList>
        <CommandEmpty>Žádné výsledky.</CommandEmpty>
        
        <CommandGroup heading="Navigace">
          <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
            <Home className="mr-2 h-4 w-4" />
            <span>Domů</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/checkout"))}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Pokladna</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Kategorie">
            {categories.slice(0, 5).map((category) => (
                 <CommandItem 
                    key={`${category.id}-${category.slug}`}
                    onSelect={() => runCommand(() => navigate(`/?category=${category.slug}`))}
                 >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>{category.name}</span>
                 </CommandItem>
            ))}
             <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
                <Search className="mr-2 h-4 w-4" />
                <span>Zobrazit všechny kategorie</span>
             </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Produkty">
            {productsData?.data.slice(0, 5).map((product) => (
                <CommandItem
                    key={product.id}
                    onSelect={() => runCommand(() => navigate(`/product/${product.slug}`))}
                >
                    <div className="mr-2 h-4 w-4 flex items-center justify-center">
                        <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
                    </div>
                    <span>{product.name}</span>
                </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}