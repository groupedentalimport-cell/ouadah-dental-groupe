'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  Loader2,
  AlertCircle,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useData } from '@/lib/data-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-100 dark:border-white/5 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 px-4 rounded-lg transition-colors"
      >
        <span className="font-medium text-sm sm:text-base dark:text-gray-200" style={{ color: '#1E3A5F' }}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 ml-3"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactPage() {
  const { t, language, isRTL } = useTranslation();
  const { contactInfo } = useData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      toast.success(t('contact.form.success'), {
        description: language === 'ar' ? 'سنقوم بالرد عليك في أقرب وقت' : 'Nous vous répondrons dans les plus brefs délais',
        icon: <CheckCircle2 className="w-5 h-5" />,
      });

      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(t('contact.form.error'), {
        description: language === 'ar' ? 'يرجى المحاولة مرة أخرى لاحقاً' : 'Veuillez réessayer ultérieurement',
        icon: <AlertCircle className="w-5 h-5" />,
      });
    } finally {
      setSending(false);
    }
  };

  const contactCards = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('contact.phone'),
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
      color: '#1E3A5F',
      bgGradient: 'from-[#1E3A5F] to-[#2A5F8F]',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact.email'),
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color: '#2A5F8F',
      bgGradient: 'from-[#2A5F8F] to-[#3A7CB8]',
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact.address'),
      value: language === 'ar' ? contactInfo.address?.ar : contactInfo.address?.fr,
      href: 'https://maps.google.com/?q=Cooperative+Azzouz+Abdelkader+Oran+Algeria',
      color: '#3A7CB8',
      bgGradient: 'from-[#3A7CB8] to-[#4A9CD8]',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('contact.hours'),
      value: language === 'ar' ? contactInfo.hours?.ar : contactInfo.hours?.fr,
      href: undefined,
      color: '#F0C05A',
      bgGradient: 'from-[#F0C05A] to-[#E0B04A]',
    },
  ];

  const faqs = [
    { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
    { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
    { q: t('contact.faq.q3'), a: t('contact.faq.a3') },
    { q: t('contact.faq.q4'), a: t('contact.faq.a4') },
    { q: t('contact.faq.q5'), a: t('contact.faq.a5') },
    { q: t('contact.faq.q6'), a: t('contact.faq.a6') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Animated Gradient Header */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        {/* Animated decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.14, 0.08] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ backgroundColor: '#F0C05A' }}
          />
          {/* Floating dots */}
          <motion.div
            className="absolute top-8 right-1/3 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-12 left-1/3 w-3 h-3 rounded-full"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ opacity: [0.3, 0.7, 0.3], y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              {t('contact.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Contact Info Cards - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <motion.div whileHover={{ y: -5 }} className="h-full">
                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden group">
                  <div className="h-1" style={{ backgroundColor: card.color }} />
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300"
                      style={{ backgroundColor: card.color }}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-bold text-sm mb-2 uppercase tracking-wide dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {card.title}
                    </h3>
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-[#1E3A5F] dark:hover:text-[#7AB0E0] transition-colors leading-relaxed"
                      >
                        {card.value}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{card.value}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form - Improved */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#1E3A5F' }} />
              <CardContent className="p-6 sm:p-8">
                {/* Quick Action Buttons - Call & WhatsApp */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <motion.a
                    href={`tel:${contactInfo.phone?.replace(/\s/g, '')}`}
                    whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(30,58,95,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <Phone className="w-5 h-5" />
                    <span>{t('contact.callUs')}</span>
                    <span className="text-white/70 text-sm font-normal" dir="ltr">{contactInfo.phone}</span>
                  </motion.a>
                  <motion.a
                    href={`https://wa.me/${contactInfo.phone?.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03, boxShadow: '0 10px 25px -5px rgba(37,211,102,0.3)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold text-base shadow-lg transition-all duration-300"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>{t('contact.whatsappUs')}</span>
                  </motion.a>
                </div>

                <h2 className="text-xl font-bold mb-2 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {t('contact.form.message')}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
                  {language === 'ar' ? 'سنقوم بالرد عليك في أقرب وقت ممكن' : 'Nous vous répondrons dans les plus brefs délais'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        {t('contact.form.name')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Votre nom complet'}
                        className="transition-shadow focus:shadow-md h-11"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        {t('contact.form.email')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                        className="transition-shadow focus:shadow-md h-11"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+213 ..."
                        className="transition-shadow focus:shadow-md h-11"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                        {t('contact.form.subject')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={language === 'ar' ? 'موضوع رسالتك' : 'Sujet de votre message'}
                        className="transition-shadow focus:shadow-md h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 block">
                      {t('contact.form.message')} <span className="text-red-400">*</span>
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Écrivez votre message ici...'}
                      className="transition-shadow focus:shadow-md resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-12 font-semibold text-base transition-all duration-300 hover:shadow-lg"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('contact.form.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        {t('contact.form.send')}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map & Social */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Map Section - With decorative overlay */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {/* Map Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-white/5" style={{ backgroundColor: '#f8fafc' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {t('contact.findUs')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? contactInfo.address?.ar : contactInfo.address?.fr}
                    </p>
                  </div>
                </div>

                {/* Map Embed with overlay */}
                <div className="h-64 sm:h-80 bg-gray-200 relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.5!2d-0.63!3d35.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM2JzAwLjAiTiAwwrAzNyc0OC4wIlc!5e0!3m2!1sfr!2sdz!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  {/* Decorative corner badge */}
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-lg flex items-center gap-1.5" style={{ backgroundColor: '#1E3A5F' }}>
                    <MapPin className="w-3.5 h-3.5" style={{ color: '#F0C05A' }} />
                    ODG - Oran
                  </div>
                </div>

                {/* Open in Google Maps Link */}
                <div className="p-4">
                  <a
                    href="https://maps.google.com/?q=Cooperative+Azzouz+Abdelkader+Oran+Algeria"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: '#1E3A5F10', color: '#1E3A5F' }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    {language === 'ar' ? 'فتح في خرائط جوجل' : 'Ouvrir dans Google Maps'}
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Social Links - Enhanced */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#F0C05A' }} />
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wide dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {language === 'ar' ? 'تابعنا على' : 'Suivez-nous'}
                </h3>
                <div className="flex gap-3">
                  {contactInfo.social?.facebook && (
                    <motion.a
                      href={contactInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#1877F2' }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Facebook className="w-5 h-5" />
                    </motion.a>
                  )}
                  {contactInfo.social?.instagram && (
                    <motion.a
                      href={contactInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#E4405F' }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Instagram className="w-5 h-5" />
                    </motion.a>
                  )}
                  {contactInfo.social?.linkedin && (
                    <motion.a
                      href={contactInfo.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#0A66C2' }}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="w-5 h-5" />
                    </motion.a>
                  )}
                  {/* WhatsApp direct link */}
                  <motion.a
                    href={`https://wa.me/${contactInfo.phone?.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: '#25D366' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="text-center mb-10">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-1 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: '#F0C05A' }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {t('contact.faq.title')}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Card className="border-0 shadow-sm overflow-hidden">
              <div className="h-1" style={{ backgroundColor: '#1E3A5F' }} />
              <CardContent className="p-0">
                {faqs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    question={faq.q}
                    answer={faq.a}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
