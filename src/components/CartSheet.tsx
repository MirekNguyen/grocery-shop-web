import { useCart, CartItem } from "@/lib/context/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const CartSheet = () => {
  const { items, removeItem, updateQuantity, cartTotal, isOpen, setIsOpen } = useCart();

  // Convert cents to units for display if cartTotal is in cents (assuming consistency)
  const displayTotal = cartTotal / 100;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Váš nákupní košík
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4">
            <ShoppingBag className="h-16 w-16 opacity-20" />
            <p>Váš košík je prázdný</p>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Začít nakupovat
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              <div className="space-y-4">
                {items.map(({ product, quantity }: CartItem) => {
                    const price = (product.price ?? 0) / 100;
                    return (
                        <div key={product.id} className="flex gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border bg-white p-2">
                                {product.images[0] ? (
                                    <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="h-full w-full object-contain"
                                />
                                ) : (
                                    <div className="h-full w-full bg-gray-100" />
                                )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between">
                            <div className="flex justify-between gap-2">
                                <h4 className="text-sm font-medium line-clamp-2">
                                {product.name}
                                </h4>
                                <p className="text-sm font-bold text-right">
                                {formatPrice(price * quantity)}
                                </p>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => updateQuantity(product.id, quantity - 1)}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="w-8 text-center text-sm">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() => updateQuantity(product.id, quantity + 1)}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeItem(product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            </div>
                        </div>
                    );
                })}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-4">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex justify-between text-base font-medium">
                  <span>Celkem</span>
                  <span>{formatPrice(displayTotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ceny jsou uvedeny včetně DPH.
                </p>
              </div>
              <SheetFooter>
                <Button className="w-full" size="lg">
                  Přejít k pokladně
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};