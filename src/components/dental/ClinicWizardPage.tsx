'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Armchair,
  Monitor,
  Scan,
  ShieldCheck,
  Wind,
  Package,
  Wrench,
  Lamp,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShoppingBag,

} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Armchair: <Armchair className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Scan: <Scan className="w-5 h-5" />,
  Shield: <ShieldCheck className="w-5 h-5" />,
  Wind: <Wind className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />,
  Lamp: <Lamp className="w-5 h-5" />,
};

// Budget ranges
const budgetRanges = [
  { id: 'low', labelFr: 'Moins de 5M DA', labelAr: 'أقل من 5M DA', min: 0, max: 5000000 },
  { id: 'mid', labelFr: '5 - 15M DA', labelAr: '5 - 15M DA', min: 5000000, max: 15000000 },
  { id: 'high', labelFr: '15 - 30M DA', labelAr: '15 - 30M DA', min: 15000000, max: 30000000 },
  { id: 'premium', labelFr: 'Plus de 30M DA', labelAr: 'أكثر من 30M DA', min: 30000000, max: null },
];

// Operatories options
const operatoryOptions = [
  { id: '1-2', labelFr: '1-2', labelAr: '1-2', icon: '🏥' },
  { id: '3-5', labelFr: '3-5', labelAr: '3-5', icon: '🏥🏥' },
  { id: '6-10', labelFr: '6-10', labelAr: '6-10', icon: '🏥🏥🏥' },
  { id: '10+', labelFr: '10+', labelAr: '+10', icon: '🏥🏥🏥🏥' },
];

// Specialty options
const specialtyOptions = [
  { id: 'general', labelFr: 'Généraliste', labelAr: 'طب أسنان عام', recommended: ['Armchair', 'Monitor', 'Wrench', 'Lamp'] },
  { id: 'ortho', labelFr: 'Orthodontie', labelAr: 'تقويم الأسنان', recommended: ['Armchair', 'Monitor', 'Scan'] },
  { id: 'pedo', labelFr: 'Pédodontie', labelAr: 'طب أسنان الأطفال', recommended: ['Armchair', 'Monitor', 'Lamp'] },
  { id: 'surgery', labelFr: 'Chirurgie', labelAr: 'جراحة الفم', recommended: ['Armchair', 'Shield', 'Wrench', 'Scan'] },
  { id: 'implant', labelFr: 'Implantologie', labelAr: 'زراعة الأسنان', recommended: ['Armchair', 'Scan', 'Shield', 'Wrench'] },
];

// Equipment categories (tarifs communiqués sur devis uniquement)
const equipmentCategories = [
  { id: 'Armchair', labelFr: 'Fauteuils dentaires', labelAr: 'كراسي الأسنان', icon: 'Armchair' },
  { id: 'Monitor', labelFr: 'Moniteurs intra-oraux', labelAr: 'كاميرات داخل الفم', icon: 'Monitor' },
  { id: 'Scan', labelFr: 'Scanners / Radiologie', labelAr: 'أجهزة المسح / الأشعة', icon: 'Scan' },
  { id: 'Shield', labelFr: 'Stérilisation', labelAr: 'التعقيم', icon: 'Shield' },
  { id: 'Wind', labelFr: 'Compresseurs', labelAr: 'الضواغط', icon: 'Wind' },
  { id: 'Package', labelFr: 'Petit matériel', labelAr: 'معدات صغيرة', icon: 'Package' },
  { id: 'Wrench', labelFr: 'Instruments / Micromoteurs', labelAr: 'أدوات / محركات دقيقة', icon: 'Wrench' },
  { id: 'Lamp', labelFr: 'Éclairage', labelAr: 'الإضاءة', icon: 'Lamp' },
];

