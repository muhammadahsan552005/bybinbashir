import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCollections } from "@/hooks/useCollections";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

const AdminCollections = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { data: collections, isLoading } = useCollections();
  const queryClient = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ collection_name: "", slug: "", description: "", hero_color: "from-slate-950/40" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/");
  }, [user, isAdmin, loading, navigate]);

  if (loading || !isAdmin) return null;

  const resetForm = () => {
    setForm({ collection_name: "", slug: "", description: "", hero_color: "from-slate-950/40" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.collection_name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        collection_name: form.collection_name.trim(),
        slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
        description: form.description.trim() || null,
        hero_color: form.hero_color,
      };
      if (editId) {
        const { error } = await supabase.from("collections").update(payload).eq("id", editId);
        if (error) throw error;
        toast.success("Collection updated");
      } else {
        const { error } = await supabase.from("collections").insert(payload);
        if (error) throw error;
        toast.success("Collection created");
      }
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this collection?")) return;
    const { error } = await supabase.from("collections").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Collection deleted");
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    }
  };

  const startEdit = (c: any) => {
    setForm({ collection_name: c.collection_name, slug: c.slug, description: c.description || "", hero_color: c.hero_color });
    setEditId(c.id);
    setShowForm(true);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-2xl text-foreground">Collections</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 text-xs bg-primary text-primary-foreground rounded-full px-5 py-2 hover:bg-gold-glow transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Collection
          </button>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={form.collection_name} onChange={(e) => setForm({ ...form, collection_name: e.target.value })} placeholder="Collection Name *" maxLength={100}
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="Slug (e.g. rolex) *" maxLength={50}
                  className="bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50" />
              </div>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} maxLength={1000}
                className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="text-xs bg-primary text-primary-foreground rounded-full px-6 py-2 hover:bg-gold-glow transition-all disabled:opacity-50">
                  {saving ? "Saving..." : editId ? "Update" : "Create"}
                </button>
                <button type="button" onClick={resetForm} className="text-xs text-muted-foreground border border-border rounded-full px-6 py-2 hover:text-foreground transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-12">Loading...</p>
        ) : (
          <div className="space-y-3">
            {collections?.map((c) => (
              <div key={c.id} className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-foreground">{c.collection_name}</h4>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(c)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminCollections;
