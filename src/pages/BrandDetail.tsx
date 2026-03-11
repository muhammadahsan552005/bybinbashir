import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import FloatingSupport from "@/components/FloatingSupport";
import { useCollection } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const BrandDetail = () => {
  const { slug } = useParams();
  const { data: collection, isLoading: loadingCollection } = useCollection(slug);
  const { data: allProducts } = useProducts();
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);

  const brandProducts = useMemo(() => {
    let result = (allProducts || []).filter((p) => p.collection_slug === slug);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "low-high") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "high-low") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [allProducts, slug, sortBy, priceRange]);

  const maxPrice = useMemo(() => {
    const all = (allProducts || []).filter((p) => p.collection_slug === slug);
    return all.length ? Math.max(...all.map((p) => p.price)) : 500000;
  }, [allProducts, slug]);

  if (loadingCollection) {
    return <Layout><div className="flex items-center justify-center h-screen"><p className="text-sm text-muted-foreground">Loading...</p></div></Layout>;
  }

  if (!collection) {
    return <Layout><div className="flex items-center justify-center h-screen"><p className="text-muted-foreground">Brand not found.</p></div></Layout>;
  }

  return (
    <Layout>
      <section className="relative h-[60vh] overflow-hidden">
        {collection.image_url ? (
          <img src={collection.image_url} alt={collection.collection_name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${collection.hero_color} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="relative h-full flex flex-col justify-end pb-12 px-8 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link to="/brands" className="text-xs text-muted-foreground hover:text-primary transition-colors mb-4 inline-block">← All Brands</Link>
            <h2 className="font-display text-5xl lg:text-6xl text-foreground mb-4">{collection.collection_name}</h2>
            <p className="text-sm text-foreground/80 max-w-lg">{collection.description}</p>
          </motion.div>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-primary mb-2">{collection.collection_name.toUpperCase()} COLLECTION</p>
            <h3 className="font-display text-2xl text-foreground">{brandProducts.length} Timepiece{brandProducts.length !== 1 ? "s" : ""}</h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs transition-all ${
              showFilters ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">Sort by Price</label>
                <div className="flex gap-2">
                  {[{ value: "default", label: "Default" }, { value: "low-high", label: "Low to High" }, { value: "high-low", label: "High to Low" }].map((opt) => (
                    <button key={opt.value} onClick={() => setSortBy(opt.value)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all ${sortBy === opt.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">Price: PKR {priceRange[0].toLocaleString()} — PKR {priceRange[1].toLocaleString()}</label>
                <Slider min={0} max={maxPrice} step={1000} value={priceRange} onValueChange={(v) => setPriceRange(v as [number, number])} />
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brandProducts.map((p, i) => (
            <WatchCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
      <FloatingSupport />
    </Layout>
  );
};

export default BrandDetail;
