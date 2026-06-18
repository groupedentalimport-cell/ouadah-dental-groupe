'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
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
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Play,
  Users,
  ArrowUp,
  X,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import QuickViewModal from '@/components/dental/QuickViewModal';
import type { Product } from '@/lib/data-service';

// Animated counter component - counts up with smooth easing
function AnimatedCounter({ end, suffix, delay = 0 }: { end: number; suffix: string; delay?: number }) {
  const [count, setCount] = useState(end); // Show final value immediately
  const [animated, setAnimated] = useState(false);
  const hasStartedRef = useRef(false);

  // Use IntersectionObserver directly for more reliable detection
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasStartedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;
            // Start from 0 and count up
            setCount(0);
            setAnimated(true);
            const startTime = performance.now() + delay;
            const duration = 1800;
            let rafId: number;

            const animate = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              if (elapsed < 0) {
                rafId = requestAnimationFrame(animate);
                return;
              }
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.round(eased * end));
              if (progress < 1) {
                rafId = requestAnimationFrame(animate);
              }
            };

            rafId = requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, delay]);

  return (
    <div ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-1 animate-float-subtle">
      {count}<span style={{ color: '#F0C05A' }}>{suffix}</span>
    </div>
  );
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

// Floating geometric particles for hero background
const heroParticles = [
  // Circles
  { shape: 'circle' as const, x: '8%', size: 6, color: '#F0C05A', opacity: 0.12, duration: 18, delay: 0 },
  { shape: 'circle' as const, x: '92%', size: 4, color: '#1E3A5F', opacity: 0.15, duration: 22, delay: 3 },
  { shape: 'circle' as const, x: '45%', size: 5, color: '#F0C05A', opacity: 0.08, duration: 20, delay: 7 },
  { shape: 'circle' as const, x: '72%', size: 3, color: '#F0C05A', opacity: 0.10, duration: 16, delay: 5 },
  // Diamonds
  { shape: 'diamond' as const, x: '18%', size: 8, color: '#1E3A5F', opacity: 0.10, duration: 24, delay: 2 },
  { shape: 'diamond' as const, x: '65%', size: 6, color: '#F0C05A', opacity: 0.08, duration: 20, delay: 8 },
  { shape: 'diamond' as const, x: '88%', size: 5, color: '#1E3A5F', opacity: 0.12, duration: 26, delay: 11 },
  // Crosses
  { shape: 'cross' as const, x: '30%', size: 7, color: '#F0C05A', opacity: 0.10, duration: 19, delay: 4 },
  { shape: 'cross' as const, x: '78%', size: 5, color: '#1E3A5F', opacity: 0.08, duration: 23, delay: 9 },
  { shape: 'cross' as const, x: '52%', size: 6, color: '#F0C05A', opacity: 0.06, duration: 21, delay: 13 },
  // Extra subtle circles
  { shape: 'circle' as const, x: '25%', size: 3, color: '#F0C05A', opacity: 0.06, duration: 28, delay: 6 },
  { shape: 'circle' as const, x: '58%', size: 4, color: '#1E3A5F', opacity: 0.08, duration: 25, delay: 15 },
];

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

