'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareState {
  productIds: string[];
  addProduct: (id: string) => void;
  removeProduct: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],

      addProduct: (id) =>
        set((state) => {
          if (state.productIds.includes(id) || state.productIds.length >= 4) {
            return state;
          }
          return { productIds: [...state.productIds, id] };
        }),

      removeProduct: (id) =>
        set((state) => ({
          productIds: state.productIds.filter((pid) => pid !== id),
        })),

      clearCompare: () => set({ productIds: [] }),

      isInCompare: (id) => get().productIds.includes(id),
    }),
    {
      name: 'odg-compare',
    }
  )
);
