'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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
  FileText,
  Tag,
  Hash,
  CircleDot,
  GitCompareArrows,
  Check,
  Share2,
  Printer,
  Home,
  ChevronDown,
  Link2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import { useCompare } from '@/hooks/useCompare';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import type { Product } from '@/lib/data-service';
import { ProductDetailPageSkeleton, ContentWithLoading } from '@/components/dental/Skeletons';
import { toast } from 'sonner';

// Decode double-encoded HTML entities
function decodeHtmlEntities(text: string): string {
  if (!text) return '';
  let decoded = text;
  for (let i = 0; i < 3; i++) {
    const prev = decoded;
    decoded = decoded
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
    if (decoded === prev) break;
  }
  return decoded;
}

function sanitizeHtml(html: string): string {
  if (!html) return '';
  let sanitized = decodeHtmlEntities(html);
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  return sanitized;
}

export default function ProductDetailPage() {
  const { t, language, isRTL } = useTranslation();
  const { params, navigate, goBack } = useRouter();
  const { products, categories, getProductName, getProductDescription, getProductShortDescription, getCategoryName, loading } = useData();
  const addItem = useQuoteCart((s) => s.addItem);
  const { addProduct: addCompareProduct, removeProduct: removeCompareProduct, isInCompare, productIds } = useCompare();
  const { addProduct: addRecentlyViewed, items: recentlyViewedItems, clearAll: clearRecentlyViewed } = useRecentlyViewed();

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
            .slice(0, 3)
        : [],
    [products, product]
  );

  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // Image zoom state
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  // Track recently viewed product
  useEffect(() => {
    if (product) {
      addRecentlyViewed(
        product.id,
        product.slug,
        getProductName(product, language),
        product.images?.[0] || '',
        product.price
      );
    }
  }, [product, addRecentlyViewed, getProductName, language]);

  if (loading) {
    return <ProductDetailPageSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: '#f0f4f8' }}
          >
            <Package className="w-12 h-12" style={{ color: '#1E3A5F', opacity: 0.4 }} />
          </div>
          <p className="text-gray-500 mb-4">{t('common.noResults')}</p>
          <Button onClick={() => navigate('/catalogue')} style={{ backgroundColor: '#1E3A5F' }}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const features = language === 'ar' ? product.features_ar : product.features_fr;
  const specs = product.specs || [];
  const priceDisplay = product.price && product.price > 0
    ? product.price.toLocaleString('fr-DZ') + ' DA'
    : null;
  const isOnQuote = !priceDisplay;

  const descriptionHtml = sanitizeHtml(getProductDescription(product, language));

  const hasWarranty = product.warranty && product.warranty.length > 0 && product.warranty !== '-';
  const hasInstallation = product.installation_included === true;
  const hasTraining = product.training_included === true;
  const hasDelivery = (language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr) &&
    (language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr).length > 0;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t('products.linkCopied'), {
        icon: <Link2 className="w-4 h-4" />,
      });
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(t('products.linkCopied'), {
        icon: <Link2 className="w-4 h-4" />,
      });
    }
    setShareMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 animate-in fade-in duration-500">
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
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  className="absolute right-4 text-white p-3 hover:bg-white/10 rounded-full transition-colors"
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
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-gray-400 mb-6 flex-wrap"
        >
          <button onClick={() => navigate('/')} className="hover:text-[#1E3A5F] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            {t('products.breadcrumb.home')}
          </button>
          <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300" />
          <button onClick={() => navigate('/catalogue')} className="hover:text-[#1E3A5F] transition-colors">
            {t('products.title')}
          </button>
          <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300" />
          {category && (
            <>
              <button onClick={() => navigate(`/catalogue?category=${category.slug}`)} className="hover:text-[#1E3A5F] transition-colors">
                {getCategoryName(category, language)}
              </button>
              <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300" />
            </>
          )}
          <span className="text-gray-500 font-medium truncate max-w-[200px]">
            {getProductName(product, language)}
          </span>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="outline"
            onClick={goBack}
            className="mb-6 gap-2 shadow-sm"
            style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery with Zoom */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div
              ref={imageRef}
              className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm cursor-crosshair relative"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={() => images.length > 0 && setLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentImage]}
                  alt={getProductName(product, language)}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transform: isZooming ? 'scale(1.5)' : 'scale(1)',
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
                  }}
                >
                  <div className="text-center">
                    <Package className="w-24 h-24 text-white/30 mx-auto mb-3" />
                    <p className="text-white/25 text-sm font-medium tracking-wider uppercase">
                      {language === 'ar' ? 'صورة غير متوفرة' : 'Image non disponible'}
                    </p>
                  </div>
                </div>
              )}
              {/* Zoom indicator */}
              {isZooming && images.length > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 text-white text-xs flex items-center gap-1 pointer-events-none">
                  <Share2 className="w-3 h-3 rotate-90" />
                  {language === 'ar' ? 'انقر للتكبير' : 'Cliquez pour agrandir'}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                      i === currentImage ? 'border-[#1E3A5F] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
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
            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {product.is_new && (
                <Badge className="border-0" style={{ backgroundColor: '#1E3A5F' }}>
                  {t('products.new')}
                </Badge>
              )}
              {product.is_best_seller && (
                <Badge className="border-0" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                  {t('products.bestSeller')}
                </Badge>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#1E3A5F' }}>
              {getProductName(product, language)}
            </h1>

            {/* Brand & Reference Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.brand && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium" style={{ color: '#1E3A5F' }}>
                  <Tag className="w-3.5 h-3.5" />
                  {product.brand}
                </div>
              )}
              {product.ref && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full text-xs font-medium" style={{ color: '#1E3A5F' }}>
                  <Hash className="w-3.5 h-3.5" />
                  {product.ref}
                </div>
              )}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                product.in_stock
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-700'
              }`}>
                <CircleDot className="w-3.5 h-3.5" />
                {product.in_stock ? t('products.inStock') : t('products.outOfStock')}
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              {priceDisplay ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#1E3A5F' }}>
                    {priceDisplay}
                  </span>
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{ backgroundColor: '#F0C05A20' }}
                >
                  <FileText className="w-5 h-5" style={{ color: '#F0C05A' }} />
                  <span className="text-lg font-semibold" style={{ color: '#1E3A5F' }}>
                    {language === 'ar' ? 'السعر على أساس التسعير' : 'Prix sur devis'}
                  </span>
                </div>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.origin && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{t('products.origin')}</p>
                  <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.origin}</p>
                </div>
              )}
              {hasWarranty && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-0.5">{t('products.warranty')}</p>
                  <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Service Badges */}
            {(hasWarranty || hasInstallation || hasTraining || hasDelivery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {hasWarranty && (
                  <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    {product.warranty}
                  </div>
                )}
                {hasInstallation && (
                  <div className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Wrench className="w-3.5 h-3.5" />
                    {t('products.installation')}
                  </div>
                )}
                {hasTraining && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {t('products.training')}
                  </div>
                )}
                {hasDelivery && (
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    {language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="flex-1 h-12 text-base font-semibold shadow-lg"
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
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 px-4 font-semibold ${
                    isInCompare(product.id)
                      ? 'bg-amber-50 border-amber-400 text-amber-700 hover:bg-amber-100'
                      : 'border-gray-300 text-gray-500 hover:border-amber-400 hover:text-amber-600'
                  }`}
                  disabled={!isInCompare(product.id) && productIds.length >= 4}
                  title={
                    isInCompare(product.id)
                      ? t('compare.remove')
                      : productIds.length >= 4
                      ? t('compare.maxReached')
                      : t('compare.add')
                  }
                  onClick={() => {
                    if (isInCompare(product.id)) {
                      removeCompareProduct(product.id);
                    } else {
                      addCompareProduct(product.id);
                    }
                  }}
                >
                  {isInCompare(product.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <GitCompareArrows className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Share & Print Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-gray-600"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4" />
                  {t('products.share')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-gray-600"
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4" />
                  {t('products.print')}
                </Button>
              </div>

              {isOnQuote && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 text-base font-semibold"
                  style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                  onClick={() => navigate('/devis')}
                >
                  <FileText className="w-5 h-5" />
                  {t('products.requestQuote')}
                </Button>
              )}
            </div>
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
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#1E3A5F' }} />
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
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#2A5F8F' }} />
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
        {descriptionHtml && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#3A7CB8' }} />
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
                  {t('products.description')}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700
                    prose-headings:font-bold prose-headings:text-[#1E3A5F]
                    prose-a:text-[#2A5F8F] prose-a:no-underline hover:prose-a:underline
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:marker:text-[#F0C05A]
                    prose-strong:text-[#1E3A5F]
                    prose-table:border-collapse
                    prose-th:bg-gray-50 prose-th:p-2 prose-th:border prose-th:border-gray-200
                    prose-td:p-2 prose-td:border prose-td:border-gray-200"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Related Products - Prominent heading */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1.5 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
              <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                {t('products.relatedProducts')}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rp) => (
                <Card
                  key={rp.id}
                  className="group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => {
                    setCurrentImage(0);
                    navigate(`/product/${rp.slug}`);
                  }}
                >
                  <div className="h-36 overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {rp.images?.[0] ? (
                      <img
                        src={rp.images[0]}
                        alt={getProductName(rp, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
                        }}
                      >
                        <Package className="w-10 h-10 text-white/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    {rp.brand && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#F0C05A' }}>
                        {rp.brand}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm line-clamp-1 mt-0.5" style={{ color: '#1E3A5F' }}>
                      {getProductName(rp, language)}
                    </h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Recently Viewed Products Section */}
      {recentlyViewedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
              <h2 className="text-xl font-bold" style={{ color: '#1E3A5F' }}>
                {t('products.recentlyViewed')}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-red-500"
              onClick={clearRecentlyViewed}
            >
              {t('products.recentlyViewed.clear')}
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {recentlyViewedItems
              .filter((rv) => rv.id !== product.id)
              .map((rv) => {
                const rvProduct = products.find((p) => p.id === rv.id);
                return (
                  <motion.div
                    key={rv.id}
                    whileHover={{ y: -4 }}
                    className="min-w-[160px] sm:min-w-[180px] shrink-0"
                  >
                    <Card
                      className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/product/${rv.slug}`)}
                    >
                      <div className="h-28 overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                        {rv.image ? (
                          <img
                            src={rv.image}
                            alt={rv.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
                            }}
                          >
                            <Package className="w-8 h-8 text-white/30" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-2.5">
                        {rvProduct?.brand && (
                          <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#F0C05A' }}>
                            {rvProduct.brand}
                          </span>
                        )}
                        <h3 className="font-semibold text-xs line-clamp-1 mt-0.5" style={{ color: '#1E3A5F' }}>
                          {rv.name}
                        </h3>
                        <p className="text-[10px] font-medium mt-1" style={{ color: '#1E3A5F' }}>
                          {rv.price && rv.price > 0
                            ? `${rv.price.toLocaleString('fr-DZ')} DA`
                            : (language === 'ar' ? 'عند الطلب' : 'Sur devis')
                          }
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Sticky Add-to-Quote Bar on Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate" style={{ color: '#1E3A5F' }}>
              {getProductName(product, language)}
            </p>
            {priceDisplay ? (
              <p className="text-xs font-semibold" style={{ color: '#2A5F8F' }}>{priceDisplay}</p>
            ) : (
              <p className="text-xs font-medium" style={{ color: '#F0C05A' }}>
                {language === 'ar' ? 'السعر على أساس التسعير' : 'Prix sur devis'}
              </p>
            )}
          </div>
          <Button
            className="h-10 px-5 font-semibold shadow-md shrink-0"
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
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            {t('products.addToQuoteSticky')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
