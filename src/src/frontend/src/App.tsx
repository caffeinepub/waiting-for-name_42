import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./contexts/CartContext";
import { useCartContext } from "./contexts/CartContext";
import { ShoppingCart, Store, User } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { toast } from "sonner";
import { useEffect } from "react";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminDashboard from "./pages/AdminDashboard";
import AuthTestPage from "./pages/AuthTestPage";

function Layout() {
  const { totalItems } = useCartContext();
  const { loginStatus, login, clear, isLoggingIn, isLoginError, loginError, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && identity && !identity.getPrincipal().isAnonymous();

  // Show error toast when login fails (but not for "already authenticated")
  useEffect(() => {
    if (isLoginError && loginError) {
      // Don't show error if user is already authenticated
      if (loginError.message?.includes("already authenticated")) {
        toast.success("You're already logged in!", {
          description: "Access admin panel from the menu",
        });
      } else {
        toast.error("Login failed", {
          description: loginError.message || "Please try again",
        });
      }
    }
  }, [isLoginError, loginError]);

  // Show success toast when login succeeds
  useEffect(() => {
    if (isLoggedIn) {
      toast.success("Login successful", {
        description: "Welcome to HRcollection Admin!",
      });
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 tap-target">
            <Store className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-2xl tracking-wide">HRcollection</span>
          </Link>
          
          <nav className="flex items-center gap-2 sm:gap-4">
            <Link to="/products">
              <Button variant="ghost" size="sm" className="tap-target text-base">
                Products
              </Button>
            </Link>
            <Link to="/cart" className="relative tap-target">
              <Button variant="ghost" size="sm" className="relative tap-target">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
            {isLoggedIn ? (
              <>
                <Link to="/admin">
                  <Button variant="default" size="sm" className="tap-target">
                    <User className="h-5 w-5 sm:mr-2" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clear}
                  className="tap-target"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">✕</span>
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm" 
                onClick={login}
                disabled={isLoggingIn}
                className="tap-target"
              >
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with love using{" "}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-3 flex items-center justify-center gap-4 flex-wrap">
            <a
              href="https://www.instagram.com/hrjewerlycollection/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <SiInstagram className="h-4 w-4" />
              <span>@hrjewerlycollection</span>
            </a>
            <Link
              to="/auth-test"
              className="text-muted-foreground hover:text-primary transition-colors text-xs"
            >
              Login Issues? Test Here
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products",
  component: ProductsPage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/products/$id",
  component: ProductDetailPage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$id",
  component: OrderConfirmationPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

const authTestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth-test",
  component: AuthTestPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  productDetailRoute,
  cartRoute,
  checkoutRoute,
  orderRoute,
  adminRoute,
  authTestRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster />
      </CartProvider>
    </ThemeProvider>
  );
}
