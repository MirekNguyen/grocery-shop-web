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
            <div className="min-h-screen bg-background font-sans antialiased">
              <Header onSearch={setSearchQuery} />
              
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <div className="flex">
                      <CategorySidebar />
                      <main className="flex-1 overflow-x-hidden">
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