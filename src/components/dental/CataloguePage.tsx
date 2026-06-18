'use client';

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Package,

  Eye,
  ChevronDown,
  X,
  RotateCcw,
  Stethoscope,
  GitCompareArrows,
  Check,
  FileText,
  Heart,
  Star,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet';
import { Toggle } from '@/components/ui/toggle';
import { Switch } from '@/components/ui/switch';
import { useCompare } from '@/hooks/useCompare';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/lib/data-service';
import { CataloguePageSkeleton, ContentWithLoading } from '@/components/dental/Skeletons';
import QuickViewModal from '@/components/dental/QuickViewModal';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'name';
type ViewMode = 'grid' | 'list';

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
          <Star key={i} className={`${size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} ${type === 'full' ? 'text-[#F0C05A] fill-[#F0C05A]' : type === 'half' ? 'text-[#F0C05A]' : 'text-gray-300 dark:text-gray-500'}`} />
        ))}
      </div>
      {count !== undefined && (
        <span className={`text-gray-500 dark:text-gray-300 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>({count})</span>
      )}
    </div>
  );
}

// Category accent colors for left borders
const categoryColors = [
  '#1E3A5F', '#2A5F8F', '#3A7CB8', '#F0C05A', '#E8963E',
  '#4A9D7C', '#6B5CE7', '#D94F7B',
];

// Extracted PriceRangeFilter as a separate component to avoid render-time component creation
function PriceRangeFilterSection({ t, priceRange, setPriceRange, priceMax, includeOnQuote, setIncludeOnQuote }: {
  t: (key: string) => string;
  priceRange: [number, number];
  setPriceRange: (val: [number, number]) => void;
  priceMax: number;
  includeOnQuote: boolean;
  setIncludeOnQuote: (val: boolean) => void;
}) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
      <h4 className="font-semibold text-xs uppercase tracking-wider mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
        {t('products.priceRange')}
      </h4>
      <div className="px-1">
        <Slider
          value={priceRange}
          onValueChange={(val) => setPriceRange([val[0], val[1]])}
          min={0}
          max={priceMax || 10000000}
          step={Math.max(1, Math.floor((priceMax || 10000000) / 100))}
          className="mb-3"
        />
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 dark:text-gray-300 uppercase">{t('products.priceRange.min')}</label>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                setPriceRange([Math.min(val, priceRange[1]), priceRange[1]]);
              }}
              className="h-8 text-xs mt-0.5 dark:bg-white/5 dark:border-white/10 dark:text-white"
              min={0}
              max={priceRange[1]}
            />
          </div>
          <span className="text-gray-300 dark:text-gray-500 mt-4">—</span>
          <div className="flex-1">
            <label className="text-[10px] text-gray-400 dark:text-gray-300 uppercase">{t('products.priceRange.max')}</label>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || priceMax;
                setPriceRange([priceRange[0], Math.max(val, priceRange[0])]);
              }}
              className="h-8 text-xs mt-0.5 dark:bg-white/5 dark:border-white/10 dark:text-white"
              min={priceRange[0]}
              max={priceMax}
            />
          </div>
        </div>
        {/* Include "Sur devis" toggle */}
        <label className="flex items-center gap-2 mt-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={includeOnQuote}
            onChange={(e) => setIncludeOnQuote(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-white/20 accent-[#1E3A5F]"
          />
          <span className="text-xs text-gray-600 dark:text-gray-300 group-hover:text-[#1E3A5F] dark:group-hover:text-[#7AB0E0] transition-colors">
            {t('products.priceRange.includeOnQuote')}
          </span>
        </label>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, products, getCategoryName, getProductName, getProductShortDescription, loading } = useData();
  const { addProduct: addCompareProduct, removeProduct: removeCompareProduct, isInCompare, productIds } = useCompare();
  const { toggleItem: toggleWishlistItem, isInWishlist } = useWishlist();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const addRecentlyViewed = useRecentlyViewed((s) => s.addProduct);

  // Price range filter state
  const pricesWithValues = useMemo(() => products.map(p => p.price).filter((p): p is number => !!p && p > 0), [products]);
  const priceMin = useMemo(() => pricesWithValues.length > 0 ? Math.min(...pricesWithValues) : 0, [pricesWithValues]);
  const priceMax = useMemo(() => pricesWithValues.length > 0 ? Math.max(...pricesWithValues) : 10000000, [pricesWithValues]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [includeOnQuote, setIncludeOnQuote] = useState(true);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Brand extraction with product counts (case-insensitive normalization)
  const brandsWithCounts = useMemo(() => {
    const brandMap = new Map<string, { display: string; count: number }>();
    products.forEach((p) => {
      if (p.brand) {
        const key = p.brand.toLowerCase().trim();
        const existing = brandMap.get(key);
        if (existing) {
          // Prefer the properly-cased version
          const display = p.brand.trim().charAt(0).toUpperCase() + p.brand.trim().slice(1);
          if (display === p.brand.trim()) {
            existing.display = p.brand.trim();
          }
          existing.count += 1;
        } else {
          brandMap.set(key, { display: p.brand.trim(), count: 1 });
        }
      }
    });
    return Array.from(brandMap.entries())
      .map(([key, data]) => ({ brand: data.display, key, count: data.count }))
      .sort((a, b) => a.brand.localeCompare(b.brand));
  }, [products]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  };

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

    // Filter by brands (case-insensitive matching)
    if (selectedBrands.size > 0) {
      const lowerBrands = new Set(Array.from(selectedBrands).map(b => b.toLowerCase()));
      result = result.filter((p) => p.brand && lowerBrands.has(p.brand.toLowerCase()));
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

    // Filter by in-stock only
    if (inStockOnly) {
      result = result.filter((p) => p.in_stock);
    }

    // Filter by price range
    result = result.filter((p) => {
      const hasPrice = p.price && p.price > 0;
      if (hasPrice) {
        return p.price >= priceRange[0] && p.price <= priceRange[1];
      }
      // Products without price ("Sur devis") are included only if includeOnQuote is true
      return includeOnQuote;
    });

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
  }, [products, categories, selectedCategory, selectedBrands, search, sort, language, priceRange, includeOnQuote, inStockOnly]);

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price) || price === 0) return null;
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const isFiltering = selectedCategory !== 'all' || selectedBrands.size > 0 || search.length > 0 || priceRange[0] > 0 || priceRange[1] < priceMax || !includeOnQuote || inStockOnly;

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    count += selectedBrands.size;
    if (search.length > 0) count++;
    if (priceRange[0] > 0 || priceRange[1] < priceMax) count++;
    if (!includeOnQuote) count++;
    if (inStockOnly) count++;
    return count;
  }, [selectedCategory, selectedBrands, search, priceRange, priceMax, includeOnQuote, inStockOnly]);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedBrands(new Set());
    setSort('newest');
    setPriceRange([0, priceMax]);
    setIncludeOnQuote(true);
    setInStockOnly(false);
  };

  return (
    <ContentWithLoading loading={loading} skeleton={<CataloguePageSkeleton />}>
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 gradient-border-animated inline-block px-6 py-2">
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
            <div className="bg-white/95 dark:bg-[#1a2d45]/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('nav.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-0 bg-gray-50 dark:bg-white/5 dark:text-white dark:placeholder:text-gray-400 focus-visible:ring-1"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="h-9 w-full sm:w-44 rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 dark:text-white px-3 pr-8 text-sm appearance-none cursor-pointer"
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
        {/* Product Count Summary & Active Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <div className="flex items-center flex-wrap gap-2">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
              {t('products.productsFound').replace('{n}', String(filteredProducts.length))}
            </p>
            {/* Active filter tags */}
            {selectedCategory !== 'all' && (() => {
              const cat = categories.find((c) => c.slug === selectedCategory);
              return cat ? (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  {getCategoryName(cat, language)}
                  <X className="w-3 h-3" />
                </button>
              ) : null;
            })()}
            {Array.from(selectedBrands).map((brand) => (
              <button
                key={brand}
                onClick={() => toggleBrand(brand)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              >
                {brand}
                <X className="w-3 h-3" />
              </button>
            ))}
            {inStockOnly && (
              <button
                onClick={() => setInStockOnly(false)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                {t('products.inStockOnly')}
                <X className="w-3 h-3" />
              </button>
            )}
            {search.length > 0 && (
              <button
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                &ldquo;{search}&rdquo;
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Mobile filter button + results count + view toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-300">
            <span className="font-semibold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>{filteredProducts.length}</span>{' '}
            {language === 'ar' ? 'منتج' : 'produit(s)'}
          </p>
          <div className="flex gap-2 items-center">
            {isFiltering && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="gap-1.5 text-xs dark:text-[#7AB0E0]"
                style={{ color: '#1E3A5F' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t('products.clearFilters')}
              </Button>
            )}
            {/* View toggle - desktop only */}
            <div className="hidden lg:flex items-center border border-gray-200 dark:border-white/10 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#1E3A5F] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                aria-label={t('products.gridView')}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#1E3A5F] text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                aria-label={t('products.listView')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            {/* Mobile filter button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="lg:hidden gap-2 dark:border-white/10 dark:text-gray-300 relative min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
              aria-label={t('products.filter')}
            >
              <Filter className="w-4 h-4" />
              {t('products.filters')}
              {activeFilterCount > 0 && (
                <Badge
                  className="h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] font-bold ml-1"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {activeFilterCount}
                </Badge>
              )}
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
            <div className="bg-white dark:bg-[#162236] rounded-xl shadow-sm dark:shadow-none p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider dark:text-[#7AB0E0] flex items-center gap-2" style={{ color: '#1E3A5F' }}>
                  {t('products.filters')}
                  {activeFilterCount > 0 && (
                    <Badge
                      className="text-[10px] h-5 min-w-[20px] flex items-center justify-center p-0 font-bold"
                      style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                </h3>
                {isFiltering && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t('products.clearFilters')}
                  </button>
                )}
              </div>
              {/* In-Stock Filter Toggle */}
              <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#1E3A5F] dark:group-hover:text-[#7AB0E0] transition-colors flex items-center gap-2">
                    {t('products.inStockOnly')}
                    <Badge
                      className="text-[10px] h-4 min-w-[16px] flex items-center justify-center p-0 font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    >
                      {products.filter(p => p.in_stock).length}
                    </Badge>
                  </span>
                  <Switch
                    checked={inStockOnly}
                    onCheckedChange={setInStockOnly}
                  />
                </label>
              </div>

              <div className="space-y-1">
                {/* "Tous" - prominent option */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                    selectedCategory === 'all'
                      ? 'font-semibold shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
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
                      selectedCategory === 'all' ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300'
                    }`}
                  >
                    {products.length}
                  </Badge>
                </button>

                <div className="my-2 border-t border-gray-100 dark:border-white/10" />

                {categories.map((cat, idx) => {
                  const count = products.filter((p) => p.category_id === cat.id).length;
                  const isActive = selectedCategory === cat.slug;
                  const accentColor = categoryColors[idx % categoryColors.length];

                  return (
                    <motion.button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      animate={{ scale: isActive ? 1.02 : 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group relative overflow-hidden ${
                        isActive
                          ? 'font-medium shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: `rgba(240,192,90,0.15)`, color: accentColor }
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
                      {/* Active checkmark indicator */}
                      {isActive && (
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#F0C05A' }} />
                      )}
                      <span className={`${isActive ? '' : 'pl-2'} flex-1`}>{getCategoryName(cat, language)}</span>
                      <motion.span
                        key={`${cat.id}-${count}`}
                        initial={{ scale: 1.3, opacity: 0.5 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Badge
                          variant="secondary"
                          className={`text-[10px] h-5 min-w-[20px] flex items-center justify-center ${
                            isActive ? 'text-white hover:opacity-90' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300'
                          }`}
                          style={isActive ? { backgroundColor: accentColor } : {}}
                        >
                          {count}
                        </Badge>
                      </motion.span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Brand Filter in Sidebar */}
              {brandsWithCounts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                  <h4 className="font-semibold text-xs uppercase tracking-wider mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('catalogue.brands')}
                  </h4>
                  <div className="space-y-1">
                    {/* "Toutes les marques" option */}
                    <button
                      onClick={() => setSelectedBrands(new Set())}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                        selectedBrands.size === 0
                          ? 'font-semibold shadow-sm'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                      style={
                        selectedBrands.size === 0
                          ? { backgroundColor: '#1E3A5F', color: '#fff' }
                          : {}
                      }
                    >
                      <span className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {t('catalogue.allBrands')}
                      </span>
                    </button>

                    <div className="my-2 border-t border-gray-100 dark:border-white/10" />

                    <div className="max-h-48 overflow-y-auto space-y-1 pr-1" style={{ scrollbarWidth: 'thin' }}>
                      {brandsWithCounts.map(({ brand, count }) => {
                        const isActive = selectedBrands.has(brand);
                        return (
                          <button
                            key={brand}
                            onClick={() => toggleBrand(brand)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all duration-200 flex items-center justify-between group ${
                              isActive
                                ? 'font-medium shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                            }`}
                            style={
                              isActive
                                ? { backgroundColor: '#F0C05A20', color: '#1E3A5F' }
                                : {}
                            }
                          >
                            <span className="flex items-center gap-2 truncate">
                              {isActive && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#F0C05A' }} />}
                              <span className="truncate">{brand}</span>
                            </span>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] h-5 min-w-[20px] flex items-center justify-center shrink-0 ml-1 ${
                                isActive ? 'text-white hover:opacity-90' : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-300'
                              }`}
                              style={isActive ? { backgroundColor: '#F0C05A', color: '#1E3A5F' } : {}}
                            >
                              {count}
                            </Badge>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Price Range Filter in Sidebar */}
              <PriceRangeFilterSection t={t} priceRange={priceRange} setPriceRange={setPriceRange} priceMax={priceMax} includeOnQuote={includeOnQuote} setIncludeOnQuote={setIncludeOnQuote} />
            </div>
          </motion.div>

          {/* Mobile Filter Sheet */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent
              side={isRTL ? 'left' : 'right'}
              className="w-[320px] sm:w-[380px] dark:bg-[#162236] overflow-y-auto"
            >
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle
                    className="dark:text-[#7AB0E0] flex items-center gap-2"
                    style={{ color: '#1E3A5F' }}
                  >
                    {t('products.filters')}
                    {activeFilterCount > 0 && (
                      <Badge
                        className="text-[10px] h-5 min-w-[20px] flex items-center justify-center p-0 font-bold"
                        style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </SheetTitle>
                  {isFiltering && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {t('products.clearFilters')}
                    </button>
                  )}
                </div>
              </SheetHeader>

              <div className="px-4 mt-2">
                {/* In-Stock Filter Toggle - Mobile */}
                <div className="mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-[#1E3A5F] dark:group-hover:text-[#7AB0E0] transition-colors flex items-center gap-2">
                      {t('products.inStockOnly')}
                      <Badge
                        className="text-[10px] h-4 min-w-[16px] flex items-center justify-center p-0 font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      >
                        {products.filter(p => p.in_stock).length}
                      </Badge>
                    </span>
                    <Switch
                      checked={inStockOnly}
                      onCheckedChange={setInStockOnly}
                    />
                  </label>
                </div>
                {/* Categories */}
                <h4 className="font-semibold text-xs uppercase tracking-wider mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {t('nav.categories')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors min-h-[36px] ${
                      selectedCategory === 'all'
                        ? 'text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                    }`}
                    style={selectedCategory === 'all' ? { backgroundColor: '#1E3A5F' } : {}}
                  >
                    {t('products.all')} ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;
                    const isActive = selectedCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 min-h-[36px] ${
                          isActive
                            ? 'shadow-sm'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                        }`}
                        style={isActive ? { backgroundColor: 'rgba(240,192,90,0.2)', color: '#1E3A5F' } : {}}
                      >
                        {isActive && <Check className="w-3.5 h-3.5 shrink-0" style={{ color: '#F0C05A' }} />}
                        {getCategoryName(cat, language)} ({count})
                      </button>
                    );
                  })}
                </div>
                {/* Brand filter in mobile */}
                {brandsWithCounts.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                    <h4 className="font-semibold text-xs uppercase tracking-wider mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('catalogue.brands')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedBrands(new Set())}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                          selectedBrands.size === 0
                            ? 'text-white shadow-sm'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                        }`}
                        style={selectedBrands.size === 0 ? { backgroundColor: '#1E3A5F' } : {}}
                      >
                        {t('catalogue.allBrands')}
                      </button>
                      {brandsWithCounts.map(({ brand, count }) => {
                        const isActive = selectedBrands.has(brand);
                        return (
                          <button
                            key={brand}
                            onClick={() => toggleBrand(brand)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${
                              isActive
                                ? 'shadow-sm'
                                : 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
                            }`}
                            style={isActive ? { backgroundColor: 'rgba(240,192,90,0.2)', color: '#1E3A5F' } : {}}
                          >
                            {isActive && <Check className="w-3 h-3 shrink-0" style={{ color: '#F0C05A' }} />}
                            {brand} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {/* Price Range in mobile filter */}
                <PriceRangeFilterSection t={t} priceRange={priceRange} setPriceRange={setPriceRange} priceMax={priceMax} includeOnQuote={includeOnQuote} setIncludeOnQuote={setIncludeOnQuote} />
              </div>

              <SheetFooter className="mt-4">
                <Button
                  onClick={() => setShowFilters(false)}
                  className="w-full text-white font-semibold min-h-[44px]"
                  style={{ backgroundColor: '#1E3A5F' }}
                >
                  {language === 'ar' ? 'عرض النتائج' : 'Voir les résultats'} ({filteredProducts.length})
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div
                  className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center dark:bg-white/5"
                  style={{ backgroundColor: '#f0f4f8' }}
                >
                  <Stethoscope className="w-12 h-12" style={{ color: '#1E3A5F', opacity: 0.4 }} />
                </div>
                <p className="text-gray-500 dark:text-gray-300 text-lg font-medium mb-2">{t('products.noResults')}</p>
                <p className="text-gray-400 dark:text-gray-300 text-sm max-w-md mx-auto mb-6">
                  {t('products.noResultsTip')}
                </p>
                {isFiltering && (
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="gap-2 dark:border-white/10 dark:text-[#7AB0E0]"
                    style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('products.clearFilters')}
                  </Button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5'
                    : 'flex flex-col gap-3 sm:gap-4'
                  }
                >
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
                      isInCompare={isInCompare}
                      addCompareProduct={addCompareProduct}
                      removeCompareProduct={removeCompareProduct}
                      compareFull={productIds.length >= 4}
                      isInWishlist={isInWishlist}
                      toggleWishlistItem={toggleWishlistItem}
                      viewMode={viewMode}
                      onQuickView={() => {
                        setQuickViewProduct(product);
                        setQuickViewOpen(true);
                        addRecentlyViewed(product.id, product.slug, getProductName(product, language), product.images?.[0] || '', product.price);
                      }}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
    </ContentWithLoading>
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
  isInCompare,
  addCompareProduct,
  removeCompareProduct,
  compareFull,
  isInWishlist,
  toggleWishlistItem,
  viewMode = 'grid',
  onQuickView,
}: {
  product: Product;
  index: number;
  language: string;
  getProductName: (p: Product, lang: any) => string;
  getProductShortDescription: (p: Product, lang: any) => string;
  formatPrice: (p: number | undefined) => string | null;
  t: (k: string) => string;
  navigate: (p: string) => void;
  isInCompare: (id: string) => boolean;
  addCompareProduct: (id: string) => void;
  removeCompareProduct: (id: string) => void;
  compareFull: boolean;
  isInWishlist: (slug: string) => boolean;
  toggleWishlistItem: (slug: string) => void;
  viewMode?: ViewMode;
  onQuickView: () => void;
}) {
  const priceDisplay = formatPrice(product.price);
  const isOnQuote = !priceDisplay; // price is 0 or missing
  const [isHovered, setIsHovered] = useState(false);

  const isListView = viewMode === 'list';

  const categoryAccent = categoryColors[index % categoryColors.length];

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  if (isListView) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card
          className="group border-0 shadow-sm dark:shadow-none dark:bg-[#162236] transition-all duration-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-amber-400/50 dark:hover:ring-amber-500/40 relative card-lift"
          onClick={() => navigate(`/product/${product.slug}`)}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          {/* Category color accent bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300"
            style={{ backgroundColor: isHovered ? categoryAccent : 'transparent' }}
          />
          <div className="flex flex-row">
            {/* Image area - compact for list view */}
            <div className="w-32 sm:w-44 shrink-0 relative overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={getProductName(product, language)}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className="w-full h-full min-h-[120px] flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 60%, #3A7CB8 100%)' }}
                >
                  <Package className="w-10 h-10 text-white/40" />
                </div>
              )}
              {/* Badges on image */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end z-[2]">
                {product.is_new && (
                  <Badge className="text-[9px] px-1.5 py-0 border-0 text-white" style={{ backgroundColor: '#3B8C6E' }}>
                    {t('products.new')}
                  </Badge>
                )}
                {product.is_best_seller && (
                  <Badge className="text-[9px] px-1.5 py-0 border-0 font-semibold" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                    {t('products.bestSeller')}
                  </Badge>
                )}
              </div>
              {product.in_stock ? (
                <Badge variant="outline" className="absolute top-2 left-2 text-[9px] px-1.5 py-0 bg-white/90 dark:bg-[#162236]/90 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 backdrop-blur-sm z-[2]">
                  {t('products.inStock')}
                </Badge>
              ) : (
                <Badge variant="destructive" className="absolute top-2 left-2 text-[9px] px-1.5 py-0 z-[2]">
                  {t('products.outOfStock')}
                </Badge>
              )}
            </div>
            {/* Info area */}
            <CardContent className="p-3 sm:p-4 flex flex-col flex-1 min-w-0">
              {/* Brand badge */}
              {product.brand && (
                <Badge
                  className="text-[9px] px-1.5 py-0 h-4 border-0 font-semibold uppercase tracking-wider w-fit mb-1"
                  style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#F0C05A' }}
                >
                  {product.brand}
                </Badge>
              )}
              <h3
                className="font-semibold text-sm mb-1 line-clamp-1 leading-snug dark:text-white"
                style={{ color: '#1E3A5F' }}
              >
                {getProductName(product, language)}
              </h3>
              {product.rating && (
                <div className="mb-1">
                  <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
                </div>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-300 mb-2 line-clamp-2 flex-1">
                {getProductShortDescription(product, language)}
              </p>
              {/* Price + Actions */}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/10">
                <div className="flex-1 min-w-0">
                  {priceDisplay ? (
                    <span className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
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
                </div>
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`text-xs h-8 w-8 p-0 border-gray-200 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                      isInCompare(product.id)
                        ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                        : 'text-gray-400 dark:text-gray-300'
                    }`}
                    disabled={!isInCompare(product.id) && compareFull}
                    aria-label={isInCompare(product.id) ? t('compare.remove') : t('compare.add')}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isInCompare(product.id)) removeCompareProduct(product.id);
                      else addCompareProduct(product.id);
                    }}
                  >
                    {isInCompare(product.id) ? <Check className="w-3.5 h-3.5" /> : <GitCompareArrows className="w-3.5 h-3.5" />}
                  </Button>

                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid view (default)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: Math.min(index * 0.08, 0.3), duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="tilt-card gold-bottom-hover"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <Card
          className="group border-0 shadow-sm dark:shadow-none dark:bg-[#162236] transition-all duration-300 overflow-hidden h-full flex flex-col cursor-pointer hover:ring-2 hover:ring-amber-400/50 dark:hover:ring-amber-500/40 relative card-lift"
          onClick={() => navigate(`/product/${product.slug}`)}
        >
          {/* Category color accent bottom border */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 z-10"
            style={{ backgroundColor: isHovered ? categoryAccent : 'transparent' }}
          />
          {/* Image area */}
          <div className="h-48 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={getProductName(product, language)}
                loading="lazy"
                className={`w-full h-full object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
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

          {/* Top-right: Nouveau & Best-seller badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end z-[2]">
            {product.is_new && (
              <Badge className="text-[10px] px-2 py-0.5 border-0 text-white" style={{ backgroundColor: '#3B8C6E' }}>
                {t('products.new')}
              </Badge>
            )}
            {product.is_best_seller && (
              <Badge className="text-[10px] px-2 py-0.5 border-0 font-semibold" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                {t('products.bestSeller')}
              </Badge>
            )}
          </div>

          {/* Wishlist heart button - bottom-right of image */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            className={`absolute bottom-3 right-3 z-[3] w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
              isInWishlist(product.slug)
                ? 'bg-white/90 dark:bg-[#162236]/90 text-rose-500'
                : 'bg-white/70 dark:bg-[#162236]/70 text-white/50 hover:text-rose-400'
            }`}
            aria-label={isInWishlist(product.slug) ? t('products.removeFromWishlist') : t('products.addToWishlist')}
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlistItem(product.slug);
            }}
          >
            <Heart
              className="w-4 h-4"
              fill={isInWishlist(product.slug) ? 'currentColor' : 'none'}
              strokeWidth={isInWishlist(product.slug) ? 0 : 2}
            />
          </motion.button>

          {/* Top-left: Stock badge */}
          <div className="absolute top-3 left-3 z-[2]">
            {product.in_stock ? (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-white/90 dark:bg-[#162236]/90 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 backdrop-blur-sm">
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
                <FileText className="w-3 h-3 mr-1" />
                {t('products.priceOnQuote')}
              </Badge>
            </div>
          )}

          {/* Quick View button - visible on hover (desktop), always on mobile */}
          <button
            className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-[#162236]/90 backdrop-blur-sm shadow-md flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-[#1a2d45] hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView();
            }}
            aria-label={t('products.quickView')}
            title={t('products.quickView')}
          >
            <Eye className="w-4 h-4" style={{ color: '#1E3A5F' }} />
          </button>

          {/* Hover overlay with gradient + quick-action bar */}
          <div className="absolute inset-0 transition-all duration-300 pointer-events-none">
            {/* Gradient overlay from transparent to dark at the bottom */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Quick-action bar that slides up */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2.5 translate-y-full group-hover:translate-y-0 transition-all duration-300 pointer-events-auto">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs font-semibold shadow-lg gap-1"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/product/${product.slug}`);
                }}
              >
                <Eye className="w-3.5 h-3.5" />
                {t('products.viewDetails')}
              </Button>

            </div>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-1">
          {/* Brand badge */}
          {product.brand && (
            <Badge
              className="text-[9px] px-1.5 py-0 h-4 border-0 font-semibold uppercase tracking-wider w-fit mb-1.5"
              style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#F0C05A' }}
            >
              {product.brand}
            </Badge>
          )}

          {/* Product name */}
          <h3
            className="font-semibold text-sm mb-1 line-clamp-2 leading-snug dark:text-white"
            style={{ color: '#1E3A5F' }}
          >
            {getProductName(product, language)}
          </h3>

          {/* Star rating */}
          {product.rating && (
            <div className="mb-1">
              <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
            </div>
          )}

          {/* Short description */}
          <p className="text-xs text-gray-500 dark:text-gray-300 mb-3 line-clamp-2 flex-1">
            {getProductShortDescription(product, language)}
          </p>

          {/* Price + Action row */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/10">
            <div className="flex-1 min-w-0">
              {priceDisplay ? (
                <span className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
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
            </div>
            <div className="flex items-center gap-1.5">
              {/* Compare button */}
              <Button
                size="sm"
                variant="outline"
                className={`text-xs h-8 w-8 p-0 border-gray-200 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isInCompare(product.id)
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                    : 'text-gray-400 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
                disabled={!isInCompare(product.id) && compareFull}
                aria-label={isInCompare(product.id) ? t('compare.remove') : t('compare.add')}
                title={
                  isInCompare(product.id)
                    ? t('compare.remove')
                    : compareFull
                    ? t('compare.maxReached')
                    : t('compare.add')
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (isInCompare(product.id)) {
                    removeCompareProduct(product.id);
                  } else {
                    addCompareProduct(product.id);
                  }
                }}
              >
                {isInCompare(product.id) ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <GitCompareArrows className="w-3.5 h-3.5" />
                )}
              </Button>

            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </motion.div>
  );
}
