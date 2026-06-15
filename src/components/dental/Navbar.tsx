'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ShoppingCart, ChevronDown, Search, XCircle, Sun, Moon, Clock, Tag, FileText, Package, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useSiteSettings } from '@/lib/site-settings';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';

// Recent searches localStorage helpers
const RECENT_SEARCHES_KEY = 'odg-recent-searches';
const MAX_RECENT = 5;

function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  if (!query.trim()) return;
  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((s) => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

function removeRecentSearch(query: string) {
  try {
    const existing = getRecentSearches();
    const updated = existing.filter((s) => s !== query);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export default function Navbar() {
  const { t, language, setLanguage, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { route } = useRouter();
  const { getText } = useSiteSettings();
  const { products, categories, blogPosts, getProductName, getCategoryName } = useData();
  const totalItems = useQuoteCart((s) => s.totalItems());
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => getRecentSearches());
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use useRef + requestAnimationFrame to avoid synchronous setState in effect
  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      requestAnimationFrame(() => {
        setMounted(true);
      });
    }
  }, []);

  // Refresh recent searches when search opens
  const openSearch = () => {
    setRecentSearches(getRecentSearches());
    setSearchOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brandName = getText('brand_name') || 'ODG';
  const logoUrl = getText('logo_url');

  const navLinks = [
    { label: t('nav.catalogue'), path: '/catalogue', routeName: 'catalogue' },
    { label: t('nav.blog'), path: '/blog', routeName: 'blog' },
    { label: t('nav.promotions'), path: '/promotions', routeName: 'promotions', isPromo: true },
    { label: t('nav.about'), path: '/about', routeName: 'about' },
    { label: t('nav.contact'), path: '/contact', routeName: 'contact' },
  ];

  // Search results - categorized
  const hasQuery = searchQuery.trim().length >= 2;
  const q = searchQuery.trim().toLowerCase();

  const matchedProducts = useMemo(() => {
    if (!hasQuery) return [];
    return products
      .filter((p) => {
        const name = getProductName(p, language).toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(q) || brand.includes(q);
      })
      .slice(0, 5);
  }, [searchQuery, products, language, getProductName, hasQuery, q]);

  const matchedCategories = useMemo(() => {
    if (!hasQuery) return [];
    return categories
      .filter((c) => {
        const name = getCategoryName(c, language).toLowerCase();
        return name.includes(q);
      })
      .slice(0, 3);
  }, [searchQuery, categories, language, getCategoryName, hasQuery, q]);

  const matchedArticles = useMemo(() => {
    if (!hasQuery) return [];
    return blogPosts
      .filter((a) => {
        const title = language === 'ar' ? a.title_ar : a.title_fr;
        return title.toLowerCase().includes(q);
      })
      .slice(0, 3);
  }, [searchQuery, blogPosts, language, hasQuery, q]);

  // Flatten all searchable items into a single list for keyboard navigation
  type SearchItem =
    | { type: 'recent'; query: string }
    | { type: 'product'; slug: string }
    | { type: 'category'; slug: string }
    | { type: 'article'; slug: string }
    | { type: 'viewAll' }
    | { type: 'browseCatalogue' };

  const searchItems: SearchItem[] = useMemo(() => {
    const items: SearchItem[] = [];
    if (!hasQuery) {
      // Show recent searches only
      recentSearches.forEach((s) => items.push({ type: 'recent', query: s }));
    } else {
      matchedProducts.forEach((p) => items.push({ type: 'product', slug: p.slug }));
      matchedCategories.forEach((c) => items.push({ type: 'category', slug: c.slug }));
      matchedArticles.forEach((a) => items.push({ type: 'article', slug: a.slug }));
      if (matchedProducts.length > 0 || matchedCategories.length > 0 || matchedArticles.length > 0) {
        items.push({ type: 'viewAll' });
      } else {
        items.push({ type: 'browseCatalogue' });
      }
    }
    return items;
  }, [hasQuery, recentSearches, matchedProducts, matchedCategories, matchedArticles]);

  // Track query changes for selectedIdx reset - derived value for keyboard nav

  const showDropdown = searchOpen && (searchItems.length > 0 || (hasQuery && matchedProducts.length === 0 && matchedCategories.length === 0 && matchedArticles.length === 0));

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSelect = (slug: string) => {
    if (hasQuery) addRecentSearch(searchQuery);
    navigate(`/product/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleCategorySelect = (slug: string) => {
    if (hasQuery) addRecentSearch(searchQuery);
    navigate(`/catalogue?category=${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleArticleSelect = (slug: string) => {
    if (hasQuery) addRecentSearch(searchQuery);
    navigate(`/article/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleRecentClick = (query: string) => {
    setSearchQuery(query);
    searchInputRef.current?.focus();
  };

  const handleRecentRemove = (query: string) => {
    removeRecentSearch(query);
    setRecentSearches(getRecentSearches());
  };

  const handleViewAll = () => {
    if (hasQuery) addRecentSearch(searchQuery);
    navigate(`/catalogue?search=${encodeURIComponent(searchQuery)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleBrowseCatalogue = () => {
    navigate('/catalogue');
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectItem = (item: SearchItem) => {
    switch (item.type) {
      case 'recent':
        handleRecentClick(item.query);
        break;
      case 'product':
        handleSearchSelect(item.slug);
        break;
      case 'category':
        handleCategorySelect(item.slug);
        break;
      case 'article':
        handleArticleSelect(item.slug);
        break;
      case 'viewAll':
        handleViewAll();
        break;
      case 'browseCatalogue':
        handleBrowseCatalogue();
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev < searchItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => (prev > 0 ? prev - 1 : searchItems.length - 1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      handleSelectItem(searchItems[selectedIdx]);
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Close search on click outside
  useEffect(() => {
    if (!searchOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        // Don't close if clicking inside the search bar area
        const target = e.target as HTMLElement;
        if (target.closest('[data-search-area]')) return;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Helper to get product category name
  const getProductCategoryName = (product: { category_id: string }) => {
    const cat = categories.find((c) => c.id === product.category_id);
    return cat ? getCategoryName(cat, language) : '';
  };

  // Render a section separator (declared outside component)
  // Using a function instead of a component inside render

  const renderSectionLabel = (icon: React.ElementType, label: string) => (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/[0.03] border-y border-gray-100 dark:border-white/5">
      {React.createElement(icon, { className: 'w-3.5 h-3.5 text-gray-400 dark:text-gray-500' })}
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</span>
    </div>
  );

  // Category badge colors
  const categoryBadgeColors = [
    { bg: 'rgba(30,58,95,0.1)', text: '#1E3A5F', darkBg: 'rgba(122,176,224,0.1)', darkText: '#7AB0E0' },
    { bg: 'rgba(240,192,90,0.15)', text: '#8B6914', darkBg: 'rgba(240,192,90,0.1)', darkText: '#F0C05A' },
    { bg: 'rgba(16,185,129,0.1)', text: '#065F46', darkBg: 'rgba(16,185,129,0.1)', darkText: '#34D399' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0f1d2e]/90 backdrop-blur-xl shadow-md'
          : 'bg-white/70 dark:bg-[#0f1d2e]/70 backdrop-blur-md'
      }`}
    >
      {/* Gold bottom border line when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ backgroundColor: '#F0C05A' }} />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 group"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={brandName}
                className="h-9 w-auto object-contain"
              />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: '#1E3A5F' }}
                >
                  ODG
                </div>
                <span
                  className="text-lg font-bold hidden sm:inline dark:text-[#7AB0E0]"
                  style={{ color: '#1E3A5F' }}
                >
                  {brandName}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Nav with active indicator */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = route === link.routeName;
              return (
                <button
                  key={link.routeName}
                  onClick={() => handleNav(link.path)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#1E3A5F] dark:text-[#7AB0E0]'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.label}
                  {/* Red dot indicator for promotions link */}
                  {'isPromo' in link && link.isPromo && (
                    <span className="absolute -top-0.5 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#C0564F' }} />
                  )}
                  {/* Gold accent line under active item */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full"
                      style={{ backgroundColor: '#F0C05A', width: '60%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}
              className="text-gray-600 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] relative"
            >
              <Search className="w-4.5 h-4.5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] relative"
              aria-label={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            >
              <motion.div
                initial={false}
                animate={{
                  rotate: theme === 'dark' ? 180 : 0,
                  scale: mounted ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {mounted && (theme === 'dark' ? (
                  <Sun className="w-4.5 h-4.5 text-[#F0C05A]" />
                ) : (
                  <Moon className="w-4.5 h-4.5" />
                ))}
              </motion.div>
            </Button>

            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="gap-1.5 text-gray-600 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0]"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                {language === 'fr' ? 'AR' : 'FR'}
              </span>
            </Button>

            {/* Cart with badge */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav('/devis')}
              className="relative text-gray-600 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0]"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Badge
                    className="h-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] font-bold"
                    style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                  >
                    {totalItems}
                  </Badge>
                </motion.div>
              )}
            </Button>

            {/* CTA */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => handleNav('/devis')}
                size="sm"
                className="text-white font-semibold shadow-md hover:shadow-lg transition-all"
                style={{ backgroundColor: '#1E3A5F' }}
              >
                {t('nav.quote')}
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-0.5">
            {/* Search Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}
              className="text-gray-600 dark:text-gray-300 touch-target"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 touch-target"
              aria-label={theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode')}
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {mounted && (theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[#F0C05A]" />
                ) : (
                  <Moon className="w-5 h-5" />
                ))}
              </motion.div>
            </Button>

            {/* Cart Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav('/devis')}
              className="relative text-gray-600 dark:text-gray-300 touch-target"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {totalItems}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300 touch-target">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-[300px] sm:w-[350px] dark:bg-[#162236]"
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-left dark:text-[#7AB0E0]"
                    style={{ color: '#1E3A5F' }}
                  >
                    {brandName}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1 px-4 mt-4">
                  {navLinks.map((link, i) => {
                    const isActive = route === link.routeName;
                    return (
                      <motion.button
                        key={link.routeName}
                        onClick={() => handleNav(link.path)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`w-full text-left px-4 py-3 text-base font-medium rounded-lg transition-colors flex items-center gap-3 ${
                          isActive
                            ? 'text-[#1E3A5F] dark:text-[#7AB0E0] bg-[#1E3A5F]/5 dark:bg-white/5'
                            : 'text-gray-700 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
                        )}
                        {link.label}
                        {'isPromo' in link && link.isPromo && (
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: '#C0564F' }} />
                        )}
                      </motion.button>
                    );
                  })}

                  <div className="my-3 border-t border-gray-100 dark:border-white/10" />

                  {/* Language Switcher Mobile */}
                  <button
                    onClick={() => {
                      setLanguage(language === 'fr' ? 'ar' : 'fr');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    {language === 'fr' ? 'العربية' : 'Français'}
                  </button>

                  {/* Dark Mode Toggle Mobile */}
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {mounted && (theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-[#F0C05A]" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    ))}
                    {mounted && (theme === 'dark' ? t('nav.lightMode') : t('nav.darkMode'))}
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => handleNav('/admin-login')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {t('nav.admin')}
                  </button>
                </div>

                <div className="mt-auto px-4 pb-6">
                  <Button
                    onClick={() => handleNav('/devis')}
                    className="w-full text-white font-semibold shadow-md"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    {t('nav.quote')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Bar Dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-100 dark:border-white/5 bg-white/95 dark:bg-[#0f1d2e]/95 backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
              <div className="relative max-w-xl mx-auto" data-search-area>
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('nav.searchPlaceholder')}
                  className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#1E3A5F] dark:focus:border-[#7AB0E0] focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:text-white dark:placeholder:text-gray-400`}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}

                {/* Enhanced Search Results Dropdown */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      ref={dropdownRef}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a2d45] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
                    >
                      {/* No query - show recent searches */}
                      {!hasQuery && recentSearches.length > 0 && (
                        <>
                          {renderSectionLabel(Clock, t('search.recent'))}
                          {recentSearches.map((query, idx) => {
                            const globalIdx = searchItems.findIndex(
                              (item) => item.type === 'recent' && item.query === query
                            );
                            return (
                              <div
                                key={`recent-${query}`}
                                className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                                  selectedIdx === globalIdx ? 'bg-gray-50 dark:bg-white/5' : ''
                                }`}
                                onClick={() => handleRecentClick(query)}
                              >
                                <Clock className="w-3.5 h-3.5 text-gray-300 dark:text-gray-500 shrink-0" />
                                <span className="text-sm flex-1 truncate dark:text-gray-300" style={{ color: '#1E3A5F' }}>
                                  {query}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRecentRemove(query);
                                  }}
                                  className="text-gray-300 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 shrink-0"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {/* Has query - show categorized results */}
                      {hasQuery && (
                        <>
                          {/* Products section */}
                          {matchedProducts.length > 0 && (
                            <>
                              {renderSectionLabel(Package, t('search.products'))}
                              {matchedProducts.map((product, idx) => {
                                const globalIdx = searchItems.findIndex(
                                  (item) => item.type === 'product' && item.slug === product.slug
                                );
                                const catName = getProductCategoryName(product);
                                return (
                                  <div
                                    key={`product-${product.id}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                                      selectedIdx === globalIdx ? 'bg-gray-50 dark:bg-white/5' : ''
                                    }`}
                                    onClick={() => handleSearchSelect(product.slug)}
                                  >
                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 shrink-0">
                                      {product.images?.[0] ? (
                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#1E3A5F10', color: '#1E3A5F' }}>
                                          ODG
                                        </div>
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-medium text-sm truncate dark:text-white" style={{ color: '#1E3A5F' }}>
                                        {getProductName(product, language)}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {product.brand && (
                                          <span className="text-xs text-gray-400">{product.brand}</span>
                                        )}
                                        {catName && (
                                          <Badge
                                            className="text-[9px] px-1.5 py-0 h-4 font-medium border-0"
                                            style={{
                                              backgroundColor: categoryBadgeColors[idx % categoryBadgeColors.length].bg,
                                              color: categoryBadgeColors[idx % categoryBadgeColors.length].text,
                                            }}
                                          >
                                            {catName}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </>
                          )}

                          {/* Categories section */}
                          {matchedCategories.length > 0 && (
                            <>
                              <div className="border-t border-gray-100 dark:border-white/5" />
                              {renderSectionLabel(Tag, t('search.categories'))}
                              {matchedCategories.map((cat, idx) => {
                                const globalIdx = searchItems.findIndex(
                                  (item) => item.type === 'category' && item.slug === cat.slug
                                );
                                return (
                                  <div
                                    key={`cat-${cat.id}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                                      selectedIdx === globalIdx ? 'bg-gray-50 dark:bg-white/5' : ''
                                    }`}
                                    onClick={() => handleCategorySelect(cat.slug)}
                                  >
                                    <div
                                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                      style={{ backgroundColor: categoryBadgeColors[idx % categoryBadgeColors.length].bg }}
                                    >
                                      <Tag className="w-4 h-4" style={{ color: categoryBadgeColors[idx % categoryBadgeColors.length].text }} />
                                    </div>
                                    <span className="text-sm font-medium truncate dark:text-white" style={{ color: '#1E3A5F' }}>
                                      {getCategoryName(cat, language)}
                                    </span>
                                    <ArrowRight className={`w-3.5 h-3.5 text-gray-300 dark:text-gray-500 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                                  </div>
                                );
                              })}
                            </>
                          )}

                          {/* Articles section */}
                          {matchedArticles.length > 0 && (
                            <>
                              <div className="border-t border-gray-100 dark:border-white/5" />
                              {renderSectionLabel(FileText, t('search.articles'))}
                              {matchedArticles.map((article) => {
                                const globalIdx = searchItems.findIndex(
                                  (item) => item.type === 'article' && item.slug === article.slug
                                );
                                const title = language === 'ar' ? article.title_ar : article.title_fr;
                                return (
                                  <div
                                    key={`article-${article.id}`}
                                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${
                                      selectedIdx === globalIdx ? 'bg-gray-50 dark:bg-white/5' : ''
                                    }`}
                                    onClick={() => handleArticleSelect(article.slug)}
                                  >
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-900/20 shrink-0">
                                      <FileText className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium truncate dark:text-white" style={{ color: '#1E3A5F' }}>
                                      {title}
                                    </span>
                                    <ArrowRight className={`w-3.5 h-3.5 text-gray-300 dark:text-gray-500 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                                  </div>
                                );
                              })}
                            </>
                          )}

                          {/* No results found */}
                          {matchedProducts.length === 0 && matchedCategories.length === 0 && matchedArticles.length === 0 && (
                            <div className="px-4 py-8 text-center">
                              <Search className="w-8 h-8 text-gray-200 dark:text-gray-600 mx-auto mb-2" />
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                {t('search.noResults')}
                              </p>
                              <button
                                onClick={handleBrowseCatalogue}
                                className="text-xs font-medium hover:underline"
                                style={{ color: '#1E3A5F' }}
                              >
                                {t('search.browseCatalogue')} →
                              </button>
                            </div>
                          )}

                          {/* View all results link */}
                          {(matchedProducts.length > 0 || matchedCategories.length > 0 || matchedArticles.length > 0) && (
                            <div className="border-t border-gray-100 dark:border-white/5">
                              <button
                                className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
                                  selectedIdx === searchItems.length - 1 ? 'bg-gray-50 dark:bg-white/5' : ''
                                }`}
                                style={{ color: '#1E3A5F' }}
                                onClick={handleViewAll}
                              >
                                {t('search.viewAll')}
                                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
