import { ProductWithCategories } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Info } from "lucide-react";
import { formatCurrency, formatUnitPrice } from "@/lib/formatters";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCart } from "@/lib/context/cart-context";

interface ProductCardProps {
  product: ProductWithCategories;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  const currentPrice = product.price ?? 0;
  const showDiscount = product.inPromotion && product.regularPrice && product.regularPrice > currentPrice;
  const discountPercentage = showDiscount
    ? Math.round(((product.regularPrice! - currentPrice) / product.regularPrice!) * 100)
    : 0;

  return (
    <Card className="group relative h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl border-border/50 bg-card hover:-translate-y-1 rounded-lg">
      <Link to={`/product/${product.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View product</span>
      </Link>

      {/* Badges Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        {product.inPromotion && (
          <Badge variant="destructive" className="font-semibold shadow-sm">
            Akce
          </Badge>
        )}
        {showDiscount && (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm">
            -{discountPercentage}%
          </Badge>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
         <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md hover:bg-white relative z-20">
            <Heart className="h-4 w-4 text-gray-600" />
         </Button>
      </div>

      <CardHeader className="p-0">
        <div className="aspect-[4/3] w-full overflow-hidden bg-white p-4 flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
                 <img
                 src={product.images[0]}
                 alt={product.name}
                 className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                 loading="lazy"
               />
            ) : (
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                </div>
            )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
             <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase truncate max-w-[150px]">
                {product.brand || "Generické"}
            </div>
            <TooltipProvider>
                <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                         {/* Make tooltip trigger interactive */}
                         <div className="pointer-events-auto">
                            <Info className="h-4 w-4 text-muted-foreground/50 hover:text-primary cursor-help" />
                         </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-xs">
                        <p>{product.descriptionLong || product.descriptionShort || product.productMarketing || "No description available"}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
       
        <h3 className="font-semibold text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.name}
        </h3>

        <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-primary">
                    {formatCurrency(currentPrice)}
                </span>
                {showDiscount && (
                    <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                        {formatCurrency(product.regularPrice!)}
                    </span>
                )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
                {product.unitPrice && product.volumeLabelShort 
                    ? formatUnitPrice(product.unitPrice * 100, product.volumeLabelShort)
                    : product.packageLabel || "Kus"}
            </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {/* Z-index 20 to sit above the card link */}
        <Button 
            className="w-full font-semibold shadow-sm group-hover:bg-primary/90 transition-all active:scale-95 relative z-20" 
            size="lg"
            onClick={(e) => {
                e.preventDefault(); // Prevent navigation
                addItem(product);
            }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Do košíku
        </Button>
      </CardFooter>
    </Card>
  );
};