export default function ClinicWizardPage() {
  const { t, isRTL, language } = useTranslation();
  const { navigate } = useRouter();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Step 1 state
  const [operatories, setOperatories] = useState<string>('');
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [budget, setBudget] = useState<string>('');

  // Step 2 state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Derived: operatories count
  const operatoryCount = useMemo(() => {
    if (operatories === '1-2') return 2;
    if (operatories === '3-5') return 5;
    if (operatories === '6-10') return 10;
    if (operatories === '10+') return 12;
    return 0;
  }, [operatories]);

  // When specialties change, update recommended categories
  const recommendedCategories = useMemo(() => {
    const recs = new Set<string>();
    specialties.forEach((specId) => {
      const spec = specialtyOptions.find((s) => s.id === specId);
      if (spec) spec.recommended.forEach((r) => recs.add(r));
    });
    return Array.from(recs);
  }, [specialties]);

  // When moving to step 2, pre-select recommended categories
  const handleNext = () => {
    if (step === 1) {
      // Auto-select recommended categories when moving to step 2
      if (selectedCategories.length === 0) {
        setSelectedCategories(recommendedCategories);
      }
    }
    setStep(Math.min(step + 1, totalSteps));
  };

  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleSpecialty = (specId: string) => {
    setSpecialties((prev) =>
      prev.includes(specId) ? prev.filter((s) => s !== specId) : [...prev, specId]
    );
  };

  // Validation
  const canProceedStep1 = operatories !== '' && specialties.length > 0 && budget !== '';
  const canProceedStep2 = selectedCategories.length > 0;

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isRTL ? -300 : 300) : isRTL ? 300 : -300,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? (isRTL ? -300 : 300) : isRTL ? 300 : -300,
      opacity: 0,
    }),
  };

  const [direction, setDirection] = useState(0);

  const goNext = () => {
    setDirection(1);
    handleNext();
  };

  const goPrev = () => {
    setDirection(-1);
    handlePrev();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Hero Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <motion.div
            className="absolute top-10 right-1/4 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 60 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: '#F0C05A' }}
            />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 gradient-border-animated inline-block px-6 py-2">
              {t('wizard.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('wizard.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0 mb-4">
            {[
              { num: 1, label: t('wizard.step1') },
              { num: 2, label: t('wizard.step2') },
              { num: 3, label: t('wizard.step3') },
            ].map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      step >= s.num
                        ? 'text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}
                    style={step >= s.num ? { backgroundColor: '#1E3A5F' } : {}}
                    animate={{ scale: step === s.num ? 1.1 : 1 }}
                  >
                    {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </motion.div>
                  <span
                    className={`text-xs mt-1.5 font-medium ${
                      step >= s.num
                        ? 'dark:text-[#7AB0E0]'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    style={step >= s.num ? { color: '#1E3A5F' } : {}}
                  >
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`h-0.5 w-12 sm:w-20 mx-2 mb-5 transition-all duration-500 ${
                      step > s.num ? 'bg-[#1E3A5F]' : 'bg-gray-200 dark:bg-white/10'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: '#F0C05A' }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait" custom={direction}>
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-1" style={{ backgroundColor: '#1E3A5F' }} />
                <CardContent className="p-6 sm:p-8">
                  {/* Operatories */}
                  <div className="mb-8">
                    <h3
                      className="text-lg font-bold mb-4 dark:text-[#7AB0E0]"
                      style={{ color: '#1E3A5F' }}
                    >
                      {t('wizard.operatories')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {operatoryOptions.map((opt) => (
                        <motion.button
                          key={opt.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setOperatories(opt.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 min-h-[44px] ${
                            operatories === opt.id
                              ? 'border-[#1E3A5F] dark:border-[#7AB0E0] bg-[#1E3A5F]/5 dark:bg-white/5'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <div className="text-2xl mb-1">{opt.icon}</div>
                          <span
                            className={`text-sm font-bold ${
                              operatories === opt.id
                                ? 'dark:text-[#7AB0E0]'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                            style={operatories === opt.id ? { color: '#1E3A5F' } : {}}
                          >
                            {language === 'ar' ? opt.labelAr : opt.labelFr}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="mb-8">
                    <h3
                      className="text-lg font-bold mb-4 dark:text-[#7AB0E0]"
                      style={{ color: '#1E3A5F' }}
                    >
                      {t('wizard.specialty')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {specialtyOptions.map((spec) => {
                        const isSelected = specialties.includes(spec.id);
                        return (
                          <motion.button
                            key={spec.id}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleSpecialty(spec.id)}
                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 min-h-[44px] ${
                              isSelected
                                ? 'border-[#1E3A5F] dark:border-[#7AB0E0] bg-[#1E3A5F]/5 dark:bg-white/5'
                                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                            }`}
                          >
                            <span
                              className={`text-sm font-bold block ${
                                isSelected
                                  ? 'dark:text-[#7AB0E0]'
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}
                              style={isSelected ? { color: '#1E3A5F' } : {}}
                            >
                              {language === 'ar' ? spec.labelAr : spec.labelFr}
                            </span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="mt-1"
                              >
                                <CheckCircle2
                                  className="w-4 h-4 mx-auto"
                                  style={{ color: '#3B8C6E' }}
                                />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <h3
                      className="text-lg font-bold mb-4 dark:text-[#7AB0E0]"
                      style={{ color: '#1E3A5F' }}
                    >
                      {t('wizard.budget')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {budgetRanges.map((b) => (
                        <motion.button
                          key={b.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setBudget(b.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 min-h-[44px] ${
                            budget === b.id
                              ? 'border-[#1E3A5F] dark:border-[#7AB0E0] bg-[#1E3A5F]/5 dark:bg-white/5'
                              : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          <span
                            className={`text-sm font-bold ${
                              budget === b.id
                                ? 'dark:text-[#7AB0E0]'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                            style={budget === b.id ? { color: '#1E3A5F' } : {}}
                          >
                            {language === 'ar' ? b.labelAr : b.labelFr}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-1" style={{ backgroundColor: '#2A5F8F' }} />
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag
                      className="w-5 h-5"
                      style={{ color: '#1E3A5F' }}
                    />
                    <h3
                      className="text-lg font-bold dark:text-[#7AB0E0]"
                      style={{ color: '#1E3A5F' }}
                    >
                      {language === 'ar'
                        ? 'اختر فئات المعدات'
                        : 'Sélectionnez les catégories d\'équipement'}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {language === 'ar'
                      ? 'الفئات الموصى بها بناءً على تخصصك محددة مسبقاً'
                      : 'Les catégories recommandées selon votre spécialité sont pré-sélectionnées'}
                  </p>

                  {recommendedCategories.length > 0 && (
                    <div className="mb-4">
                      <Badge
                        className="text-xs"
                        style={{ backgroundColor: '#3B8C6E20', color: '#3B8C6E' }}
                      >
                        {language === 'ar'
                          ? `${recommendedCategories.length} فئات موصى بها`
                          : `${recommendedCategories.length} catégories recommandées`}
                      </Badge>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {equipmentCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat.id);
                      const isRecommended = recommendedCategories.includes(cat.id);
                      return (
                        <motion.button
                          key={cat.id}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => toggleCategory(cat.id)}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-200 min-h-[44px] relative ${
                            isSelected
                              ? 'border-[#1E3A5F] dark:border-[#7AB0E0] bg-[#1E3A5F]/5 dark:bg-white/5'
                              : isRecommended
                                ? 'border-dashed border-[#3B8C6E]/40 dark:border-[#3B8C6E]/30'
                                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                          }`}
                        >
                          {isRecommended && !isSelected && (
                            <div
                              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                              style={{ backgroundColor: '#3B8C6E' }}
                            />
                          )}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute top-1.5 right-1.5"
                            >
                              <CheckCircle2
                                className="w-4 h-4"
                                style={{ color: '#3B8C6E' }}
                              />
                            </motion.div>
                          )}
                          <div className="text-gray-400 dark:text-gray-300 mb-2 flex justify-center">
                            {categoryIcons[cat.icon] || <Package className="w-5 h-5" />}
                          </div>
                          <span
                            className={`text-xs font-bold block ${
                              isSelected
                                ? 'dark:text-[#7AB0E0]'
                                : 'text-gray-600 dark:text-gray-300'
                            }`}
                            style={isSelected ? { color: '#1E3A5F' } : {}}
                          >
                            {language === 'ar' ? cat.labelAr : cat.labelFr}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-1" style={{ backgroundColor: '#3A7CB8' }} />
                <CardContent className="p-6 sm:p-8">
                  <h3
                    className="text-lg font-bold mb-6 dark:text-[#7AB0E0]"
                    style={{ color: '#1E3A5F' }}
                  >
                    {t('wizard.step3')}
                  </h3>

                  {/* Summary of selections */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('wizard.operatories')}
                      </div>
                      <div className="font-bold dark:text-white" style={{ color: '#1E3A5F' }}>
                        {operatoryOptions.find((o) => o.id === operatories)
                          ? language === 'ar'
                            ? operatoryOptions.find((o) => o.id === operatories)!.labelAr
                            : operatoryOptions.find((o) => o.id === operatories)!.labelFr
                          : '—'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('wizard.specialty')}
                      </div>
                      <div className="font-bold dark:text-white" style={{ color: '#1E3A5F' }}>
                        {specialties
                          .map(
                            (s) =>
                              language === 'ar'
                                ? specialtyOptions.find((o) => o.id === s)?.labelAr
                                : specialtyOptions.find((o) => o.id === s)?.labelFr
                          )
                          .join(', ') || '—'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('wizard.budget')}
                      </div>
                      <div className="font-bold dark:text-white" style={{ color: '#1E3A5F' }}>
                        {budgetRanges.find((b) => b.id === budget)
                          ? language === 'ar'
                            ? budgetRanges.find((b) => b.id === budget)!.labelAr
                            : budgetRanges.find((b) => b.id === budget)!.labelFr
                          : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Recommended Package - Group by category */}
                  <div className="space-y-3 mb-6">
                    {selectedCategories.map((catId) => {
                      const cat = equipmentCategories.find((c) => c.id === catId);
                      if (!cat) return null;
                      const scale = cat.id === 'Armchair' ? operatoryCount : 1;
                      return (
                        <motion.div
                          key={catId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: '#1E3A5F' }}
                          >
                            {categoryIcons[cat.icon] || <Package className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm dark:text-white" style={{ color: '#1E3A5F' }}>
                              {language === 'ar' ? cat.labelAr : cat.labelFr}
                              {cat.id === 'Armchair' && scale > 1 && (
                                <span className="text-gray-400 font-normal">
                                  {' '}× {scale}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide"
                              style={{ backgroundColor: 'rgba(240,192,90,0.15)', color: '#1E3A5F' }}
                            >
                              {language === 'ar' ? 'عند الطلب' : 'Sur devis'}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Devis - pas d'estimation de prix publique */}
                  <div
                    className="p-6 rounded-xl text-center"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <div className="text-blue-200 text-sm mb-2">
                      {language === 'ar' ? 'التكلفة الإجمالية' : 'Coût total de votre équipement'}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                      {language === 'ar' ? 'عند الطلب' : 'Sur devis'}
                    </div>
                    <div className="text-blue-300 text-xs">
                      {language === 'ar'
                        ? '* أرسل طلبك لتلقي عرض سعر مفصل خلال 24 ساعة'
                        : '* Envoyez votre demande pour recevoir un devis détaillé sous 24h'}
                    </div>
                  </div>


                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          <AnimatePresence>
            {step > 1 && (
              <motion.div
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              >
                <Button
                  onClick={goPrev}
                  variant="outline"
                  className="h-11 px-6 font-medium border-gray-200 dark:border-white/10"
                >
                  <ArrowLeft
                    className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`}
                  />
                  {t('wizard.prev')}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex-1" />

          {step < totalSteps && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                onClick={goNext}
                disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                className="h-11 px-6 font-semibold text-white"
                style={{ backgroundColor: '#1E3A5F' }}
              >
                {t('wizard.next')}
                <ArrowRight
                  className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`}
                />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
