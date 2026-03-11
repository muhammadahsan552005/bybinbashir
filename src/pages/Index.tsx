import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Globe, MessageCircle } from "lucide-react";
import heroWatch from "@/assets/hero-watch.jpg";
import { watches, brands } from "@/data/watches";
import WatchCard from "@/components/WatchCard";
import BrandCard from "@/components/BrandCard";

const features = [
  { icon: Package, label: "Nationwide Shipping", desc: "Delivered to your doorstep across Pakistan" },
  { icon: Globe, label: "Premium Collection", desc: "Curated watches from world-renowned brands" },
  { icon: MessageCircle, label: "Easy Ordering", desc: "Order via WhatsApp — simple and direct" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroWatch}
            alt="Luxury watch macro detail"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative h-full flex flex-col justify-end pb-20 px-8 lg:px-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p className="text-brand text-xs text-primary mb-4">BYBINBASHIR</p>
            <h2 className="font-display text-5xl lg:text-7xl font-light text-foreground leading-tight tracking-wide mb-6">
              Premium Watches for Every Moment
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-md mb-8">
              Curated collection of luxury timepieces. Nationwide delivery across Pakistan.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="font-body text-sm bg-primary text-primary-foreground px-8 py-3 hover:bg-gold-glow transition-colors duration-300"
              >
                Explore Collection
              </Link>
              <a
                href="https://wa.me/923167530204"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-8 lg:px-16 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-start gap-4"
            >
              <f.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-body text-sm font-medium text-foreground mb-1">{f.label}</h4>
                <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Watches */}
      <section className="py-16 px-8 lg:px-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand text-[10px] text-primary mb-2">COLLECTION</p>
            <h3 className="text-display text-3xl text-foreground">Featured Timepieces</h3>
          </div>
          <Link to="/shop" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {watches.slice(0, 6).map((w, i) => (
            <WatchCard key={w.id} watch={w} index={i} />
          ))}
        </div>
      </section>

      {/* Brands Preview */}
      <section className="py-16 px-8 lg:px-16 border-t border-border">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand text-[10px] text-primary mb-2">BRANDS</p>
            <h3 className="text-display text-3xl text-foreground">Our Houses</h3>
          </div>
          <Link to="/brands" className="font-body text-xs text-muted-foreground hover:text-primary transition-colors">
            All Brands →
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brands.slice(0, 3).map((b, i) => (
            <BrandCard key={b.id} brand={b} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-8 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h4 className="text-display text-xl text-foreground mb-1">BBB</h4>
            <p className="text-brand text-[9px] text-muted-foreground">BYBINBASHIR</p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://www.instagram.com/by_binbashir"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/923167530204"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              WhatsApp
            </a>
          </div>
          <p className="font-body text-[10px] text-muted-foreground">
            © 2025 ByBinBashir. All rights reserved.
          </p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
