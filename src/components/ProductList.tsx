import { ProductWithCategories } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  products: ProductWithCategories[];
}

export const ProductList = ({ products }: ProductListProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <div className="bg-muted/50 rounded-full p-6 mb-4">
            <span className="text-4xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Žádné produkty nenalezeny</h3>
        <p className="text-muted-foreground max-w-md">
          Zkuste změnit filtry nebo hledaný výraz.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};