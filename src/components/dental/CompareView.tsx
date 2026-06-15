'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  GitCompareArrows,
  ShoppingCart,
  Package,
  CheckCircle2,
  XCircle,
  Tag,
  Hash,
  Shield,
  CircleDot,
  MapPin,
} from 'lucide-react';
import { useCompare } from '@/hooks/useCompare';
import { useData } from '@/lib/data-service';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import type { Product } from '@/lib/data-service';

// Safely get a spec value from a Record
function getSpecField(spec: Record<string, string>, field: string): string {
  return spec[field] || '';
}

export default function CompareView() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { productIds, removeProduct, clearCompare } = useCompare();
  const { products, categories, getProductName, getCategoryName } = useData();
  const addItem = useQuoteCart((s) => s.addItem);

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

  // Check if a feature differs among products (present in some but not all)
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
        <div className="w-full aspect-square max-w-[200px] mx-auto rounded-xl overflow-hidden bg-white shadow-sm">
          {p.images && p.images.length > 0 ? (
            <img
              src={p.images[0]}
              alt={getProductName(p, language)}
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ backgroundColor: '#f8fafc' }}>
                      <th
                        className="p-4 text-left text-sm font-semibold min-w-[140px] sticky left-0 z-10"
                        style={{
                          backgroundColor: '#f8fafc',
                          color: '#1E3A5F',
                        }}
                      >
                        {t('compare.highlightDiff')}
                      </th>
                      {compareProducts.map((product) => (
                        <th key={product.id} className="p-4 min-w-[200px]">
                          <div className="flex flex-col items-center">
                            {/* Remove button */}
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="self-end mb-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 flex items-center justify-center transition-colors"
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
                            ? 'bg-amber-50/50'
                            : ''
                        }`}
                      >
                        <td
                          className={`p-4 text-sm font-medium sticky left-0 z-10 ${
                            row.isDifferent ? 'bg-amber-50/50' : 'bg-white'
                          }`}
                          style={{ color: '#1E3A5F' }}
                        >
                          <div className="flex items-center gap-2">
                            {row.label}
                            {row.isDifferent && (
                              <Badge
                                className="text-[9px] px-1.5 py-0 border-0"
                                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                              >
                                !
                              </Badge>
                            )}
                          </div>
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className={`p-4 text-center ${
                              row.isDifferent ? 'bg-amber-50/30' : ''
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
                          className="p-3 text-sm font-bold text-white sticky left-0 z-10"
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
                          className={`border-b ${different ? 'bg-amber-50/50' : ''}`}
                        >
                          <td
                            className={`p-3 text-sm sticky left-0 z-10 ${
                              different ? 'bg-amber-50/50' : 'bg-white'
                            }`}
                            style={{ color: '#64748b' }}
                          >
                            <div className="flex items-center gap-2">
                              {language === 'ar' ? specLabel.label_ar : specLabel.label_fr}
                              {different && (
                                <Badge
                                  className="text-[9px] px-1.5 py-0 border-0"
                                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                                >
                                  !
                                </Badge>
                              )}
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
                                  different ? 'bg-amber-50/30' : ''
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
                          className="p-3 text-sm font-bold text-white sticky left-0 z-10"
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
                          className={`border-b ${different ? 'bg-amber-50/50' : ''}`}
                        >
                          <td
                            className={`p-3 text-sm sticky left-0 z-10 ${
                              different ? 'bg-amber-50/50' : 'bg-white'
                            }`}
                            style={{ color: '#64748b' }}
                          >
                            <div className="flex items-center gap-2">
                              {feature}
                              {different && (
                                <Badge
                                  className="text-[9px] px-1.5 py-0 border-0"
                                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                                >
                                  !
                                </Badge>
                              )}
                            </div>
                          </td>
                          {compareProducts.map((product) => {
                            const feats = language === 'ar' ? product.features_ar : product.features_fr;
                            const hasFeature = (feats || []).includes(feature);
                            return (
                              <td
                                key={product.id}
                                className={`p-3 text-center ${
                                  different ? 'bg-amber-50/30' : ''
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

                    {/* Add to Quote row */}
                    <tr className="border-t-2" style={{ backgroundColor: '#f8fafc' }}>
                      <td
                        className="p-4 text-sm font-semibold sticky left-0 z-10"
                        style={{ backgroundColor: '#f8fafc', color: '#1E3A5F' }}
                      >
                        {t('products.addQuote')}
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <Button
                            size="sm"
                            className="gap-1.5 shadow-sm font-semibold"
                            style={{ backgroundColor: '#1E3A5F', color: '#fff' }}
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
                            <ShoppingCart className="w-4 h-4" />
                            {t('products.addQuote')}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
