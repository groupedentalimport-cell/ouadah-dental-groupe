'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  Tag,
  Clock,
  Mail,
  ArrowRight,
  Sparkles,
  Timer,
  CheckCircle,
  Zap,
  Percent,
  Star,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Hardcoded promotional items
interface PromoItem {
  id: string;
  name_fr: string;
  name_ar: string;
  image: string;
  originalPrice: number;
  promoPrice: number;
  discount: number;
  badge_fr: string;
  badge_ar: string;
  expiresAt: Date;
  brand: string;
  slug: string;
  isFree: boolean;
}

interface ComingSoonItem {
  id: string;
  name_fr: string;
  name_ar: string;
  image: string;
  teaser_fr: string;
  teaser_ar: string;
  startDate: string;
}

const activePromotions: PromoItem[] = [
  {
    id: 'promo-1',
    name_fr: 'Fauteuil Dentaire Premium X500',
    name_ar: 'كرسي أسنان بريميوم X500',
    image: '',
    originalPrice: 2850000,
    promoPrice: 2280000,
    discount: 20,
    badge_fr: 'ÉCONOMISEZ 20%',
    badge_ar: 'وفّر 20%',
    expiresAt: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    brand: 'Ritter',
    slug: 'fauteuil-ritter-x500',
    isFree: false,
  },
  {
    id: 'promo-2',
    name_fr: 'Radio Panoramique Numérique',
    name_ar: 'أشعة بانورامية رقمية',
    image: '',
    originalPrice: 3500000,
    promoPrice: 2975000,
    discount: 15,
    badge_fr: 'ÉCONOMISEZ 15%',
    badge_ar: 'وفّر 15%',
    expiresAt: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    brand: 'Owandy',
    slug: 'radio-owandy-pano',
    isFree: false,
  },
  {
    id: 'promo-3',
    name_fr: 'Autoclave Classe B + Formation Gratuite',
    name_ar: 'جهاز تعقيم فئة ب + تكوين مجاني',
    image: '',
    originalPrice: 980000,
    promoPrice: 980000,
    discount: 0,
    badge_fr: 'FORMATION GRATUITE',
    badge_ar: 'تدريب مجاني',
    expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    brand: 'W&H',
    slug: 'autoclave-wh-classb',
    isFree: true,
  },
  {
    id: 'promo-4',
    name_fr: 'Unité Dentaire Complete Evo',
    name_ar: 'وحدة أسنان كاملة إيفو',
    image: '',
    originalPrice: 1950000,
    promoPrice: 1560000,
    discount: 20,
    badge_fr: 'ÉCONOMISEZ 20%',
    badge_ar: 'وفّر 20%',
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    brand: 'V2S',
    slug: 'unite-v2s-evo',
    isFree: false,
  },
  {
    id: 'promo-5',
    name_fr: 'Pack Starter Cabinet Dentaire',
    name_ar: 'باقة انطلاق عيادة أسنان',
    image: '',
    originalPrice: 5200000,
    promoPrice: 4160000,
    discount: 20,
    badge_fr: 'ÉCONOMISEZ 20%',
    badge_ar: 'وفّر 20%',
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    brand: 'ODG Pack',
    slug: 'pack-starter-cabinet',
    isFree: false,
  },
];

const comingSoonItems: ComingSoonItem[] = [
  {
    id: 'cs-1',
    name_fr: 'Nouveau Scanner Intra-oral',
    name_ar: 'ماسح داخل الفم الجديد',
    image: '',
    teaser_fr: 'Technologie de scan 3D de dernière génération',
    teaser_ar: 'تقنية المسح ثلاثي الأبعاد من الجيل الأخير',
    startDate: 'Mars 2026',
  },
  {
    id: 'cs-2',
    name_fr: 'Promo Spéciale Ramadan',
    name_ar: 'عرض رمضان الخاص',
    image: '',
    teaser_fr: 'Des réductions exclusives pour le mois sacré',
    teaser_ar: 'تخفيضات حصرية للشهر الكريم',
    startDate: 'Ramadan 2026',
  },
  {
    id: 'cs-3',
    name_fr: 'Lampe LED Premium + Kit Offert',
    name_ar: 'مصباح LED بريميوم + هدية مجانية',
    image: '',
    teaser_fr: 'Polymerisation LED avec kit de composite offert',
    teaser_ar: 'مصباح LED مع مجموعة كومبوزيت مجانية',
    startDate: 'Avril 2026',
  },
];

// Helper function for countdown with seconds
function calcTimeLeft(date: Date) {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

// Flip-card style digit component
function FlipDigit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-10 h-12 sm:w-12 sm:h-14 rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: '#1E3A5F' }}>
        {/* Center line for flip effect */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-black/10 z-10" />
        {/* Top half - slightly lighter */}
        <div className="absolute inset-0 top-0 h-1/2" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-lg sm:text-xl tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[9px] sm:text-[10px] font-medium mt-1.5 uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}

