import { Link } from "react-router-dom";
import { Search, ShoppingCart, Store, ChevronDown } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const { items } = useCart();
  const { selectedStore, setStore } = useStore();
  const { data: stores } = useStores();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const formatStoreName = (store: string) => {
    return store.replace(/_/g, " ").replace("FOODORA", "Foodora").replace("BILLA", "Billa");
  };

  const getStoreLabel = (store: string | null) => {
    if (!store) return "Všechny obchody";
    return formatStoreName(store);
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
                        <Store className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{getStoreLabel(selectedStore)}</span>
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
                    Všechny obchody
                </DropdownMenuItem>
                
                {stores?.map((storeInfo) => (
                    <DropdownMenuItem 
                        key={storeInfo.store}
                        onClick={() => setStore(storeInfo.store)}
                        className={selectedStore === storeInfo.store ? "bg-accent justify-between" : "justify-between"}
                    >
                        <span>{formatStoreName(storeInfo.store)}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5">{storeInfo.count}</Badge>
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
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setStore(null)}>Všechny</DropdownMenuItem>
                {stores?.map((storeInfo) => (
                    <DropdownMenuItem 
                        key={storeInfo.store}
                        onClick={() => setStore(storeInfo.store)}
                    >
                        {formatStoreName(storeInfo.store)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
           </DropdownMenu>

          <Button variant="ghost" size="icon" className="relative">
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