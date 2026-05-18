import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, Globe } from "lucide-react";

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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim()) {
      toast.error("Please fill in all required fields");
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

  const handleWebsiteOrder = async () => {
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
          order_status: "pending",
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

      clearCart();
      toast.success("Order placed successfully! You can track it in your profile.");
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
      // Save order if logged in
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
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <h1 className="font-display text-3xl text-foreground mb-8">Checkout</h1>

        {guestMode && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
            You're checking out as a guest. <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to track orders and save your details.
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-8">
          <h3 className="text-sm font-medium text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.product.product_name} × {item.quantity}</span>
                <span className="text-foreground">PKR {(item.product.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Total</span>
            <span className="text-lg font-medium text-primary">PKR {totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Customer Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required maxLength={100}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="Your full name" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Phone Number *</label>
            <input name="phone" value={form.phone} onChange={handleChange} required maxLength={20}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="03XX XXXXXXX" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Delivery Address *</label>
            <input name="address" value={form.address} onChange={handleChange} required maxLength={200}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="Full delivery address" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">City *</label>
            <input name="city" value={form.city} onChange={handleChange} required maxLength={50}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              placeholder="Your city" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">Notes (optional)</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} maxLength={500} rows={3}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors resize-none"
              placeholder="Any special instructions..." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {user && (
              <button type="button" onClick={handleWebsiteOrder} disabled={submitting}
                className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground rounded-full py-3.5 hover:bg-gold-glow transition-all duration-300 disabled:opacity-50">
                <Globe className="w-4 h-4" />
                {submitting ? "Processing..." : "Order via Website"}
              </button>
            )}
            <button type="button" onClick={handleWhatsAppOrder} disabled={submitting}
              className={`flex items-center justify-center gap-2 text-sm rounded-full py-3.5 transition-all duration-300 disabled:opacity-50 ${user
                ? "border border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
                : "bg-primary text-primary-foreground hover:bg-gold-glow"
                }`}>
              <MessageCircle className="w-4 h-4" />
              {submitting ? "Processing..." : "Order via WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Checkout;
