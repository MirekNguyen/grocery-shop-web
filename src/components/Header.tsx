import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/context/cart-context";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { MobileNav } from "@/components/MobileNav";

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
      <div className="container flex h-16 items-center gap-4 px-4 md:px-6">
        
        {/* Mobile Menu Trigger */}
        <MobileNav />

        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary cursor-pointer mr-auto md:mr-0">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                G
            </div>
            <span className="hidden sm:inline">Grocer<span className="text-primary/70">App</span></span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md relative mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder="Hledat produkty..." 
                className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
            />
        </div>

         <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="md:hidden">
                 <Search className="h-5 w-5" />
             </Button>
             <div className="h-8 w-px bg-border mx-2 hidden md:block" />
             <Button 
                size="sm" 
                className="relative"
                onClick={() => setIsOpen(true)}
             >
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Košík</span>
                {itemCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 bg-white/20 text-white hover:bg-white/30 border-none">
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