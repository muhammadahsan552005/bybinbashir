import Layout from "@/components/Layout";
import BrandCard from "@/components/BrandCard";
import { brands } from "@/data/watches";

const Brands = () => {
  return (
    <Layout>
      <div className="px-8 lg:px-16 py-12 lg:py-20">
        <div className="mb-10">
          <p className="text-brand text-[10px] text-primary mb-2">HOUSES</p>
          <h2 className="text-display text-4xl text-foreground mb-4">Our Brands</h2>
          <p className="font-body text-sm text-muted-foreground max-w-lg">
            Each brand carries its own legacy. Explore the collections that define modern watchmaking.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {brands.map((b, i) => (
            <BrandCard key={b.id} brand={b} index={i} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Brands;