// Countdown timer component with flip-card digits
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000); // Update every second
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1 sm:gap-1.5">
      <FlipDigit value={timeLeft.days} label="Jours" />
      <span className="text-lg font-bold mt-[-14px]" style={{ color: '#1E3A5F' }}>:</span>
      <FlipDigit value={timeLeft.hours} label="Heures" />
      <span className="text-lg font-bold mt-[-14px]" style={{ color: '#1E3A5F' }}>:</span>
      <FlipDigit value={timeLeft.minutes} label="Min" />
      <span className="text-lg font-bold mt-[-14px]" style={{ color: '#1E3A5F' }}>:</span>
      <FlipDigit value={timeLeft.seconds} label="Sec" />
    </div>
  );
}

// Compact countdown for card view
function CountdownCompact({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-1">
      {[
        { val: timeLeft.days, suffix: 'j' },
        { val: timeLeft.hours, suffix: 'h' },
        { val: timeLeft.minutes, suffix: 'm' },
        { val: timeLeft.seconds, suffix: 's' },
      ].map((unit, i) => (
        <React.Fragment key={unit.suffix}>
          <div
            className="flex items-center justify-center min-w-[28px] h-7 rounded text-xs font-bold tabular-nums"
            style={{ backgroundColor: 'rgba(30,58,95,0.08)', color: '#1E3A5F' }}
          >
            {String(unit.val).padStart(2, '0')}{unit.suffix}
          </div>
          {i < 3 && <span className="text-gray-300 text-xs">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function PromotionsPage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen">
      {/* ==================== GRADIENT HEADER ==================== */}
      <section
        className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4f7f 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 1 }}
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
          style={{ backgroundColor: '#F0C05A' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
          style={{ backgroundColor: '#F0C05A' }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 text-xs font-semibold px-3 py-1.5 border-0" style={{ backgroundColor: 'rgba(240,192,90,0.2)', color: '#F0C05A' }}>
              <Gift className="w-3.5 h-3.5 mr-1.5" />
              {language === 'ar' ? 'عروض حصرية' : 'Offres exclusives'}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {t('promotions.title')}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              {t('promotions.subtitle')}
            </p>
          </motion.div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
            <path d="M0,30 C360,55 720,5 1440,30 L1440,60 L0,60 Z" className="fill-white dark:fill-[#0f1d2e]" />
          </svg>
        </div>
      </section>

      {/* ==================== ACTIVE PROMOTIONS ==================== */}
      <section className="py-12 sm:py-16 bg-white dark:bg-[#0f1d2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: '#C0564F' }} />
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                {t('promotions.active')}
              </h2>
              <div className="h-0.5 w-16 mt-1 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            </div>
            <Zap className="w-6 h-6 ml-2" style={{ color: '#F0C05A' }} />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {activePromotions.map((promo) => (
              <motion.div
                key={promo.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group border-0 shadow-lg dark:shadow-none dark:bg-[#162236] hover:shadow-2xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden h-full flex flex-col card-lift relative">
                  {/* Promo badge */}
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="flex items-center justify-between p-3">
                      <Badge
                        className="text-[10px] font-bold px-2.5 py-1 border-0 shadow-md"
                        style={{
                          backgroundColor: promo.isFree ? '#10B981' : '#C0564F',
                          color: 'white',
                        }}
                      >
                        {promo.isFree ? (
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {language === 'ar' ? promo.badge_ar : promo.badge_fr}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            {language === 'ar' ? promo.badge_ar : promo.badge_fr}
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>

                  {/* Product image area */}
                  <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'rgba(30,58,95,0.03)' }}>
                    {promo.image ? (
                      <img
                        src={promo.image}
                        alt={language === 'ar' ? promo.name_ar : promo.name_fr}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(30,58,95,0.08)' }}
                        >
                          <Gift className="w-8 h-8" style={{ color: '#1E3A5F', opacity: 0.3 }} />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: '#1E3A5F', opacity: 0.3 }}>
                          {promo.brand}
                        </span>
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1">
                    {/* Brand */}
                    <p className="text-xs font-semibold mb-1 dark:text-[#F0C05A]" style={{ color: '#F0C05A' }}>
                      {promo.brand}
                    </p>

                    {/* Name */}
                    <h3 className="font-bold text-base mb-2 line-clamp-2 dark:text-white" style={{ color: '#1E3A5F' }}>
                      {language === 'ar' ? promo.name_ar : promo.name_fr}
                    </h3>

                    {/* Price section */}
                    <div className="mb-3">
                      {!promo.isFree && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                            {promo.promoPrice.toLocaleString('fr-DZ')} DA
                          </span>
                          <span className="text-sm line-through text-gray-400 dark:text-gray-400">
                            {promo.originalPrice.toLocaleString('fr-DZ')} DA
                          </span>
                        </div>
                      )}
                      {promo.isFree && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold" style={{ color: '#10B981' }}>
                            {promo.originalPrice.toLocaleString('fr-DZ')} DA
                          </span>
                          <Badge className="text-[9px] px-1.5 py-0 h-4 font-bold border-0 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                            + {language === 'ar' ? promo.badge_ar : promo.badge_fr}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Countdown - Real-time with seconds */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-1 text-xs mb-2" style={{ color: '#1E3A5F' }}>
                        <Timer className="w-3 h-3 text-gray-400 dark:text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-300 text-[10px]">{t('promotions.expiresIn')}</span>
                      </div>
                      <CountdownCompact targetDate={promo.expiresAt} />
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-3">
                      <Button
                        className="w-full text-white font-semibold text-sm h-10 border-0"
                        style={{ backgroundColor: '#1E3A5F' }}
                        onClick={() => navigate(`/product/${promo.slug}`)}
                      >
                        {t('promotions.claimOffer')}
                        <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''} ml-1.5`} />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== HERO COUNTDOWN - Featured Deal ==================== */}
      <section
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4f7f 50%, #1E3A5F 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 text-xs font-semibold px-3 py-1.5 border-0" style={{ backgroundColor: 'rgba(240,192,90,0.2)', color: '#F0C05A' }}>
              <Timer className="w-3.5 h-3.5 mr-1.5" />
              {language === 'ar' ? 'العرض ينتهي قريباً' : 'Offre limitée'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {activePromotions[0] ? (language === 'ar' ? activePromotions[0].name_ar : activePromotions[0].name_fr) : t('promotions.title')}
            </h2>
            <p className="text-blue-200/70 text-sm mb-8">
              {language === 'ar' ? 'لا تفوّت هذا العرض الحصري' : 'Ne manquez pas cette offre exclusive'}
            </p>

            {/* Flip-card Countdown */}
            <div className="flex justify-center mb-8">
              <CountdownTimer targetDate={activePromotions[0]?.expiresAt || new Date()} />
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={() => activePromotions[0] && navigate(`/product/${activePromotions[0].slug}`)}
                className="h-12 px-8 font-semibold text-sm border-0 shadow-lg"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
              >
                {t('promotions.claimOffer')}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''} ml-2`} />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Wave divider */}
      <div className="bg-white dark:bg-[#0f1d2e]">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,20 C360,50 720,0 1440,20 L1440,50 L0,50 Z" className="fill-gray-50 dark:fill-[#0c1622]" />
        </svg>
      </div>

      {/* ==================== COMING SOON ==================== */}
      <section className="py-12 sm:py-16 bg-gray-50 dark:bg-[#0c1622]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                {t('promotions.comingSoon')}
              </h2>
              <div className="h-0.5 w-16 mt-1 rounded-full" style={{ backgroundColor: '#F0C05A' }} />
            </div>
            <Star className="w-6 h-6 ml-2" style={{ color: '#F0C05A' }} />
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {comingSoonItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="group border-0 shadow-md dark:shadow-none dark:bg-[#162236] hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden border-t-2 card-lift" style={{ borderTopColor: '#F0C05A' }}>
                  <div className="h-36 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'rgba(30,58,95,0.03)' }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={language === 'ar' ? item.name_ar : item.name_fr}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}
                        >
                          <Sparkles className="w-6 h-6" style={{ color: '#F0C05A' }} />
                        </div>
                      </div>
                    )}
                    {/* Coming soon overlay */}
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-[1px]" />
                    <Badge
                      className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 border-0"
                      style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {item.startDate}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-sm mb-1 dark:text-white" style={{ color: '#1E3A5F' }}>
                      {language === 'ar' ? item.name_ar : item.name_fr}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-300 line-clamp-2">
                      {language === 'ar' ? item.teaser_ar : item.teaser_fr}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== NEWSLETTER CTA ==================== */}
      <section
        className="py-14 sm:py-20 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4f7f 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle, #F0C05A 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}>
              <Mail className="w-7 h-7" style={{ color: '#F0C05A' }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {t('promotions.newsletterCta')}
            </h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              {t('promotions.newsletterSub')}
            </p>

            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-center gap-2 text-emerald-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">{t('newsletter.success')}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                >
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('newsletter.placeholder')}
                    className="h-11 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-[#F0C05A] focus:ring-[#F0C05A]/20"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  />
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleSubscribe}
                      className="h-11 px-6 font-semibold text-sm border-0 whitespace-nowrap"
                      style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                    >
                      {t('newsletter.subscribe')}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-white/30 text-xs mt-4">
              {t('newsletter.privacy')}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
