import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import FloatingSupport from "@/components/FloatingSupport";
import SearchFilters from "@/components/SearchFilters";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [activeCollections, setActiveCollections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useProducts();
  const { data: collections } = useCollections();

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 500000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

  const filtered = useMemo(() => {
    let result = products || [];
    if (activeCollections.length > 0) {
      result = result.filter((p) => activeCollections.includes(p.collection_name || ""));
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
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (inStockOnly) {
      result = result.filter((p) => p.stock_quantity > 0);
    }
    if (sortBy === "low-high") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "high-low") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeCollections, searchQuery, products, sortBy, priceRange, inStockOnly]);

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

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or product code..."
              className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors" />
          </div>
          <SearchFilters showFilters={showFilters} setShowFilters={setShowFilters}
            sortBy={sortBy} setSortBy={setSortBy} priceRange={priceRange} setPriceRange={setPriceRange}
            maxPrice={maxPrice} collections={collections} activeCollections={activeCollections}
            setActiveCollections={setActiveCollections} inStockOnly={inStockOnly} setInStockOnly={setInStockOnly} showCollectionFilter={true} />
        </div>

        {showFilters && <div className="mb-6" />}

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-20">Loading products...</p>
        ) : (
          <>
            <motion.div key={activeCollections.join() + searchQuery + sortBy + priceRange.join("-") + inStockOnly}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map((p, i) => (
                <WatchCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-20">No watches found. Try a different search or filter.</p>
            )}
          </>
        )}
      </div>
      <FloatingSupport />
    </Layout>
  );
};

export default Shop;
