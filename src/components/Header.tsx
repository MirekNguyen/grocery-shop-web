import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/context/cart-context";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { MobileNav } from "@/components/MobileNav";
import { StoreSelector } from "@/components/StoreSelector";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [localSearch, setLocalSearch] = useState("");
  const { itemCount, setIsOpen } = useCart();
  
  // Debounce search input to avoid too many re-renders/fetches
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-2 sm:gap-4 px-4 md:px-6">
        
        {/* Mobile Menu Trigger */}
        <MobileNav />

        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary cursor-pointer mr-auto md:mr-0 min-w-0">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0">
                G
            </div>
            <span className="hidden sm:inline truncate">Grocer<span className="text-primary/70">App</span></span>
        </Link>

        {/* Store Selector */}
        <StoreSelector />

        <div className="hidden md:flex flex-1 max-w-md relative mx-auto group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Hledat produkty..." 
                className="pl-9 pr-12 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>

         <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
             <Button variant="ghost" size="icon" className="md:hidden" onClick={() => document.getElementById('mobile-search')?.focus()}>
                 <Search className="h-5 w-5" />
             </Button>
             
             <div className="h-8 w-px bg-border mx-1 hidden md:block" />
             
             <Button 
                size="sm" 
                className="relative"
                onClick={() => setIsOpen(true)}
             >
                <ShoppingCart className="sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Košík</span>
                {itemCount > 0 && (
                    <Badge variant="secondary" className="absolute -top-1.5 -right-1.5 sm:static sm:ml-2 h-5 min-w-5 px-1 bg-white/20 text-white hover:bg-white/30 border-none rounded-full sm:rounded-md flex items-center justify-center">
                        {itemCount}
                    </Badge>
                )}
             </Button>
         </div>
      </div>
      
      {/* Mobile Search Bar (Below header on small screens) */}
      <div className="md:hidden border-t p-2 bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                id="mobile-search"
                placeholder="Hledat produkty..." 
                className="pl-9"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
        </div>
      </div>
    </header>
  );
};