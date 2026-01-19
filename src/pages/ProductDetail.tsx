import { useParams, Link } from "react-router-dom";
import { useProductBySlug, useProducts } from "@/lib/queries";
import { formatCurrency, formatUnitPrice } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Home, ShoppingCart, Heart, Share2 } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { ProductList } from "@/components/ProductList";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { ProductWithCategories } from "@/types";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProductBySlug(slug || "");
  const { addItem } = useCart();

  // Fetch related products from the same category
  const { data: relatedData } = useProducts({
    category: product?.categorySlug,
    limit: 4,
  });

  const relatedProducts = relatedData?.data.filter((p: ProductWithCategories) => p.id !== product?.id).slice(0, 4) || [];

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError || !product) {
    return (
      <div className="container min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Produkt nenalezen</h1>
        <Button asChild>
          <Link to="/">Zpět na hlavní stranu</Link>
        </Button>
      </div>
    );
  }

  const currentPrice = product.price ?? 0;
  const showDiscount = product.inPromotion && product.regularPrice && product.regularPrice > currentPrice;
  const discountPercentage = showDiscount
    ? Math.round(((product.regularPrice! - currentPrice) / product.regularPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50/30">
        {/* Breadcrumb Navigation */}
        <nav className="border-b bg-white">
            <div className="container px-4 h-12 flex items-center text-sm text-muted-foreground">
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
                    <Home className="h-4 w-4" />
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
                <span className="truncate max-w-[150px]">{product.category}</span>
                <ChevronRight className="h-4 w-4 mx-2 opacity-50" />
                <span className="font-medium text-foreground truncate">{product.name}</span>
            </div>
        </nav>

      <main className="container px-4 py-8 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl border shadow-sm overflow-hidden p-8 flex items-center justify-center relative group">
               {showDiscount && (
                  <Badge className="absolute top-4 left-4 z-10 bg-yellow-500 text-white text-lg px-3 py-1 shadow-md">
                    -{discountPercentage}%
                  </Badge>
               )}
               {product.images[0] ? (
                   <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                   />
               ) : (
                   <div className="text-muted-foreground">Obrázek není k dispozici</div>
               )}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                 <Link to={`/?category=${product.categorySlug}`} className="text-sm font-medium text-primary hover:underline uppercase tracking-wide">
                    {product.brand || product.category}
                 </Link>
                 <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Heart className="h-5 w-5 text-muted-foreground" />
                    </Button>
                 </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(currentPrice)}
                </span>
                {showDiscount && (
                  <div className="flex flex-col">
                    <span className="text-lg text-muted-foreground line-through decoration-destructive/50">
                      {formatCurrency(product.regularPrice!)}
                    </span>
                    <span className="text-xs text-destructive font-medium">
                        Ušetříte {formatCurrency(product.regularPrice! - currentPrice)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                {product.pricePerUnit && product.baseUnitShort
                    ? formatUnitPrice(product.pricePerUnit, product.baseUnitShort)
                    : (product.pricePerUnit && product.volumeLabelShort 
                        ? formatUnitPrice(product.pricePerUnit, product.volumeLabelShort)
                        : product.packageLabel || "Cena za kus")
                }
                <span className="mx-2">•</span>
                <span className={product.published ? "text-green-600 font-medium" : "text-red-500"}>
                    {product.published ? "Skladem" : "Nedostupné"}
                </span>
              </div>

              <div className="flex gap-4">
                 <Button 
                    size="lg" 
                    className="flex-1 h-14 text-lg font-semibold shadow-lg shadow-primary/20"
                    onClick={() => addItem(product)}
                 >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Přidat do košíku
                 </Button>
              </div>
            </div>

            <Separator />

            <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{product.descriptionLong || product.descriptionShort || product.productMarketing}</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger>Podrobné informace</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">Regulovaný název:</span>
                    <span>{product.regulatedProductName || "-"}</span>
                    
                    <span className="text-muted-foreground">Značka:</span>
                    <span>{product.brand || "-"}</span>
                    
                    <span className="text-muted-foreground">Hmotnost/Objem:</span>
                    <span>{product.amount} {product.volumeLabelShort}</span>
                    
                    <span className="text-muted-foreground">Srovnávací jednotka:</span>
                    <span>{product.baseUnitLong || product.baseUnitShort || "-"}</span>

                    <span className="text-muted-foreground">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Doprava a doručení</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Doručujeme každý den od 8:00 do 22:00. Při objednávce nad 1500 Kč je doprava zdarma.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Mohlo by se vám líbit</h2>
                <ProductList products={relatedProducts} />
            </div>
        )}
      </main>

      <footer className="border-t bg-white py-12 mt-12">
        <div className="container px-4 text-center text-muted-foreground text-sm">
             <p className="mb-4">&copy; 2024 GrocerApp. Premium Grocery Experience.</p>
             <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

const ProductSkeleton = () => (
    <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-6">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        </div>
    </div>
);

export default ProductDetail;