import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { StoreProvider } from "@/lib/context/store-context";
import { CartProvider } from "@/lib/context/cart-context";
import { Header } from "@/components/Header";
import { CategorySidebar } from "@/components/CategorySidebar";
import { StoreView } from "@/components/StoreView";
import { CartSheet } from "@/components/CartSheet";
import { Toaster } from "@/components/ui/toaster";

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
              
              <div className="flex">
                <CategorySidebar />
                <main className="flex-1 overflow-x-hidden">
                  <StoreView searchQuery={searchQuery} />
                </main>
              </div>
              
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