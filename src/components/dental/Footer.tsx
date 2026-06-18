'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart,
  Youtube,
  Truck,
  Wrench,
  Shield,
  ArrowUp,
  MailOpen,
  MessageCircle,
  ShieldCheck,
  Award,
  BadgeCheck,
  FileCheck,
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

  const [footerLoading, setFooterLoading] = useState(false);

  const handleFooterSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (footerEmail.trim()) {
      setFooterLoading(true);
      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: footerEmail.trim() }),
        });
        if (res.ok) {
          setFooterSubmitted(true);
          setFooterEmail('');
          setTimeout(() => setFooterSubmitted(false), 5000);
        }
      } catch {
        // Still show success for UX
        setFooterSubmitted(true);
        setFooterEmail('');
        setTimeout(() => setFooterSubmitted(false), 5000);
      } finally {
        setFooterLoading(false);
      }
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

  const socialLinks = [
    { icon: <Facebook className="w-4 h-4" />, href: contactInfo.social?.facebook, color: '#1877F2', label: 'Facebook' },
    { icon: <Instagram className="w-4 h-4" />, href: contactInfo.social?.instagram, color: '#E4405F', label: 'Instagram' },
    { icon: <Linkedin className="w-4 h-4" />, href: contactInfo.social?.linkedin, color: '#0A66C2', label: 'LinkedIn' },
  ].filter(s => s.href);

  // Certification badges with icons
  const certificationBadges = [
    { icon: <BadgeCheck className="w-4 h-4" />, label: 'CE', color: '#1E3A5F' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'ISO 9001', color: '#2A5F8F' },
    { icon: <FileCheck className="w-4 h-4" />, label: 'FDA', color: '#3A7CB8' },
    { icon: <Award className="w-4 h-4" />, label: 'ISO 13485', color: '#F0C05A' },
  ];

  return (
    <footer role="contentinfo" className="text-white">
      {/* ==================== DECORATIVE TOP GRADIENT BORDER ==================== */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #1E3A5F, #F0C05A, #1E3A5F)' }} />

      {/* ==================== MAIN FOOTER ==================== */}
      <div className="dark:bg-[#0f1d2e] bg-[#1E3A5F] relative overflow-hidden">
        {/* Decorative tooth watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <svg width="400" height="400" viewBox="0 0 512 512" fill="currentColor" className="text-white" alt="" role="presentation">
            <path d="M256 0C167.6 0 96 71.6 96 160c0 52.7 25.8 99.4 65.5 128H144c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h32c17.7 0 32-14.3 32-32V336h96v176c0 17.7 14.3 32 32 32h32c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48h-17.5c39.7-28.6 65.5-75.3 65.5-128C416 71.6 344.4 0 256 0zm0 256c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z"/>
          </svg>
        </div>
        {/* Gradient background transition */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, transparent 60%, rgba(255,255,255,0.03) 100%)' }} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Column 1: Brand & Overview */}
            <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
              {/* Brand with prominent display */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base shadow-lg"
                  style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                >
                  ODG
                </div>
                <div>
                  <span className="text-xl font-bold block leading-tight">ODG</span>
                  <span className="text-[10px] text-blue-200/60 uppercase tracking-widest leading-none">Ouadah Dental Groupe</span>
                </div>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed mb-6">
                {t('footer.description')}
              </p>

              {/* Social Media Icons with hover animations */}
              <div>
                <h4 className="text-[#F0C05A] font-semibold text-xs uppercase tracking-wider mb-3">
                  {t('footer.social')}
                </h4>
                <div className="flex items-center gap-2">
                  {socialLinks.map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300"
                      whileHover={{
                        scale: 1.15,
                        backgroundColor: social.color,
                      }}
                      whileTap={{ scale: 0.9 }}
                      title={social.label}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                  {/* WhatsApp */}
                  <motion.a
                    href={`https://wa.me/${contactInfo.phone?.replace(/\s/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300"
                    whileHover={{ scale: 1.15, backgroundColor: '#25D366' }}
                    whileTap={{ scale: 0.9 }}
                    title="WhatsApp"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Column 2: Quick Links - Enhanced */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.quickLinks')}
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, i) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-blue-200 hover:text-white text-sm transition-all duration-200 flex items-center gap-2 group w-full"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F0C05A]/40 group-hover:bg-[#F0C05A] transition-colors duration-200 shrink-0" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0" style={{ color: '#F0C05A' }} />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Legal links */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <ul className="space-y-2">
                  {legalLinks.map((link) => (
                    <li key={link.path}>
                      <button
                        onClick={() => navigate(link.path)}
                        className="text-blue-200/80 hover:text-white text-xs transition-colors"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Column 3: Contact with WhatsApp */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.contact')}
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <a href={`tel:${contactInfo.phone?.replace(/\s/g, '')}`} className="hover:text-white transition-colors" dir="ltr">{contactInfo.phone}</a>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Mail className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors">{contactInfo.email}</a>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span>{contactInfo.address?.fr}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span>{language === 'ar' ? 'الأحد - الخميس: 8:00 - 17:00' : 'Dim - Jeu : 8h00 - 17h00'}</span>
                </li>
              </ul>

              {/* WhatsApp Direct Link Button */}
              <motion.a
                href={`https://wa.me/${contactInfo.phone?.replace(/\s/g, '')}?text=${encodeURIComponent(language === 'ar' ? 'مرحباً، أرغب في الاستفسار عن منتجاتكم' : 'Bonjour, je souhaite me renseigner sur vos produits')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 group w-fit"
                style={{ backgroundColor: 'rgba(37,211,102,0.15)', color: '#25D366' }}
                whileHover={{ scale: 1.03, backgroundColor: 'rgba(37,211,102,0.25)' }}
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span>{language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Direct'}</span>
              </motion.a>
            </motion.div>

            {/* Column 4: Newsletter - Enhanced */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
                <MailOpen className="w-4 h-4" />
                {t('footer.newsletter.title')}
              </h3>
              <p className="text-blue-200 text-sm mb-4 leading-relaxed">
                {language === 'ar' ? 'اشترك ليصلك كل جديد وعروضنا الحصرية' : 'Recevez nos offres exclusives et nouveautés'}
              </p>

              <AnimatePresence mode="wait">
                {footerSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="flex items-center gap-2 py-3 px-4 rounded-lg"
                    style={{ backgroundColor: 'rgba(240,192,90,0.15)' }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 shrink-0" style={{ color: '#F0C05A' }} />
                    </motion.div>
                    <span className="text-white text-xs font-medium">{t('newsletter.success')}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <form onSubmit={handleFooterSubscribe} className="space-y-2">
                      <Input
                        type="email"
                        required
                        placeholder={t('newsletter.placeholder')}
                        value={footerEmail}
                        onChange={(e) => setFooterEmail(e.target.value)}
                        className="h-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 text-sm focus:border-[#F0C05A] focus:ring-[#F0C05A]/20"
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          disabled={footerLoading}
                          className="w-full h-10 font-semibold text-sm transition-all duration-300 hover:shadow-lg"
                          style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                        >
                          {footerLoading ? '...' : t('newsletter.subscribe')}
                          {!footerLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-blue-200/30 text-[10px] mt-3 leading-relaxed">
                {t('newsletter.privacy')}
              </p>
            </motion.div>

            {/* Column 5: Nos Engagements */}
            <motion.div variants={itemVariants}>
              <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-5">
                {t('footer.commitments')}
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Truck className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span className="group-hover:text-white transition-colors">{t('footer.commitments.delivery')}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Wrench className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span className="group-hover:text-white transition-colors">{t('footer.commitments.installation')}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span className="group-hover:text-white transition-colors">{t('footer.commitments.sav')}</span>
                </li>
                <li className="flex items-start gap-3 text-blue-200 text-sm group">
                  <Shield className="w-4 h-4 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" style={{ color: '#F0C05A' }} />
                  <span className="group-hover:text-white transition-colors">{t('footer.commitments.warranty')}</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </motion.div>

        {/* Gold line above certification row */}
        <div className="h-px mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto" style={{ backgroundColor: '#F0C05A', opacity: 0.3 }} />

        {/* Certification Badges Row - Enhanced with icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h4 className="text-[#F0C05A] font-semibold text-xs uppercase tracking-wider">
              {t('footer.certifications')}
            </h4>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {certificationBadges.map((cert) => (
                <motion.span
                  key={cert.label}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide border border-white/15 hover:border-[#F0C05A]/50 transition-all duration-300 cursor-default"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(240,192,90,0.1)' }}
                >
                  <span style={{ color: cert.color }}>{cert.icon}</span>
                  <span className="text-blue-100">{cert.label}</span>
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div className="h-px mx-4 sm:mx-6 lg:mx-8 max-w-7xl lg:mx-auto bg-white/10" />

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-200/80">
            <p>
              &copy; {new Date().getFullYear()} ODG - OUADAH DENTAL GROUPE. {t('footer.rights')}
            </p>
            <p className="flex items-center gap-1">
              Fait avec <Heart className="w-3 h-3 text-red-400 inline" fill="currentColor" /> en Algérie 🇩🇿
            </p>
          </div>
        </div>

        {/* Back to Top - Enhanced with animated arrow */}
        <div className="border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group flex items-center gap-2 text-white/50 hover:text-[#F0C05A] text-xs transition-colors duration-300 py-2 px-4 rounded-full hover:bg-white/5"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowUp className="w-4 h-4" />
              </motion.span>
              {t('footer.backToTop')}
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
