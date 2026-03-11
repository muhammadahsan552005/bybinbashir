import Layout from "@/components/Layout";
import WatchCard from "@/components/WatchCard";
import { brands, watches } from "@/data/watches";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const BrandDetail = () => {
  const { slug } = useParams();
  const brand = brands.find((b) => b.slug === slug);
  const brandWatches = watches.filter((w) => w.brand === brand?.name);

  if (!brand) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="font-body text-muted-foreground">Brand not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Brand Hero */}
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={brand.image}
          alt={brand.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${brand.heroColor} to-transparent`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="relative h-full flex flex-col justify-end pb-12 px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/brands" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors mb-4 inline-block">
              ← All Brands
            </Link>
            <h2 className="text-display text-5xl lg:text-6xl text-foreground mb-4">{brand.name}</h2>
            <p className="font-body text-sm text-foreground/80 max-w-lg">{brand.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Brand Watches */}
      <section className="px-8 lg:px-16 py-16">
        <div className="mb-8">
          <p className="text-brand text-[10px] text-primary mb-2">{brand.name.toUpperCase()} COLLECTION</p>
          <h3 className="text-display text-2xl text-foreground">
            {brandWatches.length} Timepiece{brandWatches.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brandWatches.map((w, i) => (
            <WatchCard key={w.id} watch={w} index={i} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default BrandDetail;
