import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import FloatingSupport from "@/components/FloatingSupport";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [activeCollection, setActiveCollection] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);

  const { data: products, isLoading } = useProducts();
  const { data: collections } = useCollections();

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return 500000;
    return Math.max(...products.map((p) => p.price));
  }, [products]);

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
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [activeCollection, searchQuery, products, sortBy, priceRange]);

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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or product code..."
              className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${
              showFilters ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-xl p-5 mb-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">Sort by Price</label>
                <div className="flex gap-2">
                  {[
                    { value: "default", label: "Default" },
                    { value: "low-high", label: "Low to High" },
                    { value: "high-low", label: "High to Low" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`text-xs px-4 py-2 rounded-full border transition-all ${
                        sortBy === opt.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-2 block">
                  Price Range: PKR {priceRange[0].toLocaleString()} — PKR {priceRange[1].toLocaleString()}
                </label>
                <Slider
                  min={0}
                  max={maxPrice}
                  step={1000}
                  value={priceRange}
                  onValueChange={(val) => setPriceRange(val as [number, number])}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}

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
              key={activeCollection + searchQuery + sortBy + priceRange.join("-")}
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
      <FloatingSupport />
    </Layout>
  );
};

export default Shop;
