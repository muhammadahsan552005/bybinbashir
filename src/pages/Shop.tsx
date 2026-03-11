import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [activeCollection, setActiveCollection] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const { data: products, isLoading } = useProducts();
  const { data: collections } = useCollections();

  const filtered = useMemo(() => {
    let result = products || [];
    if (activeCollection !== "All") {
      result = result.filter((p) => p.collection_name === activeCollection);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          p.product_code.toLowerCase().includes(q) ||
          (p.collection_name || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCollection, searchQuery, products]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
        <div className="mb-8">
          <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            ALL PRODUCTS
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4">Full Collection</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Browse our curated selection of premium timepieces. Order directly via WhatsApp for the fastest service.
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or product code..."
            className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...(collections?.map((c) => c.collection_name) || [])].map((name) => (
            <button
              key={name}
              onClick={() => setActiveCollection(name)}
              className={`text-xs px-5 py-2 transition-all duration-300 rounded-full border ${
                activeCollection === name
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-20">Loading products...</p>
        ) : (
          <>
            <motion.div
              key={activeCollection + searchQuery}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
            >
              {filtered.map((p, i) => (
                <WatchCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>

            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-20">
                No watches found. Try a different search or filter.
              </p>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
