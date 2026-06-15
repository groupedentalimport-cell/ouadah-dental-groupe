'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useData } from '@/lib/data-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

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
      icon: <Phone className="w-5 h-5" />,
      title: t('contact.phone'),
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
      color: '#1E3A5F',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: t('contact.email'),
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
      color: '#2A5F8F',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: t('contact.address'),
      value: language === 'ar' ? contactInfo.address?.ar : contactInfo.address?.fr,
      href: 'https://maps.google.com/?q=Cooperative+Azzouz+Abdelkader+Oran+Algeria',
      color: '#3A7CB8',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: t('contact.hours'),
      value: language === 'ar' ? contactInfo.hours?.ar : contactInfo.hours?.fr,
      href: undefined,
      color: '#F0C05A',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Gradient Header - matching catalogue page style */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
            style={{ backgroundColor: '#F0C05A' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ backgroundColor: '#F0C05A' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
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
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full group">
                <CardContent className="p-6 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-md group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: card.color }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-2 uppercase tracking-wide" style={{ color: '#1E3A5F' }}>
                    {card.title}
                  </h3>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-[#1E3A5F] transition-colors leading-relaxed"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500 leading-relaxed">{card.value}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
                  {t('contact.form.message')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact.form.name')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Votre nom complet'}
                        className="transition-shadow focus:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact.form.email')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder={language === 'ar' ? 'example@email.com' : 'example@email.com'}
                        className="transition-shadow focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder={language === 'ar' ? '+213 ...' : '+213 ...'}
                        className="transition-shadow focus:shadow-md"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                        {t('contact.form.subject')} <span className="text-red-400">*</span>
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={language === 'ar' ? 'موضوع رسالتك' : 'Sujet de votre message'}
                        className="transition-shadow focus:shadow-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">
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
            {/* Map Section */}
            <Card className="border-0 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                {/* Map Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: '#1E3A5F' }}>
                      {t('contact.findUs')}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {language === 'ar' ? contactInfo.address?.ar : contactInfo.address?.fr}
                    </p>
                  </div>
                </div>

                {/* Map Embed */}
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

            {/* Social Links */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-bold text-sm mb-4 uppercase tracking-wide" style={{ color: '#1E3A5F' }}>
                  {language === 'ar' ? 'تابعنا على' : 'Suivez-nous'}
                </h3>
                <div className="flex gap-3">
                  {contactInfo.social?.facebook && (
                    <a
                      href={contactInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#1877F2' }}
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {contactInfo.social?.instagram && (
                    <a
                      href={contactInfo.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#E4405F' }}
                    >
                      <Instagram className="w-5 h-5"                    />
                    </a>
                  )}
                  {contactInfo.social?.linkedin && (
                    <a
                      href={contactInfo.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                      style={{ backgroundColor: '#0A66C2' }}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
