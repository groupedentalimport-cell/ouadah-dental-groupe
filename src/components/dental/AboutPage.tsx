'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  MapPin,
  Lightbulb,
  Heart,
  Users,
  Globe,
  Clock,
  Target,
  Shield,
  BadgeCheck,
  FileCheck,
  TrendingUp,
  Building2,
  Headphones,
  Wrench,
  GraduationCap,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const { t, isRTL } = useTranslation();

  const values = [
    {
      icon: <Award className="w-7 h-7" />,
      title: t('about.values.excellence'),
      desc: t('about.values.excellence.text'),
      color: '#1E3A5F',
    },
    {
      icon: <MapPin className="w-7 h-7" />,
      title: t('about.values.proximity'),
      desc: t('about.values.proximity.text'),
      color: '#2A5F8F',
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      title: t('about.values.innovation'),
      desc: t('about.values.innovation.text'),
      color: '#3A7CB8',
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: t('about.values.trust'),
      desc: t('about.values.trust.text'),
      color: '#F0C05A',
    },
  ];

  const milestones = [
    { year: '2009', title: t('about.milestones.2009'), desc: t('about.milestones.2009.desc') },
    { year: '2012', title: t('about.milestones.2012'), desc: t('about.milestones.2012.desc') },
    { year: '2015', title: t('about.milestones.2015'), desc: t('about.milestones.2015.desc') },
    { year: '2018', title: t('about.milestones.2018'), desc: t('about.milestones.2018.desc') },
    { year: '2021', title: t('about.milestones.2021'), desc: t('about.milestones.2021.desc') },
    { year: '2024', title: t('about.milestones.2024'), desc: t('about.milestones.2024.desc') },
  ];

  const keyFigures = [
    { icon: <Building2 className="w-6 h-6" />, value: '500+', label: t('stats.clinics') },
    { icon: <Globe className="w-6 h-6" />, value: '48', label: t('stats.wilayas') },
    { icon: <TrendingUp className="w-6 h-6" />, value: '15+', label: t('stats.brands') },
    { icon: <Headphones className="w-6 h-6" />, value: '48h', label: t('stats.sav') },
  ];

  const certifications = [
    {
      icon: <Shield className="w-8 h-8" />,
      name: t('about.certifications.iso'),
      desc: t('about.certifications.iso.desc'),
      color: '#1E3A5F',
    },
    {
      icon: <BadgeCheck className="w-8 h-8" />,
      name: t('about.certifications.ce'),
      desc: t('about.certifications.ce.desc'),
      color: '#2A5F8F',
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      name: t('about.certifications.fda'),
      desc: t('about.certifications.fda.desc'),
      color: '#F0C05A',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Gradient Header Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative elements */}
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
          {/* Floating dots */}
          <motion.div
            className="absolute top-10 right-1/4 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#F0C05A' }}
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 left-1/4 w-3 h-3 rounded-full"
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
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 gradient-border-animated inline-block px-6 py-2">
              {t('about.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <Card className="glass border-0 shadow-sm overflow-hidden">
            <div className="h-1" style={{ backgroundColor: '#F0C05A' }} />
            <CardContent className="p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E3A5F' }}>
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                  {t('about.history')}
                </h2>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>{t('about.history.p1')}</p>
                <p>{t('about.history.p2')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="h-1 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: '#F0C05A' }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
              {t('about.mission')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic">
              &ldquo;{t('about.mission.text')}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Timeline / Milestones Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
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
              {t('about.milestones.title')}
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#1E3A5F] via-[#2A5F8F] to-[#F0C05A] sm:-translate-x-0.5" />

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  variants={itemVariants}
                  className={`relative flex items-start gap-6 sm:gap-0 ${
                    i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                  }`}
                >
                  {/* Dot on timeline */}
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 rounded-full border-4 border-white shadow-md -translate-x-2 sm:-translate-x-2 z-10" style={{ backgroundColor: '#F0C05A' }} />

                  {/* Content */}
                  <div className={`ml-12 sm:ml-0 sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 sm:text-left'}`}>
                    <motion.div
                      whileHover={{ y: -3 }}
                      className="bg-white dark:bg-[#162236] rounded-xl p-5 shadow-sm dark:shadow-none hover:shadow-lg dark:hover:shadow-black/20 transition-shadow duration-300"
                    >
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-bold text-white mb-2" style={{ backgroundColor: '#1E3A5F' }}>
                        {milestone.year}
                      </span>
                      <h3 className="font-bold text-base mb-1 dark:text-white" style={{ color: '#1E3A5F' }}>
                        {milestone.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
                        {milestone.desc}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Figures Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
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
              {t('about.figures.title')}
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {keyFigures.map((fig, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 text-center h-full card-lift">
                  <CardContent className="p-6">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 text-white shadow-md"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {fig.icon}
                    </div>
                    <div className="text-3xl sm:text-4xl font-bold mb-1 dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                      {fig.value}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-300">{fig.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-16"
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
              {t('about.values')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 text-center h-full overflow-hidden card-lift">
                    <div className="h-1.5" style={{ backgroundColor: value.color }} />
                    <CardContent className="p-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-md"
                        style={{ backgroundColor: value.color }}
                      >
                        {value.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2 dark:text-white" style={{ color: '#1E3A5F' }}>
                        {value.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">{value.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team / Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <Card className="border-0 shadow-sm overflow-hidden" style={{ backgroundColor: '#1E3A5F' }}>
            <div className="h-1" style={{ backgroundColor: '#F0C05A' }} />
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { icon: <Wrench className="w-6 h-6" />, value: '30+', label: isRTL ? 'فني معتمد' : 'Techniciens certifiés' },
                  { icon: <GraduationCap className="w-6 h-6" />, value: '200+', label: isRTL ? 'جلسة تكوينية/سنة' : 'Formations/an' },
                  { icon: <Users className="w-6 h-6" />, value: '50+', label: isRTL ? 'موظف متفاني' : 'Collaborateurs' },
                  { icon: <Award className="w-6 h-6" />, value: '15+', label: isRTL ? 'سنة من الخبرة' : "Ans d'expérience" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                      {item.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{item.value}</div>
                    <div className="text-blue-200 text-sm">{item.label}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
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
              {t('about.certifications.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 text-center h-full overflow-hidden card-lift">
                    <div className="h-1.5" style={{ backgroundColor: cert.color }} />
                    <CardContent className="p-6">
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md"
                        style={{ backgroundColor: `${cert.color}15`, color: cert.color }}
                      >
                        {cert.icon}
                      </div>
                      <h3 className="font-bold text-base mb-2 dark:text-white" style={{ color: '#1E3A5F' }}>
                        {cert.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">{cert.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
