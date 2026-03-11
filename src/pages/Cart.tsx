import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-3">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-8">Browse our collection and find your perfect timepiece.</p>
          <Link to="/shop" className="text-sm bg-primary text-primary-foreground px-8 py-3 rounded-full hover:bg-gold-glow transition-all">
            Browse Products
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <h1 className="font-display text-3xl text-foreground mb-8">Shopping Cart</h1>

        <div className="space-y-4 mb-8">
          {items.map((item, i) => (
            <motion.div
              key={item.watch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 sm:gap-6 bg-card rounded-2xl border border-border p-4"
            >
              <Link to={`/product/${item.watch.id}`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-secondary flex-shrink-0">
                <img src={item.watch.image} alt={item.watch.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{item.watch.brand}</p>
                <h3 className="text-sm font-medium text-foreground truncate">{item.watch.name}</h3>
                <p className="text-xs text-muted-foreground">Code: {item.watch.code}</p>
                <p className="text-sm font-medium text-primary mt-1">{item.watch.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.watch.id, item.quantity - 1)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-medium text-foreground w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.watch.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button onClick={() => removeFromCart(item.watch.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-xl font-medium text-primary">PKR {totalPrice.toLocaleString()}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full text-center text-sm bg-primary text-primary-foreground rounded-full py-3.5 hover:bg-gold-glow transition-all duration-300"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
