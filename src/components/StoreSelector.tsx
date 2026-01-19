import { useStore } from "@/lib/context/store-context";
import { useStores } from "@/lib/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store as StoreIcon, Loader2 } from "lucide-react";

export const StoreSelector = () => {
  const { selectedStore, setStore } = useStore();
  const { data: stores, isLoading } = useStores();

  const handleValueChange = (value: string) => {
    // "all" is our internal string for undefined/null
    setStore(value === "all" ? null : value);
  };

  if (isLoading) {
      return (
          <div className="flex items-center gap-2 px-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground hidden sm:inline">Načítání obchodů...</span>
          </div>
      )
  }

  return (
    <div className="flex items-center">
      {/* Mobile Icon Trigger */}
      <div className="sm:hidden">
         <Select value={selectedStore || "all"} onValueChange={handleValueChange}>
            <SelectTrigger className="w-10 h-10 px-0 border-none bg-transparent hover:bg-accent focus:ring-0">
               <StoreIcon className="h-5 w-5 mx-auto" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all">Všechny obchody</SelectItem>
              {stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                      {store.name}
                  </SelectItem>
              ))}
            </SelectContent>
         </Select>
      </div>

      {/* Desktop Standard Select */}
      <div className="hidden sm:block">
        <Select value={selectedStore || "all"} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
             <div className="flex items-center gap-2">
                <StoreIcon className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Vyberte obchod" />
             </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všechny obchody</SelectItem>
             {stores?.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                      {store.name}
                  </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};