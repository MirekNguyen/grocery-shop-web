import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "@/lib/context/store-context";
import { CartProvider } from "@/lib/context/cart-context";
import { Header } from "@/components/Header";
import { MainLayout } from "@/components/MainLayout";
import { CartSheet } from "@/components/CartSheet";
import { Toaster } from "@/components/ui/toaster";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
              <Header />
              
              <Routes>
                <Route 
                  path="/" 
                  element={<MainLayout />} 
                />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
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