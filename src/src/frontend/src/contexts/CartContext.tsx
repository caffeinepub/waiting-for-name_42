import { createContext, useContext, useMemo } from "react";
import { useCart, useProducts } from "../hooks/useQueries";
import type { Product } from "../backend";

interface CartContextValue {
  items: Array<{ product: Product; quantity: bigint }>;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: cartItems = [], isLoading: cartLoading } = useCart();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const items = useMemo(() => {
    return cartItems
      .map((cartItem) => {
        const product = products.find((p) => p.id === cartItem.productId);
        if (!product) return null;
        return { product, quantity: cartItem.quantity };
      })
      .filter((item): item is { product: Product; quantity: bigint } => item !== null);
  }, [cartItems, products]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.quantity), 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.product.price) * Number(item.quantity), 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        isLoading: cartLoading || productsLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
}
