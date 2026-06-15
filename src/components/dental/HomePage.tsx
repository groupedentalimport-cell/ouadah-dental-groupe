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
  Building2,
  MapPin,
  Award,
  Eye,
  Stethoscope,
  Quote,
  Star,
  Mail,
  CheckCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

// Category image mapping based on slug
const categoryImages: Record<string, string> = {
  fauteuils: '/categories/fauteuils.jpg',
  unites: '/categories/unites.jpg',
  radiologie: '/categories/radiologie.jpg',
  sterilisation: '/categories/sterilisation.jpg',
  pneumatiques: '/categories/pneumatiques.jpg',
  consommables: '/categories/consommables.jpg',
  instruments: '/categories/instruments.jpg',
  mobilier: '/categories/mobilier.jpg',
};

export default function HomePage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, products, getCategoryName, getProductName, getProductShortDescription } = useData();
  const addItem = useQuoteCart((s) => s.addItem);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  // Stats with icons
  const stat1 = useCounter(500);
  const stat2 = useCounter(48);
  const stat3 = useCounter(15);
  const stat4 = useCounter(48);

  const stats = [
    { ref: stat1.ref, value: stat1.count, suffix: '+', label: t('stats.clinics'), icon: <Building2 className="w-7 h-7" /> },
    { ref: stat2.ref, value: stat2.count, suffix: '', label: t('stats.wilayas'), icon: <MapPin className="w-7 h-7" /> },
    { ref: stat3.ref, value: stat3.count, suffix: '+', label: t('stats.brands'), icon: <Award className="w-7 h-7" /> },
    { ref: stat4.ref, value: stat4.count, suffix: 'h', label: t('stats.sav'), icon: <Headphones className="w-7 h-7" /> },
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: t('products.warranty'),
      desc: language === 'ar'
        ? 'ضمان من 2 إلى 5 سنوات حسب المنتج، مع خدمة ما بعد البيع سريعة'
        : 'Garantie de 2 à 5 ans selon le produit, avec service après-vente réactif',
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: t('products.installation'),
      desc: language === 'ar'
        ? 'تركيب احترافي وتدريب مشمولان مع كل معدات'
        : 'Installation professionnelle et formation incluses avec chaque équipement',
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: 'SAV 48h',
      desc: language === 'ar'
        ? 'خدمة ما بعد البيع السريعة تغطي 48 ولاية في أقل من 48 ساعة'
        : 'Service après-vente réactif couvrant 48 wilayas en moins de 48h',
    },
    {
      icon: <Truck className="w-7 h-7" />,
      title: t('products.delivery'),
      desc: language === 'ar'
        ? 'توصيل في 58 ولاية جزائرية، مدة التسليم من 1 إلى 6 أسابيع'
        : 'Livraison dans les 58 wilayas algériennes, délai de 1 à 6 semaines',
    },
  ];

  const partnerBrands = [
    { name: 'OWANDY', subtext: 'Radiologie' },
    { name: 'DENTALEZ', subtext: 'Fauteuils' },
    { name: 'RITTER', subtext: 'Unités' },
    { name: 'NSK', subtext: 'Instruments' },
    { name: 'VDW', subtext: 'Endodontie' },
    { name: 'SEILER', subtext: 'Microscopes' },
  ];

  const testimonials = [
    {
      text: language === 'ar'
        ? 'زودنا ODG بكرسي أسنان بجودة استثنائية. كان التركيب سريعاً والفريق محترفاً جداً.'
        : 'ODG nous a fourni un fauteuil dentaire de qualité exceptionnelle. L\'installation a été rapide et l\'équipe très professionnelle.',
      author: 'Dr. Karim Benali',
      clinic: language === 'ar' ? 'عيادة الأسنان الأمل، وهران' : 'Clinique Dentaire El Amel, Oran',
      stars: 5,
    },
    {
      text: language === 'ar'
        ? 'خدمة ما بعد البيع رائعة. في أقل من 48 ساعة، كان الفني في الموقع لحل المشكلة التقنية.'
        : 'Le service après-vente est remarquable. En moins de 48h, un technicien était sur place pour résoudre un problème technique.',
      author: 'Dr. Sarah Mansouri',
      clinic: language === 'ar' ? 'عيادة ميدستار، الجزائر' : 'Cabinet Dentaire Medstar, Alger',
      stars: 5,
    },
    {
      text: language === 'ar'
        ? 'نجهز عياداتنا الـ 12 حصرياً مع ODG منذ 2015. جودة المنتجات وخدمة ما بعد البيع لا مثيل لها.'
        : 'Nous équipons nos 12 cabinets exclusivement avec ODG depuis 2015. La qualité des produits et le SAV sont incomparables.',
      author: 'Dr. Ahmed Tlemçani',
      clinic: language === 'ar' ? 'مجموعة دنتال بلس، قسنطينة' : 'Groupe Dental Plus, Constantine',
      stars: 5,
    },
  ];

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterSubmitted(false), 5000);
    }
  };

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
              className="text-base font-semibold px-8 h-12 border-2 border-white/50 text-white hover:bg-white/20 backdrop-blur-sm"
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
              fill="#1E3A5F"
            />
          </svg>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-16 sm:py-20 relative overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                ref={stat.ref}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="text-center group"
              >
                <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/[0.08] hover:border-[#F0C05A]/30 transition-all duration-300 hover:bg-white/[0.12]">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#F0C05A' }}
                  >
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1.5">
                    {stat.value}<span style={{ color: '#F0C05A' }}>{stat.suffix}</span>
                  </div>
                  <div className="text-blue-200/70 text-sm font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z"
              fill="#f9fafb"
            />
          </svg>
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
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            {categories.map((cat) => {
              const imgSrc = categoryImages[cat.slug] || cat.image || '';
              return (
                <motion.div key={cat.id} variants={itemVariants}>
                  <div
                    className="group cursor-pointer relative rounded-2xl overflow-hidden h-48 sm:h-56 shadow-md hover:shadow-2xl transition-all duration-500"
                    onClick={() => navigate(`/catalogue?category=${cat.slug}`)}
                  >
                    {/* Background image */}
                    {imgSrc ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${imgSrc}')` }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ backgroundColor: '#1E3A5F' }}
                      >
                        {categoryIcons[cat.icon] || <Package className="w-12 h-12 text-white/30" />}
                      </div>
                    )}
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/90 via-[#1E3A5F]/50 to-transparent transition-opacity duration-500 group-hover:from-[#1E3A5F]/70 group-hover:via-[#1E3A5F]/30 group-hover:to-transparent" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80" style={{ backgroundColor: 'rgba(240,192,90,0.2)' }}>
                          {categoryIcons[cat.icon] || <Package className="w-4 h-4" />}
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-white">
                          {getCategoryName(cat, language)}
                        </h3>
                      </div>
                      <p className="text-white/50 text-xs">
                        {products.filter((p) => p.category_id === cat.id).length}{' '}
                        {language === 'ar' ? 'منتجات' : 'produits'}
                      </p>
                      {/* Hover arrow */}
                      <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Card className="group border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                  <div
                    className="h-52 flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: '#f0f4f8' }}
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={getProductName(product, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Dental-themed placeholder */
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-300">
                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(30,58,95,0.08)' }}>
                          <Stethoscope className="w-10 h-10" style={{ color: '#1E3A5F', opacity: 0.25 }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#1E3A5F', opacity: 0.3 }}>
                          {product.brand || 'ODG'}
                        </span>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.is_new && (
                        <Badge className="text-[10px] px-2.5 py-0.5 font-semibold" style={{ backgroundColor: '#1E3A5F' }}>
                          {t('products.new')}
                        </Badge>
                      )}
                      {product.is_best_seller && (
                        <Badge className="text-[10px] px-2.5 py-0.5 font-semibold" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                          {t('products.bestSeller')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-medium mb-1" style={{ color: '#F0C05A' }}>{product.brand}</p>
                    <h3
                      className="font-bold text-sm mb-1.5 line-clamp-1"
                      style={{ color: '#1E3A5F' }}
                    >
                      {getProductName(product, language)}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">
                      {getProductShortDescription(product, language)}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
                        {(product.price ?? 0) === 0
                          ? (language === 'ar' ? 'عند الطلب' : 'Sur devis')
                          : `${(product.price ?? 0).toLocaleString('fr-DZ')} DA`
                        }
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-8 px-3"
                          style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/catalogue?product=${product.slug}`);
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {language === 'ar' ? 'عرض' : 'Voir'}
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs h-8 px-3"
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
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
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
      <section className="py-16 sm:py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #eef2f7 50%, #f9fafb 100%)' }}
      >
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #1E3A5F 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 text-xs font-medium px-3 py-1 border-0" style={{ backgroundColor: 'rgba(30,58,95,0.08)', color: '#1E3A5F' }}>
              {language === 'ar' ? 'مميزاتنا' : 'Nos atouts'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1E3A5F' }}>
              {language === 'ar' ? 'لماذا تختارنا؟' : 'Pourquoi nous choisir ?'}
            </h2>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              {language === 'ar'
                ? 'التزامنا بالجودة والخدمة يجعلنا الخيار الأول'
                : 'Notre engagement qualité et service fait de nous le choix n°1'
              }
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} variants={itemVariants}>
                <div className="group bg-white rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: 'rgba(30,58,95,0.08)', color: '#1E3A5F' }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-2" style={{ color: '#1E3A5F' }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 text-xs font-medium px-3 py-1 border-0" style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#1E3A5F' }}>
              {t('testimonials.subtitle')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1E3A5F' }}>
              {t('testimonials.title')}
            </h2>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {testimonials.map((testimonial, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <CardContent className="p-6 sm:p-8 flex flex-col h-full">
                    <Quote className="w-10 h-10 mb-4 opacity-80" style={{ color: '#F0C05A' }} />
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow mb-6">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="mt-auto">
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: testimonial.stars }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" style={{ color: '#F0C05A' }} />
                        ))}
                      </div>
                      <p className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
                        {testimonial.author}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {testimonial.clinic}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== PARTNERS / BRANDS SECTION ==================== */}
      <section className="py-14 sm:py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
              {language === 'ar' ? 'علاماتنا الشريكة' : 'Nos Marques Partenaires'}
            </h2>
            <p className="text-gray-400 text-sm">
              {language === 'ar'
                ? 'موزع حصري لأكبر العلامات العالمية'
                : 'Distributeur exclusif des plus grandes marques mondiales'
              }
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10"
          >
            {partnerBrands.map((brand, i) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex flex-col items-center justify-center"
              >
                <div className="w-28 sm:w-32 h-16 sm:h-20 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-1 transition-all duration-300 group-hover:border-gray-200 group-hover:shadow-md grayscale hover:grayscale-0">
                  <span className="text-sm sm:text-base font-bold tracking-wider text-gray-400 group-hover:text-gray-700 transition-colors duration-300">
                    {brand.name}
                  </span>
                  <span className="text-[10px] text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
                    {brand.subtext}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <section
        className="py-16 sm:py-20 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2b47 50%, #1a3352 100%)' }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}>
              <Mail className="w-7 h-7" style={{ color: '#F0C05A' }} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {t('newsletter.title')}
            </h2>
            <p className="text-blue-200/70 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {t('newsletter.subtitle')}
            </p>

            {newsletterSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl"
                style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}
              >
                <CheckCircle className="w-5 h-5" style={{ color: '#F0C05A' }} />
                <span className="text-white font-medium text-sm">{t('newsletter.success')}</span>
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  required
                  placeholder={t('newsletter.placeholder')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 focus:border-[#F0C05A] focus:ring-[#F0C05A]/20"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <Button
                  type="submit"
                  className="h-12 px-6 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {t('newsletter.subscribe')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}

            <p className="text-blue-200/40 text-xs mt-4 max-w-sm mx-auto">
              {t('newsletter.privacy')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 sm:py-24 relative overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
        {/* Decorative dental pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
            style={{ backgroundColor: '#F0C05A' }}
          />
          {/* Subtle tooth/toothbrush pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1.5px, transparent 1.5px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: '#F0C05A', opacity: 0.4 }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Decorative icon */}
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}>
              <Stethoscope className="w-8 h-8" style={{ color: '#F0C05A' }} />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {language === 'ar'
                ? 'هل أنت مستعد لتجهيز عيادتك؟'
                : 'Prêt à équiper votre cabinet ?'
              }
            </h2>
            <p className="text-blue-200/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'احصل على عرض سعر مخصص في أقل من 24 ساعة. فريقنا متاح لمساعدتك.'
                : 'Obtenez un devis personnalisé en moins de 24h. Notre équipe est à votre disposition.'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/devis')}
                size="lg"
                className="text-base font-semibold px-8 h-13 shadow-xl hover:shadow-2xl transition-all"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              >
                {language === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/contact')}
                size="lg"
                variant="outline"
                className="text-base font-semibold px-8 h-13 border-white/30 text-white hover:bg-white/10"
              >
                {language === 'ar' ? 'اتصل بنا' : 'Nous contacter'}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
