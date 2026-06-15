'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';

export default function Footer() {
  const { t, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { contactInfo } = useData();

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
    <footer
      className="text-white"
      style={{ backgroundColor: '#1E3A5F' }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
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
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contactInfo.social?.instagram && (
                <a
                  href={contactInfo.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contactInfo.social?.linkedin && (
                <a
                  href={contactInfo.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#F0C05A] hover:text-[#1E3A5F] transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span dir="ltr">{contactInfo.phone}</span>
              </li>
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{contactInfo.email}</span>
              </li>
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{contactInfo.address?.fr}</span>
              </li>
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-[#F0C05A] font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-blue-200 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-blue-200"
        >
          <p>
            &copy; {new Date().getFullYear()} ODG - OUADAH DENTAL GROUPE. {t('footer.rights')}
          </p>
          <p>
            {t('footer.madeWith')} ❤️ {t('footer.in')} {t('footer.algeria')} 🇩🇿
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
