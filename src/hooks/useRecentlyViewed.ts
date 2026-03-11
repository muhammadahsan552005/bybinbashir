import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bbb-recently-viewed";
const MAX_ITEMS = 20;

export function addToRecentlyViewed(productId: string) {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
    const filtered = saved.filter((id) => id !== productId);
    filtered.unshift(productId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, MAX_ITEMS)));
  } catch {}
}

export function useRecentlyViewedIds(): string[] {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as string[];
      setIds(saved);
    } catch {}
  }, []);
  return ids;
}
