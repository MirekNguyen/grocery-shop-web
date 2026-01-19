import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/lib/context/store-context";
import { CartProvider } from "@/lib/context/cart-context";
import { Header } from "@/components/Header";
import { CategorySidebar } from "@/components/CategorySidebar";
import { StoreView } from "@/components/StoreView";
import { CartSheet } from "@/components/CartSheet";
import { Toaster } from "@/components/ui/toaster";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
              <Header onSearch={setSearchQuery} />
              
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <div className="flex flex-1 overflow-hidden">
                      {/* Desktop Sidebar: Visible only on large screens */}
                      <aside className="hidden lg:block w-64 border-r bg-background/50 overflow-y-auto">
                        <CategorySidebar />
                      </aside>
                      
                      <main className="flex-1 overflow-y-auto overflow-x-hidden">
                        <StoreView searchQuery={searchQuery} />
                      </main>
                    </div>
                  } 
                />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <CartSheet />
              <Toaster />
            </div>
          </BrowserRouter>
        </CartProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;