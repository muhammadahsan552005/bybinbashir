import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Package, FolderOpen, ShoppingCart, ArrowLeft } from "lucide-react";

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !isAdmin) return null;

  const cards = [
    { title: "Products", desc: "Add, edit, and delete products", icon: Package, path: "/admin/products" },
    { title: "Collections", desc: "Manage product collections", icon: FolderOpen, path: "/admin/collections" },
    { title: "Orders", desc: "View and manage customer orders", icon: ShoppingCart, path: "/admin/orders" },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Manage your store</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((c) => (
            <Link
              key={c.path}
              to={c.path}
              className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">{c.title}</h3>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
