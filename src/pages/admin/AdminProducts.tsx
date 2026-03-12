import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Upload, X, Eye, Package } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const AdminProducts = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const { data: collections } = useCollections();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    product_name: "", product_code: "", description: "", price: "", collection_id: "", stock_quantity: "0",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [viewProduct, setViewProduct] = useState<any>(null);

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
      product_name: p.product_name, product_code: p.product_code, description: p.description || "",
      price: String(p.price), collection_id: p.collection_id || "", stock_quantity: String(p.stock_quantity),
    });
    setEditId(p.id);
    setShowForm(true);
    setViewProduct(null);
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
        product_name: form.product_name.trim(), product_code: form.product_code.trim(),
        description: form.description.trim() || null, price: parseFloat(form.price),
        collection_id: form.collection_id || null, stock_quantity: parseInt(form.stock_quantity) || 0,
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
    if (path) await supabase.storage.from("product-images").remove([path]);
    await supabase.from("product_images").delete().eq("image_url", imageUrl).eq("product_id", productId);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success("Image deleted");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl text-foreground">Products</h1>
            <span className="text-xs text-muted-foreground">({products?.length || 0} total)</span>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 text-xs bg-primary text-primary-foreground rounded-full px-5 py-2 hover:bg-gold-glow transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>

        {/* View Product Modal */}
        {viewProduct && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Product Details</h3>
              <button onClick={() => setViewProduct(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {viewProduct.images?.length > 0 && viewProduct.images[0] !== "/placeholder.svg" && (
                  <div className="flex gap-2 flex-wrap mb-4">
                    {viewProduct.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="" className="w-24 h-24 rounded-xl object-cover" />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Name:</span> <span className="text-foreground">{viewProduct.product_name}</span></p>
                <p><span className="text-muted-foreground">Code:</span> <span className="text-foreground">{viewProduct.product_code}</span></p>
                <p><span className="text-muted-foreground">Price:</span> <span className="text-primary">PKR {viewProduct.price.toLocaleString()}</span></p>
                <p><span className="text-muted-foreground">Stock:</span> <span className={viewProduct.stock_quantity <= 0 ? "text-destructive" : "text-foreground"}>{viewProduct.stock_quantity <= 0 ? "Out of Stock" : `${viewProduct.stock_quantity} in stock`}</span></p>
                <p><span className="text-muted-foreground">Collection:</span> <span className="text-foreground">{viewProduct.collection_name || "None"}</span></p>
                {viewProduct.description && <p><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{viewProduct.description}</span></p>}
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <h3 className="text-sm font-medium text-foreground mb-4">{editId ? "Edit Product" : "New Product"}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Product Name *</label>
                  <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="Product Name" maxLength={200}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Product Code *</label>
                  <input value={form.product_code} onChange={(e) => setForm({ ...form, product_code: e.target.value })} placeholder="Product Code" maxLength={50}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Price (PKR) *</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" type="number" min="0"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Stock Quantity</label>
                  <input value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Stock Quantity" type="number" min="0"
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Collection</label>
                  <select value={form.collection_id} onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                    className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50">
                    <option value="">No Collection</option>
                    {collections?.map((c) => <option key={c.id} value={c.id}>{c.collection_name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Product description" rows={3} maxLength={2000}
                  className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="text-xs bg-primary text-primary-foreground rounded-full px-6 py-2 hover:bg-gold-glow transition-all disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update Product" : "Create Product"}
                </button>
                <button type="button" onClick={resetForm} className="text-xs text-muted-foreground border border-border rounded-full px-6 py-2 hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Table */}
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading products...</p>
        ) : !products?.length ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">No products yet. Add your first product above.</p>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden md:table-cell">Collection</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-secondary">
                        <img src={p.images[0]} alt={p.product_name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{p.product_name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.product_code}</p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{p.collection_name || "—"}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-primary">PKR {p.price.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.stock_quantity <= 0 ? "text-destructive bg-destructive/10" : "text-foreground bg-secondary"}`}>
                        {p.stock_quantity <= 0 ? "Out of Stock" : p.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <label className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-colors">
                              <Upload className="w-3.5 h-3.5" />
                              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleImageUpload(p.id, e.target.files)} disabled={uploading} />
                            </label>
                          </TooltipTrigger>
                          <TooltipContent>Upload Images</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => setViewProduct(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>View Details</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Edit Product</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Delete Product</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminProducts;
