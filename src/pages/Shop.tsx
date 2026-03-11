import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import { watches, brands } from "@/data/watches";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [activeBrand, setActiveBrand] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  const filtered = useMemo(() => {
    let result = activeBrand === "All" ? watches : watches.filter((w) => w.brand === activeBrand);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((w) =>
        w.name.toLowerCase().includes(q) ||
        w.code.toLowerCase().includes(q) ||
        w.brand.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeBrand, searchQuery]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            ALL PRODUCTS
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4">Full Collection</h1>
          <p className="text-sm text-muted-foreground max-w-lg">
            Browse our curated selection of premium timepieces. Order directly via WhatsApp for the fastest service.
          </p>
        </div>

        {/* Search */}
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

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...brands.map((b) => b.name)].map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`text-xs px-5 py-2 transition-all duration-300 rounded-full border ${
                activeBrand === brand
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeBrand + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
        >
          {filtered.map((w, i) => (
            <WatchCard key={w.id} watch={w} index={i} />
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-20">
            No watches found. Try a different search or filter.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
