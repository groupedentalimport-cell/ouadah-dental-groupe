'use client';

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,

  CheckCircle2,
  CheckCircle,
  Shield,
  ShieldCheck,
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
  ZoomIn,
  Maximize2,
  Heart,
  Star,
  Copy,
  MessageCircle,
  Facebook,
  Linkedin,
  ClipboardList,
  Sparkles,
  Play,
  Globe,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCompare } from '@/hooks/useCompare';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useWishlist } from '@/hooks/useWishlist';
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

// Parse YouTube URL to get embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Standard youtube.com/watch?v=...
    if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${urlObj.searchParams.get('v')}`;
    }
    // youtu.be/...
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    // youtube.com/embed/...
    if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
      return url;
    }
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  } catch {
    return null;
  }
}

function sanitizeHtml(html: string): string {
  if (!html) return '';
  let sanitized = decodeHtmlEntities(html);
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');
  return sanitized;
}

// Scroll progress bar component
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #1E3A5F, #F0C05A)',
      }}
    />
  );
}

// Star Rating component
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
          <Star key={i} className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${type === 'full' ? 'text-[#F0C05A] fill-[#F0C05A]' : type === 'half' ? 'text-[#F0C05A]' : 'text-gray-300 dark:text-gray-600'}`} />
        ))}
      </div>
      {count !== undefined && (
        <span className={`text-gray-500 dark:text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>({count})</span>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { t, language, isRTL } = useTranslation();
  const { params, navigate, goBack } = useRouter();
  const { products, categories, getProductName, getProductDescription, getProductShortDescription, getCategoryName, loading } = useData();
  const { addProduct: addCompareProduct, removeProduct: removeCompareProduct, isInCompare, productIds } = useCompare();
  const { addProduct: addRecentlyViewed, items: recentlyViewedItems, clearAll: clearRecentlyViewed } = useRecentlyViewed();
  const { toggleItem: toggleWishlistItem, isInWishlist } = useWishlist();

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

  const youMayAlsoLike = useMemo(
    () =>
      product
        ? products
            .filter((p) => p.category_id === product.category_id && p.id !== product.id)
            .slice(0, 4)
        : [],
    [products, product]
  );

  const relatedCategories = useMemo(() => {
    if (!product || !categories.length) return [];
    const currentCatIndex = categories.findIndex((c) => c.id === product.category_id);
    if (currentCatIndex === -1) return [categories[0]].filter(Boolean);
    const result = [];
    // Current category
    result.push(categories[currentCatIndex]);
    // Adjacent category before
    if (currentCatIndex > 0) result.push(categories[currentCatIndex - 1]);
    // Adjacent category after
    if (currentCatIndex < categories.length - 1) result.push(categories[currentCatIndex + 1]);
    return result.filter(Boolean);
  }, [categories, product]);

  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // Image zoom state
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Lightbox zoom state
  const [lightboxZoom, setLightboxZoom] = useState(false);
  const [lightboxZoomPos, setLightboxZoomPos] = useState({ x: 50, y: 50 });
  const lightboxImgRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  }, []);

  const handleLightboxMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!lightboxImgRef.current) return;
    const rect = lightboxImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightboxZoomPos({ x, y });
  }, []);

  // Reset lightbox zoom when changing images - use event handler pattern
  const handleImageChange = useCallback((index: number) => {
    setCurrentImage(index);
    setLightboxZoom(false);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const images = product?.images || [];
      if (e.key === 'Escape') {
        setLightboxOpen(false);
        setLightboxZoom(false);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleImageChange(currentImage > 0 ? currentImage - 1 : images.length - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleImageChange(currentImage < images.length - 1 ? currentImage + 1 : 0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, product?.images, handleImageChange, currentImage]);

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
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center dark:bg-white/5"
            style={{ backgroundColor: '#f0f4f8' }}
          >
            <Package className="w-12 h-12" style={{ color: '#1E3A5F', opacity: 0.4 }} />
          </div>
          <p className="text-gray-500 dark:text-gray-300 mb-4">{t('common.noResults')}</p>
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

  const openLightbox = () => {
    if (images.length > 0) {
      setLightboxOpen(true);
      setLightboxZoom(false);
    }
  };

  const goToPrevImage = () => {
    if (images.length <= 1) return;
    handleImageChange(currentImage > 0 ? currentImage - 1 : images.length - 1);
  };

  const goToNextImage = () => {
    if (images.length <= 1) return;
    handleImageChange(currentImage < images.length - 1 ? currentImage + 1 : 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20 animate-in fade-in duration-500 relative">
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />
      {/* Lightbox using Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={(open) => { setLightboxOpen(open); if (!open) setLightboxZoom(false); }}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-black/95 backdrop-blur-sm sm:max-w-[90vw]"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">
            {getProductName(product, language)} - {t('products.gallery')}
          </DialogTitle>
          <div className="relative w-full h-[85vh] flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-3 right-3 z-10 text-white/70 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => { setLightboxOpen(false); setLightboxZoom(false); }}
              aria-label={t('products.close_gallery')}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-xs font-medium">
              {currentImage + 1} / {images.length}
            </div>

            {/* Prev/Next navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 sm:p-3 hover:bg-white/10 rounded-full transition-colors"
                  onClick={goToPrevImage}
                  aria-label={t('products.prev_image')}
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
                <button
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 text-white/70 hover:text-white p-2 sm:p-3 hover:bg-white/10 rounded-full transition-colors"
                  onClick={goToNextImage}
                  aria-label={t('products.next_image')}
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                </button>
              </>
            )}

            {/* Main image with zoom */}
            <div
              ref={lightboxImgRef}
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-crosshair"
              onMouseMove={handleLightboxMouseMove}
              onClick={() => setLightboxZoom(!lightboxZoom)}
            >
              <motion.img
                key={currentImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                src={images[currentImage]}
                alt={getProductName(product, language)}
                className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg transition-transform duration-200 select-none"
                style={{
                  transform: lightboxZoom ? 'scale(2.5)' : 'scale(1)',
                  transformOrigin: `${lightboxZoomPos.x}% ${lightboxZoomPos.y}%`,
                }}
                draggable={false}
              />
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/70 hover:text-white hover:bg-white/20 text-xs font-medium transition-colors flex items-center gap-1.5"
                onClick={() => setLightboxZoom(!lightboxZoom)}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                {lightboxZoom
                  ? (language === 'ar' ? 'تصغير' : 'Réduire')
                  : (language === 'ar' ? 'انقر للتكبير' : 'Cliquez pour agrandir')
                }
              </button>
            </div>

            {/* Thumbnail strip in lightbox */}
            {images.length > 1 && (
              <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 px-3 py-2 rounded-xl bg-white/5 backdrop-blur-sm">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); handleImageChange(i); }}
                    className={`w-12 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                      i === currentImage
                        ? 'border-[#F0C05A] shadow-lg shadow-[#F0C05A]/30'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                    aria-label={`${t('products.gallery')} ${i + 1}`}
                  >
                    <img src={img} alt={`${getProductName(product, language)} - ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-300 mb-6 flex-wrap"
        >
          <button onClick={() => navigate('/')} className="hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" />
            {t('products.breadcrumb.home')}
          </button>
          <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300 dark:text-gray-400" />
          <button onClick={() => navigate('/catalogue')} className="hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors">
            {t('products.title')}
          </button>
          <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300 dark:text-gray-400" />
          {category && (
            <>
              <button onClick={() => navigate(`/catalogue?category=${category.slug}`)} className="hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors">
                {getCategoryName(category, language)}
              </button>
              <ChevronDown className="w-3 h-3 rotate-[-90deg] text-gray-300 dark:text-gray-400" />
            </>
          )}
          <span className="text-gray-500 dark:text-gray-200 font-medium truncate max-w-[200px]">
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
            className="mb-6 gap-2 shadow-sm dark:border-gray-600 dark:text-gray-200"
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
              className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#162236] shadow-sm cursor-crosshair relative group transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(240,192,90,0.3)] dark:hover:shadow-[0_0_20px_rgba(122,176,224,0.2)]"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              onClick={openLightbox}
            >
              {images.length > 0 ? (
                <img
                  src={images[currentImage]}
                  alt={getProductName(product, language)}
                  loading="eager"
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
                  <ZoomIn className="w-3 h-3" />
                  {language === 'ar' ? 'انقر للتكبير' : 'Cliquez pour agrandir'}
                </div>
              )}
              {/* Fullscreen indicator */}
              {!isZooming && images.length > 0 && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/30 text-white/70 text-xs flex items-center gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  {language === 'ar' ? 'عرض كامل' : 'Plein écran'}
                </div>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => handleImageChange(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                      i === currentImage
                        ? 'border-[#1E3A5F] dark:border-[#7AB0E0] shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100 dark:opacity-40 dark:hover:opacity-80'
                    }`}
                    aria-label={`${t('products.gallery')} ${i + 1}`}
                  >
                    <img src={img} alt={`${getProductName(product, language)} - ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-24 lg:self-start"
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
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {getProductName(product, language)}
            </h1>

            {/* Star Rating */}
            {product.rating && (
              <div className="mb-3">
                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
              </div>
            )}

            {/* Brand & Reference Badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.brand && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full text-xs font-medium dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  <Tag className="w-3.5 h-3.5" />
                  {product.brand}
                </div>
              )}
              {product.ref && (
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full text-xs font-medium dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  <Hash className="w-3.5 h-3.5" />
                  {product.ref}
                </div>
              )}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold ${
                product.in_stock
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 opacity-80'
              }`}>
                <span className="relative flex h-2.5 w-2.5">
                  {product.in_stock && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-50" />
                  )}
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${product.in_stock ? 'bg-green-500' : 'bg-red-500'}`} />
                </span>
                {product.in_stock ? t('products.inStock') : t('products.outOfStock')}
              </div>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              {priceDisplay ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {priceDisplay}
                  </span>
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-blue-900/50"
                  style={{ backgroundColor: '#F0C05A20' }}
                >
                  <FileText className="w-5 h-5 dark:text-blue-200" style={{ color: '#F0C05A' }} />
                  <span className="text-lg font-semibold dark:text-blue-200" style={{ color: '#1E3A5F' }}>
                    {language === 'ar' ? 'السعر على أساس التسعير' : 'Prix sur devis'}
                  </span>
                </div>
              )}
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.origin && (
                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-300 mb-0.5">{t('products.origin')}</p>
                  <p className="font-semibold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{product.origin}</p>
                </div>
              )}
              {hasWarranty && (
                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-gray-400 dark:text-gray-300 mb-0.5">{t('products.warranty')}</p>
                  <p className="font-semibold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Service Badges */}
            {(hasWarranty || hasInstallation || hasTraining || hasDelivery) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {hasWarranty && (
                  <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Shield className="w-3.5 h-3.5" />
                    {product.warranty}
                  </div>
                )}
                {hasInstallation && (
                  <div className="flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Wrench className="w-3.5 h-3.5" />
                    {t('products.installation')}
                  </div>
                )}
                {hasTraining && (
                  <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-full text-xs font-medium">
                    <GraduationCap className="w-3.5 h-3.5" />
                    {t('products.training')}
                  </div>
                )}
                {hasDelivery && (
                  <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-medium">
                    <Truck className="w-3.5 h-3.5" />
                    {language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Wishlist + Compare */}
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className={`h-12 px-4 font-semibold focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                      isInWishlist(product.slug)
                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-300 dark:border-rose-700 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-rose-400 dark:hover:border-rose-600 hover:text-rose-500 dark:hover:text-rose-400'
                    }`}
                    aria-label={isInWishlist(product.slug) ? t('products.removeFromWishlist') : t('products.addToWishlist')}
                    onClick={() => {
                      toggleWishlistItem(product.slug);
                      toast.success(
                        isInWishlist(product.slug)
                          ? t('wishlist.removed')
                          : t('wishlist.added')
                      );
                    }}
                  >
                    <Heart
                      className="w-5 h-5"
                      fill={isInWishlist(product.slug) ? 'currentColor' : 'none'}
                    />
                  </Button>
                </motion.div>
                <Button
                  size="lg"
                  variant="outline"
                  className={`h-12 px-4 font-semibold focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                    isInCompare(product.id)
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                      : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-amber-400 dark:hover:border-amber-600 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                  disabled={!isInCompare(product.id) && productIds.length >= 4}
                  aria-label={isInCompare(product.id) ? t('compare.remove') : t('compare.add')}
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
              <div className="flex gap-2 relative">
                <div className="flex-1 relative">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-gray-600 dark:text-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={t('products.share')}
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  >
                    <Share2 className="w-4 h-4" />
                    {t('products.share')}
                  </Button>
                  <AnimatePresence>
                    {shareMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-0 right-0 z-50 bg-white dark:bg-[#162236] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              const url = window.location.origin + '/#/product/' + product.slug;
                              navigator.clipboard.writeText(url).then(() => {
                                toast.success(t('share.linkCopied'), {
                                  icon: <Copy className="w-4 h-4" />,
                                });
                              }).catch(() => {
                                const textArea = document.createElement('textarea');
                                textArea.value = url;
                                document.body.appendChild(textArea);
                                textArea.select();
                                document.execCommand('copy');
                                document.body.removeChild(textArea);
                                toast.success(t('share.linkCopied'), {
                                  icon: <Copy className="w-4 h-4" />,
                                });
                              });
                              setShareMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <Copy className="w-4 h-4 text-gray-400" />
                            {t('share.copyLink')}
                          </button>
                          <button
                            onClick={() => {
                              const url = window.location.origin + '/#/product/' + product.slug;
                              const text = `${getProductName(product, language)} - ${url}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                              setShareMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            {t('share.whatsapp')}
                          </button>
                          <button
                            onClick={() => {
                              const url = window.location.origin + '/#/product/' + product.slug;
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                              setShareMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            {t('share.facebook')}
                          </button>
                          <button
                            onClick={() => {
                              const url = window.location.origin + '/#/product/' + product.slug;
                              const productName = getProductName(product, language);
                              window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(productName)}`, '_blank');
                              setShareMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            {t('share.linkedin')}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 text-gray-600 dark:text-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label={t('products.print')}
                  onClick={handlePrint}
                >
                  <Printer className="w-4 h-4" />
                  {t('products.print')}
                </Button>
              </div>



              {/* Trust Badges Row */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.in_stock && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <Truck className="w-3.5 h-3.5 text-amber-500" />
                    {t('product.delivery48h')}
                  </div>
                )}
                {hasInstallation && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <Wrench className="w-3.5 h-3.5 text-purple-500" />
                    {t('products.installation')}
                  </div>
                )}
                {hasTraining && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-3.5 h-3.5 text-green-500" />
                    {t('products.training')}
                  </div>
                )}
                {hasWarranty && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 text-xs font-medium text-gray-600 dark:text-gray-300">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    {t('products.warranty')}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-10"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {hasWarranty && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.warranty')}</p>
                <p className="text-sm font-semibold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{product.warranty}</p>
              </motion.div>
            )}
            {hasDelivery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.delivery')}</p>
                <p className="text-sm font-semibold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {language === 'ar' ? product.delivery_time_ar : product.delivery_time_fr}
                </p>
              </motion.div>
            )}
            {hasInstallation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mx-auto mb-2">
                  <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.installation')}</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'نعم' : 'Oui'}
                </p>
              </motion.div>
            )}
            {hasTraining && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mx-auto mb-2">
                  <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.training')}</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {language === 'ar' ? 'نعم' : 'Oui'}
                </p>
              </motion.div>
            )}
            {product.origin && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mx-auto mb-2">
                  <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.origin')}</p>
                <p className="text-sm font-semibold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{product.origin}</p>
              </motion.div>
            )}
            {product.ref && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25, duration: 0.3 }}
                className="bg-white dark:bg-[#162236] rounded-xl p-4 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md dark:hover:shadow-black/20 transition-all text-center"
              >
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <Hash className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </div>
                <p className="text-[11px] text-gray-400 dark:text-gray-300 mb-0.5">{t('product.reference')}</p>
                <p className="text-sm font-semibold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{product.ref}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Description */}
        {descriptionHtml && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 border-b border-gray-100 dark:border-white/5 pb-8 mb-8"
          >
            <Card className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] overflow-hidden">
              <div className="h-1 gradient-border-animated" style={{ background: 'linear-gradient(90deg, #1E3A5F, #F0C05A, #3A7CB8)' }} />
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {t('products.description')}
                </h2>
                <div
                  className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300
                    prose-headings:font-bold prose-headings:text-[#1E3A5F] dark:prose-headings:text-[#7AB0E0]
                    prose-a:text-[#2A5F8F] dark:prose-a:text-[#7AB0E0] prose-a:no-underline hover:prose-a:underline
                    prose-ul:list-disc prose-ol:list-decimal
                    prose-li:marker:text-[#F0C05A]
                    prose-strong:text-[#1E3A5F] dark:prose-strong:text-[#7AB0E0]
                    prose-table:border-collapse
                    prose-th:bg-gray-50 dark:prose-th:bg-white/5 prose-th:p-2 prose-th:border prose-th:border-gray-200 dark:prose-th:border-white/10
                    prose-td:p-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-white/10"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Specifications Table Section */}
        {specs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 border-b border-gray-100 dark:border-white/5 pb-8 mb-8"
          >
            <Card className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] overflow-hidden">
              <div className="h-1 gradient-border-animated" style={{ background: 'linear-gradient(90deg, #2A5F8F, #F0C05A, #1E3A5F)' }} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(30,58,95,0.1)' }}>
                    <ClipboardList className="w-5 h-5" style={{ color: '#1E3A5F' }} />
                  </div>
                  <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('product.specifications')}
                  </h2>
                </div>
                {/* Desktop: Table view */}
                <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-white/5">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300" style={{ color: '#1E3A5F' }}>
                          {t('product.spec')}
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300" style={{ color: '#1E3A5F' }}>
                          {t('product.value')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {specs.map((spec, i) => (
                        <tr
                          key={i}
                          className={`${
                            i % 2 === 0
                              ? 'bg-white dark:bg-[#162236]'
                              : 'bg-gray-50 dark:bg-white/[0.03]'
                          } transition-colors hover:bg-[#1E3A5F]/[0.03] dark:hover:bg-white/[0.06]`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                            {language === 'ar' ? spec.label_ar : spec.label_fr}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile: Key-value pairs */}
                <div className="sm:hidden space-y-3">
                  {specs.map((spec, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gray-50 dark:bg-white/[0.03] rounded-lg p-3"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-300 mb-1">
                        {language === 'ar' ? spec.label_ar : spec.label_fr}
                      </p>
                      <p className="text-sm font-medium dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                        {spec.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Key Features Section */}
        {features && features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 border-b border-gray-100 dark:border-white/5 pb-8 mb-8"
          >
            <Card className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] overflow-hidden">
              <div className="h-1 gradient-border-animated" style={{ background: 'linear-gradient(90deg, #10B981, #F0C05A, #10B981)' }} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('product.keyFeatures')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex items-start gap-3 bg-gray-50 dark:bg-white/[0.03] rounded-lg p-3 hover:shadow-sm dark:hover:shadow-none transition-shadow"
                    >
                      <div className="mt-0.5 shrink-0 p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Customer Reviews Section */}
        {product.rating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 border-b border-gray-100 dark:border-white/5 pb-8 mb-8"
          >
            <Card className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] overflow-hidden">
              <div className="h-1 gradient-border-animated" style={{ background: 'linear-gradient(90deg, #F0C05A, #3A7CB8, #F0C05A)' }} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Star className="w-5 h-5 text-amber-500 dark:text-amber-400 fill-amber-500" />
                  </div>
                  <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('product.reviews')}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Rating Summary Card */}
                  <div className="md:col-span-1 bg-gray-50 dark:bg-white/[0.03] rounded-xl p-5 flex flex-col items-center justify-center text-center">
                    <span className="text-5xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {product.rating.toFixed(1)}
                    </span>
                    <div className="mt-2">
                      <StarRating rating={product.rating} size="md" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                      {product.reviewCount || 0} {language === 'ar' ? 'تقييم' : 'avis'}
                    </p>

                    {/* Rating Distribution */}
                    <div className="w-full mt-4 space-y-1.5">
                      {[
                        { stars: 5, pct: 80 },
                        { stars: 4, pct: 15 },
                        { stars: 3, pct: 3 },
                        { stars: 2, pct: 1 },
                        { stars: 1, pct: 1 },
                      ].map((row) => (
                        <div key={row.stars} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-gray-500 dark:text-gray-300">{row.stars}</span>
                          <Star className="w-3 h-3 text-[#F0C05A] fill-[#F0C05A]" />
                          <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#F0C05A]"
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-right text-gray-400 dark:text-gray-300">{row.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sample Reviews */}
                  <div className="md:col-span-2 space-y-4">
                    {[
                      {
                        name: 'Dr. Benali',
                        rating: 5,
                        date: language === 'ar' ? t('product.monthsAgo').replace('{n}', '2') : 'Il y a 2 mois',
                        text: language === 'ar'
                          ? 'جهاز ممتاز، التركيب كان احترافياً والفريق التقني متاح دائماً. أنصح بشدة بهذا المنتج لزملائي.'
                          : 'Équipement excellent, l\'installation a été professionnelle et l\'équipe technique toujours disponible. Je recommande vivement ce produit à mes confrères.',
                        verified: true,
                      },
                      {
                        name: 'Dr. Meziane',
                        rating: 4,
                        date: language === 'ar' ? t('product.weeksAgo').replace('{n}', '1') : 'Il y a 1 semaine',
                        text: language === 'ar'
                          ? 'جودة التصنيع ممتازة. تكوين الفريق كان مفيداً جداً. راضٍ تماماً عن الشراء.'
                          : 'Qualité de fabrication au rendez-vous. La formation de l\'équipe a été très utile. Très satisfait de mon achat.',
                        verified: true,
                      },
                      {
                        name: 'Dr. Khelifi',
                        rating: 5,
                        date: language === 'ar' ? t('product.monthsAgo').replace('{n}', '3') : 'Il y a 3 mois',
                        text: language === 'ar'
                          ? 'استخدام يومي منذ 3 أشهر بدون أي مشكلة. خدمة ما بعد البيع استثنائية. شكراً لفريق ODG.'
                          : 'Utilisation quotidienne depuis 3 mois sans aucun problème. SAV exceptionnel. Merci à l\'équipe ODG.',
                        verified: true,
                      },
                    ].map((review, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="bg-gray-50 dark:bg-white/[0.03] rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: '#1E3A5F' }}>
                              {review.name.charAt(review.name.lastIndexOf(' ') + 1)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold dark:text-white" style={{ color: '#1E3A5F' }}>{review.name}</p>
                              <div className="flex items-center gap-1.5">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3 h-3 ${s <= review.rating ? 'text-[#F0C05A] fill-[#F0C05A]' : 'text-gray-300 dark:text-gray-600'}`}
                                    />
                                  ))}
                                </div>
                                {review.verified && (
                                  <span className="flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400 font-medium">
                                    <CheckCircle className="w-3 h-3" />
                                    {t('product.verifiedPurchase')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-300">{review.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.text}</p>
                      </motion.div>
                    ))}

                    {/* See All Reviews Button */}
                    <Button
                      variant="outline"
                      className="w-full mt-2 gap-2 dark:border-white/10 dark:text-[#7AB0E0]"
                      style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                      onClick={() => {}}
                    >
                      {t('product.seeAllReviews')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Product Videos Section */}
        {product.videos && product.videos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-8 border-b border-gray-100 dark:border-white/5 pb-8 mb-8"
          >
            <Card className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] overflow-hidden">
              <div className="h-1 gradient-border-animated" style={{ background: 'linear-gradient(90deg, #EF4444, #F0C05A, #EF4444)' }} />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <Play className="w-5 h-5 text-red-500 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('product.videos')}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.videos.map((video, i) => {
                    const embedUrl = getYouTubeEmbedUrl(video.url);
                    const videoTitle = language === 'ar' ? video.title_ar : video.title_fr;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        className="rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
                      >
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          {embedUrl ? (
                            <iframe
                              src={embedUrl}
                              title={videoTitle}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="absolute inset-0 w-full h-full"
                            />
                          ) : (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100 dark:bg-[#0f1d2e] hover:bg-gray-200 dark:hover:bg-[#162236] transition-colors"
                            >
                              <div className="text-center">
                                <div className="w-14 h-14 rounded-full bg-red-500/10 dark:bg-red-500/20 flex items-center justify-center mx-auto mb-2">
                                  <Play className="w-7 h-7 text-red-500 dark:text-red-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                  {t('product.watchVideo')}
                                </p>
                              </div>
                            </a>
                          )}
                        </div>
                        {videoTitle && (
                          <div className="px-4 py-3 bg-gray-50 dark:bg-white/[0.03]">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                              {videoTitle}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
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
              <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                {t('products.relatedProducts')}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rp) => (
                <Card
                  key={rp.id}
                  className="group border-0 shadow-sm dark:shadow-none dark:bg-[#162236] hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => {
                    handleImageChange(0);
                    navigate(`/product/${rp.slug}`);
                  }}
                >
                  <div className="h-36 overflow-hidden bg-[#f0f4f8] dark:bg-[#0f1d2e]">
                    {rp.images?.[0] ? (
                      <img
                        src={rp.images[0]}
                        alt={getProductName(rp, language)}
                        loading="lazy"
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
                    <h3 className="font-semibold text-sm line-clamp-1 mt-0.5 dark:text-white" style={{ color: '#1E3A5F' }}>
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
              <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                {t('products.recentlyViewed')}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
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
                      className="border-0 shadow-sm dark:shadow-none dark:bg-[#162236] hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/product/${rv.slug}`)}
                    >
                      <div className="h-28 overflow-hidden bg-[#f0f4f8] dark:bg-[#0f1d2e]">
                        {rv.image ? (
                          <img
                            src={rv.image}
                            alt={rv.name}
                            loading="lazy"
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
                        <h3 className="font-semibold text-xs line-clamp-1 mt-0.5 dark:text-white" style={{ color: '#1E3A5F' }}>
                          {rv.name}
                        </h3>
                        <p className="text-[10px] font-medium mt-1 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
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

      {/* Related Categories Section */}
      {relatedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1.5 rounded-full" style={{ backgroundColor: '#3B8C6E' }} />
            <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {t('products.relatedCategories')}
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {relatedCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate('/catalogue')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 hover:border-[#1E3A5F] dark:hover:border-[#7AB0E0] hover:shadow-md dark:hover:shadow-black/30 transition-all duration-200 group"
                style={{ backgroundColor: 'rgba(30,58,95,0.03)' }}
              >
                {cat.icon && (
                  <span className="text-lg" dangerouslySetInnerHTML={{ __html: cat.icon }} />
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#1E3A5F] dark:group-hover:text-[#7AB0E0] transition-colors">
                  {getCategoryName(cat, language)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* You May Also Like Section */}
      {youMayAlsoLike.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-4"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            <h2 className="text-xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {t('products.youMayAlsoLike')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {youMayAlsoLike.map((rp) => (
              <Card
                key={rp.id}
                className="group border-0 shadow-sm dark:shadow-none dark:bg-[#162236] hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => {
                  handleImageChange(0);
                  navigate(`/product/${rp.slug}`);
                }}
              >
                <div className="flex sm:flex-col">
                  <div className="w-24 sm:w-full h-24 sm:h-36 shrink-0 overflow-hidden bg-[#f0f4f8] dark:bg-[#0f1d2e]">
                    {rp.images?.[0] ? (
                      <img
                        src={rp.images[0]}
                        alt={getProductName(rp, language)}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <CardContent className="p-3 flex-1 min-w-0">
                    {rp.brand && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#F0C05A' }}>
                        {rp.brand}
                      </span>
                    )}
                    <h3 className="font-semibold text-sm line-clamp-1 mt-0.5 dark:text-white" style={{ color: '#1E3A5F' }}>
                      {getProductName(rp, language)}
                    </h3>
                    <p className="text-xs font-medium mt-1 dark:text-[#7AB0E0]" style={{ color: '#2A5F8F' }}>
                      {rp.price && rp.price > 0
                        ? `${rp.price.toLocaleString('fr-DZ')} DA`
                        : (language === 'ar' ? 'عند الطلب' : 'Sur devis')
                      }
                    </p>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}


    </div>
  );
}
