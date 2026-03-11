import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Upload, X } from "lucide-react";

const AdminProducts = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { data: collections } = useCollections();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_name: "",
    product_code: "",
    description: "",
    price: "",
    collection_id: "",
    stock_quantity: "0",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !isAdmin) return null;

  const resetForm = () => {
    setForm({ product_name: "", product_code: "", description: "", price: "", collection_id: "", stock_quantity: "0" });
    setEditId(null);
    setShowForm(false);
  };

  const startEdit = (p: any) => {
    setForm({
      product_name: p.product_name,
      product_code: p.product_code,
      description: p.description || "",
      price: String(p.price),
      collection_id: p.collection_id || "",
      stock_quantity: String(p.stock_quantity),
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.product_name.trim() || !form.product_code.trim() || !form.price.trim()) {
      toast.error("Name, code, and price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        product_name: form.product_name.trim(),
        product_code: form.product_code.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        collection_id: form.collection_id || null,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        updated_at: new Date().toISOString(),
      };

      if (editId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editId);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product added");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Product deleted");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  };

  const handleImageUpload = async (productId: string, files: FileList) => {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const path = `${productId}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from("product-images").upload(path, file);
        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        await supabase.from("product_images").insert({ product_id: productId, image_url: urlData.publicUrl });
      }
      toast.success("Images uploaded");
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageUrl: string, productId: string) => {
    const path = imageUrl.split("/product-images/")[1];
    if (path) {
      await supabase.storage.from("product-images").remove([path]);
    }
    await supabase.from("product_images").delete().eq("image_url", imageUrl).eq("product_id", productId);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success("Image deleted");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl text-foreground">Products</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 text-xs bg-primary text-primary-foreground rounded-full px-5 py-2 hover:bg-gold-glow transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h3 className="text-sm font-medium text-foreground mb-4">{editId ? "Edit Product" : "New Product"}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="Product Name *" maxLength={200}
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                <input value={form.product_code} onChange={(e) => setForm({ ...form, product_code: e.target.value })} placeholder="Product Code *" maxLength={50}
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price (PKR) *" type="number" min="0"
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                <input value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Stock Quantity" type="number" min="0"
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50">
                  <option value="">No Collection</option>
                  {collections?.map((c) => <option key={c.id} value={c.id}>{c.collection_name}</option>)}
                </select>
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} maxLength={2000}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="text-xs bg-primary text-primary-foreground rounded-full px-6 py-2 hover:bg-gold-glow transition-all disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={resetForm} className="text-xs text-muted-foreground border border-border rounded-full px-6 py-2 hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product List */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading products...</p>
        ) : (
          <div className="space-y-3">
            {products?.map((p) => (
              <div key={p.id} className="bg-card rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                      <img src={p.images[0]} alt={p.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{p.product_name}</h4>
                      <p className="text-xs text-muted-foreground">{p.product_code} · {p.collection_name || "No collection"}</p>
                      <p className="text-sm text-primary mt-0.5">PKR {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <label className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(p.id, e.target.files)} disabled={uploading} />
                    </label>
                    <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Image thumbnails */}
                {p.images.length > 0 && p.images[0] !== "/placeholder.svg" && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {p.images.map((img, i) => (
                      <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary group/img">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button onClick={() => handleDeleteImage(img, p.id)} className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;
