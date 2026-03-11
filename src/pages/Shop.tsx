import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import { watches, brands } from "@/data/watches";
import { useState } from "react";
import { motion } from "framer-motion";

const Shop = () => {
  const [activeBrand, setActiveBrand] = useState<string>("All");

  const filtered = activeBrand === "All"
    ? watches
    : watches.filter((w) => w.brand === activeBrand);

  return (
    <Layout>
      <div className="px-8 lg:px-16 py-12 lg:py-20">
        {/* Header */}
        <div className="mb-10">
          <p className="text-brand text-[10px] text-primary mb-2">SHOP</p>
          <h2 className="text-display text-4xl text-foreground mb-4">Full Collection</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg">
            Browse our curated selection of premium timepieces. Order directly via WhatsApp for the fastest service.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 border-b border-border pb-6">
          {["All", ...brands.map((b) => b.name)].map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`font-body text-xs px-4 py-2 transition-colors duration-300 border ${
                activeBrand === brand
                  ? "border-primary text-primary"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          key={activeBrand}
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
          <p className="font-body text-sm text-muted-foreground text-center py-20">
            No watches found for this brand.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Shop;
