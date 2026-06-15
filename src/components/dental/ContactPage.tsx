'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useData } from '@/lib/data-service';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

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
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(false);

    try {
      // Try to submit to Supabase
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && supabase) {
        const { error: dbError } = await supabase.from('contact_messages').insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
          },
        ]);
        if (dbError) throw dbError;
      }
      setSent(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(true);
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
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contact.email'),
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('contact.address'),
      value: language === 'ar' ? contactInfo.address?.ar : contactInfo.address?.fr,
      href: 'https://maps.google.com/?q=Cooperative+Azzouz+Abdelkader+Oran+Algeria',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('contact.hours'),
      value: language === 'ar' ? contactInfo.hours?.ar : contactInfo.hours?.fr,
      href: undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('contact.title')}
            </h1>
            <p className="text-blue-200">{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-5 text-center">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-white"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: '#1E3A5F' }}>
                    {card.title}
                  </h3>
                  {card.href ? (
                    <a
                      href={card.href}
                      target={card.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-gray-500 hover:text-[#1E3A5F] transition-colors"
                    >
                      {card.value}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-500">{card.value}</p>
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

                {sent && (
                  <div className="mb-6 flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{t('contact.form.success')}</span>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                    {t('contact.form.error')}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {t('contact.form.name')}
                      </label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {t('contact.form.email')}
                      </label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {t('contact.form.phone')}
                      </label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">
                        {t('contact.form.subject')}
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                      {t('contact.form.message')}
                    </label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sending}
                    className="w-full h-11 font-semibold"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    {sending ? (
                      t('contact.form.sending')
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
            {/* Map */}
            <Card className="border-0 shadow-sm overflow-hidden">
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
            </Card>

            {/* Social Links */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-sm mb-4" style={{ color: '#1E3A5F' }}>
                  {t('contact.findUs')}
                </h3>
                <div className="flex gap-3">
                  {contactInfo.social?.facebook && (
                    <a
                      href={contactInfo.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
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
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
                      style={{ backgroundColor: '#E4405F' }}
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {contactInfo.social?.linkedin && (
                    <a
                      href={contactInfo.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform"
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
