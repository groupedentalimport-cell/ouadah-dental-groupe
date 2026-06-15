'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompareArrows, X, Trash2, Package } from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { useData } from '@/lib/data-service';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CompareDrawer() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { productIds, removeProduct, clearCompare } = useCompare();
  const { products, getProductName } = useData();

  const compareProducts = productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (compareProducts.length === 0) return null;

  const canCompare = compareProducts.length >= 2;

  return (
    <AnimatePresence>
      {productIds.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 inset-x-4 z-40 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-2xl"
        >
          <div
            className="rounded-2xl shadow-2xl border-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 100%)',
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              {/* Icon + count */}
              <div className="flex items-center gap-2 shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#F0C05A' }}
                >
                  <GitCompareArrows className="w-4 h-4" style={{ color: '#1E3A5F' }} />
                </div>
                <Badge
                  className="text-xs font-bold border-0 px-2"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {productIds.length}
                </Badge>
              </div>

              {/* Product thumbnails */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 min-w-0">
                {compareProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative shrink-0 group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 bg-white/10"
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={getProductName(product, language)}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-white/50" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-[9px] text-white/80 mt-0.5 text-center line-clamp-1 max-w-[48px]">
                      {getProductName(product, language).substring(0, 12)}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCompare}
                  className="text-white/60 hover:text-white hover:bg-white/10 h-8 px-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-4 font-semibold shadow-md gap-1.5"
                  disabled={!canCompare}
                  style={{
                    backgroundColor: canCompare ? '#F0C05A' : '#F0C05A50',
                    color: '#1E3A5F',
                  }}
                  onClick={() => navigate('/compare')}
                >
                  <GitCompareArrows className="w-3.5 h-3.5" />
                  {t('compare.now')}
                </Button>
              </div>
            </div>

            {/* Select minimum notice */}
            {!canCompare && (
              <div
                className="px-4 pb-2 text-xs text-center"
                style={{ color: '#F0C05A' }}
              >
                {t('compare.selectMin')}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
