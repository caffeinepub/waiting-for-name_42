import { useParams, Link } from "@tanstack/react-router";
import { useOrder } from "../hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Package, Smartphone, CreditCard, Banknote } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const WHATSAPP_NUMBER = "03281325899";
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER.replace(/^0/, "92")}`;

export default function OrderConfirmationPage() {
  const { id } = useParams({ from: "/order/$id" });
  const orderId = id ? BigInt(id) : null;
  const { data: order, isLoading } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 max-w-2xl mx-auto">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-semibold text-2xl mb-2">Order not found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find the order you're looking for.
            </p>
            <Link to="/products">
              <Button className="tap-target">Continue Shopping</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const paymentMethodDisplay = {
    cash: { label: "Cash on Delivery", icon: Banknote },
    easypaisa: { label: "EasyPaisa", icon: Smartphone },
    jazzcash: { label: "JazzCash", icon: CreditCard },
  };

  const paymentInfo = paymentMethodDisplay[order.paymentMethod as keyof typeof paymentMethodDisplay] || {
    label: order.paymentMethod,
    icon: Banknote,
  };
  const PaymentIcon = paymentInfo.icon;

  const needsPaymentScreenshot = order.paymentMethod === "easypaisa" || order.paymentMethod === "jazzcash";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Message */}
        <Card className="border-success/50 bg-success/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h1 className="font-display font-bold text-3xl mb-2">Order Confirmed!</h1>
              <p className="text-lg text-muted-foreground mb-4">
                Thank you for your order. We'll process it shortly.
              </p>
              <div className="inline-flex items-center gap-2 bg-background px-4 py-2 rounded-lg">
                <span className="text-sm text-muted-foreground">Order Number:</span>
                <span className="font-display font-bold text-xl text-primary">
                  #{order.id.toString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions for EasyPaisa/JazzCash */}
        {needsPaymentScreenshot && (
          <Alert className="border-accent bg-accent/10">
            <Smartphone className="h-5 w-5" />
            <AlertTitle className="text-lg font-display font-semibold mb-2">
              Complete Your Payment
            </AlertTitle>
            <AlertDescription className="space-y-2 text-base">
              <p>
                <strong>1.</strong> Send Rs. {Number(order.total).toLocaleString()} to:{" "}
                <span className="font-bold">{WHATSAPP_NUMBER}</span> via {paymentInfo.label}
              </p>
              <p>
                <strong>2.</strong> Take a screenshot of the payment confirmation
              </p>
              <p className="flex items-center gap-2">
                <strong>3.</strong> Send the screenshot to our WhatsApp
              </p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full mt-3 tap-target bg-[#25D366] hover:bg-[#20BA5A] text-white">
                  <SiWhatsapp className="mr-2 h-5 w-5" />
                  Send Screenshot on WhatsApp
                </Button>
              </a>
            </AlertDescription>
          </Alert>
        )}

        {/* WhatsApp Contact (for all payment methods) */}
        {!needsPaymentScreenshot && (
          <Card className="border-accent/50 bg-accent/5">
            <CardContent className="pt-6 text-center">
              <SiWhatsapp className="h-12 w-12 text-[#25D366] mx-auto mb-3" />
              <h3 className="font-display font-semibold text-xl mb-2">Need Help?</h3>
              <p className="text-muted-foreground mb-4">
                Contact us on WhatsApp for any questions about your order
              </p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="tap-target">
                  <SiWhatsapp className="mr-2 h-5 w-5" />
                  WhatsApp: {WHATSAPP_NUMBER}
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status & Payment Method */}
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge variant="secondary" className="text-sm">
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <Badge variant="outline" className="text-sm">
                  <PaymentIcon className="mr-1.5 h-4 w-4" />
                  {paymentInfo.label}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                <p className="text-sm font-medium">
                  {new Date(Number(order.timestamp) / 1_000_000).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-3">Items</h4>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold mb-1">{item.product.name}</h5>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {Number(item.quantity)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Rs. {(Number(item.product.price) * Number(item.quantity)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex justify-between items-center text-lg pt-2">
              <span className="font-display font-semibold">Total Amount</span>
              <span className="font-display font-bold text-2xl text-primary">
                Rs. {Number(order.total).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/products" className="flex-1">
            <Button variant="outline" size="lg" className="w-full tap-target">
              Continue Shopping
            </Button>
          </Link>
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="default" size="lg" className="w-full tap-target bg-[#25D366] hover:bg-[#20BA5A]">
              <SiWhatsapp className="mr-2 h-5 w-5" />
              Contact on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
