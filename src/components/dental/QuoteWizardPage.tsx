'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Send,
  Package,
  Check,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { useQuoteCart } from '@/hooks/useQuoteCart';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WILAYAS = [
  'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
  'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
  'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
  'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
  'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
  'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
  'Ghardaïa', 'Relizane',
];

export default function QuoteWizardPage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { products, getProductName } = useData();
  const cart = useQuoteCart();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [clientInfo, setClientInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    wilaya: '',
    clientType: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price)) return '— DA';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!clientInfo.fullName.trim()) errors.fullName = 'Required';
    if (!clientInfo.email.trim()) errors.email = 'Required';
    if (!clientInfo.phone.trim()) errors.phone = 'Required';
    if (!clientInfo.wilaya) errors.wilaya = 'Required';
    if (!clientInfo.clientType) errors.clientType = 'Required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep(Math.min(step + 1, totalSteps));
  };

  const handlePrev = () => setStep(Math.max(step - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(false);

    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('quotes').insert([
          {
            nom: clientInfo.fullName,
            email: clientInfo.email,
            telephone: clientInfo.phone,
            wilaya: clientInfo.wilaya,
            type_client: clientInfo.clientType,
            produits_selectionnes: cart.items.map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              quantity: item.quantity,
            })),
            message: clientInfo.message,
            status: 'new',
          },
        ]);
        if (error) throw error;
      }
      setSubmitted(true);
      cart.clearCart();
    } catch (err) {
      console.error('Error submitting quote:', err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8 relative"
        >
          {/* Confetti-like particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: ['#F0C05A', '#1E3A5F', '#3B8C6E', '#C0564F', '#7AB0E0', '#F0C05A'][i % 6],
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 40}%`,
              }}
              initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0.5],
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 150,
                y: (Math.random() - 0.5) * 150 - 50,
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.5, delay: i * 0.08, ease: 'easeOut' }}
            />
          ))}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.3 }}
            className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold mb-3 dark:text-[#7AB0E0]"
            style={{ color: '#1E3A5F' }}
          >
            {t('quote.success')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-500 dark:text-gray-300 mb-6"
          >
            {language === 'ar' ? 'شكراً لثقتكم بنا، سنتواصل معكم قريباً' : 'Merci pour votre confiance, nous vous recontacterons très bientôt'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              onClick={() => navigate('/')}
              className="gap-2"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              {t('nav.home')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-10 sm:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {t('quote.title')}
            </h1>
            <p className="text-blue-200 text-sm">{t('quote.subtitle')}</p>
          </motion.div>

          {/* Progress Stepper */}
          <div className="mt-8">
            <div className="flex items-center justify-center gap-0">
              {[1, 2, 3].map((s, i) => (
                <React.Fragment key={s}>
                  {/* Step circle */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step >= s
                          ? 'text-[#1E3A5F] shadow-lg'
                          : 'bg-white/10 text-white/40 border border-white/20'
                      }`
                      }
                      style={step >= s ? { backgroundColor: '#F0C05A' } : {}}
                      animate={{ scale: step === s ? 1.1 : 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {step > s ? <Check className="w-4 h-4" /> : s}
                    </motion.div>
                    <span className={`text-[10px] mt-1.5 font-medium transition-colors duration-300 ${
                      step >= s ? 'text-white' : 'text-white/30'
                    }`}>
                      {s === 1 ? t('quote.step1') : s === 2 ? t('quote.step2') : t('quote.step3')}
                    </span>
                  </div>
                  {/* Connecting line */}
                  {i < 2 && (
                    <div className="flex-1 mx-3 mt-[-18px]">
                      <div className="h-1 rounded-full overflow-hidden bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: '#F0C05A' }}
                          initial={{ width: '0%' }}
                          animate={{ width: step > s ? '100%' : '0%' }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Client Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="border-0 shadow-sm dark:bg-[#162236]">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-lg font-bold mb-6 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('quote.step1')}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                        {t('quote.fullName')} *
                      </label>
                      <Input
                        value={clientInfo.fullName}
                        onChange={(e) => setClientInfo({ ...clientInfo, fullName: e.target.value })}
                        className={`h-11 transition-all duration-200 focus:ring-2 focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:bg-white/5 dark:border-white/10 dark:text-white ${validationErrors.fullName ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                          {t('quote.email')} *
                        </label>
                        <Input
                          type="email"
                          value={clientInfo.email}
                          onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                          className={`h-11 transition-all duration-200 focus:ring-2 focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:bg-white/5 dark:border-white/10 dark:text-white ${validationErrors.email ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                          {t('quote.phone')} *
                        </label>
                        <Input
                          type="tel"
                          value={clientInfo.phone}
                          onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                          className={`h-11 transition-all duration-200 focus:ring-2 focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:bg-white/5 dark:border-white/10 dark:text-white ${validationErrors.phone ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                          {t('quote.wilaya')} *
                        </label>
                        <Select
                          value={clientInfo.wilaya}
                          onValueChange={(v) => setClientInfo({ ...clientInfo, wilaya: v })}
                        >
                          <SelectTrigger className={`h-11 dark:bg-white/5 dark:border-white/10 dark:text-white ${validationErrors.wilaya ? 'border-red-400 ring-1 ring-red-400' : ''}`}>
                            <SelectValue placeholder={t('quote.wilaya')} />
                          </SelectTrigger>
                          <SelectContent>
                            {WILAYAS.map((w) => (
                              <SelectItem key={w} value={w}>
                                {w}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                          {t('quote.clientType')} *
                        </label>
                        <Select
                          value={clientInfo.clientType}
                          onValueChange={(v) => setClientInfo({ ...clientInfo, clientType: v })}
                        >
                          <SelectTrigger className={`h-11 dark:bg-white/5 dark:border-white/10 dark:text-white ${validationErrors.clientType ? 'border-red-400 ring-1 ring-red-400' : ''}`}>
                            <SelectValue placeholder={t('quote.clientType')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="clinic">{t('quote.clientType.clinic')}</SelectItem>
                            <SelectItem value="reseller">{t('quote.clientType.reseller')}</SelectItem>
                            <SelectItem value="counter">{t('quote.clientType.counter')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                        {t('quote.message')}
                      </label>
                      <Textarea
                        rows={3}
                        value={clientInfo.message}
                        onChange={(e) => setClientInfo({ ...clientInfo, message: e.target.value })}
                        className="transition-all duration-200 focus:ring-2 focus:ring-[#1E3A5F]/20 dark:focus:ring-[#7AB0E0]/20 dark:bg-white/5 dark:border-white/10 dark:text-white"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Product Selection */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="border-0 shadow-sm dark:bg-[#162236]">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('quote.step2')}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/catalogue')}
                      className="gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      {t('products.addQuote')}
                    </Button>
                  </div>

                  {cart.items.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-2">{t('quote.empty')}</p>
                      <p className="text-gray-400 text-sm mb-4">{t('quote.addProducts')}</p>
                      <Button
                        onClick={() => navigate('/catalogue')}
                        style={{ backgroundColor: '#1E3A5F' }}
                      >
                        {t('nav.catalogue')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate" style={{ color: '#1E3A5F' }}>
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-500"
                              onClick={() => cart.removeItem(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="border-0 shadow-sm dark:bg-[#162236]">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-lg font-bold mb-6 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                    {t('quote.step3')}
                  </h2>

                  {/* Client Info Summary */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-sm mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('quote.step1')}
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">{t('quote.fullName')}:</span>
                        <p className="font-medium">{clientInfo.fullName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">{t('quote.email')}:</span>
                        <p className="font-medium">{clientInfo.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">{t('quote.phone')}:</span>
                        <p className="font-medium">{clientInfo.phone}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">{t('quote.wilaya')}:</span>
                        <p className="font-medium">{clientInfo.wilaya}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Summary */}
                  <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-sm mb-3 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('quote.products')}
                    </h3>
                    {cart.items.length === 0 ? (
                      <p className="text-gray-400 text-sm">{t('quote.empty')}</p>
                    ) : (
                      <div className="space-y-2">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold" style={{ color: '#1E3A5F' }}>
                          <span>{t('quote.total')}</span>
                          <span>{formatPrice(cart.totalPrice())}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {t('quote.error')}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('quote.prev')}
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button onClick={handleNext} className="gap-2" style={{ backgroundColor: '#1E3A5F' }}>
              {t('quote.next')}
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || cart.items.length === 0}
              className="gap-2"
              style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
            >
              {submitting ? (
                t('quote.submitting')
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t('quote.submit')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
