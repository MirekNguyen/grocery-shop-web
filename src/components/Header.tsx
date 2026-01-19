import { Link } from "react-router-dom";
import { Search, ShoppingCart, Store, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/lib/context/cart-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useStore } from "@/lib/context/store-context";
import { useStores } from "@/lib/queries";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const { items, setIsOpen } = useCart();
  const { selectedStore, setStore } = useStore();
  const { data: stores, isLoading: storesLoading } = useStores();
  
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const getStoreLabel = (storeKey: string | null) => {
    if (!storeKey) return "Všechny obchody";
    const found = stores?.find(s => s.store === storeKey);
    return found ? found.store.replace(/_/g, " ") : storeKey;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <Store className="h-6 w-6" />
          <span>GrocerApp</span>
        </Link>

        {/* Store Selector */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="min-w-[160px] justify-between hidden md:flex">
                    <span className="flex items-center gap-2">
                        {storesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Store className="h-4 w-4 text-muted-foreground" />}
                        <span className="truncate max-w-[150px]">{getStoreLabel(selectedStore)}</span>
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[240px]">
                <DropdownMenuLabel>Vyberte obchod</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => setStore(null)}
                    className={!selectedStore ? "bg-accent" : ""}
                >
                    <div className="flex justify-between w-full">
                        <span>Všechny obchody</span>
                    </div>
                </DropdownMenuItem>
                
                {stores?.map((storeInfo) => (
                    <DropdownMenuItem 
                        key={storeInfo.store}
                        onClick={() => setStore(storeInfo.store)}
                        className={selectedStore === storeInfo.store ? "bg-accent" : ""}
                    >
                         <div className="flex justify-between w-full items-center">
                            <span>{storeInfo.store.replace(/_/g, " ")}</span>
                            <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{storeInfo.count}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1 max-w-xl mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Hledat produkty..." 
              className="pl-9 bg-gray-50 focus-visible:bg-white transition-colors"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
           {/* Mobile Store Selector Trigger */}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Store className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStore(null)}>Všechny</DropdownMenuItem>
                {stores?.map((storeInfo) => (
                    <DropdownMenuItem key={storeInfo.store} onClick={() => setStore(storeInfo.store)}>
                        {storeInfo.store}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
           </DropdownMenu>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden container py-2 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Hledat produkty..." 
              className="pl-9 bg-gray-50"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
      </div>
    </header>
  );
};