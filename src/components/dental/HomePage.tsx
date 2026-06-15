'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Wrench,
  Headphones,
  Truck,
  Armchair,
  Monitor,
  Scan,
  ShieldCheck,
  Wind,
  Package,
  WrenchIcon,
  Lamp,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuoteCart } from '@/hooks/useQuoteCart';

// Animated counter hook
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return { count, ref };
}

const categoryIcons: Record<string, React.ReactNode> = {
  Armchair: <Armchair className="w-8 h-8" />,
  Monitor: <Monitor className="w-8 h-8" />,
  Scan: <Scan className="w-8 h-8" />,
  Shield: <ShieldCheck className="w-8 h-8" />,
  Wind: <Wind className="w-8 h-8" />,
  Package: <Package className="w-8 h-8" />,
  Wrench: <WrenchIcon className="w-8 h-8" />,
  Lamp: <Lamp className="w-8 h-8" />,
};

export default function HomePage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, products, getCategoryName, getProductName, getProductShortDescription } = useData();
  const addItem = useQuoteCart((s) => s.addItem);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  // Stats
  const stat1 = useCounter(500);
  const stat2 = useCounter(48);
  const stat3 = useCounter(15);
  const stat4 = useCounter(48);

  const stats = [
    { ref: stat1.ref, value: stat1.count, suffix: '+', label: t('stats.clinics') },
    { ref: stat2.ref, value: stat2.count, suffix: '', label: t('stats.wilayas') },
    { ref: stat3.ref, value: stat3.count, suffix: '+', label: t('stats.brands') },
    { ref: stat4.ref, value: stat4.count, suffix: 'h', label: t('stats.sav') },
  ];

  const whyChooseUs = [
    { icon: <Shield className="w-8 h-8" />, title: t('products.warranty'), desc: t('about.values.excellence.text') },
    { icon: <Wrench className="w-8 h-8" />, title: t('products.installation'), desc: t('about.values.proximity.text') },
    { icon: <Headphones className="w-8 h-8" />, title: 'SAV 48h', desc: t('about.values.innovation.text') },
    { icon: <Truck className="w-8 h-8" />, title: t('products.delivery'), desc: t('about.values.trust.text') },
  ];

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hero-dental.jpg')`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(30,58,95,0.92) 0%, rgba(45,90,142,0.88) 40%, rgba(26,74,110,0.90) 70%, rgba(15,43,71,0.95) 100%)`,
          }}
        />
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Badge
              className="mb-6 text-sm font-medium px-4 py-1.5 border-0"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
            >
              {t('hero.subtitle')}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              onClick={() => navigate('/catalogue')}
              size="lg"
              className="text-base font-semibold px-8 h-12 shadow-xl hover:shadow-2xl transition-all"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
            >
              {t('hero.cta.catalogue')}
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => navigate('/devis')}
              size="lg"
              variant="outline"
              className="text-base font-semibold px-8 h-12 border-white/30 text-white hover:bg-white/10"
            >
              {t('hero.cta.quote')}
            </Button>
          </motion.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,80 C360,120 720,40 1440,80 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                ref={stat.ref}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-4xl sm:text-5xl font-bold mb-2"
                  style={{ color: '#1E3A5F' }}
                >
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1E3A5F' }}>
              {t('categories.title')}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              {t('categories.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {categories.map((cat) => (
              <motion.div key={cat.id} variants={itemVariants}>
                <Card
                  className="group cursor-pointer border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
                  onClick={() => navigate(`/catalogue?category=${cat.slug}`)}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {categoryIcons[cat.icon] || <Package className="w-8 h-8" />}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-1" style={{ color: '#1E3A5F' }}>
                      {getCategoryName(cat, language)}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {products.filter((p) => p.category_id === cat.id).length} {t('nav.allProducts').toLowerCase().replace('tous les ', '').replace('جميع ', '')}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: '#1E3A5F' }}>
                {t('products.featured')}
              </h2>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/catalogue')}
              className="hidden sm:flex gap-2"
              style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
            >
              {t('common.seeAll')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="min-w-[280px] sm:min-w-[320px] snap-start"
              >
                <Card className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div
                    className="h-48 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: '#f0f4f8' }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={getProductName(product, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <Package className="w-16 h-16 text-gray-300" />
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
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
                    <h3
                      className="font-semibold text-sm mb-1 line-clamp-1"
                      style={{ color: '#1E3A5F' }}
                    >
                      {getProductName(product, language)}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {getProductShortDescription(product, language)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
                        {(product.price ?? 0).toLocaleString('fr-DZ')} DA
                      </span>
                      <Button
                        size="sm"
                        className="text-xs h-8"
                        style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
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
                        {t('products.addQuote')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Button
              variant="outline"
              onClick={() => navigate('/catalogue')}
              className="gap-2"
              style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
            >
              {t('common.seeAll')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1E3A5F' }}>
              Pourquoi nous choisir ?
            </h2>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 text-center h-full">
                  <CardContent className="p-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: '#1E3A5F', color: '#F0C05A' }}
                    >
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: '#1E3A5F' }}>
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {t('hero.cta.quote')}
            </h2>
            <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
              {t('quote.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/devis')}
                size="lg"
                className="text-base font-semibold px-8 h-12 shadow-xl"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              >
                {t('nav.quote')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8 h-12 border-white/30 text-white hover:bg-white/10"
              >
                {t('nav.contact')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
