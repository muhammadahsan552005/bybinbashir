import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogOut, Settings, Package, ShieldCheck } from "lucide-react";

const Profile = () => {
  const { user, profile, isAdmin, signOut, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", address: "", city: "" });

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data }) => {
          if (data) setOrders(data);
        });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
      })
      .eq("id", user.id);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      setEditing(false);
      refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out");
  };

  if (loading || !user) return null;

  const statusColor: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    confirmed: "text-blue-400 bg-blue-400/10",
    shipped: "text-purple-400 bg-purple-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-4 py-2 hover:bg-primary/20 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
              </Link>
            )}
            <button onClick={handleSignOut} className="flex items-center gap-2 text-xs text-muted-foreground border border-border rounded-full px-4 py-2 hover:text-foreground hover:border-primary/30 transition-colors">
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-primary" /> Account Information
            </h3>
            <button onClick={() => setEditing(!editing)} className="text-xs text-primary hover:underline">
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>
          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-3">
              <input name="full_name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" maxLength={100}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
              <input name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" maxLength={20}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
              <input name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" maxLength={200}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
              <input name="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" maxLength={50}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
              <button type="submit" className="text-xs bg-primary text-primary-foreground rounded-full px-6 py-2 hover:bg-gold-glow transition-all">Save Changes</button>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted-foreground text-xs">Name</span><p className="text-foreground">{profile?.full_name || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Email</span><p className="text-foreground">{profile?.email || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">Phone</span><p className="text-foreground">{profile?.phone || "—"}</p></div>
              <div><span className="text-muted-foreground text-xs">City</span><p className="text-foreground">{profile?.city || "—"}</p></div>
              <div className="col-span-2"><span className="text-muted-foreground text-xs">Address</span><p className="text-foreground">{profile?.address || "—"}</p></div>
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" /> Order History
          </h3>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping →</Link></p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full ${statusColor[order.order_status] || "text-muted-foreground bg-secondary"}`}>
                      {order.order_status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{item.product_name} × {item.quantity}</span>
                        <span className="text-foreground">PKR {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border mt-3 pt-3 flex justify-between">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-sm font-medium text-primary">PKR {Number(order.total_price).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
