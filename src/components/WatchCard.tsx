import { Link } from "react-router-dom";
import type { Watch } from "@/data/watches";
import { motion } from "framer-motion";

const WatchCard = ({ watch, index = 0 }: { watch: Watch; index?: number }) => {
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the ${watch.brand} ${watch.name} (${watch.price}). Is it available?`);
  const whatsappUrl = `https://wa.me/923167530204?text=${whatsappMsg}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group card-surface overflow-hidden"
    >
      <div className="aspect-square overflow-hidden bg-secondary">
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <p className="text-brand text-[10px] text-muted-foreground mb-1">{watch.brand}</p>
        <h3 className="text-display text-sm text-foreground mb-1">{watch.name}</h3>
        <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">{watch.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm font-medium text-primary">{watch.price}</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-primary hover:text-gold-glow transition-colors duration-300 border border-primary px-3 py-1.5"
          >
            Order Now
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchCard;
