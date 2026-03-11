import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import { watches } from "@/data/watches";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, MessageCircle, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const watch = watches.find((w) => w.id === id);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  if (!watch) {
    return (
      <Layout>
        <div className="px-8 py-32 text-center">
          <h2 className="text-2xl font-medium text-foreground mb-4">Product not found</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">← Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const relatedWatches = watches.filter((w) => w.brand === watch.brand && w.id !== watch.id).slice(0, 4);
  const whatsappMsg = encodeURIComponent(
    `Hi! I would like to order:\n\nProduct: ${watch.brand} ${watch.name}\nCode: ${watch.code}\nPrice: ${watch.price}\n\nPlease confirm availability. Thank you.`
  );
  const whatsappUrl = `https://wa.me/923167530204?text=${whatsappMsg}`;

  const handleAddToCart = () => {
    addToCart(watch);
    toast.success(`${watch.name} added to cart`);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        {/* Back */}
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img src={watch.images[activeImage]} alt={watch.name} className="w-full h-full object-cover" />
            </div>
            {watch.images.length > 1 && (
              <div className="flex gap-3">
                {watch.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? "border-primary" : "border-border hover:border-primary/30"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">{watch.brand}</p>
            <h1 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-2">{watch.name}</h1>
            <p className="text-xs text-muted-foreground mb-4">Product Code: {watch.code}</p>
            <p className="text-2xl font-medium text-primary mb-6">{watch.price}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{watch.description}</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground rounded-full px-6 py-3.5 hover:bg-gold-glow transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" /> Order Now
              </a>
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 text-sm border border-primary/40 text-primary rounded-full px-6 py-3.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {relatedWatches.length > 0 && (
          <section className="mt-20">
            <h3 className="font-display text-2xl text-foreground mb-8">Similar Products</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedWatches.map((w, i) => (
                <WatchCard key={w.id} watch={w} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
