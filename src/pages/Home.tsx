import { useState } from "react";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { ProductList } from "@/components/ProductList";
import { useProducts, useCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useStore } from "@/lib/context/store-context";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category") || undefined;
  const { selectedStore } = useStore();

  const { data: productsData, isLoading: productsLoading } = useProducts({
    search: searchQuery,
    category: categorySlug,
    store: selectedStore,
  });

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Handle the object structure from API (grouped by store)
  const activeCategories = categories ? Object.values(categories).flat() : [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={setSearchQuery} />
      
      <main className="flex-1 container py-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Kategorie</h2>
          </div>
          {categoriesLoading ? (
             <div className="flex gap-4 overflow-auto pb-4">
                 {[1,2,3,4].map(i => (
                     <div key={i} className="h-10 w-32 bg-gray-100 animate-pulse rounded-full" />
                 ))}
             </div>
          ) : (
             <CategoryNav categories={activeCategories} />
          )}
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
                {searchQuery ? `Výsledky pro "${searchQuery}"` : 
                 categorySlug ? "Produkty v kategorii" : 
                 selectedStore ? `Produkty v obchodu ${selectedStore === 'BILLA' ? 'Billa' : 'Foodora Market'}` :
                 "Doporučené produkty"}
            </h2>
            <Button variant="link" className="text-primary">
              Zobrazit vše
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[300px] bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <ProductList products={productsData?.data || []} />
          )}

          {productsData?.data.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  Nebyly nalezeny žádné produkty.
              </div>
          )}
        </section>
      </main>
      
      <footer className="border-t bg-gray-50 py-12 mt-auto">
        <div className="container text-center text-muted-foreground">
           <p>&copy; 2024 GrocerApp. Všechna práva vyhrazena.</p>
           <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;