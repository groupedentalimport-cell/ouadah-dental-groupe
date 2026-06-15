'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Package, ShoppingCart, Eye, ChevronDown } from 'lucide-react';
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
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
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
    if (price == null || isNaN(price)) return '— DA';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('products.title')}
            </h1>
            <p className="text-blue-200">{t('products.subtitle')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('nav.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {t('products.filter')}
              </Button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 rounded-md border border-gray-200 bg-background px-3 text-sm"
              >
                <option value="newest">{t('products.sort.newest')}</option>
                <option value="priceAsc">{t('products.sort.priceAsc')}</option>
                <option value="priceDesc">{t('products.sort.priceDesc')}</option>
                <option value="name">{t('products.sort.name')}</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-6">
          {/* Category Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block w-56 shrink-0"
          >
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-sm mb-3" style={{ color: '#1E3A5F' }}>
                {t('nav.categories')}
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === 'all'
                      ? 'text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
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
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === cat.slug
                          ? 'text-white font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      style={selectedCategory === cat.slug ? { backgroundColor: '#1E3A5F' } : {}}
                    >
                      {getCategoryName(cat, language)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Mobile Filter */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl p-4 max-h-[60vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>
                    {t('nav.categories')}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    ✕
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setSelectedCategory('all'); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedCategory === 'all'
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    style={selectedCategory === 'all' ? { backgroundColor: '#1E3A5F' } : {}}
                  >
                    {t('products.all')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.slug); setShowFilters(false); }}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedCategory === cat.slug
                          ? 'text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                      style={selectedCategory === cat.slug ? { backgroundColor: '#1E3A5F' } : {}}
                    >
                      {getCategoryName(cat, language)}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t('products.noResults')}</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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
  formatPrice: (p: number | undefined) => string;
  t: (k: string) => string;
  navigate: (p: string) => void;
  addItem: (item: any) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        <div
          className="h-48 relative overflow-hidden cursor-pointer"
          style={{ backgroundColor: '#f0f4f8' }}
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={getProductName(product, language)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="text-[10px] px-2 py-0.5" style={{ backgroundColor: '#1E3A5F' }}>
                {t('products.new')}
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge className="text-[10px] px-2 py-0.5" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                {t('products.bestSeller')}
              </Badge>
            )}
            {!product.in_stock && (
              <Badge variant="destructive" className="text-[10px] px-2 py-0.5">
                {t('products.outOfStock')}
              </Badge>
            )}
          </div>
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <Button
              size="sm"
              variant="secondary"
              className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              onClick={() => navigate(`/product/${product.slug}`)}
            >
              <Eye className="w-4 h-4 mr-1" />
              {t('products.viewDetails')}
            </Button>
          </div>
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <p className="text-xs text-gray-400 mb-1">{product.brand} • {product.ref}</p>
          <h3
            className="font-semibold text-sm mb-1 line-clamp-1 cursor-pointer hover:underline"
            style={{ color: '#1E3A5F' }}
            onClick={() => navigate(`/product/${product.slug}`)}
          >
            {getProductName(product, language)}
          </h3>
          <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">
            {getProductShortDescription(product, language)}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              className="text-xs h-8 gap-1"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              onClick={() =>
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name: getProductName(product, language),
                  price: product.price,
                  image: product.images?.[0] || '',
                })
              }
            >
              <ShoppingCart className="w-3 h-3" />
              {t('products.addQuote')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
