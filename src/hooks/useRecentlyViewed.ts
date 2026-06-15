'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  viewedAt: number;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addProduct: (id: string, slug: string, name: string, image: string, price: number) => void;
  getRecentProducts: () => RecentlyViewedItem[];
  clearAll: () => void;
}

const MAX_ITEMS = 6;

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (id, slug, name, image, price) =>
        set((state) => {
          // Remove if already exists (to move to front)
          const filtered = state.items.filter((item) => item.id !== id);
          // Add new item at the beginning
          const newItem: RecentlyViewedItem = {
            id,
            slug,
            name,
            image,
            price,
            viewedAt: Date.now(),
          };
          // Keep only MAX_ITEMS
          const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
          return { items: updated };
        }),

      getRecentProducts: () => get().items,

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'odg-recently-viewed',
    }
  )
);
