import { ProductWithCategories } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: ProductWithCategories;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();

  // Helper to get display price
  const displayPrice = product.price ?? product.regularPrice ?? 0;
  // If price is in cents (integer), divide by 100. If it looks like decimal, keep it.
  // Based on mock: price: 1190 (11.90)
  const finalPrice = displayPrice > 0 ? displayPrice / 100 : 0;
  
  const discountPercentage = product.regularPrice && product.discountPrice 
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100) 
    : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-square overflow-hidden bg-white p-4 group">
        {product.inPromotion && (
          <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
            Akce
          </Badge>
        )}
        {discountPercentage > 0 && (
            <Badge className="absolute top-2 right-2 z-10 bg-yellow-500 text-black hover:bg-yellow-600">
                -{discountPercentage}%
            </Badge>
        )}
        <img
          src={product.images[0] || "/placeholder.png"}
          alt={product.name}
          className="h-full w-full object-contain transition-transform group-hover:scale-105 duration-300"
          loading="lazy"
        />
      </div>

      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.5em]" title={product.name}>
            {product.name}
            </h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
            {product.amount} {product.volumeLabelShort} • {product.store?.replace(/_/g, " ")}
        </p>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(finalPrice)}
          </span>
          {product.regularPrice && product.price !== product.regularPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.regularPrice / 100)}
            </span>
          )}
        </div>
        {product.pricePerUnit && (
             <p className="text-xs text-muted-foreground mt-1">
                 {formatPrice(product.pricePerUnit / 100)} / {product.baseUnitShort || "jednotka"}
             </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 gap-2">
        <Button 
            className="flex-1 gap-2" 
            onClick={() => addItem(product)}
        >
          <ShoppingCart className="h-4 w-4" />
          Do košíku
        </Button>
      </CardFooter>
    </Card>
  );
};