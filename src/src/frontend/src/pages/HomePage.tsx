import { Link } from "@tanstack/react-router";
import { useProducts } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <h1 className="font-display font-bold text-4xl md:text-6xl mb-4 text-foreground">
          Welcome to Our Shop
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Discover amazing products with fast delivery and flexible payment options
        </p>
        <Link to="/products">
          <Button size="lg" className="tap-target text-lg font-semibold">
            Browse Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Featured Products */}
      <section className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-2xl md:text-3xl">Featured Products</h2>
          <Link to="/products">
            <Button variant="outline" className="tap-target">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="pt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl mb-2">No products yet</h3>
              <p className="text-muted-foreground">Check back soon for new items!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id.toString()} to="/products/$id" params={{ id: product.id.toString() }}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
                  <div className="aspect-square overflow-hidden bg-muted">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-display font-semibold text-lg mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <p className="font-display font-bold text-xl text-primary">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">Easy Shopping</h3>
          <p className="text-sm text-muted-foreground">
            Browse and order your favorite products with just a few taps
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">Flexible Payment</h3>
          <p className="text-sm text-muted-foreground">
            Pay with Cash on Delivery, EasyPaisa, or JazzCash
          </p>
        </Card>
        <Card className="text-center p-6">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">WhatsApp Support</h3>
          <p className="text-sm text-muted-foreground">
            Get instant support via WhatsApp at 03281325899
          </p>
        </Card>
      </section>
    </div>
  );
}
