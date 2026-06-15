'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  Shield,
  Wrench,
  GraduationCap,
  Truck,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuoteCart } from '@/hooks/useQuoteCart';

export default function ProductDetailPage() {
  const { t, language, isRTL } = useTranslation();
  const { params, navigate, goBack } = useRouter();
  const { products, categories, getProductName, getProductDescription, getProductShortDescription, getCategoryName } = useData();
  const addItem = useQuoteCart((s) => s.addItem);

  const product = useMemo(
    () => products.find((p) => p.slug === params.slug),
    [products, params.slug]
  );

  const category = useMemo(
    () => categories.find((c) => c.id === product?.category_id),
    [categories, product]
  );

  const relatedProducts = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.category_id === product.category_id && p.id !== product.id)
            .slice(0, 4)
        : [],
    [products, product]
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('common.noResults')}</p>
          <Button onClick={() => navigate('/catalogue')} className="mt-4" style={{ backgroundColor: '#1E3A5F' }}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const features = language === 'ar' ? product.features_ar : product.features_fr;
  const specs = product.specs || [];
  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price)) return '— DA';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 text-white p-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[currentImage]}
              alt={getProductName(product, language)}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={goBack}
          className="mb-6 gap-2"
          style={{ color: '#1E3A5F' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('common.back')}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm cursor-pointer"
              onClick={() => images.length > 0 && setLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentImage]}
                  alt={getProductName(product, language)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
                  <Package className="w-24 h-24 text-gray-300" />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${
                      i === currentImage ? 'border-[#1E3A5F]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <button onClick={() => navigate('/catalogue')} className="hover:text-[#1E3A5F]">
                {t('products.title')}
              </button>
              <span>/</span>
              {category && (
                <>
                  <button onClick={() => navigate(`/catalogue?category=${category.slug}`)} className="hover:text-[#1E3A5F]">
                    {getCategoryName(category, language)}
                  </button>
                  <span>/</span>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-3">
              {product.is_new && (
                <Badge style={{ backgroundColor: '#1E3A5F' }}>{t('products.new')}</Badge>
              )}
              {product.is_best_seller && (
                <Badge style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                  {t('products.bestSeller')}
              </Badge>
              )}
              {product.in_stock ? (
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                  {t('products.inStock')}
                </Badge>
              ) : (
                <Badge variant="destructive">{t('products.outOfStock')}</Badge>
              )}
            </div>

            {/* Name & Price */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
              {getProductName(product, language)}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#1E3A5F' }}>
                {formatPrice(product.price)}
              </span>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{t('products.brand')}</p>
                <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.brand}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{t('products.ref')}</p>
                <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.ref}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{t('products.origin')}</p>
                <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.origin}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">{t('products.warranty')}</p>
                <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.warranty}</p>
              </div>
            </div>

            {/* Service Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.installation_included && (
                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  <Wrench className="w-3.5 h-3.5" />
                  {t('products.installation')}
                </div>
              )}
              {product.training_included && (
                <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {t('products.training')}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium">
                <Truck className="w-3.5 h-3.5" />
                {language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr}
              </div>
            </div>

            {/* Add to Quote */}
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold shadow-lg"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              onClick={() => {
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: getProductName(product, language),
                  price: product.price,
                  image: product.images?.[0] || '',
                });
              }}
            >
              <ShoppingCart className="w-5 h-5" />
              {t('products.addQuote')}
            </Button>
          </motion.div>
        </div>

        {/* Features */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
                  {t('products.features')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#1E3A5F' }} />
                      <span className="text-sm text-gray-700">{feat}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Specs */}
        {specs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
                  {t('products.specs')}
                </h2>
                <div className="divide-y">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex justify-between py-3">
                      <span className="text-sm text-gray-500">
                        {language === 'ar' ? spec.label_ar : spec.label_fr}
                      </span>
                      <span className="text-sm font-medium" style={{ color: '#1E3A5F' }}>
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div
                className="prose max-w-none text-sm text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: getProductDescription(product, language),
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
              Produits similaires
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Card
                  key={rp.id}
                  className="group border-0 shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/product/${rp.slug}`)}
                >
                  <div className="h-40 overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {rp.images?.[0] ? (
                      <img src={rp.images[0]} alt={getProductName(rp, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1" style={{ color: '#1E3A5F' }}>
                      {getProductName(rp, language)}
                    </h3>
                    <p className="font-bold text-sm mt-1" style={{ color: '#1E3A5F' }}>
                      {formatPrice(rp.price)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
