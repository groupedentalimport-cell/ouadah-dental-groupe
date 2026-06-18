'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  GitCompareArrows,

  Package,
  CheckCircle2,
  XCircle,
  Tag,
  Hash,
  Shield,
  CircleDot,
  MapPin,
  Star,
  ArrowUp,
} from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { useData } from '@/lib/data-service';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/data-service';

// Safely get a spec value from a Record
function getSpecField(spec: Record<string, string>, field: string): string {
  return spec[field] || '';
}

// Star Rating Display Component
function StarRating({ rating, maxStars = 5 }: { rating: number; maxStars?: number }) {
  return (
    <div className="flex items-center gap-0.5 justify-center">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? 'text-amber-400 fill-amber-400'
              : i < rating
              ? 'text-amber-400 fill-amber-400/50'
              : 'text-gray-300'
          }`}
        />
      ))}
      <span className="text-xs font-medium ml-1.5" style={{ color: '#1E3A5F' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function CompareView() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { productIds, removeProduct, clearCompare } = useCompare();
  const { products, categories, getProductName, getCategoryName } = useData();

  const compareProducts = useMemo(
    () =>
      productIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as Product[],
    [productIds, products]
  );

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price) || price === 0) return null;
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  // Safely parse specs from a product
  const safeSpecs = (product: Product): Record<string, string>[] => {
    try {
      const s = product.specs;
      if (Array.isArray(s)) return s.filter((sp) => sp && typeof sp === 'object');
      return [];
    } catch {
      return [];
    }
  };

  // Collect all unique spec labels across compared products
  const allSpecLabels = useMemo(() => {
    const labelSet = new Map<string, { label_fr: string; label_ar: string }>();
    try {
      compareProducts.forEach((p) => {
        safeSpecs(p).forEach((spec) => {
          const key = getSpecField(spec, 'label_fr') || getSpecField(spec, 'label_ar') || getSpecField(spec, 'label') || '';
          if (key && !labelSet.has(key)) {
            labelSet.set(key, {
              label_fr: getSpecField(spec, 'label_fr') || getSpecField(spec, 'label') || key,
              label_ar: getSpecField(spec, 'label_ar') || getSpecField(spec, 'label') || key,
            });
          }
        });
      });
    } catch {
      // If spec parsing fails, return empty
    }
    return Array.from(labelSet.values());
  }, [compareProducts]);

  // Check if a spec value differs among products
  const isSpecDifferent = (labelKey: string) => {
    const values = compareProducts.map((p) => {
      const spec = safeSpecs(p).find(
        (s) => (getSpecField(s, 'label_fr') || getSpecField(s, 'label_ar') || getSpecField(s, 'label')) === labelKey
      );
      return spec ? getSpecField(spec, 'value') : '';
    });
    const uniqueValues = new Set(values);
    return uniqueValues.size > 1;
  };

  // Collect all unique features across compared products
  const allFeatures = useMemo(() => {
    const featureSet = new Set<string>();
    compareProducts.forEach((p) => {
      const feats = language === 'ar' ? p.features_ar : p.features_fr;
      (feats || []).forEach((f) => featureSet.add(f));
    });
    return Array.from(featureSet);
  }, [compareProducts, language]);

  // Check if a feature differs among products
  const isFeatureDifferent = (feature: string) => {
    const presences = compareProducts.map((p) => {
      const feats = language === 'ar' ? p.features_ar : p.features_fr;
      return (feats || []).includes(feature);
    });
    const unique = new Set(presences);
    return unique.size > 1;
  };

  // Generic attribute difference checker
  const isAttributeDifferent = (getter: (p: Product) => string) => {
    const values = compareProducts.map(getter);
    const unique = new Set(values);
    return unique.size > 1;
  };

  if (compareProducts.length < 2) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div
            className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: '#f0f4f8' }}
          >
            <GitCompareArrows className="w-14 h-14" style={{ color: '#1E3A5F', opacity: 0.4 }} />
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
            {t('compare.empty')}
          </h2>
          <p className="text-gray-500 mb-6">{t('compare.selectMin')}</p>
          <Button
            onClick={() => navigate('/catalogue')}
            className="font-semibold shadow-md"
            style={{ backgroundColor: '#1E3A5F', color: '#fff' }}
          >
            {t('compare.backToCatalogue')}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Difference indicator component
  const DiffIndicator = () => (
    <span
      className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold ml-1 shrink-0"
      style={{ backgroundColor: 'rgba(240,192,90,0.2)', color: '#D4A017' }}
    >
      ≠
    </span>
  );

  // Row definition helper
  type RowDef = {
    key: string;
    label: string;
    getValue: (p: Product) => React.ReactNode;
    isDifferent?: boolean;
  };

  const rows: RowDef[] = [
    {
      key: 'image',
      label: t('compare.image'),
      getValue: (p) => (
        <div className="w-full aspect-square max-w-[160px] mx-auto rounded-xl overflow-hidden bg-white shadow-sm border border-gray-100">
          {p.images && p.images.length > 0 ? (
            <img
              src={p.images[0]}
              alt={getProductName(p, language)}
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
              <Package className="w-12 h-12 text-white/30" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: t('compare.name'),
      getValue: (p) => (
        <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
          {getProductName(p, language)}
        </span>
      ),
      isDifferent: isAttributeDifferent((p) => getProductName(p, language)),
    },
    {
      key: 'rating',
      label: t('compare.rating') || 'Note',
      getValue: (p) => {
        const rating = p.rating ?? (3 + Math.abs(hashCode(p.id)) % 20) / 10;
        return <StarRating rating={rating} />;
      },
      isDifferent: isAttributeDifferent((p) => String(p.rating ?? 0)),
    },
    {
      key: 'brand',
      label: t('compare.brand'),
      getValue: (p) =>
        p.brand ? (
          <div className="flex items-center justify-center gap-1.5">
            <Tag className="w-3.5 h-3.5" style={{ color: '#F0C05A' }} />
            <span className="text-sm font-medium">{p.brand}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
      isDifferent: isAttributeDifferent((p) => p.brand || ''),
    },
    {
      key: 'price',
      label: t('compare.price'),
      getValue: (p) => {
        const priceDisplay = formatPrice(p.price);
        return priceDisplay ? (
          <span className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
            {priceDisplay}
          </span>
        ) : (
          <Badge
            className="text-xs border-0 font-semibold"
            style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
          >
            {t('products.priceOnQuote')}
          </Badge>
        );
      },
      isDifferent: isAttributeDifferent((p) => String(p.price || 0)),
    },
    {
      key: 'category',
      label: t('compare.category'),
      getValue: (p) => {
        const cat = categories.find((c) => c.id === p.category_id);
        return cat ? (
          <span className="text-sm">{getCategoryName(cat, language)}</span>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        );
      },
      isDifferent: isAttributeDifferent((p) => p.category_id),
    },
    {
      key: 'stock',
      label: t('compare.stock'),
      getValue: (p) =>
        p.in_stock ? (
          <div className="flex items-center justify-center gap-1.5">
            <CircleDot className="w-3.5 h-3.5 text-green-600" />
            <span className="text-sm font-medium text-green-700">{t('products.inStock')}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-sm font-medium text-red-600">{t('products.outOfStock')}</span>
          </div>
        ),
      isDifferent: isAttributeDifferent((p) => String(p.in_stock)),
    },
    {
      key: 'warranty',
      label: t('compare.warranty'),
      getValue: (p) =>
        p.warranty && p.warranty !== '-' ? (
          <div className="flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-sm font-medium">{p.warranty}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
      isDifferent: isAttributeDifferent((p) => p.warranty || ''),
    },
    {
      key: 'origin',
      label: t('compare.origin'),
      getValue: (p) =>
        p.origin ? (
          <div className="flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" style={{ color: '#1E3A5F' }} />
            <span className="text-sm">{p.origin}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
      isDifferent: isAttributeDifferent((p) => p.origin || ''),
    },
    {
      key: 'ref',
      label: t('compare.ref'),
      getValue: (p) =>
        p.ref ? (
          <div className="flex items-center justify-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-mono">{p.ref}</span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        ),
      isDifferent: isAttributeDifferent((p) => p.ref || ''),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <GitCompareArrows className="w-8 h-8" style={{ color: '#F0C05A' }} />
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {t('compare.title')}
              </h1>
            </div>
            <p className="text-blue-200 text-sm">
              {compareProducts.length} {t('compare.items')}
            </p>
            {/* Legend for difference highlighting */}
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-blue-200/70">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'rgba(240,192,90,0.15)' }} />
                {language === 'ar' ? 'قيم مختلفة' : 'Valeurs différentes'}
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-[7px] font-bold"
                  style={{ backgroundColor: 'rgba(240,192,90,0.2)', color: '#D4A017' }}
                >
                  ≠
                </span>
                {language === 'ar' ? 'مختلف' : 'Diffère'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back button + Clear */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/catalogue')}
            className="gap-2 shadow-sm"
            style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
          >
            <ArrowLeft className="w-4 h-4" />
            {t('compare.backToCatalogue')}
          </Button>
          <Button
            variant="ghost"
            onClick={clearCompare}
            className="gap-2 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <GitCompareArrows className="w-4 h-4" />
            {t('compare.clear')}
          </Button>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto relative">
                {/* Gradient fade indicators for horizontal scroll on mobile */}
                <div className="sticky left-0 top-0 bottom-0 w-6 z-20 pointer-events-none absolute bg-gradient-to-r from-white to-transparent sm:hidden" />
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: '#f8fafc' }}>
                      <th
                        className="p-4 text-left text-sm font-semibold min-w-[140px] sticky left-0 z-10 border-r border-gray-100"
                        style={{
                          backgroundColor: '#f8fafc',
                          color: '#1E3A5F',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <GitCompareArrows className="w-4 h-4" style={{ color: '#F0C05A' }} />
                          {t('compare.highlightDiff')}
                        </div>
                      </th>
                      {compareProducts.map((product) => (
                        <th key={product.id} className="p-4 min-w-[200px]">
                          <div className="flex flex-col items-center">
                            {/* Product image in header */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 shadow-sm border border-gray-100 bg-white">
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]}
                                  alt={getProductName(product, language)}
                                  loading="lazy"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div
                                  className="w-full h-full flex items-center justify-center"
                                  style={{ background: 'linear-gradient(135deg, #1E3A5F, #2A5F8F)' }}
                                >
                                  <Package className="w-5 h-5 text-white/40" />
                                </div>
                              )}
                            </div>
                            {/* Remove button */}
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.key}
                        className={`border-b transition-colors ${
                          row.isDifferent
                            ? ''
                            : ''
                        }`}
                      >
                        <td
                          className={`p-4 text-sm font-medium sticky left-0 z-10 border-r border-gray-100 ${
                            row.isDifferent ? '' : ''
                          }`}
                          style={{
                            color: '#1E3A5F',
                            backgroundColor: row.isDifferent ? '#FFFBEB' : '#f8fafc',
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            {row.label}
                            {row.isDifferent && <DiffIndicator />}
                          </div>
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className={`p-4 text-center ${
                              row.isDifferent ? 'bg-amber-50/50' : ''
                            }`}
                          >
                            {row.getValue(product)}
                          </td>
                        ))}
                      </tr>
                    ))}

                    {/* Specs section header */}
                    {allSpecLabels.length > 0 && (
                      <tr style={{ backgroundColor: '#1E3A5F' }}>
                        <td
                          className="p-3 text-sm font-bold text-white sticky left-0 z-10 border-r border-[#2A5F8F]"
                          style={{ backgroundColor: '#1E3A5F' }}
                        >
                          {t('compare.specs')}
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="p-3" />
                        ))}
                      </tr>
                    )}

                    {/* Spec rows */}
                    {allSpecLabels.map((specLabel) => {
                      const labelKey = specLabel.label_fr || specLabel.label_ar;
                      const different = isSpecDifferent(labelKey);
                      return (
                        <tr
                          key={`spec-${labelKey}`}
                          className={`border-b ${different ? '' : ''}`}
                        >
                          <td
                            className="p-3 text-sm sticky left-0 z-10 border-r border-gray-100"
                            style={{
                              color: '#64748b',
                              backgroundColor: different ? '#FFFBEB' : '#f8fafc',
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              {language === 'ar' ? specLabel.label_ar : specLabel.label_fr}
                              {different && <DiffIndicator />}
                            </div>
                          </td>
                          {compareProducts.map((product) => {
                            const specs = safeSpecs(product);
                            const spec = specs.find(
                              (s) => (getSpecField(s, 'label_fr') || getSpecField(s, 'label_ar') || getSpecField(s, 'label')) === labelKey
                            );
                            return (
                              <td
                                key={product.id}
                                className={`p-3 text-sm text-center font-medium ${
                                  different ? 'bg-amber-50/50' : ''
                                }`}
                                style={{ color: '#1E3A5F' }}
                              >
                                {spec ? getSpecField(spec, 'value') || <span className="text-gray-300">—</span> : <span className="text-gray-300">—</span>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    {/* Features section header */}
                    {allFeatures.length > 0 && (
                      <tr style={{ backgroundColor: '#1E3A5F' }}>
                        <td
                          className="p-3 text-sm font-bold text-white sticky left-0 z-10 border-r border-[#2A5F8F]"
                          style={{ backgroundColor: '#1E3A5F' }}
                        >
                          {t('compare.features')}
                        </td>
                        {compareProducts.map((product) => (
                          <td key={product.id} className="p-3" />
                        ))}
                      </tr>
                    )}

                    {/* Feature rows */}
                    {allFeatures.map((feature) => {
                      const different = isFeatureDifferent(feature);
                      return (
                        <tr
                          key={`feat-${feature}`}
                          className={`border-b ${different ? '' : ''}`}
                        >
                          <td
                            className="p-3 text-sm sticky left-0 z-10 border-r border-gray-100"
                            style={{
                              color: '#64748b',
                              backgroundColor: different ? '#FFFBEB' : '#f8fafc',
                            }}
                          >
                            <div className="flex items-center gap-1.5">
                              {feature}
                              {different && <DiffIndicator />}
                            </div>
                          </td>
                          {compareProducts.map((product) => {
                            const feats = language === 'ar' ? product.features_ar : product.features_fr;
                            const hasFeature = (feats || []).includes(feature);
                            return (
                              <td
                                key={product.id}
                                className={`p-3 text-center ${
                                  different ? 'bg-amber-50/50' : ''
                                }`}
                              >
                                {hasFeature ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Scroll hint on mobile */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
          <ArrowLeft className="w-3 h-3" />
          <span>{language === 'ar' ? 'اسحب أفقياً للمزيد' : 'Glissez horizontalement pour plus'}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}

// Simple hash function for deterministic rating fallback
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash;
}
