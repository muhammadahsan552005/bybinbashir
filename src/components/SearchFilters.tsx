import { SlidersHorizontal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import type { Collection } from "@/hooks/useCollections";

interface SearchFiltersProps {
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  sortBy: string;
  setSortBy: (v: string) => void;
  priceRange: [number, number];
  setPriceRange: (v: [number, number]) => void;
  maxPrice: number;
  collections?: Collection[];
  activeCollection?: string;
  setActiveCollection?: (v: string) => void;
  showCollectionFilter?: boolean;
}

const SearchFilters = ({
  showFilters, setShowFilters, sortBy, setSortBy, priceRange, setPriceRange, maxPrice,
  collections, activeCollection, setActiveCollection, showCollectionFilter = false,
}: SearchFiltersProps) => {
  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all ${showFilters ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
          }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
      </button>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block">Sort by Price</label>
              <div className="flex gap-2">
                {[
                  { value: "default", label: "Default" },
                  { value: "low-high", label: "Low to High" },
                  { value: "high-low", label: "High to Low" },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${sortBy === opt.value ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>{opt.label}</button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block">
                Price Range: PKR {priceRange[0].toLocaleString()} — PKR {priceRange[1].toLocaleString()}
              </label>
              <Slider min={0} max={maxPrice} step={1000} value={priceRange} onValueChange={(val) => setPriceRange(val as [number, number])} className="w-full" />
            </div>
          </div>

          {showCollectionFilter && collections && setActiveCollection && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Filter by Brand</label>
              <div className="flex flex-wrap gap-2">
                {["All", ...(collections.map((c) => c.collection_name) || [])].map((name) => (
                  <button key={name} onClick={() => setActiveCollection(name)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${activeCollection === name ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:border-primary/30"
                      }`}>{name}</button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default SearchFilters;
