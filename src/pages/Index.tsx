import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Globe, MessageCircle, Truck, Shield, Clock } from "lucide-react";
import heroWatch from "@/assets/hero-watch.jpg";
import { useProducts } from "@/hooks/useProducts";
import { useCollections } from "@/hooks/useCollections";
import { useRecentlyViewedIds } from "@/hooks/useRecentlyViewed";
import WatchCard from "@/components/WatchCard";
import BrandCard from "@/components/BrandCard";
import { useState, useMemo } from "react";

const features = [
  { icon: Truck, label: "Nationwide Shipping", desc: "We deliver premium watches to every corner of Pakistan. Fast, secure, and tracked." },
  { icon: Globe, label: "Premium Collection", desc: "Hand-picked timepieces from world-renowned brands — Rolex, Hublot, Cartier & more." },
  { icon: MessageCircle, label: "DM to Order", desc: "No complicated checkout. Simply message us on WhatsApp and we'll handle the rest." },
  { icon: Shield, label: "Quality Assured", desc: "Every piece is inspected for build quality and aesthetic perfection before shipping." },
  { icon: Clock, label: "Every Moment", desc: "From daily wear to special occasions, find the perfect watch for every chapter of life." },
  { icon: Package, label: "Premium Packaging", desc: "Each watch arrives in elegant packaging — because unboxing should feel special too." },
];

type FeaturedTab = "featured" | "recent" | "recommended";

const Index = () => {
  const { data: products } = useProducts();
  const { data: collections } = useCollections();
  const recentIds = useRecentlyViewedIds();
  const [activeTab, setActiveTab] = useState<FeaturedTab>("featured");

  const displayProducts = useMemo(() => {
    const all = products || [];
    if (activeTab === "recent") {
      const recentProducts = recentIds
        .map((id) => all.find((p) => p.id === id))
        .filter(Boolean) as typeof all;
      return recentProducts.slice(0, 6);
    }
    if (activeTab === "recommended") {
      // Recommend based on recently viewed collections, then popular
      const viewedCollections = new Set(
        recentIds
          .map((id) => all.find((p) => p.id === id)?.collection_id)
          .filter(Boolean)
      );
      if (viewedCollections.size > 0) {
        const recommended = all
          .filter((p) => p.collection_id && viewedCollections.has(p.collection_id) && !recentIds.includes(p.id));
        if (recommended.length >= 3) return recommended.slice(0, 6);
      }
      // Fallback: random mix
      return [...all].sort(() => 0.5 - Math.random()).slice(0, 6);
    }
    return all.slice(0, 6);
  }, [products, activeTab, recentIds]);

  const tabs: { key: FeaturedTab; label: string }[] = [
    { key: "featured", label: "Featured" },
    { key: "recent", label: "Recently Viewed" },
    { key: "recommended", label: "Recommended" },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroWatch} alt="Luxury watch macro detail" className="w-full h-full object-cover animate-slow-zoom" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        </div>
        <div className="relative h-full flex flex-col justify-end pb-20 px-6 sm:px-8 lg:px-16 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              BYBINBASHIR — PREMIUM WATCHES
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-light text-foreground leading-[1.1] tracking-wide mb-6">
              Premium Watches<br />for Every Moment
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mb-8 leading-relaxed">
              Curated collection of luxury timepieces from world-renowned brands. Nationwide delivery across Pakistan.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="text-sm bg-primary text-primary-foreground px-8 py-3.5 rounded-full hover:bg-gold-glow transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(43_56%_52%/0.5)]">
                Explore Collection
              </Link>
              <a href="https://wa.me/923276266204" target="_blank" rel="noopener noreferrer" className="text-sm border border-primary/40 text-primary px-8 py-3.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
                WHY CHOOSE US
              </span>
              <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-3">Premium Watches for Every Moment</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                We bring the luxury watch experience to your doorstep — no showroom needed.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 hover:border-primary/30 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_hsl(43_56%_52%/0.1)] group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground mb-2">{f.label}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Watches with tabs */}
      <section className="py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">COLLECTION</span>
              <h2 className="font-display text-3xl text-foreground">Featured Timepieces</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`text-xs px-4 py-2 rounded-full border transition-all duration-300 ${
                    activeTab === tab.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <Link to="/shop" className="text-xs text-primary border border-primary/30 rounded-full px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                View All →
              </Link>
            </div>
          </div>

          {displayProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              {activeTab === "recent" ? "No recently viewed products yet. Browse our collection!" : "No products to show."}
            </p>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              {displayProducts.map((p, i) => (
                <WatchCard key={p.id} product={p} index={i} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="inline-block text-[10px] tracking-widest uppercase text-primary bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">BRANDS</span>
              <h2 className="font-display text-3xl text-foreground">Our Collections</h2>
            </div>
            <Link to="/brands" className="text-xs text-primary border border-primary/30 rounded-full px-5 py-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              All Brands →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {(collections || []).slice(0, 3).map((c, i) => (
              <BrandCard key={c.id} collection={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-card rounded-3xl border border-border p-10 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
            <div className="relative">
              <h2 className="font-display text-3xl lg:text-4xl text-foreground mb-4">Ready to Find Your Watch?</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
                Message us on WhatsApp for personalized recommendations, pricing, and fastest delivery options.
              </p>
              <a href="https://wa.me/923276266204" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-8 py-3.5 rounded-full hover:bg-gold-glow transition-all duration-300 hover:shadow-[0_4px_20px_-4px_hsl(43_56%_52%/0.5)]">
                <MessageCircle className="w-4 h-4" /> Order on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="font-display text-sm font-semibold text-primary">B</span>
            </div>
            <div>
              <h4 className="font-display text-lg text-foreground">BBB</h4>
              <p className="text-[9px] text-muted-foreground tracking-wider uppercase">ByBinBashir</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/by_binbashir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-4 py-2 hover:border-primary/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              Instagram
            </a>
            <a href="https://wa.me/923276266204" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-full px-4 py-2 hover:border-primary/30">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground">© 2025 ByBinBashir. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
