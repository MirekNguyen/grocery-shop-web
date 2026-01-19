import { useParams, Link } from "react-router-dom";
import { useProduct } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Home, ChevronRight } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { MadeWithDyad } from "@/components/made-with-dyad";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(slug);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-1/3" />
            </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold">Produkt nenalezen</h2>
        <p className="text-muted-foreground">Omlouváme se, ale požadovaný produkt neexistuje nebo byl odstraněn.</p>
        <Link to="/">
            <Button>Zpět na nákup</Button>
        </Link>
      </div>
    );
  }

  // Calculate prices
  const displayPrice = product.price ?? product.regularPrice ?? 0;
  const finalPrice = displayPrice > 0 ? displayPrice / 100 : 0;
  
  const discountPercentage = product.regularPrice && product.discountPrice 
    ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
        <div className="container px-4 md:px-6 py-6 flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-hidden whitespace-nowrap">
                <Link to="/" className="hover:text-primary flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Domů
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                
                {product.categories && product.categories.length > 0 ? (
                    product.categories.map((cat, index) => (
                        <div key={cat.id} className="flex items-center">
                            <Link to={`/?category=${cat.slug}`} className="hover:text-primary">
                                {cat.name}
                            </Link>
                            {index < (product.categories?.length || 0) - 1 && (
                                <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                            )}
                        </div>
                    ))
                ) : (
                    <Link to={`/?category=${product.categorySlug}`} className="hover:text-primary">
                        {product.category}
                    </Link>
                )}
                
                <ChevronRight className="h-4 w-4 mx-2 shrink-0 opacity-50" />
                <span className="font-medium text-foreground truncate">{product.name}</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Image Gallery (Simple for now) */}
                <div className="relative aspect-square bg-white rounded-2xl border overflow-hidden p-8 flex items-center justify-center">
                    {product.inPromotion && (
                        <Badge className="absolute top-4 left-4 z-10 bg-red-500 text-white text-base py-1 px-3">
                            Akce
                        </Badge>
                    )}
                    {discountPercentage > 0 && (
                        <Badge className="absolute top-4 right-4 z-10 bg-yellow-500 text-black text-base py-1 px-3 hover:bg-yellow-600">
                            -{discountPercentage}%
                        </Badge>
                    )}
                    <img 
                        src={product.images[0] || "/placeholder.png"} 
                        alt={product.name} 
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                         <Badge variant="outline" className="text-muted-foreground uppercase tracking-wider text-[10px]">
                            {product.brand || "Obecné"}
                         </Badge>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {product.amount} {product.volumeLabelShort} 
                            {product.store && <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-xs font-medium">{product.store.replace(/_/g, " ")}</span>}
                        </p>
                    </div>

                    <div className="flex items-baseline gap-4 py-4 border-y">
                        <span className="text-4xl font-bold text-primary">
                            {formatPrice(finalPrice)}
                        </span>
                        {product.regularPrice && product.price !== product.regularPrice && (
                            <div className="flex flex-col">
                                <span className="text-lg text-muted-foreground line-through decoration-2 decoration-red-300">
                                    {formatPrice(product.regularPrice / 100)}
                                </span>
                                <span className="text-xs text-red-500 font-medium">
                                    Ušetříte {formatPrice((product.regularPrice - (product.price || 0)) / 100)}
                                </span>
                            </div>
                        )}
                        {product.pricePerUnit && (
                            <span className="text-sm text-muted-foreground ml-auto">
                                {formatPrice(product.pricePerUnit / 100)} / {product.baseUnitShort || "jed"}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <Button 
                            size="lg" 
                            className="w-full md:w-auto text-lg py-6 gap-3 shadow-lg shadow-primary/20"
                            onClick={() => addItem(product)}
                        >
                            <ShoppingCart className="h-6 w-6" />
                            Přidat do košíku
                        </Button>
                        <p className="text-xs text-muted-foreground text-center md:text-left">
                            Dostupnost závisí na vybraném obchodu. Ceny se mohou lišit.
                        </p>
                    </div>

                    {/* Additional Details */}
                    <div className="pt-6 space-y-4">
                        {(product.descriptionShort || product.descriptionLong) && (
                            <div className="prose prose-sm max-w-none text-muted-foreground">
                                <h3 className="text-foreground font-semibold text-lg mb-2">Popis produktu</h3>
                                <p>{product.descriptionLong || product.descriptionShort}</p>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between py-1 border-b border-gray-200/50">
                                <span className="text-muted-foreground">Kód produktu</span>
                                <span className="font-medium">{product.sku}</span>
                            </div>
                             <div className="flex justify-between py-1 border-b border-gray-200/50">
                                <span className="text-muted-foreground">Balení</span>
                                <span className="font-medium">{product.packageLabel || product.amount}</span>
                            </div>
                             <div className="flex justify-between py-1">
                                <span className="text-muted-foreground">Značka</span>
                                <span className="font-medium">{product.brand || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <footer className="border-t bg-white py-12 mt-12">
            <div className="container px-4 text-center text-muted-foreground text-sm">
                <p className="mb-4">&copy; 2024 GrocerApp. Premium Grocery Experience.</p>
                <MadeWithDyad />
            </div>
        </footer>
    </div>
  );
};

export default ProductDetail;