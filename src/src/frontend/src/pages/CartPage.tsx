import { Link } from "@tanstack/react-router";
import { useCartContext } from "../contexts/CartContext";
import { useUpdateCartItem, useRemoveFromCart } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { items, subtotal, isLoading } = useCartContext();
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const handleQuantityChange = async (productId: bigint, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCart.mutateAsync({
        productId,
        quantity: BigInt(newQuantity),
      });
    } catch (error) {
      toast.error("Failed to update quantity");
      console.error(error);
    }
  };

  const handleRemove = async (productId: bigint, productName: string) => {
    try {
      await removeFromCart.mutateAsync(productId);
      toast.success(`${productName} removed from cart`);
    } catch (error) {
      toast.error("Failed to remove item");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-8">Shopping Cart</h1>
        <Card className="p-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Link to="/products">
              <Button size="lg" className="tap-target">
                Browse Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <Card key={product.id.toString()}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link
                    to="/products/$id"
                    params={{ id: product.id.toString() }}
                    className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 mb-2">
                      <Link to="/products/$id" params={{ id: product.id.toString() }}>
                        <h3 className="font-display font-semibold text-lg line-clamp-1 hover:text-primary">
                          {product.name}
                        </h3>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(product.id, product.name)}
                        disabled={removeFromCart.isPending}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between gap-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(product.id, Number(quantity) - 1)}
                          disabled={Number(quantity) <= 1 || updateCart.isPending}
                          className="h-9 w-9"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={Number(quantity)}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= 1 && val <= Number(product.stock)) {
                              handleQuantityChange(product.id, val);
                            }
                          }}
                          className="w-16 text-center h-9"
                          min={1}
                          max={Number(product.stock)}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(product.id, Number(quantity) + 1)}
                          disabled={Number(quantity) >= Number(product.stock) || updateCart.isPending}
                          className="h-9 w-9"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <p className="font-display font-bold text-lg text-primary">
                        Rs. {(Number(product.price) * Number(quantity)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span className="font-display font-semibold">Total</span>
                <span className="font-display font-bold text-primary text-xl">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/checkout" className="w-full">
                <Button size="lg" className="w-full tap-target text-lg font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
