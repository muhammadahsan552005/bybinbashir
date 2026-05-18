import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
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
  activeCollections?: string[];
  setActiveCollections?: (v: string[]) => void;
  inStockOnly?: boolean;
  setInStockOnly?: (v: boolean) => void;
  showCollectionFilter?: boolean;
}

const SearchFilters = ({
  showFilters, setShowFilters, sortBy, setSortBy, priceRange, setPriceRange, maxPrice,
  collections, activeCollections = [], setActiveCollections, inStockOnly = false, setInStockOnly, showCollectionFilter = false,
}: SearchFiltersProps) => {

  const toggleCollection = (name: string) => {
    if (!setActiveCollections) return;
    if (activeCollections.includes(name)) {
      setActiveCollections(activeCollections.filter(c => c !== name));
    } else {
      setActiveCollections([...activeCollections, name]);
    }
  };

  const handleReset = () => {
    setSortBy("default");
    setPriceRange([0, maxPrice]);
    if (setActiveCollections) setActiveCollections([]);
    if (setInStockOnly) setInStockOnly(false);
  };

  return (
    <div className="relative z-10 w-full md:w-auto">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm transition-all duration-300 w-full md:w-auto justify-center ${showFilters ? "border-primary bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.4)]" : "border-border bg-card text-foreground hover:border-primary/50"
          }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Advanced Filters</span>
        {(activeCollections.length > 0 || inStockOnly || sortBy !== "default") && (
          <span className="w-2 h-2 rounded-full bg-destructive ml-1"></span>
        )}
      </button>

      <AnimatePresence>
      {showFilters && (
        <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2 }}
          className="absolute top-full right-0 mt-4 bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-2xl space-y-8 w-[calc(100vw-2rem)] md:w-[600px] origin-top-right">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary/50"></span> Sort Timepieces
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "default", label: "Recommended" },
                  { value: "low-high", label: "Price: Ascending" },
                  { value: "high-low", label: "Price: Descending" },
                ].map((opt) => (
                  <button key={opt.value} onClick={() => setSortBy(opt.value)}
                    className={`text-xs px-4 py-2.5 rounded-lg text-left transition-all duration-300 ${sortBy === opt.value ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground border-l-2 border-transparent"
                      }`}>{opt.label}</button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-end mb-4">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-primary/50"></span> Price Range
                </label>
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">PKR {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}</span>
              </div>
              <div className="pt-2 px-2">
                <Slider min={0} max={maxPrice} step={5000} value={priceRange} onValueChange={(val) => setPriceRange(val as [number, number])} className="w-full" />
              </div>

              <div className="pt-6 space-y-4">
                 <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-primary/50"></span> Availability
                </label>
                <button onClick={() => setInStockOnly && setInStockOnly(!inStockOnly)}
                  className={`flex items-center gap-3 text-xs px-4 py-3 rounded-xl border transition-all w-full duration-300 ${inStockOnly ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${inStockOnly ? "bg-primary border-primary" : "border-muted-foreground/50"}`}>
                    {inStockOnly && <Check className="w-3 h-3 text-primary-foreground" />}
                  </div>
                  Show In-Stock Only
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            {showCollectionFilter && collections && setActiveCollections && (
              <div className="space-y-4">
                <label className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-primary/50"></span> Filter by Brands
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setActiveCollections([])}
                    className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${activeCollections.length === 0 ? "border-primary bg-primary text-primary-foreground shadow-[0_2px_10px_-2px_hsl(var(--primary)/0.4)]" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}>
                    All Brands
                  </button>
                  {collections.map((c) => (
                    <button key={c.collection_name} onClick={() => toggleCollection(c.collection_name)}
                      className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border transition-all duration-300 ${activeCollections.includes(c.collection_name) ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        }`}>
                      {c.collection_name}
                      {activeCollections.includes(c.collection_name) && <Check className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button onClick={handleReset} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground hover:underline transition-all px-4 py-2">
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;
