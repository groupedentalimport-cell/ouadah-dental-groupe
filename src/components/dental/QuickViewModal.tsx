'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  GitCompareArrows,
  Check,
  Package,
  ArrowRight,
  Tag,
  Hash,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { useCompare } from '@/hooks/useCompare';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/lib/data-service';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, getProductName, getProductShortDescription, getCategoryName } = useData();
  const { addProduct: addCompareProduct, removeProduct: removeCompareProduct, isInCompare, productIds } = useCompare();
  const addRecentlyViewed = useRecentlyViewed((s) => s.addProduct);

  if (!product) return null;

  const name = getProductName(product, language);
  const shortDesc = getProductShortDescription(product, language);
  const category = categories.find((c) => c.id === product.category_id);
  const categoryName = category ? getCategoryName(category, language) : '';
  const priceDisplay = product.price && product.price > 0
    ? product.price.toLocaleString('fr-DZ') + ' DA'
    : null;
  const isOnQuote = !priceDisplay;
  const inCompare = isInCompare(product.id);
  const compareFull = productIds.length >= 4;


  const handleCompareToggle = () => {
    if (inCompare) {
      removeCompareProduct(product.id);
    } else if (!compareFull) {
      addCompareProduct(product.id);
    }
  };

  const handleViewFull = () => {
    // Track in recently viewed
    addRecentlyViewed(
      product.id,
      product.slug,
      name,
      product.images?.[0] || '',
      product.price
    );
    onClose();
    navigate(`/product/${product.slug}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="sm:max-w-2xl w-[calc(100%-1.5rem)] p-0 gap-0 overflow-hidden rounded-xl"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">
          {t('products.quickView.title')} - {name}
        </DialogTitle>

        <AnimatePresence mode="wait">
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col md:flex-row"
          >
            {/* Image section */}
            <div className="w-full md:w-1/2 h-56 md:h-auto min-h-[220px] relative overflow-hidden shrink-0">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
                  }}
                >
                  <div className="text-center">
                    <Package className="w-16 h-16 text-white/30 mx-auto mb-2" />
                    <p className="text-white/20 text-xs font-medium tracking-wider uppercase">ODG</p>
                  </div>
                </div>
              )}

              {/* Badges overlay */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.is_new && (
                  <Badge className="text-[10px] px-2.5 py-0.5 border-0 font-semibold" style={{ backgroundColor: '#1E3A5F' }}>
                    {t('products.new')}
                  </Badge>
                )}
                {product.is_best_seller && (
                  <Badge className="text-[10px] px-2.5 py-0.5 border-0 font-semibold" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                    {t('products.bestSeller')}
                  </Badge>
                )}
              </div>

              {/* Stock badge */}
              <div className="absolute top-3 right-3">
                {product.in_stock ? (
                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-white/90 border-green-200 text-green-700 backdrop-blur-sm">
                    {t('products.quickView.inStock')}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                    {t('products.quickView.outOfStock')}
                  </Badge>
                )}
              </div>
            </div>

            {/* Info section */}
            <div className="w-full md:w-1/2 p-5 md:p-6 flex flex-col">
              {/* Category badge */}
              {categoryName && (
                <Badge
                  variant="outline"
                  className="w-fit text-[10px] px-2.5 py-0.5 mb-3 font-medium"
                  style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                >
                  {categoryName}
                </Badge>
              )}

              {/* Brand */}
              {product.brand && (
                <div className="flex items-center gap-1.5 mb-1">
                  <Tag className="w-3 h-3" style={{ color: '#F0C05A' }} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#F0C05A' }}>
                    {product.brand}
                  </span>
                </div>
              )}

              {/* Name */}
              <h2 className="font-bold text-lg leading-snug mb-2" style={{ color: '#1E3A5F' }}>
                {name}
              </h2>

              {/* Reference */}
              {product.ref && (
                <div className="flex items-center gap-1.5 mb-2">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-mono">{product.ref}</span>
                </div>
              )}

              {/* Short description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                {shortDesc}
              </p>

              {/* Price */}
              <div className="mb-4">
                {priceDisplay ? (
                  <span className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>
                    {priceDisplay}
                  </span>
                ) : (
                  <Badge
                    className="text-sm px-3 py-1 border-0 font-semibold"
                    style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                  >
                    {t('products.priceOnQuote')}
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`h-10 w-10 shrink-0 ${
                      inCompare
                        ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                        : 'text-gray-400 hover:text-amber-600 hover:border-amber-300'
                    }`}
                    disabled={!inCompare && compareFull}
                    title={
                      inCompare
                        ? t('compare.remove')
                        : compareFull
                        ? t('compare.maxReached')
                        : t('products.quickView.compare')
                    }
                    onClick={handleCompareToggle}
                  >
                    {inCompare ? <Check className="w-4 h-4" /> : <GitCompareArrows className="w-4 h-4" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full gap-2 h-10 group"
                  style={{ borderColor: '#F0C05A', color: '#1E3A5F' }}
                  onClick={handleViewFull}
                >
                  <Eye className="w-4 h-4" />
                  {t('products.quickView.viewFull')}
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
