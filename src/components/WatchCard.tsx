import { Link } from "react-router-dom";
import type { Watch } from "@/data/watches";
import { motion } from "framer-motion";

const WatchCard = ({ watch, index = 0 }: { watch: Watch; index?: number }) => {
  const whatsappMsg = encodeURIComponent(`Hi! I'm interested in the ${watch.brand} ${watch.name} (${watch.price}). Is it available?`);
  const whatsappUrl = `https://wa.me/923167530204?text=${whatsappMsg}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(43_56%_52%/0.15)]"
    >
      <div className="aspect-square overflow-hidden bg-secondary rounded-t-2xl">
        <img
          src={watch.image}
          alt={`${watch.brand} ${watch.name}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <p className="text-brand text-[10px] text-muted-foreground mb-1">{watch.brand}</p>
        <h3 className="text-display text-sm text-foreground mb-1">{watch.name}</h3>
        <p className="font-body text-xs text-muted-foreground mb-4 line-clamp-2">{watch.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm font-medium text-primary">{watch.price}</span>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-primary-foreground bg-primary hover:bg-gold-glow transition-all duration-300 rounded-full px-4 py-2"
          >
            Order Now
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default WatchCard;
