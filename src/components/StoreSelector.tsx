import { useStore } from "@/lib/context/store-context";
import { useStores } from "@/lib/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, Loader2 } from "lucide-react";

export const StoreSelector = () => {
  const { selectedStore, setStore } = useStore();
  const { data: stores, isLoading } = useStores();

  const handleValueChange = (value: string) => {
    // "all" is our internal string for undefined/null
    setStore(value === "all" ? null : value);
  };

  const formatStoreName = (name: string) => {
    return name
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const renderSelectItems = () => (
    <>
      <SelectItem value="all" className="font-medium">
        Všechny obchody
      </SelectItem>
      {stores?.map((storeInfo) => (
        <SelectItem key={storeInfo.store} value={storeInfo.store}>
          <span className="flex items-center justify-between w-full gap-2">
            <span>{formatStoreName(storeInfo.store)}</span>
            <span className="text-xs text-muted-foreground/60 ml-2">
              ({storeInfo.count})
            </span>
          </span>
        </SelectItem>
      ))}
    </>
  );

  return (
    <div className="flex items-center">
      {/* Mobile Icon Trigger */}
      <div className="sm:hidden">
        <Select 
            value={selectedStore || "all"} 
            onValueChange={handleValueChange}
            disabled={isLoading}
        >
          <SelectTrigger className="w-10 h-10 px-0 border-none bg-transparent hover:bg-accent focus:ring-0">
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
                <Store className="h-5 w-5 mx-auto" />
            )}
          </SelectTrigger>
          <SelectContent align="start">
            {renderSelectItems()}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Standard Select */}
      <div className="hidden sm:block">
        <Select 
            value={selectedStore || "all"} 
            onValueChange={handleValueChange}
            disabled={isLoading}
        >
          <SelectTrigger className="w-[200px] lg:w-[240px]">
            <div className="flex items-center gap-2 truncate">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Store className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
              <SelectValue placeholder="Vyberte obchod" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {renderSelectItems()}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};