import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCartContext } from "../contexts/CartContext";
import { useCreateOrder } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingBag, Banknote, Smartphone, CreditCard, AlertCircle } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

type PaymentMethod = "cash" | "easypaisa" | "jazzcash";

const WHATSAPP_NUMBER = "03281325899";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal } = useCartContext();
  const createOrder = useCreateOrder();
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("Please fill in all fields");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      const orderId = await createOrder.mutateAsync(paymentMethod);
      toast.success("Order placed successfully!");
      navigate({ to: "/order/$id", params: { id: orderId.toString() } });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add some products before checking out
            </p>
            <Button onClick={() => navigate({ to: "/products" })} className="tap-target">
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-base">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="mt-1.5 h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="03XXXXXXXXX"
                    required
                    className="mt-1.5 h-12 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-base">
                    Delivery Address *
                  </Label>
                  <Textarea
                    id="address"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    placeholder="House no., Street, Area, City"
                    required
                    rows={3}
                    className="mt-1.5 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  className="space-y-3"
                >
                  {/* Cash on Delivery */}
                  <label
                    htmlFor="cash"
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all tap-target ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <RadioGroupItem value="cash" id="cash" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Banknote className="h-5 w-5 text-primary" />
                        <span className="font-display font-semibold text-lg">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered
                      </p>
                    </div>
                  </label>

                  {/* EasyPaisa */}
                  <label
                    htmlFor="easypaisa"
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all tap-target ${
                      paymentMethod === "easypaisa"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <RadioGroupItem value="easypaisa" id="easypaisa" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="h-5 w-5 text-accent" />
                        <span className="font-display font-semibold text-lg">EasyPaisa</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pay via EasyPaisa mobile wallet
                      </p>
                      {paymentMethod === "easypaisa" && (
                        <Alert className="bg-accent/10 border-accent">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <p className="font-semibold mb-1">Send payment to: {WHATSAPP_NUMBER}</p>
                            <div className="flex items-center gap-1.5">
                              <SiWhatsapp className="h-4 w-4" />
                              <span>Send screenshot to WhatsApp: {WHATSAPP_NUMBER}</span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    htmlFor="jazzcash"
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all tap-target ${
                      paymentMethod === "jazzcash"
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <RadioGroupItem value="jazzcash" id="jazzcash" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-5 w-5 text-accent" />
                        <span className="font-display font-semibold text-lg">JazzCash</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Pay via JazzCash mobile wallet
                      </p>
                      {paymentMethod === "jazzcash" && (
                        <Alert className="bg-accent/10 border-accent">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <p className="font-semibold mb-1">Send payment to: {WHATSAPP_NUMBER}</p>
                            <div className="flex items-center gap-1.5">
                              <SiWhatsapp className="h-4 w-4" />
                              <span>Send screenshot to WhatsApp: {WHATSAPP_NUMBER}</span>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-display text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id.toString()} className="flex gap-3">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {Number(quantity)}</p>
                        <p className="text-sm font-semibold text-primary">
                          Rs. {(Number(product.price) * Number(quantity)).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold">To be confirmed</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-display font-semibold">Total</span>
                    <span className="font-display font-bold text-primary text-xl">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={createOrder.isPending}
                  className="w-full tap-target text-lg font-semibold"
                >
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
