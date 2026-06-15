'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Package,
  ShoppingCart,
  Eye,
  ChevronDown,
  X,
  RotateCcw,
  Stethoscope,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import type { Product } from '@/lib/data-service';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'name';

// Category accent colors for left borders
const categoryColors = [
  '#1E3A5F', '#2A5F8F', '#3A7CB8', '#F0C05A', '#E8963E',
  '#4A9D7C', '#6B5CE7', '#D94F7B',
];

export default function CataloguePage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, products, getCategoryName, getProductName, getProductShortDescription } = useData();
  const addItem = useQuoteCart((s) => s.addItem);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Parse category from URL hash if present
  React.useEffect(() => {
    const hash = window.location.hash;
    const parts = hash.split('?');
    if (parts.length > 1) {
      const params = new URLSearchParams(parts[1]);
      const cat = params.get('category');
      if (cat) setSelectedCategory(cat);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== 'all') {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) result = result.filter((p) => p.category_id === cat.id);
    }

    // Filter by search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name_fr.toLowerCase().includes(q) ||
          p.name_ar.includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.ref.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'priceAsc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        result.sort((a, b) =>
          language === 'ar'
            ? a.name_ar.localeCompare(b.name_ar)
            : a.name_fr.localeCompare(b.name_fr)
        );
        break;
    }

    return result;
  }, [products, categories, selectedCategory, search, sort, language]);

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price) || price === 0) return null;
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const isFiltering = selectedCategory !== 'all' || search.length > 0;

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSort('newest');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ backgroundColor: '#F0C05A' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {t('products.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </motion.div>

          {/* Search & Sort inside the header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('nav.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-0 bg-gray-50 focus-visible:ring-1"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-9 w-full sm:w-44 rounded-md border border-gray-200 bg-gray-50 px-3 pr-8 text-sm appearance-none cursor-pointer"
                >
                  <option value="newest">{t('products.sort.newest')}</option>
                  <option value="priceAsc">{t('products.sort.priceAsc')}</option>
                  <option value="priceDesc">{t('products.sort.priceDesc')}</option>
                  <option value="name">{t('products.sort.name')}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filter button + results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            <span className="font-semibold" style={{ color: '#1E3A5F' }}>{filteredProducts.length}</span>{' '}
            {language === 'ar' ? 'منتج' : 'produit(s)'}
          </p>
          <div className="flex gap-2 items-center">
            {isFiltering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="gap-1.5 text-xs"
                style={{ color: '#1E3A5F' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('products.clearFilters')}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('products.filter')}
            </Button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-60 shrink-0"
          >
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider" style={{ color: '#1E3A5F' }}>
                {t('nav.categories')}
              </h3>
              <div className="space-y-1">
                {/* "Tous" - prominent option */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory === 'all'
                      ? 'font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  style={
                    selectedCategory === 'all'
                      ? { backgroundColor: '#1E3A5F', color: '#fff' }
                      : {}
                  }
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {t('products.all')}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`text-[10px] h-5 min-w-[20px] flex items-center justify-center ${
                      selectedCategory === 'all' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {products.length}
                  </Badge>
                </button>

                <div className="my-2 border-t border-gray-100" />

                {categories.map((cat, idx) => {
                  const count = products.filter((p) => p.category_id === cat.id).length;
                  const isActive = selectedCategory === cat.slug;
                  const accentColor = categoryColors[idx % categoryColors.length];

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group relative overflow-hidden ${
                        isActive
                          ? 'font-medium shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: `${accentColor}15`, color: accentColor }
                          : {}
                      }
                    >
                      {/* Colored left border */}
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r transition-all duration-200 ${
                          isActive ? 'h-6' : 'h-0 group-hover:h-3'
                        }`}
                        style={{ backgroundColor: isActive ? '#F0C05A' : accentColor }}
                      />
                      <span className="pl-2 flex-1">{getCategoryName(cat, language)}</span>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] h-5 min-w-[20px] flex items-center justify-center ${
                          isActive ? 'text-white hover:opacity-90' : 'bg-gray-100 text-gray-500'
                        }`}
                        style={isActive ? { backgroundColor: accentColor } : {}}
                      >
                        {count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Mobile Filter Sheet */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                  onClick={() => setShowFilters(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-5 max-h-[70vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>
                      {t('nav.categories')}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => { setSelectedCategory('all'); setShowFilters(false); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === 'all'
                          ? 'text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={selectedCategory === 'all' ? { backgroundColor: '#1E3A5F' } : {}}
                    >
                      {t('products.all')} ({products.length})
                    </button>
                    {categories.map((cat) => {
                      const count = products.filter((p) => p.category_id === cat.id).length;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            selectedCategory === cat.slug
                              ? 'text-white shadow-sm'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          style={selectedCategory === cat.slug ? { backgroundColor: '#1E3A5F' } : {}}
                        >
                          {getCategoryName(cat, language)} ({count})
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div
                  className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: '#f0f4f8' }}
                >
                  <Stethoscope className="w-12 h-12" style={{ color: '#1E3A5F', opacity: 0.4 }} />
                </div>
                <p className="text-gray-500 text-lg font-medium mb-2">{t('products.noResults')}</p>
                <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                  {t('products.noResultsTip')}
                </p>
                {isFiltering && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="gap-2"
                    style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('products.clearFilters')}
                  </Button>
                )}
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    language={language}
                    getProductName={getProductName}
                    getProductShortDescription={getProductShortDescription}
                    formatPrice={formatPrice}
                    t={t}
                    navigate={navigate}
                    addItem={addItem}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  index,
  language,
  getProductName,
  getProductShortDescription,
  formatPrice,
  t,
  navigate,
  addItem,
}: {
  product: Product;
  index: number;
  language: string;
  getProductName: (p: Product, lang: any) => string;
  getProductShortDescription: (p: Product, lang: any) => string;
  formatPrice: (p: number | undefined) => string | null;
  t: (k: string) => string;
  navigate: (p: string) => void;
  addItem: (item: any) => void;
}) {
  const priceDisplay = formatPrice(product.price);
  const isOnQuote = !priceDisplay; // price is 0 or missing

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
    >
      <Card
        className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer"
        onClick={() => navigate(`/product/${product.slug}`)}
      >
        {/* Image area */}
        <div className="h-48 relative overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={getProductName(product, language)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)',
              }}
            >
              <div className="text-center">
                <Package className="w-14 h-14 text-white/40 mx-auto mb-1" />
                <p className="text-white/30 text-xs font-medium tracking-wider uppercase">ODG</p>
              </div>
            </div>
          )}

          {/* Top-left badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="text-[10px] px-2 py-0.5 border-0" style={{ backgroundColor: '#1E3A5F' }}>
                {t('products.new')}
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge className="text-[10px] px-2 py-0.5 border-0" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                {t('products.bestSeller')}
              </Badge>
            )}
          </div>

          {/* Top-right: Stock badge */}
          <div className="absolute top-3 right-3">
            {product.in_stock ? (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-white/90 border-green-200 text-green-700 backdrop-blur-sm">
                {t('products.inStock')}
              </Badge>
            ) : (
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                {t('products.outOfStock')}
              </Badge>
            )}
          </div>

          {/* "Sur devis" badge when no price */}
          {isOnQuote && (
            <div className="absolute bottom-3 left-3">
              <Badge
                className="text-[10px] px-2.5 py-0.5 border-0 font-semibold shadow-sm"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              >
                {t('products.priceOnQuote')}
              </Badge>
            </div>
          )}

          {/* Hover overlay with "Voir détails" button */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg translate-y-2 group-hover:translate-y-0"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.slug}`);
              }}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              {t('products.viewDetails')}
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-1">
          {/* Brand tag */}
          {product.brand && (
            <span
              className="text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: '#F0C05A' }}
            >
              {product.brand}
            </span>
          )}

          {/* Product name */}
          <h3
            className="font-semibold text-sm mb-1 line-clamp-2 leading-snug"
            style={{ color: '#1E3A5F' }}
          >
            {getProductName(product, language)}
          </h3>

          {/* Short description */}
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
            {getProductShortDescription(product, language)}
          </p>

          {/* Price + Action row */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            {priceDisplay ? (
              <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
                {priceDisplay}
              </span>
            ) : (
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ backgroundColor: '#F0C05A20', color: '#1E3A5F' }}
              >
                {t('products.priceOnQuote')}
              </span>
            )}
            <Button
              size="sm"
              className="text-xs h-8 gap-1.5 shadow-sm"
              style={{ backgroundColor: '#1E3A5F', color: '#fff' }}
              onClick={(e) => {
                e.stopPropagation();
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: getProductName(product, language),
                  price: product.price,
                  image: product.images?.[0] || '',
                });
              }}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {t('products.addQuote')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
