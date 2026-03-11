import Layout from "@/components/Layout";
import BrandCard from "@/components/BrandCard";
import { useCollections } from "@/hooks/useCollections";

const Brands = () => {
  const { data: collections, isLoading } = useCollections();

  return (
    <Layout>
      <div className="px-8 lg:px-16 py-12 lg:py-20">
        <div className="mb-10">
          <p className="text-[10px] tracking-widest uppercase text-primary mb-2">HOUSES</p>
          <h2 className="font-display text-4xl text-foreground mb-4">Our Brands</h2>
          <p className="text-sm text-muted-foreground max-w-lg">
            Each brand carries its own legacy. Explore the collections that define modern watchmaking.
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-20">Loading collections...</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {(collections || []).map((c, i) => (
              <BrandCard key={c.id} collection={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Brands;
