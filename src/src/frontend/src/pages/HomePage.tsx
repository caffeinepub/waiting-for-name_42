import { Link } from "@tanstack/react-router";
import { useProducts } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { SiInstagram } from "react-icons/si";

export default function HomePage() {
  const { data: products = [], isLoading } = useProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div>
      {/* Hero Banner Section */}
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mb-12">
        {/* Banner Image */}
        <img
          src="/assets/generated/banner-hero-1.dim_1200x500.jpg"
          alt="Elegant modest abaya fashion - HRcollection Islamic wear for modern Muslim women"
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        
        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display font-semibold text-4xl md:text-6xl lg:text-7xl mb-4 text-white leading-tight max-w-4xl">
            Welcome to <span className="font-bold italic">HRcollection</span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover elegant abayas, premium hijabs, and refined modest fashion accessories
          </p>
          <Link to="/products">
            <Button size="lg" className="tap-target text-lg font-semibold px-10 py-7 rounded-full bg-white text-primary hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all duration-200">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">

        {/* Featured Products */}
        <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-semibold text-3xl md:text-4xl">Featured Collection</h2>
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
        <section className="py-16 grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        <Link to="/products" className="block">
          <Card className="text-center p-8 border-2 hover:border-primary/50 transition-colors h-full cursor-pointer hover:shadow-lg">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShoppingBag className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-3">Modest Fashion</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Curated selection of elegant Islamic clothing and accessories designed for the modern Muslim woman
            </p>
          </Card>
        </Link>
        <Link to="/checkout" className="block">
          <Card className="text-center p-8 border-2 hover:border-primary/50 transition-colors h-full cursor-pointer hover:shadow-lg">
            <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="h-7 w-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl mb-3">Flexible Payment</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cash on Delivery, EasyPaisa, or JazzCash — choose what works best for you
            </p>
          </Card>
        </Link>
        <a
          href="https://wa.me/923281325899"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="text-center p-8 border-2 hover:border-primary/50 transition-colors h-full cursor-pointer hover:shadow-lg">
            <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-xl mb-3">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Get instant personalized support via WhatsApp at 03281325899
            </p>
          </Card>
        </a>
        <a
          href="https://www.instagram.com/hrjewerlycollection/"
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="text-center p-8 border-2 hover:border-primary/50 transition-colors h-full cursor-pointer hover:shadow-lg">
            <div className="w-14 h-14 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <SiInstagram className="h-7 w-7 text-pink-500" />
            </div>
            <h3 className="font-display font-semibold text-xl mb-3">Follow Us on Instagram</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Stay updated with our latest collections and exclusive offers @hrjewerlycollection
            </p>
          </Card>
        </a>
        </section>
      </div>
    </div>
  );
}
