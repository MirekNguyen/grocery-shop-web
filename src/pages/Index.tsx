import { useState, useMemo } from "react";
import { mockProducts, mockCategories } from "@/data/mock";
import { ProductList } from "@/components/ProductList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? product.categories.some((c) => c.id === selectedCategory)
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                    G
                </div>
                Grocer<span className="text-primary/70">App</span>
            </div>

            <div className="hidden md:flex flex-1 max-w-md relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Hledat produkty..." 
                    className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

             <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" className="md:hidden">
                     <Search className="h-5 w-5" />
                 </Button>
                 <Button variant="outline" size="sm" className="hidden md:flex">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filtry
                 </Button>
                 <div className="h-8 w-px bg-border mx-2" />
                 <Button size="sm">Košík (0)</Button>
             </div>
        </div>
      </header>

      <main className="container px-4 md:px-6 py-8 space-y-8">
        {/* Mobile Search - Visible only on small screens */}
        <div className="md:hidden">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Hledat produkty..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        {/* Categories Scroller */}
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold tracking-tight">Kategorie</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-fade-right">
                <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className="rounded-full shadow-sm whitespace-nowrap"
                >
                    Vše
                </Button>
                {mockCategories.map((category) => (
                    <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category.id)}
                        className="rounded-full shadow-sm whitespace-nowrap border-muted-foreground/20"
                    >
                        {category.name}
                    </Button>
                ))}
            </div>
        </section>

        {/* Product Grid */}
        <section className="space-y-4">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold tracking-tight">
                    {selectedCategory 
                        ? mockCategories.find(c => c.id === selectedCategory)?.name 
                        : "Všechny produkty"}
                    <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground text-xs align-middle">
                        {filteredProducts.length}
                    </Badge>
                </h2>
             </div>
             
             <ProductList products={filteredProducts} />
        </section>
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

export default Index;