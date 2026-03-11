import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

const AdminOrders = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ order_status: status }).eq("id", orderId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Order marked as ${status}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    }
  };

  if (loading || !isAdmin) return null;

  const filtered = filter === "all" ? orders : orders?.filter((o: any) => o.order_status === filter);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl text-foreground">Orders</h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", ...statuses].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-4 py-1.5 rounded-full border transition-all ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading orders...</p>
        ) : !filtered?.length ? (
          <p className="text-sm text-muted-foreground text-center py-12">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filtered?.map((order: any) => (
              <div key={order.id} className="bg-card rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.phone_number} · {order.city}</p>
                    <p className="text-xs text-muted-foreground">{order.address}</p>
                    {order.notes && <p className="text-xs text-muted-foreground italic mt-1">Note: {order.notes}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    <p className="text-sm font-medium text-primary">PKR {Number(order.total_price).toLocaleString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-1 mb-4">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{item.product_name} ({item.product_code}) × {item.quantity}</span>
                      <span className="text-foreground">PKR {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="flex flex-wrap items-center gap-2">
                  {statuses.map((s) => (
                    <button key={s} onClick={() => updateStatus(order.id, s)}
                      className={`text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                        order.order_status === s ? statusColor[s] : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminOrders;
