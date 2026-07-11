import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import WhatsAppFloat from "@/components/common/WhatsAppFloat";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import Collections from "@/pages/Collections";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Wishlist from "@/pages/Wishlist";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/collections" component={Collections} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/admin">
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <SearchProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
                <Toaster />
                <WhatsAppFloat />
               
              </SearchProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;