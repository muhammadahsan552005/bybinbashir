import { Link } from "react-router-dom";
import type { Collection } from "@/hooks/useCollections";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useMemo } from "react";

const BrandCard = ({ collection, index = 0 }: { collection: Collection; index?: number }) => {
  const { data: products } = useProducts();

  const displayImage = useMemo(() => {
    if (!products) return collection.image_url;
    const collectionProducts = products.filter(
      (p) => p.collection_id === collection.id && p.images[0] && p.images[0] !== "/placeholder.svg"
    );
    if (collectionProducts.length === 0) return collection.image_url;
    const randomProduct = collectionProducts[Math.floor(Math.random() * collectionProducts.length)];
    return randomProduct.images[0];
  }, [products, collection.id, collection.image_url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={`/brands/${collection.slug}`}
        className="group block relative overflow-hidden aspect-[4/5] rounded-2xl border border-border hover:border-primary/30 transition-all duration-500 h-full"
      >
        {displayImage ? (
          <img
            src={displayImage}
            alt={collection.collection_name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-secondary" />
        )}
        <div className={`absolute inset-0 bg-gradient-to-t ${collection.hero_color} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-display text-2xl text-foreground mb-2">{collection.collection_name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{collection.description}</p>
          <span className="inline-block mt-3 text-[10px] text-primary border border-primary/40 rounded-full px-3 py-1 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            Explore →
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default BrandCard;
