import { ShoppingCart, Menu, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/context/store-context";
import { useCart } from "@/lib/context/cart-context";
import { useStores } from "@/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { CategorySidebar } from "./CategorySidebar";
import { SearchDialog } from "./SearchDialog";
import { Link } from "react-router-dom";

// Removed unused interface since onSearch is unused
// interface HeaderProps {
//   onSearch: (query: string) => void;
// }

export const Header = () => {
  // Fix: use setStore instead of setSelectedStore
  const { selectedStore, setStore } = useStore();
  // Fix: fetch availableStores from useStores hook
  const { data: availableStores = [] } = useStores();
  
  const { items, setIsOpen: setCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[300px]">
            <SheetHeader className="p-4 border-b text-left">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="h-full py-2">
               <CategorySidebar onSelect={() => setIsMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
             <span className="text-primary-foreground font-bold text-lg">N</span>
          </div>
          <span className="hidden font-bold sm:inline-block">NakupTady</span>
        </Link>

        {/* Store Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="mr-4 hidden md:flex gap-2 min-w-[140px] justify-between">
              <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span className="truncate max-w-[100px]">
                    {selectedStore 
                        ? availableStores.find((s) => s.store === selectedStore)?.store.replace(/_/g, " ") 
                        : "Všechny obchody"}
                  </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[200px]">
            <DropdownMenuItem onClick={() => setStore(null)}>
              Všechny obchody
            </DropdownMenuItem>
            {availableStores.map((storeInfo) => (
              <DropdownMenuItem
                key={storeInfo.store}
                onClick={() => setStore(storeInfo.store)}
                className="gap-2"
              >
                {/* Note: Store object structure is slightly different from previous assumptions (no color, id is store name) */}
                <div className="h-2 w-2 rounded-full bg-primary" />
                {storeInfo.store.replace(/_/g, " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search Bar - Now using SearchDialog */}
        <div className="flex-1 md:w-auto md:flex-none">
            <SearchDialog />
        </div>

        {/* Right Actions */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[11px] font-medium text-primary-foreground flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="sr-only">Otevřít košík</span>
          </Button>
        </div>
      </div>
    </header>
  );
};