import { Store, ChevronDown, Check } from "lucide-react";
import { useStore } from "@/lib/context/store-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const StoreSelector = () => {
  const { selectedStore, setStore } = useStore();

  const stores = [
    { id: undefined, name: "Všechny obchody", color: "bg-slate-500" },
    { id: "BILLA", name: "Billa", color: "bg-yellow-400 text-yellow-950" },
    { id: "FOODORA", name: "Foodora Market", color: "bg-pink-600 text-white" },
  ];

  const activeStore = stores.find(s => s.id === selectedStore) || stores[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="outline" 
            className="w-[180px] justify-between hidden sm:flex border-dashed border-2 hover:border-solid hover:bg-accent/50"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={cn("h-4 w-4 rounded-full flex-shrink-0", activeStore.color)} />
            <span className="truncate">{activeStore.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      
      {/* Mobile Trigger (Icon only) */}
      <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="sm:hidden">
              <Store className="h-5 w-5" />
          </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Vyberte obchod</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {stores.map((store) => (
          <DropdownMenuItem
            key={store.id || "all"}
            onClick={() => setStore(store.id ?? null)}
            className="cursor-pointer gap-2"
          >
            <div className={cn("h-3 w-3 rounded-full", store.color)} />
            <span className="flex-1">{store.name}</span>
            {selectedStore === store.id && <Check className="h-4 w-4 ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};