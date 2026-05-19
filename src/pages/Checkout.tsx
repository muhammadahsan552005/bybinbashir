import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Globe, CreditCard } from "lucide-react";
import emailjs from "@emailjs/browser";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Dummy test key for rendering Stripe Elements. In production, this would be your actual public key.
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

const StripePaymentForm = ({ onPaymentSuccess, disabled }: { onPaymentSuccess: () => void, disabled: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setProcessing(true);

    // Create token purely to validate the card UI securely on the frontend.
    const { error } = await stripe.createToken(cardElement);

    if (error) {
      toast.error(error.message);
      setProcessing(false);
    } else {
      // Simulate backend payment intent processing
      setTimeout(() => {
        setProcessing(false);
        onPaymentSuccess();
      }, 1500);
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-primary" /> Pay with Card (Stripe Test Mode)
      </h3>
      <div className="bg-background border border-border p-4 rounded-xl mb-4 focus-within:border-primary/50 transition-colors">
        <CardElement options={{
          style: {
            base: {
              fontSize: '14px',
              color: '#ffffff',
              '::placeholder': {
                color: '#aab7c4',
              },
              iconColor: '#D4AF37'
            },
            invalid: {
              color: '#ef4444',
            },
          },
        }} />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || processing || !stripe}
        className="w-full flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground rounded-full py-3.5 hover:bg-gold-glow transition-all duration-300 disabled:opacity-50"
      >
        <CreditCard className="w-4 h-4" />
        {processing ? "Processing Payment..." : "Pay Securely"}
      </button>
      <p className="text-[10px] text-muted-foreground text-center mt-3">
        Use <span className="font-mono text-primary">4242 4242 4242 4242</span> for testing.
      </p>
    </div>
  );
};

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || profile.full_name || "",
        phone: prev.phone || profile.phone || "",
        address: prev.address || profile.address || "",
        city: prev.city || profile.city || "",
      }));
    }
  }, [profile]);

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-8 py-20 text-center">
          <h2 className="font-display text-2xl text-foreground mb-3">No items to checkout</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">← Browse Products</Link>
        </div>
      </Layout>
    );
  }

  // Show auth options if not logged in and not guest
  if (!user && !guestMode) {
    return (
      <Layout>
        <div className="max-w-md mx-auto px-4 sm:px-8 py-16 text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Checkout</h1>
          <p className="text-sm text-muted-foreground mb-8">Choose how you'd like to proceed</p>
          <div className="space-y-3">
            <Link to="/auth" className="block w-full text-sm bg-primary text-primary-foreground rounded-full py-3.5 hover:bg-gold-glow transition-all duration-300">
              Login
            </Link>
            <Link to="/auth?mode=signup" className="block w-full text-sm border border-primary/40 text-primary rounded-full py-3.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Sign Up
            </Link>
            <button onClick={() => setGuestMode(true)} className="w-full text-sm border border-border text-muted-foreground rounded-full py-3.5 hover:text-foreground hover:border-primary/30 transition-all duration-300">
              Continue as Guest
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-6">Guests can only order via WhatsApp. Sign in to track orders.</p>
        </div>
      </Layout>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "phone") {
      let val = e.target.value.replace(/\D/g, "");
      
      // Auto-format as 03XX XXXXXXX
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 4) val = `${val.slice(0, 4)} ${val.slice(4)}`;
      
      setForm({ ...form, phone: val });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Please fill in all required fields");
      return false;
    }

    const rawPhone = form.phone.replace(/\D/g, "");
    if (rawPhone.length !== 11 || !rawPhone.startsWith("03")) {
      toast.error("Please enter a valid Pakistani phone number (e.g., 0300 1234567)");
      return false;
    }

    if (form.name.length < 3) {
      toast.error("Name must be at least 3 characters long");
      return false;
    }

    if (form.address.length < 10) {
      toast.error("Please provide a more detailed delivery address");
      return false;
    }

    return true;
  };

  const buildWhatsAppMessage = () => {
    const orderLines = items
      .map(
        (item) =>
          `Product: ${item.product.product_name}\nCode: ${item.product.product_code}\nQuantity: ${item.quantity}\nPrice: PKR ${item.product.price.toLocaleString()}`
      )
      .join("\n\n");

    return `Hello, I would like to place an order.\n\nCustomer Name: ${form.name.trim()}\nPhone Number: ${form.phone.trim()}\nAddress: ${form.address.trim()}\nCity: ${form.city.trim()}${form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : ""}\n\nOrder Details:\n\n${orderLines}\n\nTotal Price: PKR ${totalPrice.toLocaleString()}\n\nPlease confirm my order. Thank you.`;
  };

  const handleWebsiteOrder = async (status: "pending" | "paid" = "pending") => {
    if (!validateForm()) return;
    if (!user) {
      toast.error("Please sign in to place orders through the website");
      return;
    }
    setSubmitting(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: form.name.trim(),
          phone_number: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          notes: form.notes.trim() || null,
          total_price: totalPrice,
          order_status: status,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.product_name,
        product_code: item.product.product_code,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
      const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
      const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

      if (EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID") {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            to_name: form.name.trim(),
            user_email: user.email || "customer@example.com",
            order_id: order.id,
            total_amount: `PKR ${totalPrice.toLocaleString()}`,
            delivery_address: `${form.address.trim()}, ${form.city.trim()}`
          }, EMAILJS_PUBLIC_KEY);
        } catch (emailError) {
          console.error("EmailJS Error:", emailError);
        }
      }

      clearCart();
      toast.success(status === "paid" ? "Payment successful! Order placed." : "Order placed successfully!");
      navigate("/profile");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      if (user) {
        const { data: order, error: orderErr } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            customer_name: form.name.trim(),
            phone_number: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            notes: form.notes.trim() || null,
            total_price: totalPrice,
            order_status: "pending",
          })
          .select()
          .single();

        if (!orderErr && order) {
          const orderItems = items.map((item) => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.product_name,
            product_code: item.product.product_code,
            quantity: item.quantity,
            price: item.product.price,
          }));
          await supabase.from("order_items").insert(orderItems);
        }
      }

      const message = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/923276266204?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      clearCart();
      toast.success("Order placed! WhatsApp opened.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <h1 className="font-display text-3xl text-foreground mb-8">Checkout</h1>

        {guestMode && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
            You're checking out as a guest. <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to track orders and save your details.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Summary & Payment - Right Column on Desktop */}
          <div className="lg:col-span-2 lg:order-2 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
              <h3 className="text-sm font-medium text-foreground mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start justify-between text-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                        <img src={item.product.images[0]} alt={item.product.product_name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-foreground line-clamp-1">{item.product.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="text-foreground shrink-0 pl-4">PKR {(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-xl font-medium text-primary">PKR {totalPrice.toLocaleString()}</span>
              </div>

              {user && (
                <div className="mt-6">
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      onPaymentSuccess={() => handleWebsiteOrder("paid")}
                      disabled={submitting || !form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()}
                    />
                  </Elements>
                </div>
              )}
            </div>
          </div>

          {/* Form - Left Column on Desktop */}
          <div className="lg:col-span-3 lg:order-1">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Shipping Details</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1.5">Customer Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required maxLength={100}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                      placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} required maxLength={20}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                      placeholder="03XX XXXXXXX" />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1.5">City *</label>
                    <input name="city" value={form.city} onChange={handleChange} required maxLength={50}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                      placeholder="Your city" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1.5">Delivery Address *</label>
                    <input name="address" value={form.address} onChange={handleChange} required maxLength={200}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
                      placeholder="Full delivery address" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-muted-foreground mb-1.5">Notes (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} maxLength={500} rows={3}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
                      placeholder="Any special instructions..." />
                  </div>
                </div>

                <div className="mt-8 border-t border-border pt-6">
                  <h3 className="text-sm font-medium text-foreground mb-4">Other Payment Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user && (
                      <button type="button" onClick={() => handleWebsiteOrder("pending")} disabled={submitting}
                        className="flex items-center justify-center gap-2 text-sm border border-primary/40 text-primary rounded-full py-3.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 disabled:opacity-50">
                        <Globe className="w-4 h-4" />
                        {submitting ? "Processing..." : "Cash on Delivery"}
                      </button>
                    )}
                    <button type="button" onClick={handleWhatsAppOrder} disabled={submitting}
                      className={`flex items-center justify-center gap-2 text-sm rounded-full py-3.5 transition-all duration-300 disabled:opacity-50 ${user
                        ? "border border-border text-muted-foreground hover:border-primary hover:text-primary"
                        : "bg-primary text-primary-foreground hover:bg-gold-glow"
                        }`}>
                      <MessageCircle className="w-4 h-4" />
                      {submitting ? "Processing..." : "Order via WhatsApp"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
