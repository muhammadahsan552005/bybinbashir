import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import FloatingSupport from "@/components/FloatingSupport";
import SearchFilters from "@/components/SearchFilters";
import { useCollection } from "@/hooks/useCollections";
import { useProducts } from "@/hooks/useProducts";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

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
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <p className="text-[10px] tracking-widest uppercase text-primary mb-2">{collection.collection_name.toUpperCase()} COLLECTION</p>
            <h3 className="font-display text-2xl text-foreground">{brandProducts.length} Timepiece{brandProducts.length !== 1 ? "s" : ""}</h3>
          </div>
          <SearchFilters showFilters={showFilters} setShowFilters={setShowFilters}
            sortBy={sortBy} setSortBy={setSortBy} priceRange={priceRange} setPriceRange={setPriceRange} maxPrice={maxPrice} />
        </div>

        {showFilters && <div className="mb-6" />}

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
