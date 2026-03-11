import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import FloatingSupport from "@/components/FloatingSupport";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { addToRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) addToRecentlyViewed(id);
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="px-8 py-32 text-center">
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="px-8 py-32 text-center">
          <h2 className="text-2xl font-medium text-foreground mb-4">Product not found</h2>
          <Link to="/shop" className="text-sm text-primary hover:underline">← Back to Shop</Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = (allProducts || [])
    .filter((p) => p.collection_id === product.collection_id && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
  };

  const handleOrderNow = () => {
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
    navigate("/cart");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-4">
              <img src={product.images[activeImage] || "/placeholder.svg"} alt={product.product_name} className="w-full h-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
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

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
            <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-2">{product.collection_name}</p>
            <h1 className="font-display text-3xl lg:text-4xl font-light text-foreground mb-2">{product.product_name}</h1>
            <p className="text-xs text-muted-foreground mb-4">Product Code: {product.product_code}</p>
            <p className="text-2xl font-medium text-primary mb-6">PKR {product.price.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleOrderNow}
                    className="flex-1 flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground rounded-full px-6 py-3.5 hover:bg-gold-glow transition-all duration-300">
                    <ShoppingBag className="w-4 h-4" /> Order Now
                  </button>
                </TooltipTrigger>
                <TooltipContent>Buy Now</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 text-sm border border-primary/40 text-primary rounded-full px-6 py-3.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add to Cart</TooltipContent>
              </Tooltip>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h3 className="font-display text-2xl text-foreground mb-8">Similar Products</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p, i) => (
                <WatchCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
      <FloatingSupport />
    </Layout>
  );
};

export default ProductDetail;
