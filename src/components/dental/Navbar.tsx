'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useSiteSettings } from '@/lib/site-settings';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const { t, language, setLanguage, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { getText } = useSiteSettings();
  const totalItems = useQuoteCart((s) => s.totalItems());
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brandName = getText('brand_name') || 'ODG';
  const logoUrl = getText('logo_url');

  const navLinks = [
    { label: t('nav.catalogue'), path: '/catalogue' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
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
                  className="text-lg font-bold hidden sm:inline"
                  style={{ color: '#1E3A5F' }}
                >
                  {brandName}
                </span>
              </div>
            )}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#1E3A5F] rounded-lg hover:bg-gray-50 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="gap-1.5 text-gray-600 hover:text-[#1E3A5F]"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase">
                {language === 'fr' ? 'AR' : 'FR'}
              </span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav('/devis')}
              className="relative text-gray-600 hover:text-[#1E3A5F]"
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

            {/* CTA */}
            <Button
              onClick={() => handleNav('/devis')}
              size="sm"
              className="text-white font-semibold shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              {t('nav.quote')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            {/* Cart Mobile */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleNav('/devis')}
              className="relative text-gray-600"
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
                <Button variant="ghost" size="icon" className="text-gray-600">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? 'left' : 'right'}
                className="w-[300px] sm:w-[350px]"
              >
                <SheetHeader>
                  <SheetTitle
                    className="text-left"
                    style={{ color: '#1E3A5F' }}
                  >
                    {brandName}
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-1 px-4 mt-4">
                  {navLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:text-[#1E3A5F] hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}

                  <div className="my-3 border-t border-gray-100" />

                  {/* Language Switcher Mobile */}
                  <button
                    onClick={() => {
                      setLanguage(language === 'fr' ? 'ar' : 'fr');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-[#1E3A5F] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    {language === 'fr' ? 'العربية' : 'Français'}
                  </button>

                  {/* Admin */}
                  <button
                    onClick={() => handleNav('/admin-login')}
                    className="w-full text-left px-4 py-3 text-base font-medium text-gray-500 hover:text-[#1E3A5F] hover:bg-gray-50 rounded-lg transition-colors"
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
    </motion.nav>
  );
}
