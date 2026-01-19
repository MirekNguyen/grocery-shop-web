import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CategorySidebar } from "@/components/CategorySidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden mr-2">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px] sm:w-[350px]">
        <CategorySidebar 
            className="border-none h-full" 
            onSelect={() => setOpen(false)} 
        />
      </SheetContent>
    </Sheet>
  );
};