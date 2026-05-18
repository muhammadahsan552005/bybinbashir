import { Link, useNavigate } from "react-router-dom";
import type { Product } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const WatchCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const outOfStock = product.stock_quantity <= 0;
  const isFavorited = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
    navigate("/cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        to={`/product/${product.id}`}
        className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(43_56%_52%/0.15)] h-full"
      >
        <div className="aspect-square overflow-hidden bg-secondary rounded-t-2xl relative flex-shrink-0">
          <img src={product.images[0]} alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            
          <button 
            onClick={handleToggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 hover:scale-110
              ${isFavorited ? 'bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]' : 'bg-background/40 text-foreground/70 hover:bg-background/60 hover:text-foreground border border-transparent'}`}
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${isFavorited ? 'fill-primary' : ''}`} />
          </button>

          {outOfStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-full px-4 py-1.5">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5 flex flex-col flex-1">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{product.collection_name}</p>
          <h3 className="text-sm font-medium text-foreground mb-0.5 line-clamp-1">{product.product_name}</h3>
          <p className="text-[10px] text-muted-foreground mb-2">Code: {product.product_code}</p>
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">{product.description}</p>
          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-sm font-medium text-primary">PKR {product.price.toLocaleString()}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleAddToCart} disabled={outOfStock}
                    className="text-xs text-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300 rounded-full p-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{outOfStock ? "Out of Stock" : "Add to Cart"}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleOrderNow} disabled={outOfStock}
                    className="text-xs text-primary-foreground bg-primary hover:bg-gold-glow transition-all duration-300 rounded-full px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    Order Now
                  </button>
                </TooltipTrigger>
                <TooltipContent>{outOfStock ? "Out of Stock" : "Buy Now"}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WatchCard;
