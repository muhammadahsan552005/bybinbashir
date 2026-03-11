import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  product_name: string;
  product_code: string;
  description: string | null;
  price: number;
  collection_id: string | null;
  stock_quantity: number;
  collection_name?: string;
  collection_slug?: string;
  images: string[];
}

const PLACEHOLDER = "/placeholder.svg";

async function fetchProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from("products")
    .select("*, collections(collection_name, slug)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .order("sort_order", { ascending: true });

  const imageMap = new Map<string, string[]>();
  images?.forEach((img: any) => {
    const list = imageMap.get(img.product_id) || [];
    list.push(img.image_url);
    imageMap.set(img.product_id, list);
  });

  return (products || []).map((p: any) => ({
    id: p.id,
    product_name: p.product_name,
    product_code: p.product_code,
    description: p.description,
    price: Number(p.price),
    collection_id: p.collection_id,
    stock_quantity: p.stock_quantity ?? 0,
    collection_name: p.collections?.collection_name || "",
    collection_slug: p.collections?.slug || "",
    images: imageMap.get(p.id) || [PLACEHOLDER],
  }));
}

export function useProducts() {
  return useQuery({ queryKey: ["products"], queryFn: fetchProducts });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      if (!id) return null;
      const { data: p, error } = await supabase
        .from("products")
        .select("*, collections(collection_name, slug)")
        .eq("id", id)
        .single();
      if (error || !p) return null;

      const { data: imgs } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order", { ascending: true });

      return {
        id: p.id,
        product_name: p.product_name,
        product_code: p.product_code,
        description: p.description,
        price: Number(p.price),
        collection_id: p.collection_id,
        stock_quantity: p.stock_quantity ?? 0,
        collection_name: (p as any).collections?.collection_name || "",
        collection_slug: (p as any).collections?.slug || "",
        images: imgs?.map((i: any) => i.image_url) || [PLACEHOLDER],
      };
    },
    enabled: !!id,
  });
}
