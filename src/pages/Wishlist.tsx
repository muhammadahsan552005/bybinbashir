import Layout from "@/components/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import WatchCard from "@/components/WatchCard";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Wishlist = () => {
  const { items } = useWishlist();

  return (
    <Layout>
      <div className="pt-24 pb-20 px-6 sm:px-8 lg:px-16 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                YOUR FAVORITES
              </span>
              <h1 className="font-display text-3xl lg:text-5xl text-foreground">Wishlist</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
          </div>

          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-secondary/30 rounded-3xl border border-border"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8">
                Explore our premium collection and save your favorite timepieces here for later.
              </p>
              <Link to="/shop" className="text-sm bg-primary text-primary-foreground px-8 py-3.5 rounded-full hover:bg-gold-glow transition-all duration-300">
                Explore Collection
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {items.map((product, i) => (
                <WatchCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
