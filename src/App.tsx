import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import AnimatedRoutes from "@/components/AnimatedRoutes";
import ScrollToTop from "@/components/ScrollToTop";
import Preloader from "@/components/Preloader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <Preloader />
          <BrowserRouter>
            <ScrollToTop />
            <AnimatedRoutes />
          </BrowserRouter>
        </TooltipProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
