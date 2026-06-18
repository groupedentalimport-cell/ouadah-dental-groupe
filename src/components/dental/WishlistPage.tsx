'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Trash2,
  ShoppingCart,
  Package,
  ArrowRight,
  X,
  Stethoscope,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Product } from '@/lib/data-service';

function StarRating({ rating, count, size = 'sm' }: { rating: number; count?: number; size?: 'sm' | 'md' }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars.push('full');
    else if (i === fullStars && hasHalf) stars.push('half');
    else stars.push('empty');
  }
  return (
    <div className="flex items-center gap-1">
      <div className={`flex ${size === 'sm' ? 'gap-0.5' : 'gap-1'}`}>
        {stars.map((type, i) => (
          <svg
            key={i}
            className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${
              type === 'full'
                ? 'text-[#F0C05A] fill-[#F0C05A]'
                : type === 'half'
                ? 'text-[#F0C05A]'
                : 'text-gray-300 dark:text-gray-600'
            }`}
            viewBox="0 0 24 24"
            fill={type === 'full' ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            {type === 'half' && (
              <clipPath id={`half-${i}`}>
                <rect x="0" y="0" width="12" height="24" />
              </clipPath>
            )}
            {type === 'half' && (
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill="currentColor"
                clipPath={`url(#half-${i})`}
              />
            )}
          </svg>
        ))}
      </div>
      {count !== undefined && (
        <span className={`text-gray-500 dark:text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          ({count})
        </span>
      )}
    </div>
  );
}

export default function WishlistPage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { items, removeItem, clearAll } = useWishlist();
  const { products, getProductName, getCategoryName, categories } = useData();

  const wishlistProducts = items
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean) as Product[];

  const formatPrice = (price: number | undefined) => {
    if (!price || price === 0) return null;
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const handleAddAllToQuote = () => {
    navigate('/contact');
  };

  const handleRemoveItem = (slug: string, name: string) => {
    removeItem(slug);
    toast.success(
      language === 'ar'
        ? `تمت إزالة ${name} من المفضلة`
        : `${name} retiré des favoris`,
      {
        icon: <Heart className="w-4 h-4" />,
      }
    );
  };

  const handleClearAll = () => {
    clearAll();
    toast.success(
      language === 'ar' ? 'تم حذف جميع المفضلات' : 'Tous les favoris supprimés',
      {
        icon: <Trash2 className="w-4 h-4" />,
      }
    );
  };

  // Empty state
  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
        {/* Gradient Header */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#F0C05A]/20 blur-xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                style={{ backgroundColor: '#F0C05A' }}
              >
                <Heart className="w-8 h-8" fill="#1E3A5F" style={{ color: '#1E3A5F' }} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {t('wishlist.title')}
              </h1>
              <p className="text-white/70 text-base max-w-md mx-auto">
                {language === 'ar'
                  ? 'قم بحفظ المنتجات التي تعجبك للعودة إليها لاحقاً'
                  : 'Sauvegardez les produits qui vous intéressent pour y revenir plus tard'}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Empty illustration */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div
              className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: '#f0f4f8' }}
            >
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {t('wishlist.empty')}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 mb-8 max-w-sm mx-auto">
              {language === 'ar'
                ? 'استعرض كتالوجنا وأضف المنتجات إلى المفضلة'
                : 'Parcourez notre catalogue et ajoutez des produits à vos favoris'}
            </p>
            <Button
              size="lg"
              className="font-semibold shadow-lg gap-2"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              onClick={() => navigate('/catalogue')}
            >
              <Stethoscope className="w-5 h-5" />
              {language === 'ar' ? 'استعرض الكتالوج' : 'Parcourir le catalogue'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Gradient Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-[#F0C05A]/20 blur-xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
              style={{ backgroundColor: '#F0C05A' }}
            >
              <Heart className="w-8 h-8" fill="#1E3A5F" style={{ color: '#1E3A5F' }} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {t('wishlist.title')}
            </h1>
            <p className="text-white/70 text-base">
              {language === 'ar'
                ? `${wishlistProducts.length} منتج في المفضلة`
                : `${wishlistProducts.length} produit(s) dans vos favoris`}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <Badge
              className="text-sm font-bold border-0 px-3 py-1"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
            >
              {wishlistProducts.length}
            </Badge>
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              {language === 'ar' ? 'منتج محفوظ' : 'produit(s) sauvegardé(s)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4" />
              {t('wishlist.clearAll')}
            </Button>
            <Button
              size="sm"
              className="gap-2 font-semibold shadow-md"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              onClick={handleAddAllToQuote}
            >
              <ShoppingCart className="w-4 h-4" />
              {language === 'ar' ? 'أضف الكل للتسعير' : 'Tout ajouter au devis'}
            </Button>
          </div>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {wishlistProducts.map((product, idx) => {
              const category = categories.find((c) => c.id === product.category_id);
              const priceDisplay = formatPrice(product.price);
              const productName = getProductName(product, language);
              const categoryName = category ? getCategoryName(category, language) : '';

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  layout
                >
                  <Card
                    className="group border-0 shadow-md dark:shadow-none dark:bg-[#162236] hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer relative card-lift"
                    style={{ borderTop: '2px solid #F0C05A' }}
                  >
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveItem(product.slug, productName);
                      }}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 dark:bg-[#162236]/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors"
                      title={t('wishlist.removed')}
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Image */}
                    <div
                      className="h-48 flex items-center justify-center relative overflow-hidden"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={productName}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background:
                              'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
                          }}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Package className="w-12 h-12 text-white/30" />
                            <span className="text-white/30 text-xs">{product.brand || 'ODG'}</span>
                          </div>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.is_new && (
                          <Badge className="text-[10px] px-2 py-0.5 font-semibold border-0" style={{ backgroundColor: '#1E3A5F' }}>
                            {t('products.new')}
                          </Badge>
                        )}
                        {product.is_best_seller && (
                          <Badge className="text-[10px] px-2 py-0.5 font-semibold border-0" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                            {t('products.bestSeller')}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent
                      className="p-4 flex flex-col flex-1"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {/* Brand */}
                      {product.brand && (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider mb-1 dark:text-[#F0C05A]"
                          style={{ color: '#F0C05A' }}
                        >
                          {product.brand}
                        </span>
                      )}

                      {/* Category */}
                      {categoryName && (
                        <span className="text-[10px] text-gray-400 dark:text-gray-300 mb-1">
                          {categoryName}
                        </span>
                      )}

                      {/* Product name */}
                      <h3
                        className="font-semibold text-sm mb-1 line-clamp-2 leading-snug dark:text-white"
                        style={{ color: '#1E3A5F' }}
                      >
                        {productName}
                      </h3>

                      {/* Rating */}
                      {product.rating && (
                        <div className="mb-2">
                          <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
                        </div>
                      )}

                      {/* Price */}
                      <div className="mt-auto pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
                        {priceDisplay ? (
                          <span className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                            {priceDisplay}
                          </span>
                        ) : (
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded dark:text-[#F0C05A]"
                            style={{ backgroundColor: '#F0C05A20', color: '#1E3A5F' }}
                          >
                            {t('products.priceOnQuote')}
                          </span>
                        )}
                        <Button
                          size="sm"
                          className="text-xs h-7 px-2.5 border-0 gap-1"
                          style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/contact');
                          }}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          {language === 'ar' ? 'أضف' : 'Devis'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
