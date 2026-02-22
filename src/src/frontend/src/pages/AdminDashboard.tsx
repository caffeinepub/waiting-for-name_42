import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useProducts,
  useUserOrders,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateOrderStatus,
  useDeleteOrder,
} from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "../backend";

export default function AdminDashboard() {
  const { loginStatus, login, isLoggingIn, isLoginError, loginError, identity } = useInternetIdentity();
  // User is logged in if they have a valid identity (either from fresh login or loaded from storage)
  const isLoggedIn = identity && !identity.getPrincipal().isAnonymous();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 max-w-2xl mx-auto">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-semibold text-2xl mb-2">Admin Access Required</h2>
            <p className="text-muted-foreground mb-6">Please login to access the admin dashboard</p>
            {isLoginError && loginError && (
              <p className="text-sm text-destructive mb-4">
                {loginError.message || "Login failed. Please try again."}
              </p>
            )}
            <Button 
              onClick={login} 
              size="lg" 
              className="tap-target"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Logging in..." : "Login"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display font-semibold text-4xl md:text-5xl mb-8">HRcollection Admin</h1>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="products" className="tap-target">
            <Package className="mr-2 h-4 w-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="tap-target">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProductsTab() {
  const { data: products = [], isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingSamples, setIsLoadingSamples] = useState(false);

  const handleLoadSamples = async () => {
    setIsLoadingSamples(true);
    
    const sampleProducts = [
      {
        name: "Classic Black Abaya",
        description: "Elegant and timeless black abaya perfect for everyday wear. Made from premium breathable fabric with modest fit.",
        price: 3500,
        stock: 15,
        category: "Abayas",
        imageUrl: "/assets/generated/abaya-black.dim_800x800.jpg",
      },
      {
        name: "Embroidered Navy Abaya",
        description: "Luxurious navy blue abaya with intricate gold embroidery on sleeves and neckline. Perfect for special occasions.",
        price: 5500,
        stock: 8,
        category: "Abayas",
        imageUrl: "/assets/generated/abaya-embroidered.dim_800x800.jpg",
      },
      {
        name: "Premium Chiffon Hijab",
        description: "Soft and lightweight chiffon hijab in beautiful pastel pink. Easy to style and comfortable for all-day wear.",
        price: 850,
        stock: 30,
        category: "Hijabs",
        imageUrl: "/assets/generated/hijab-chiffon.dim_800x800.jpg",
      },
      {
        name: "Cotton Jersey Hijab",
        description: "Ultra-soft cotton jersey hijab in warm beige. Non-slip material that stays in place throughout the day.",
        price: 650,
        stock: 40,
        category: "Hijabs",
        imageUrl: "/assets/generated/hijab-jersey.dim_800x800.jpg",
      },
      {
        name: "Elegant Tote Bag",
        description: "Spacious camel brown leather tote bag perfect for daily use. Features multiple compartments and durable construction.",
        price: 4200,
        stock: 12,
        category: "Bags",
        imageUrl: "/assets/generated/bag-tote.dim_800x800.jpg",
      },
      {
        name: "Chic Crossbody Bag",
        description: "Stylish black crossbody bag with elegant gold chain strap. Compact yet spacious, perfect for outings.",
        price: 3800,
        stock: 10,
        category: "Bags",
        imageUrl: "/assets/generated/bag-crossbody.dim_800x800.jpg",
      },
      {
        name: "Luxury Oud Perfume",
        description: "Rich and captivating oud fragrance with warm woody notes. Long-lasting premium Arabian perfume in elegant bottle.",
        price: 2500,
        stock: 20,
        category: "Perfumes",
        imageUrl: "/assets/generated/perfume-oud.dim_800x800.jpg",
      },
      {
        name: "Floral Musk Perfume",
        description: "Delicate floral musk scent with hints of jasmine and rose. Perfect for daily wear with lasting freshness.",
        price: 2200,
        stock: 25,
        category: "Perfumes",
        imageUrl: "/assets/generated/perfume-musk.dim_800x800.jpg",
      },
      {
        name: "Decorative Hijab Pins Set",
        description: "Beautiful set of 6 hijab pins adorned with pearls and crystals. Gold and silver tones in elegant designs.",
        price: 950,
        stock: 35,
        category: "Accessories",
        imageUrl: "/assets/generated/accessories-pins.dim_800x800.jpg",
      },
      {
        name: "Elegant Brooch Collection",
        description: "Set of 3 stunning brooches featuring Islamic geometric patterns with gold finish and pearl accents.",
        price: 1200,
        stock: 28,
        category: "Accessories",
        imageUrl: "/assets/generated/accessories-brooches.dim_800x800.jpg",
      },
    ];

    try {
      for (const product of sampleProducts) {
        await createProduct.mutateAsync({
          name: product.name,
          description: product.description,
          price: BigInt(product.price),
          imageUrl: product.imageUrl,
          stock: BigInt(product.stock),
          category: product.category,
        });
      }
      toast.success("10 sample products loaded successfully!");
    } catch (error) {
      toast.error("Failed to load sample products");
      console.error(error);
    } finally {
      setIsLoadingSamples(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-display text-2xl">Products</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingProduct(null)}
              className="tap-target"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <ProductForm
              product={editingProduct}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No products yet. Add your first product!</p>
            <Button
              onClick={handleLoadSamples}
              disabled={isLoadingSamples}
              variant="outline"
              className="tap-target"
            >
              {isLoadingSamples ? "Loading..." : "Load Sample Products"}
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id.toString()}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>Rs. {Number(product.price).toLocaleString()}</TableCell>
                    <TableCell>{Number(product.stock)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <ProductForm
                              product={product}
                              onClose={() => setEditingProduct(null)}
                            />
                          </DialogContent>
                        </Dialog>
                        <DeleteProductButton productId={product.id} productName={product.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductForm({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product ? Number(product.price) : 0,
    imageUrl: product?.imageUrl || "",
    stock: product ? Number(product.stock) : 0,
    category: product?.category || "Abayas",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (product) {
        await updateProduct.mutateAsync({
          id: product.id,
          name: formData.name,
          description: formData.description,
          price: BigInt(formData.price),
          imageUrl: formData.imageUrl,
          stock: BigInt(formData.stock),
          category: formData.category,
        });
        toast.success("Product updated successfully!");
      } else {
        await createProduct.mutateAsync({
          name: formData.name,
          description: formData.description,
          price: BigInt(formData.price),
          imageUrl: formData.imageUrl,
          stock: BigInt(formData.stock),
          category: formData.category,
        });
        toast.success("Product created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save product");
      console.error(error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display text-2xl">
          {product ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogDescription>
          {product ? "Update product details" : "Fill in the details for your new product"}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={3}
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (Rs.) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
              required
              min={0}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock *</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              required
              min={0}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
            required
          >
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Abayas">Abayas</SelectItem>
              <SelectItem value="Hijabs">Hijabs</SelectItem>
              <SelectItem value="Bags">Bags</SelectItem>
              <SelectItem value="Perfumes">Perfumes</SelectItem>
              <SelectItem value="Accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL *</Label>
          <Input
            id="imageUrl"
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
            className="mt-1.5"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
            {createProduct.isPending || updateProduct.isPending
              ? "Saving..."
              : product
              ? "Update Product"
              : "Add Product"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function DeleteProductButton({ productId, productName }: { productId: bigint; productName: string }) {
  const deleteProduct = useDeleteProduct();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success(`${productName} deleted`);
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{productName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProduct.isPending}
          >
            {deleteProduct.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrdersTab() {
  const { data: orders = [], isLoading } = useUserOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  const handleStatusChange = async (orderId: bigint, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  const handleDeleteOrder = async (orderId: bigint) => {
    try {
      await deleteOrder.mutateAsync(orderId);
      toast.success("Order deleted");
    } catch (error) {
      toast.error("Failed to delete order");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id.toString()}>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-display font-bold text-lg">
                          Order #{order.id.toString()}
                        </span>
                        <Badge variant="secondary">{order.paymentMethod}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Number(order.timestamp) / 1_000_000).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deleteOrder.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-semibold">Items:</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} × {Number(item.quantity)}
                        </span>
                        <span className="font-medium">
                          Rs. {(Number(item.product.price) * Number(item.quantity)).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t font-display font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">Rs. {Number(order.total).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
