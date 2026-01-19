import * as React from "react";
import {
  CreditCard,
  Search,
  Store,
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
import { formatPrice } from "@/lib/utils";
import { CategoryWithCount } from "@/types";

export function SearchDialog() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { selectedStore } = useStore();
  
  // Fix: Pass store as an object property
  const { data: productsData } = useProducts({ store: selectedStore });
  const { data: categoriesData } = useCategories(selectedStore);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      
      // Open on "/" only if not typing in an input
      if (
        e.key === "/" && 
        !open && 
        !(e.target instanceof HTMLInputElement) && 
        !(e.target instanceof HTMLTextAreaElement) &&
        !(e.target instanceof HTMLSelectElement) &&
        (e.target as HTMLElement).isContentEditable !== true
      ) {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  const allProducts = React.useMemo(() => {
      if (!productsData) return [];
      // Handle both paginated structure or direct array if API changes
      // @ts-ignore
      return productsData.data || []; 
  }, [productsData]);

  const allCategories = React.useMemo(() => {
    if (!categoriesData || !selectedStore || !categoriesData[selectedStore]) return [];
    
    const flat: CategoryWithCount[] = [];
    const traverse = (cats: CategoryWithCount[]) => {
        cats.forEach(c => {
            flat.push(c);
            if (c.subcategories) traverse(c.subcategories);
        });
    };
    // @ts-ignore
    traverse(categoriesData[selectedStore]);
    return flat;
  }, [categoriesData, selectedStore]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
      >
        <span className="hidden lg:inline-flex">Hledat produkty...</span>
        <span className="inline-flex lg:hidden">Hledat...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Hledejte produkty nebo kategorie..." />
        <CommandList>
          <CommandEmpty>Žádné výsledky.</CommandEmpty>
          
          <CommandGroup heading="Rychlé akce">
            <CommandItem onSelect={() => runCommand(() => navigate("/checkout"))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Pokladna</span>
              <CommandShortcut>P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => navigate("/"))}>
              <Store className="mr-2 h-4 w-4" />
              <span>Hlavní stránka</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />

          {selectedStore && allCategories.length > 0 && (
            <CommandGroup heading="Kategorie">
                {allCategories.slice(0, 5).map((category) => (
                    <CommandItem 
                        key={category.id} 
                        value={`category-${category.name}`}
                        onSelect={() => runCommand(() => navigate(`/?category=${category.slug}`))}
                    >
                        <Search className="mr-2 h-4 w-4 opacity-50" />
                        <span>{category.name}</span>
                    </CommandItem>
                ))}
            </CommandGroup>
          )}

          <CommandGroup heading="Produkty">
            {allProducts.slice(0, 10).map((product: any) => (
                <CommandItem 
                    key={product.id} 
                    value={product.name}
                    onSelect={() => runCommand(() => navigate(`/product/${product.slug || product.id}`))}
                >
                    <div className="mr-2 h-6 w-6 rounded bg-white p-0.5 border flex items-center justify-center overflow-hidden">
                        {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt="" className="h-full w-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-gray-100" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span>{product.name}</span>
                        <span className="text-xs text-muted-foreground">{formatPrice((product.price || 0) / 100)}</span>
                    </div>
                </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>
      </CommandDialog>
    </>
  );
}