import { useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { useProduct, useAddToCart } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { loginStatus, login } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success";
  const productId = id ? BigInt(id) : null;
  const { data: product, isLoading } = useProduct(productId);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (product && newQuantity >= 1 && newQuantity <= Number(product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      login();
      return;
    }

    if (!product) return;

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: BigInt(quantity),
      });
      toast.success(`${product.name} added to cart!`);
      setQuantity(1);
    } catch (error) {
      toast.error("Failed to add to cart. Please try again.");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12">
          <div className="text-center">
            <h2 className="font-display font-semibold text-2xl mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist.
            </p>
            <Link to="/products">
              <Button className="tap-target">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const inStock = Number(product.stock) > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: "/products" })}
        className="mb-6 tap-target"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant="secondary" className="w-fit mb-3">
            {product.category}
          </Badge>
          
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-4">
            {product.name}
          </h1>
          
          <p className="font-display font-bold text-3xl text-primary mb-6">
            Rs. {Number(product.price).toLocaleString()}
          </p>

          <div className="mb-6">
            <p className="text-base leading-relaxed text-foreground">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            {inStock ? (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-success" />
                <span className="text-sm font-medium text-success-foreground">
                  In Stock ({Number(product.stock)} available)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {inStock && (
            <div className="mb-6">
              <Label htmlFor="quantity" className="mb-2 block text-base font-medium">
                Quantity
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="tap-target h-12 w-12"
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= Number(product.stock)) {
                      setQuantity(val);
                    }
                  }}
                  className="w-20 text-center h-12 text-lg font-semibold"
                  min={1}
                  max={Number(product.stock)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= Number(product.stock)}
                  className="tap-target h-12 w-12"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <Button
            size="lg"
            onClick={handleAddToCart}
            disabled={!inStock || addToCart.isPending}
            className="tap-target text-lg font-semibold h-14 w-full"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {addToCart.isPending ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
