'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, MapPin, Lightbulb, Heart, Users, Globe, Clock, Target } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const { t, isRTL } = useTranslation();

  const values = [
    {
      icon: <Award className="w-8 h-8" />,
      title: t('about.values.excellence'),
      desc: t('about.values.excellence.text'),
      color: '#1E3A5F',
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: t('about.values.proximity'),
      desc: t('about.values.proximity.text'),
      color: '#2d5a8e',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: t('about.values.innovation'),
      desc: t('about.values.innovation.text'),
      color: '#3b7dd8',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('about.values.trust'),
      desc: t('about.values.trust.text'),
      color: '#F0C05A',
    },
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '500+', label: t('stats.clinics') },
    { icon: <Globe className="w-6 h-6" />, value: '48', label: t('stats.wilayas') },
    { icon: <Clock className="w-6 h-6" />, value: '15+', label: t('stats.brands') },
    { icon: <Target className="w-6 h-6" />, value: '48h', label: t('stats.sav') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('about.title')}
            </h1>
            <p className="text-blue-200">{t('about.subtitle')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* History Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
                {t('about.history')}
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('about.history.p1')}</p>
                <p>{t('about.history.p2')}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
              {t('about.mission')}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed italic">
              &ldquo;{t('about.mission.text')}&rdquo;
            </p>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: '#1E3A5F' }}>
            {t('about.values')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow text-center h-full">
                  <CardContent className="p-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white"
                      style={{ backgroundColor: value.color }}
                    >
                      {value.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ color: '#1E3A5F' }}>
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 shadow-sm" style={{ backgroundColor: '#1E3A5F' }}>
            <CardContent className="p-8 sm:p-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}>
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
