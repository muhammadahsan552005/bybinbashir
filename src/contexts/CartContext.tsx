import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Watch } from "@/data/watches";

export interface CartItem {
  watch: Watch;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (watch: Watch) => void;
  removeFromCart: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("bbb-cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bbb-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (watch: Watch) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.watch.id === watch.id);
      if (existing) {
        return prev.map((i) => i.watch.id === watch.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { watch, quantity: 1 }];
    });
  };

  const removeFromCart = (watchId: string) => {
    setItems((prev) => prev.filter((i) => i.watch.id !== watchId));
  };

  const updateQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(watchId);
      return;
    }
    setItems((prev) => prev.map((i) => i.watch.id === watchId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.watch.priceNum * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
