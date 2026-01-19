import { useStore } from "@/lib/context/store-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store } from "lucide-react";

export const StoreSelector = () => {
  const { selectedStore, setStore } = useStore();

  const handleValueChange = (value: string) => {
    // "all" is our internal string for undefined/null
    setStore(value === "all" ? null : value);
  };

  return (
    <div className="flex items-center">
      {/* Mobile Icon Trigger - keeping this pattern but simplifying */}
      <div className="sm:hidden">
         <Select value={selectedStore || "all"} onValueChange={handleValueChange}>
            <SelectTrigger className="w-10 h-10 px-0 border-none bg-transparent hover:bg-accent focus:ring-0">
               <Store className="h-5 w-5 mx-auto" />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectItem value="all">Všechny obchody</SelectItem>
              <SelectItem value="BILLA">Billa</SelectItem>
              <SelectItem value="FOODORA">Foodora Market</SelectItem>
            </SelectContent>
         </Select>
      </div>

      {/* Desktop Standard Select */}
      <div className="hidden sm:block">
        <Select value={selectedStore || "all"} onValueChange={handleValueChange}>
          <SelectTrigger className="w-[180px]">
             <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Vyberte obchod" />
             </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Všechny obchody</SelectItem>
            <SelectItem value="BILLA">Billa</SelectItem>
            <SelectItem value="FOODORA">Foodora Market</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};