import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Collection {
  id: string;
  collection_name: string;
  slug: string;
  description: string | null;
  hero_color: string;
  image_url: string | null;
}

export function useCollections() {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<Collection[]> => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("collection_name");
      if (error) throw error;
      return (data || []).map((c: any) => ({
        id: c.id,
        collection_name: c.collection_name,
        slug: c.slug,
        description: c.description,
        hero_color: c.hero_color || "from-slate-950/40",
        image_url: c.image_url,
      }));
    },
  });
}

export function useCollection(slug: string | undefined) {
  return useQuery({
    queryKey: ["collection", slug],
    queryFn: async (): Promise<Collection | null> => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) return null;
      return {
        id: data.id,
        collection_name: data.collection_name,
        slug: data.slug,
        description: data.description,
        hero_color: data.hero_color || "from-slate-950/40",
        image_url: data.image_url,
      };
    },
    enabled: !!slug,
  });
}
