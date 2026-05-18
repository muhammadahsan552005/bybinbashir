import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Product } from "@/hooks/useProducts";
import { toast } from "sonner";

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("bbb-wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("bbb-wishlist", JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === product.id)) return prev;
      return [...prev, product];
    });
    toast.success(`${product.product_name} added to favorites`);
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
    toast.success(`Removed from favorites`);
  };

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const isExisting = prev.find((i) => i.id === product.id);
      if (isExisting) {
        toast.success(`Removed from favorites`);
        return prev.filter((i) => i.id !== product.id);
      } else {
        toast.success(`${product.product_name} added to favorites`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return items.some((i) => i.id === productId);
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};
