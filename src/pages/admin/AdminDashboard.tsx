import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, FolderOpen, ShoppingCart, ArrowLeft, TrendingUp, DollarSign, Eye, BarChart3 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "12m">("30d");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      Promise.all([
        supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
        supabase.from("products").select("*"),
      ]).then(([ordersRes, productsRes]) => {
        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
        setLoadingData(false);
      });
    }
  }, [isAdmin]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((sum, o) => sum + Number(o.total_price), 0);
    const recentOrders = orders.slice(0, 5);
    const topProducts = new Map<string, { name: string; qty: number; revenue: number }>();
    orders.forEach((o) => {
      o.order_items?.forEach((item: any) => {
        const existing = topProducts.get(item.product_name) || { name: item.product_name, qty: 0, revenue: 0 };
        existing.qty += item.quantity;
        existing.revenue += item.price * item.quantity;
        topProducts.set(item.product_name, existing);
      });
    });
    const topSelling = [...topProducts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
    return { totalOrders, totalRevenue, recentOrders, topSelling, totalProducts: products.length };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const now = new Date();
    const buckets: { label: string; start: Date; end: Date }[] = [];

    if (timeRange === "7d") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const end = new Date(start.getTime() + 86400000);
        buckets.push({ label: d.toLocaleDateString("en", { weekday: "short" }), start, end });
      }
    } else if (timeRange === "30d") {
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const end = new Date(start.getTime() + 86400000);
        buckets.push({ label: `${d.getDate()}/${d.getMonth() + 1}`, start, end });
      }
    } else {
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
        buckets.push({ label: d.toLocaleDateString("en", { month: "short" }), start: d, end });
      }
    }

    return buckets.map((b) => {
      const bucketOrders = orders.filter((o) => {
        const d = new Date(o.created_at);
        return d >= b.start && d < b.end && o.order_status !== "cancelled";
      });
      return {
        name: b.label,
        revenue: bucketOrders.reduce((s, o) => s + Number(o.total_price), 0),
        orders: bucketOrders.length,
      };
    });
  }, [orders, timeRange]);

  if (loading || !isAdmin) return null;

  const navCards = [
    { title: "Products", desc: "Add, edit, and delete products", icon: Package, path: "/admin/products" },
    { title: "Collections", desc: "Manage product collections", icon: FolderOpen, path: "/admin/collections" },
    { title: "Orders", desc: "View and manage customer orders", icon: ShoppingCart, path: "/admin/orders" },
  ];

  const chartConfig = {
    revenue: { label: "Revenue", color: "hsl(var(--primary))" },
    orders: { label: "Orders", color: "hsl(var(--primary))" },
  };

  const statusColor: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    confirmed: "text-blue-400 bg-blue-400/10",
    shipped: "text-purple-400 bg-purple-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage your store</p>
          </div>
        </div>

        {/* Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {navCards.map((c) => (
            <Link key={c.path} to={c.path}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>

        {loadingData ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading analytics...</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
                { label: "Revenue", value: `PKR ${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
                { label: "Products", value: stats.totalProducts, icon: Package },
                { label: "Avg Order", value: stats.totalOrders > 0 ? `PKR ${Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString()}` : "—", icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                  </div>
                  <p className="text-lg font-medium text-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Sales Chart */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-foreground">Sales Overview</h3>
                </div>
                <div className="flex gap-1">
                  {([["7d", "7 Days"], ["30d", "30 Days"], ["12m", "12 Months"]] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setTimeRange(key)}
                      className={`text-[10px] px-3 py-1 rounded-full border transition-all ${
                        timeRange === key ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>{label}</button>
                  ))}
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Selling */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Top Selling Products
                </h3>
                {stats.topSelling.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No sales data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topSelling.map((p, i) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                          <span className="text-sm text-foreground truncate max-w-[180px]">{p.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-primary">PKR {p.revenue.toLocaleString()}</p>
                          <p className="text-[10px] text-muted-foreground">{p.qty} sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" /> Recent Orders
                </h3>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No orders yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentOrders.map((o: any) => (
                      <div key={o.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-foreground">{o.customer_name}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${statusColor[o.order_status] || ""}`}>
                            {o.order_status}
                          </span>
                          <span className="text-xs text-primary">PKR {Number(o.total_price).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
