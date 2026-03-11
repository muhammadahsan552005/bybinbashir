import { Link } from "react-router-dom";
import type { Brand } from "@/data/watches";
import { motion } from "framer-motion";
import { forwardRef } from "react";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/brands/${brand.slug}`}
        className="group block relative overflow-hidden aspect-[4/5] card-surface"
      >
        <img
          src={brand.image}
          alt={brand.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${brand.heroColor} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-display text-2xl text-foreground mb-2">{brand.name}</h3>
          <p className="font-body text-xs text-muted-foreground line-clamp-2">{brand.description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default BrandCard;
