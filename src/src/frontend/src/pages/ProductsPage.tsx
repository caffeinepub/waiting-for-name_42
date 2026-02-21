import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useProducts } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingBag, X } from "lucide-react";

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Define explicit categories for HRcollection
  const hrCategories = ["Abayas", "Hijabs", "Bags", "Perfumes", "Accessories"];

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    return filtered;
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="font-display font-semibold text-4xl md:text-5xl mb-8">Our Collection</h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search our collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base rounded-full border-2 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 tap-target"
            >
              <X className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedCategory(null)}
            className="tap-target rounded-full px-6 font-semibold"
          >
            All Products
          </Button>
          {hrCategories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory(category)}
              className="tap-target rounded-full px-6 font-semibold"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="pt-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory
                ? "Try adjusting your filters"
                : "Check back soon for new items!"}
            </p>
            {(searchQuery || selectedCategory) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="tap-target"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-6 text-base text-muted-foreground font-medium">
            {filteredProducts.length} {filteredProducts.length !== 1 ? "items" : "item"}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link key={product.id.toString()} to="/products/$id" params={{ id: product.id.toString() }}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 hover:border-primary/30">
                  <div className="aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {Number(product.stock) === 0 && (
                      <Badge className="absolute top-3 right-3 text-xs px-3 py-1" variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <CardContent className="pt-5 pb-3">
                    <Badge variant="secondary" className="mb-3 text-xs font-medium">
                      {product.category}
                    </Badge>
                    <h3 className="font-display font-semibold text-xl mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0 pb-5 flex justify-between items-center">
                    <p className="font-display font-bold text-2xl text-primary">
                      Rs. {Number(product.price).toLocaleString()}
                    </p>
                    {Number(product.stock) > 0 && Number(product.stock) <= 5 && (
                      <Badge variant="outline" className="text-xs font-medium">
                        Only {Number(product.stock)} left
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
