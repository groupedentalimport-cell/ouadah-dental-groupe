'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ShoppingCart, ChevronDown, Search, XCircle, Sun, Moon } from 'lucide-react';
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

export default function Navbar() {
  const { t, language, setLanguage, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { route } = useRouter();
  const { getText } = useSiteSettings();
  const { products, getProductName } = useData();
  const totalItems = useQuoteCart((s) => s.totalItems());
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

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
    { label: t('nav.promotions'), path: '/catalogue', routeName: 'promotions', isPromo: true },
    { label: t('nav.about'), path: '/about', routeName: 'about' },
    { label: t('nav.contact'), path: '/contact', routeName: 'contact' },
  ];

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return products
      .filter((p) => {
        const name = getProductName(p, language).toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(q) || brand.includes(q);
      })
      .slice(0, 5);
  }, [searchQuery, products, language, getProductName]);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearchSelect = (slug: string) => {
    navigate(`/product/${slug}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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
              onClick={() => setSearchOpen(!searchOpen)}
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
          <div className="flex md:hidden items-center gap-1">
            {/* Search Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-600 dark:text-gray-300"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Theme Toggle Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300"
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
              className="relative text-gray-600 dark:text-gray-300"
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
                <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-300">
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
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="pl-10 pr-10 h-11 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-[#1E3A5F] dark:focus:border-[#7AB0E0] focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:text-white dark:placeholder:text-gray-400"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a2d45] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50"
                    >
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleSearchSelect(product.slug)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
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
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate dark:text-white" style={{ color: '#1E3A5F' }}>
                              {getProductName(product, language)}
                            </p>
                            {product.brand && (
                              <p className="text-xs text-gray-400">{product.brand}</p>
                            )}
                          </div>
                        </button>
                      ))}
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