export default function HomePage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { categories, products, getCategoryName, getProductName, getProductShortDescription } = useData();
  const addRecentlyViewed = useRecentlyViewed((s) => s.addProduct);
  const recentlyViewedItems = useRecentlyViewed((s) => s.items);

  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 6);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Parallax scroll for hero background
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  // Stats with icons
  const stats = [
    { end: 500, suffix: '+', label: t('stats.clinics'), icon: <Building2 className="w-7 h-7" /> },
    { end: 48, suffix: '', label: t('stats.wilayas'), icon: <MapPin className="w-7 h-7" /> },
    { end: 15, suffix: '+', label: t('stats.brands'), icon: <Award className="w-7 h-7" /> },
    { end: 48, suffix: 'h', label: t('stats.sav'), icon: <Headphones className="w-7 h-7" /> },
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: t('products.warranty'),
      desc: language === 'ar'
        ? 'ضمان من 2 إلى 5 سنوات حسب المنتج، مع خدمة ما بعد البيع سريعة'
        : 'Garantie de 2 à 5 ans selon le produit, avec service après-vente réactif',
      accent: '#2A5F8F',
      bgColor: 'rgba(42,95,143,0.08)',
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: t('products.installation'),
      desc: language === 'ar'
        ? 'تركيب احترافي وتدريب مشمولان مع كل معدات'
        : 'Installation professionnelle et formation incluses avec chaque équipement',
      accent: '#F0C05A',
      bgColor: 'rgba(240,192,90,0.10)',
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: 'SAV 48h',
      desc: language === 'ar'
        ? 'خدمة ما بعد البيع السريعة تغطي 48 ولاية في أقل من 48 ساعة'
        : 'Service après-vente réactif couvrant 48 wilayas en moins de 48h',
      accent: '#3B8C6E',
      bgColor: 'rgba(59,140,110,0.08)',
    },
    {
      icon: <Truck className="w-7 h-7" />,
      title: t('products.delivery'),
      desc: language === 'ar'
        ? 'توصيل في 58 ولاية جزائرية، مدة التسليم من 1 إلى 6 أسابيع'
        : 'Livraison dans les 58 wilayas algériennes, délai de 1 à 6 semaines',
      accent: '#C0564F',
      bgColor: 'rgba(192,86,79,0.08)',
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
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [promoDismissed, setPromoDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('odg_promo_dismissed');
    if (dismissed === 'true') setPromoDismissed(true);
  }, []);

  const dismissPromo = useCallback(() => {
    setPromoDismissed(true);
    localStorage.setItem('odg_promo_dismissed', 'true');
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterLoading(true);
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newsletterEmail.trim() }),
        });
        if (res.ok) {
          setNewsletterSubmitted(true);
          setNewsletterEmail('');
          setTimeout(() => setNewsletterSubmitted(false), 5000);
        }
      } catch {
        setNewsletterSubmitted(true);
        setNewsletterEmail('');
        setTimeout(() => setNewsletterSubmitted(false), 5000);
      } finally {
        setNewsletterLoading(false);
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  return (
    <div className="overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section ref={heroRef} className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">

        {/* Background image with parallax effect */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center -top-20 -bottom-20"
          style={{
            backgroundImage: `url('/images/hero-dental.jpg')`,
            y: heroY,
          }}
        />
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(30,58,95,0.82) 0%, rgba(45,90,142,0.72) 40%, rgba(26,74,110,0.78) 70%, rgba(15,43,71,0.85) 100%)',
              'linear-gradient(135deg, rgba(15,43,71,0.85) 0%, rgba(30,58,95,0.75) 40%, rgba(45,90,142,0.72) 70%, rgba(30,58,95,0.82) 100%)',
              'linear-gradient(135deg, rgba(30,58,95,0.82) 0%, rgba(45,90,142,0.72) 40%, rgba(26,74,110,0.78) 70%, rgba(15,43,71,0.85) 100%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Floating geometric particles as background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {heroParticles.map((p, i) => (
            <div
              key={i}
              className="hero-particle absolute"
              style={{
                left: p.x,
                bottom: '-10px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                opacity: p.opacity,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '0',
                transform: p.shape === 'diamond' ? 'rotate(45deg)' : 'none',
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                ...(p.shape === 'cross' ? {
                  backgroundColor: 'transparent',
                  width: p.size,
                  height: p.size,
                  position: 'absolute' as const,
                } : {}),
              }}
            >
              {p.shape === 'cross' && (
                <svg width={p.size} height={p.size} viewBox={`0 0 ${p.size} ${p.size}`} style={{ opacity: p.opacity / 0.1 }}>
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke={p.color} strokeWidth="1.5" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke={p.color} strokeWidth="1.5" />
                </svg>
              )}
            </div>
          ))}
        </div>
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: '#F0C05A' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <Badge
              className="mb-3 sm:mb-5 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1 sm:py-1.5 border-0 inline-flex items-center gap-1 sm:gap-1.5 relative overflow-hidden hero-badge-responsive"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)' }}
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
              />
              <Sparkles className="w-3.5 h-3.5 relative z-10" />
              <motion.span
                className="relative z-10 inline-block overflow-hidden whitespace-nowrap"
                initial={{ maxWidth: 0 }}
                animate={{ maxWidth: 300 }}
                transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
              >
                {t('hero.subtitle')}
              </motion.span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-3 sm:mb-5 hero-title-responsive bg-gradient-to-r from-[#1E3A5F] via-[#2A5F8F] to-[#F0C05A] dark:from-[#7AB0E0] dark:via-[#A8D0F0] dark:to-[#F0C05A] bg-clip-text text-transparent"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.24 }}
            className="text-sm sm:text-xl text-blue-200/90 dark:text-blue-100/95 max-w-2xl mx-auto mb-5 sm:mb-8 leading-relaxed hero-subtitle-responsive line-clamp-3 sm:line-clamp-none"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.36 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => navigate('/catalogue')}
                size="lg"
                className="text-base font-semibold px-8 py-3.5 h-auto shadow-lg shadow-[#1E3A5F]/20 hover:shadow-xl hover:shadow-[#1E3A5F]/30 transition-all duration-300 gap-2 group min-h-[44px]"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              >
                {t('hero.cta.catalogue')}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>

          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.6 }}
            className="mt-6 sm:mt-10 flex flex-nowrap sm:flex-wrap items-center justify-center gap-2 sm:gap-10 overflow-x-auto pb-2 sm:pb-0"
          >
            {[
              { icon: <Award className="w-5 h-5" />, text: language === 'ar' ? '15+ سنة خبرة' : '15+ ans d\'expérience' },
              { icon: <Clock className="w-5 h-5" />, text: language === 'ar' ? 'خدمة 48 ساعة' : 'Service 48h' },
              { icon: <Wrench className="w-5 h-5" />, text: language === 'ar' ? 'تركيب مشمول' : 'Installation incluse' },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 sm:gap-2.5 text-white/80 dark:text-white/90 text-xs sm:text-sm font-medium bg-white/5 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-white/10 dark:border-white/15 whitespace-nowrap"
              >
                <span style={{ color: '#F0C05A' }}>{badge.icon}</span>
                {badge.text}
              </div>
            ))}
          </motion.div>

          {/* Floating "Trusted by" badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1 }}
            className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            <div className="flex -space-x-2">
              {['KB', 'SM', 'AT'].map((initials, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white/30"
                  style={{ backgroundColor: idx === 0 ? '#2A5F8F' : idx === 1 ? '#3B8C6E' : '#C0564F', color: '#fff' }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <motion.span
              className="text-white/80 dark:text-white/90 text-sm font-medium inline-block"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {language === 'ar' ? '+500 عيادة تثق بنا' : '500+ cliniques nous font confiance'}
            </motion.span>
          </motion.div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-6 h-6 text-white/60 animate-scroll-hint" />
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0,60 C360,100 720,20 1440,60 L1440,100 L0,100 Z"
              fill="#1E3A5F"
            />
          </svg>
        </div>
      </section>

      {/* ==================== PROMOTIONAL BANNER ==================== */}
      <AnimatePresence>
        {!promoDismissed && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative glass"
          >
            {/* Gold top accent line */}
            <div className="h-[2px] w-full" style={{ backgroundColor: '#F0C05A' }} />
            <div
              className="py-3 px-4 sm:px-6 lg:px-8"
              style={{ background: 'linear-gradient(90deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)' }}
            >
              <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-xl shrink-0">🎁</span>
                  <p className="text-white text-sm sm:text-base font-medium truncate">
                    {t('promo.text')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    className="h-8 px-4 text-xs font-semibold shadow-md hover:shadow-lg transition-all touch-target"
                    style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                    onClick={() => navigate('/catalogue')}
                  >
                    {t('promo.cta')}
                  </Button>
                  <button
                    onClick={dismissPromo}
                    className="text-white/50 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 touch-target flex items-center justify-center focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={t('nav.close')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            {/* Gold bottom accent line */}
            <div className="h-[2px] w-full" style={{ backgroundColor: '#F0C05A' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-8 sm:py-14 relative overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(240,192,90,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 50%, rgba(240,192,90,0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 50%, rgba(240,192,90,0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y lg:divide-y-0 divide-white/[0.08]">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center group py-6 sm:py-8 px-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(240,192,90,0.12)', color: '#F0C05A' }}
                >
                  {stat.icon}
                </div>
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                <div className="text-blue-200/80 text-xs sm:text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 right-0 wave-divider">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path
              d="M0,30 C240,70 480,10 720,50 C960,90 1200,20 1440,40 L1440,80 L0,80 Z"
              className="fill-gray-50 dark:fill-[#0c1622]"
            />
            <path
              d="M0,50 C360,20 720,70 1080,30 C1260,15 1380,45 1440,50 L1440,80 L0,80 Z"
              className="fill-gray-50/50 dark:fill-[#0c1622]/50"
            />
          </svg>
        </div>
      </section>

      {/* ==================== TRUSTED BRANDS SECTION ==================== */}
      <section className="py-6 sm:py-10 bg-gray-50 dark:bg-[#0c1622]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4 sm:mb-6"
          >
            <h3 className="text-lg sm:text-xl font-bold relative inline-block gradient-border-animated px-4 py-1" style={{ color: '#1E3A5F' }}>
              <span className="dark:text-[#7AB0E0]">
                {t('home.trustedBrands')}
              </span>
            </h3>
          </motion.div>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4"
          >
            {Array.from(new Set(products.map((p) => p.brand))).filter(Boolean).slice(0, 8).map((brand, i) => {
              const brandProductCount = products.filter((p) => p.brand === brand).length;
              return (
                <motion.div
                  key={brand}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/catalogue?brand=${encodeURIComponent(brand)}`)}
                >
                  <div className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] hover:shadow-md transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: '#1E3A5F', color: '#F0C05A' }}>
                      {brand.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate dark:text-white" style={{ color: '#1E3A5F' }}>{brand}</p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">{brandProductCount} {language === 'ar' ? 'منتج' : 'produits'}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== CATEGORIES SECTION ==================== */}
      <section className="py-8 sm:py-16 bg-gray-50 dark:bg-[#0c1622]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight relative inline-block gradient-border-animated px-4 sm:px-6 py-1.5 sm:py-2" style={{ color: '#1E3A5F' }}>
              <span className="dark:text-[#7AB0E0]">
              {t('categories.title')}
              </span>
              {/* Gold underline */}
              <motion.span
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full"
                style={{ backgroundColor: '#F0C05A' }}
                initial={{ width: 0 }}
                whileInView={{ width: '60%' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              />
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-base max-w-xl mx-auto mt-4">
              {t('categories.subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
          >
            {categories.map((cat, idx) => {
              const imgSrc = categoryImages[cat.slug] || cat.image || '';
              return (
                <motion.div
                  key={cat.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="group cursor-pointer relative rounded-xl sm:rounded-2xl overflow-hidden h-32 sm:h-52 shadow-md hover:shadow-2xl transition-all duration-500 hover-lift card-lift"
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
                    {/* Dark overlay with dramatic hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A5F]/95 via-[#1E3A5F]/40 to-transparent transition-all duration-500 group-hover:from-[#1E3A5F]/80 group-hover:via-[#1E3A5F]/20 group-hover:to-transparent" />
                    {/* Subtle gold gradient overlay at bottom for text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F0C05A]/15 to-transparent pointer-events-none" />
                    {/* Gold accent bottom border */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-500 group-hover:h-1" style={{ backgroundColor: '#F0C05A' }} />
                    {/* Product count badge */}
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} z-10`}>
                      <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-[10px] font-bold text-white shadow-md" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                        {products.filter((p) => p.category_id === cat.id).length}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-5">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/80 transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: 'rgba(240,192,90,0.2)' }}>
                          {categoryIcons[cat.icon] || <Package className="w-3 h-3 sm:w-4 sm:h-4" />}
                        </div>
                        <h3 className="font-bold text-xs sm:text-base text-white">
                          {getCategoryName(cat, language)}
                        </h3>
                      </div>
                      <p className="text-white/50 text-[10px] sm:text-xs">
                        {products.filter((p) => p.category_id === cat.id).length}{' '}
                        {language === 'ar' ? 'منتجات' : 'produits'}
                      </p>
                      {/* Hover arrow */}
                      <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-8 h-8 rounded-full flex items-center justify-center bg-[#F0C05A]/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ${isRTL ? '-translate-x-1 group-hover:translate-x-0' : 'translate-x-1 group-hover:translate-x-0'}`}>
                        <ArrowRight className={`w-4 h-4 text-[#F0C05A] ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section divider: wave between Categories and Featured Products */}
      <div className="bg-gray-50 dark:bg-[#0c1622] wave-divider">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0,20 C360,50 720,0 1080,30 C1260,45 1380,10 1440,20 L1440,60 L0,60 Z" className="fill-white dark:fill-[#0f1d2e]" />
          <path d="M0,35 C480,10 960,55 1440,25 L1440,60 L0,60 Z" className="fill-white/40 dark:fill-[#0f1d2e]/40" />
        </svg>
      </div>

      {/* ==================== FEATURED PRODUCTS ==================== */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0f1d2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {t('products.featured')}
                </h2>
                <div className="h-0.5 w-16 mt-1 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/catalogue')}
              className="hidden sm:flex gap-2 group touch-target"
              style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
            >
              {t('common.seeAll')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Mobile: horizontal scroll, Desktop: grid */}
          <div className="flex gap-4 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5 sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-[260px] sm:min-w-0"
              >
                <Card className="group border-0 shadow-md dark:shadow-none dark:bg-[#162236] hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden h-full flex flex-col hover-lift card-lift" style={{ borderTop: '2px solid #F0C05A' }}>
                  <div
                    className="h-48 flex items-center justify-center relative overflow-hidden product-img-placeholder"
                  >
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]}
                        alt={getProductName(product, language)}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      /* Dental-themed placeholder */
                      <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(30,58,95,0.06)' }}>
                          <Stethoscope className="w-8 h-8" style={{ color: '#1E3A5F', opacity: 0.2 }} />
                        </div>
                        <span className="text-[10px] font-medium" style={{ color: '#1E3A5F', opacity: 0.2 }}>
                          {product.brand || 'ODG'}
                        </span>
                      </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.is_new && (
                        <Badge className="text-[10px] px-2 py-0.5 font-semibold border-0" style={{ backgroundColor: '#1E3A5F' }}>
                          {t('products.new')}
                        </Badge>
                      )}
                      {product.is_best_seller && (
                        <Badge className="text-[10px] px-2 py-0.5 font-semibold border-0" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                          {t('products.bestSeller')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <p className="text-xs font-semibold mb-0.5 dark:text-[#F0C05A]" style={{ color: '#F0C05A' }}>{product.brand}</p>
                    <h3
                      className="font-bold text-sm mb-1 line-clamp-1 dark:text-white"
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
                    <p className="text-xs text-gray-500 dark:text-gray-300 mb-3 line-clamp-2 flex-1">
                      {getProductShortDescription(product, language)}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-auto">
                      {(product.price ?? 0) === 0 ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide dark:text-[#F0C05A]" style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#1E3A5F' }}>
                          {language === 'ar' ? 'عند الطلب' : 'Sur devis'}
                        </span>
                      ) : (
                        <span className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                          {(product.price ?? 0).toLocaleString('fr-DZ')} DA
                        </span>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7 px-2 focus-visible:ring-2 focus-visible:ring-[#F0C05A] focus-visible:ring-offset-2 focus-visible:outline-none"
                          style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                            setQuickViewOpen(true);
                            addRecentlyViewed(product.id, product.slug, getProductName(product, language), product.images?.[0] || '', product.price);
                          }}
                          aria-label={t('products.quickView')}
                          title={t('products.quickView')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Button>

                      </div>
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
              className="gap-2 group"
              style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
            >
              {t('common.seeAll')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* ==================== RECENTLY VIEWED ==================== */}
      {recentlyViewedItems.length > 0 && (
        <section className="py-10 sm:py-12 bg-gray-50 dark:bg-[#0c1622]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }} />
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('recentlyViewed.title')}
                    </h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-300 mt-0.5">
                    {t('recentlyViewed.subtitle')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Horizontal scrollable row */}
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recentlyViewedItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.35 }}
                  className="min-w-[220px] sm:min-w-[240px] max-w-[260px]"
                >
                  <Card
                    className="group border-0 shadow-md dark:shadow-none dark:bg-[#162236] hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden cursor-pointer hover-lift card-lift"
                    style={{ borderTop: '2px solid #F0C05A' }}
                    onClick={() => navigate(`/product/${item.slug}`)}
                  >
                    <div className="h-36 flex items-center justify-center relative overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 text-gray-300">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(30,58,95,0.06)' }}>
                            <Stethoscope className="w-6 h-6" style={{ color: '#1E3A5F', opacity: 0.2 }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <p className="font-bold text-sm mb-1 line-clamp-1 dark:text-white" style={{ color: '#1E3A5F' }}>
                        {item.name}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        {(item.price ?? 0) === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide dark:text-[#F0C05A]" style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#1E3A5F' }}>
                            {language === 'ar' ? 'عند الطلب' : 'Sur devis'}
                          </span>
                        ) : (
                          <span className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                            {(item.price ?? 0).toLocaleString('fr-DZ')} DA
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[10px] h-6 px-2"
                          style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${item.slug}`);
                          }}
                        >
                          {language === 'ar' ? 'عرض التفاصيل' : 'Voir les détails'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section divider: wave between Featured Products and Why Choose Us */}
      <div className="bg-white dark:bg-[#0f1d2e] wave-divider">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0,30 C240,50 480,10 720,30 C960,50 1200,10 1440,30 L1440,60 L0,60 Z" className="fill-gray-50 dark:fill-[#0c1622]" />
          <path d="M0,40 C360,15 720,55 1080,25 C1260,10 1380,35 1440,40 L1440,60 L0,60 Z" className="fill-gray-50/50 dark:fill-[#0c1622]/50" />
        </svg>
      </div>

      {/* ==================== WHY CHOOSE US ==================== */}
      <section className="py-12 sm:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #eef2f7 50%, #f9fafb 100%)' }}
      >
        {/* Subtle decorative pattern - larger dots */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #1E3A5F 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Subtle diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #1E3A5F 0, #1E3A5F 1px, transparent 1px, transparent 20px)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-10"
          >
            <Badge className="mb-3 text-xs font-medium px-3 py-1 border-0 dark:bg-[#7AB0E0]/10 dark:text-[#7AB0E0]" style={{ backgroundColor: 'rgba(30,58,95,0.08)', color: '#1E3A5F' }}>
              {language === 'ar' ? 'مميزاتنا' : 'Nos atouts'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {language === 'ar' ? 'لماذا تختارنا؟' : 'Pourquoi nous choisir ?'}
            </h2>
            <p className="text-gray-500 dark:text-gray-300 text-base max-w-lg mx-auto">
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
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {whyChooseUs.map((item, i) => (
              <motion.div key={i} variants={itemVariants} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="group glass rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 h-full relative overflow-hidden card-lift">
                  {/* Accent bar at top */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl transition-all duration-300" style={{ backgroundColor: item.accent, opacity: 0.6 }} />
                  {/* Subtle bg glow on hover */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: item.bgColor, filter: 'blur(30px)' }} />
                  <div className="relative flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg relative"
                      style={{ backgroundColor: item.bgColor, color: item.accent }}
                    >
                      {item.icon}
                      {/* Pulse ring on hover */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:animate-ping group-hover:opacity-30" style={{ backgroundColor: item.accent }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base mb-1.5 dark:text-white" style={{ color: '#1E3A5F' }}>
                        {item.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section divider: wave between Why Choose Us and Testimonials */}
      <div style={{ background: 'linear-gradient(180deg, #f9fafb 0%, #eef2f7 50%, #f9fafb 100%)' }} className="wave-divider">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0,25 C360,5 720,45 1080,15 C1260,5 1380,30 1440,25 L1440,50 L0,50 Z" fill="#ffffff" className="dark:fill-[#0f1d2e]" />
          <path d="M0,35 C480,50 960,10 1440,35 L1440,50 L0,50 Z" fill="#ffffff" className="dark:fill-[#0f1d2e]" opacity="0.5" />
        </svg>
      </div>

      {/* ==================== TESTIMONIALS SECTION ==================== */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0f1d2e] relative">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'radial-gradient(circle, #1E3A5F 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <Badge className="mb-3 text-xs font-medium px-3 py-1 border-0" style={{ backgroundColor: 'rgba(240,192,90,0.12)', color: '#1E3A5F' }}>
              {t('testimonials.subtitle')}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {t('testimonials.title')}
            </h2>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5"
          >
            {testimonials.map((testimonial, i) => {
              // Extract initials from author name
              const nameParts = testimonial.author.replace('Dr. ', '').split(' ');
              const initials = nameParts.map(n => n[0]).join('');
              const avatarColors = ['#2A5F8F', '#3B8C6E', '#C0564F'];
              return (
                <motion.div key={i} variants={itemVariants} whileHover={{ y: -3 }} transition={{ duration: 0.2 }} style={{ transform: `translateY(${i * 8}px)` }}>
                  <Card className="h-full glass shadow-sm hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-300 relative overflow-hidden card-lift">
                    {/* Colored top accent */}
                    <div className="h-1 w-full" style={{ backgroundColor: avatarColors[i % 3] }} />
                    {/* Decorative large quote mark */}
                    <div className="absolute -top-2 -left-1 opacity-[0.06] pointer-events-none">
                      <Quote className="w-24 h-24" style={{ color: '#F0C05A' }} />
                    </div>
                    <CardContent className="p-5 sm:p-6 flex flex-col h-full relative">
                      {/* Star rating - prominent */}
                      <div className="flex items-center gap-0.5 mb-4">
                        {Array.from({ length: testimonial.stars }).map((_, idx) => (
                          <Star key={idx} className="w-4 h-4 fill-current" style={{ color: '#F0C05A' }} />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow mb-4 relative z-10 italic">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                      <div className="mt-auto pt-4 border-t border-gray-50 dark:border-white/5 flex items-center gap-3">
                        {/* Avatar with initials */}
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: avatarColors[i % 3] }}
                        >
                          {initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm dark:text-white" style={{ color: '#1E3A5F' }}>
                            {testimonial.author}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">
                            {testimonial.clinic}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Section divider: decorative line between Testimonials and Partners */}
      <div className="bg-white dark:bg-[#0f1d2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#1E3A5F', opacity: 0.3 }} />
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
          </div>
        </div>
      </div>

      {/* ==================== PARTNERS / BRANDS SECTION ==================== */}
      <section className="py-10 sm:py-12 bg-gray-50 dark:bg-[#0c1622] border-y border-gray-100 dark:border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1.5 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {language === 'ar' ? 'علاماتنا الشريكة' : 'Nos Marques Partenaires'}
            </h2>
            <p className="text-gray-400 text-sm">
              {language === 'ar'
                ? 'موزع حصري لأكبر العلامات العالمية'
                : 'Distributeur exclusif des plus grandes marques mondiales'
              }
            </p>
          </motion.div>
        </div>

        {/* Scrolling marquee - duplicates brands for seamless loop */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #f9fafb, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #f9fafb, transparent)' }} />

          <div className="flex overflow-hidden">
            <motion.div
              className="flex shrink-0 items-center gap-6 sm:gap-8 pr-6 sm:pr-8"
              animate={{ x: [0, -50 * partnerBrands.length] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: partnerBrands.length * 3,
                  ease: 'linear',
                },
              }}
            >
              {[...partnerBrands, ...partnerBrands].map((brand, i) => (
                <div
                  key={`${brand.name}-${i}`}
                  className="group flex flex-col items-center justify-center shrink-0"
                >
                  <div className="w-28 sm:w-32 h-16 sm:h-18 rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 group-hover:border-[#F0C05A]/30 group-hover:shadow-md grayscale hover:grayscale-0 group-hover:bg-white px-3">
                    <span className="text-xs sm:text-sm font-bold tracking-wider text-gray-400 group-hover:text-gray-700 transition-colors duration-300">
                      {brand.name}
                    </span>
                    <span className="text-[9px] text-gray-300 group-hover:text-gray-400 transition-colors duration-300">
                      {brand.subtext}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section divider: wave between brands and newsletter */}
      <div className="bg-gray-50 dark:bg-[#0c1622] wave-divider">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
          <path d="M0,20 C360,40 720,0 1080,25 C1260,35 1380,10 1440,20 L1440,50 L0,50 Z" fill="#1E3A5F" />
          <path d="M0,30 C480,10 960,45 1440,20 L1440,50 L0,50 Z" fill="#1E3A5F" opacity="0.5" />
        </svg>
      </div>

      {/* ==================== NEWSLETTER SECTION ==================== */}
      <section
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1E3A5F 0%, #0f2b47 40%, #1a3352 70%, #0d2238 100%)' }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mail icon pattern */}
          <div className="absolute top-6 right-[10%] opacity-[0.04]">
            <Mail className="w-32 h-32" style={{ color: '#F0C05A' }} />
          </div>
          <div className="absolute bottom-4 left-[8%] opacity-[0.03]">
            <Mail className="w-20 h-20" style={{ color: '#F0C05A' }} />
          </div>
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          {/* Gradient orbs */}
          <motion.div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.12, 0.08] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full opacity-5"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}>
              <Mail className="w-7 h-7" style={{ color: '#F0C05A' }} />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              {t('newsletter.title')}
            </h2>
            <p className="text-blue-200/60 text-base mb-6 max-w-md mx-auto leading-relaxed">
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
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto">
                <Input
                  type="email"
                  required
                  placeholder={t('newsletter.placeholder')}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 h-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/40 focus:border-[#F0C05A] focus:ring-[#F0C05A]/20 text-base rounded-xl"
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    type="submit"
                    disabled={newsletterLoading}
                    className="h-12 px-6 font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl gap-2"
                    style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                  >
                    {newsletterLoading ? '...' : t('newsletter.subscribe')}
                    {!newsletterLoading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </motion.div>
              </form>
            )}

            <p className="text-blue-200/30 text-xs mt-4 max-w-sm mx-auto">
              {t('newsletter.privacy')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-12 sm:py-16 relative overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse at 30% 50%, rgba(240,192,90,0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse at 70% 50%, rgba(240,192,90,0.06) 0%, transparent 60%)',
              'radial-gradient(ellipse at 30% 50%, rgba(240,192,90,0.06) 0%, transparent 60%)',
            ],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-8" style={{ backgroundColor: '#F0C05A' }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-[0.04]" style={{ backgroundColor: '#F0C05A' }} />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#F0C05A', opacity: 0.5 }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Decorative icon */}
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(240,192,90,0.12)' }}>
              <Stethoscope className="w-7 h-7" style={{ color: '#F0C05A' }} />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-3 leading-tight">
              {language === 'ar'
                ? 'هل أنت مستعد لتجهيز عيادتك؟'
                : 'Prêt à équiper votre cabinet ?'
              }
            </h2>
            <p className="text-blue-200/60 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              {language === 'ar'
                ? 'فريقنا متاح لمساعدتك في تجهيز عيادتك.'
                : 'Notre équipe est à votre disposition pour vous accompagner.'
              }
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  onClick={() => navigate('/contact')}
                  size="lg"
                  className="text-base font-semibold px-8 h-13 border-white/30 text-white hover:bg-white/10 transition-all duration-300 gap-2"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  {language === 'ar' ? 'اتصل بنا' : 'Nous contacter'}
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </div>
  );
}
