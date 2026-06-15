'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_WISHLIST_ITEMS = 50;

interface WishlistState {
  items: string[];
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  toggleItem: (slug: string) => void;
  isInWishlist: (slug: string) => boolean;
  clearAll: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (slug) =>
        set((state) => {
          if (state.items.includes(slug) || state.items.length >= MAX_WISHLIST_ITEMS) {
            return state;
          }
          return { items: [...state.items, slug] };
        }),

      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((s) => s !== slug),
        })),

      toggleItem: (slug) => {
        const { items } = get();
        if (items.includes(slug)) {
          set({ items: items.filter((s) => s !== slug) });
        } else if (items.length < MAX_WISHLIST_ITEMS) {
          set({ items: [...items, slug] });
        }
      },

      isInWishlist: (slug) => get().items.includes(slug),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: 'odg-wishlist',
    }
  )
);
