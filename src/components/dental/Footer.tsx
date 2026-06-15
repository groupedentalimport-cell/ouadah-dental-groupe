'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const { t, isRTL, language } = useTranslation();
  const { navigate } = useRouter();
  const { contactInfo } = useData();

  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail.trim()) {
      setFooterSubmitted(true);
      setFooterEmail('');
      setTimeout(() => setFooterSubmitted(false), 5000);
    }
  };

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.catalogue'), path: '/catalogue' },
    { label: t('nav.blog'), path: '/blog' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const legalLinks = [
    { label: t('footer.legal.mentions'), path: '/mentions-legales' },
    { label: t('footer.privacy'), path: '/politique-confidentialite' },
    { label: t('footer.legal.cgv'), path: '/conditions-vente' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <footer className="text-white">
      {/* ==================== TOP CTA BAR ==================== */}
      <div style={{ backgroundColor: '#0f2b47' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-200 text-sm sm:text-base font-medium text-center sm:text-left">
            {t('footer.cta')}
          </p>
          <Button
            onClick={() => navigate('/devis')}
            className="font-semibold px-6 h-10 shadow-lg hover:shadow-xl transition-all text-sm whitespace-nowrap"
            style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
          >
            {t('footer.requestQuote')}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* ==================== MAIN FOOTER ==================== */}
      <div style={{ backgroundColor: '#1E3A5F' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand */}
            <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  ODG
                </div>
                <span className="text-xl font-bold">ODG</span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                {t('footer.description')}
              </p>
              <div className="flex items-center gap-3">
                {contactInfo.social?.facebook && (
                  <a
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] hover:scale-110 transition-all duration-300"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {contactInfo.social?.instagram && (
                  <a
                    href={contactInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] hover:scale-110 transition-all duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {contactInfo.social?.linkedin && (
                  <a
                    href={contactInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] hover:scale-110 transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-blue-200 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" style={{ color: '#F0C05A' }} />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Contact */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.contact')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-blue-200 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#F0C05A' }} />
                  <span dir="ltr">{contactInfo.phone}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#F0C05A' }} />
                  <span>{contactInfo.email}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#F0C05A' }} />
                  <span>{contactInfo.address?.fr}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#F0C05A' }} />
                  <span>{language === 'ar' ? 'الأحد - الخميس: 8:00 - 17:00' : 'Dim - Jeu : 8h00 - 17h00'}</span>
                </li>
              </ul>
            </motion.div>

            {/* Column 4: Newsletter Mini */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.newsletter.mini')}
              </h3>
              <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                {t('newsletter.subtitle')}
              </p>

              {footerSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 py-3 px-4 rounded-lg"
                  style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}
                >
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#F0C05A' }} />
                  <span className="text-white text-xs">{t('newsletter.success')}</span>
                </motion.div>
              ) : (
                <form onSubmit={handleFooterSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    required
                    placeholder={t('newsletter.placeholder')}
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    className="h-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 text-sm focus:border-[#F0C05A] focus:ring-[#F0C05A]/20"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-4 shrink-0 font-semibold"
                    style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              <p className="text-blue-200/30 text-[10px] mt-3 leading-relaxed">
                {t('newsletter.privacy')}
              </p>

              {/* Legal links */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-blue-200/60 hover:text-blue-200 text-xs transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Gold line above bottom bar */}
        <div className="h-px mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto" style={{ backgroundColor: '#F0C05A', opacity: 0.3 }} />

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-200/60">
            <p>
              &copy; 2026 ODG - OUADAH DENTAL GROUPE. {t('footer.rights')}
            </p>
            <p>
              Fait avec ❤️ en Algérie 🇩🇿
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
