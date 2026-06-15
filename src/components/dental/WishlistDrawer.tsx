'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, Trash2, Package } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useData } from '@/lib/data-service';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function WishlistDrawer() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { items, removeItem, clearAll } = useWishlist();
  const { products, getProductName } = useData();

  const wishlistProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as typeof products;

  if (wishlistProducts.length === 0) return null;

  return (
    <AnimatePresence>
      {items.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-6 z-40 sm:max-w-xs"
          style={isRTL ? { left: 'auto', right: '1.5rem' } : undefined}
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
                  <Heart className="w-4 h-4" fill="#1E3A5F" style={{ color: '#1E3A5F' }} />
                </div>
                <Badge
                  className="text-xs font-bold border-0 px-2"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {items.length}
                </Badge>
              </div>

              {/* Product thumbnails */}
              <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 min-w-0">
                {wishlistProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative shrink-0 group"
                  >
                    <div
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/20 bg-white/10 cursor-pointer"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={getProductName(product, language)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-white/50" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(product.slug)}
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
              <div className="flex flex-col items-center gap-1 shrink-0">
                <Button
                  size="sm"
                  className="h-7 px-3 font-semibold shadow-md gap-1 text-xs"
                  style={{
                    backgroundColor: '#F0C05A',
                    color: '#1E3A5F',
                  }}
                  onClick={() => navigate('/wishlist')}
                >
                  {t('wishlist.viewAll')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-white/60 hover:text-white hover:bg-white/10 h-7 px-2 text-xs"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  {t('wishlist.clearAll')}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
