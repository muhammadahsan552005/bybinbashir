import { Link, useNavigate } from "react-router-dom";
import type { Product } from "@/hooks/useProducts";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const WatchCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.product_name} added to cart`);
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    >
      <Link
        to={`/product/${product.id}`}
        className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(43_56%_52%/0.15)]"
      >
        <div className="aspect-square overflow-hidden bg-secondary rounded-t-2xl">
          <img
            src={product.images[0]}
            alt={product.product_name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-1">{product.collection_name}</p>
          <h3 className="text-sm font-medium text-foreground mb-0.5">{product.product_name}</h3>
          <p className="text-[10px] text-muted-foreground mb-2">Code: {product.product_code}</p>
          <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-primary">PKR {product.price.toLocaleString()}</span>
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleAddToCart}
                    className="text-xs text-foreground bg-secondary hover:bg-secondary/80 transition-all duration-300 rounded-full p-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add to Cart</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleOrderNow}
                    className="text-xs text-primary-foreground bg-primary hover:bg-gold-glow transition-all duration-300 rounded-full px-4 py-2"
                  >
                    Order Now
                  </button>
                </TooltipTrigger>
                <TooltipContent>Buy Now</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WatchCard;
