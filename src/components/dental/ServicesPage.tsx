'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Building2,
  CreditCard,
  Phone,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  ClipboardList,
  Settings,
  UserCheck,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  const { t, isRTL, language } = useTranslation();
  const { navigate } = useRouter();

  const services = [
    {
      icon: <Wrench className="w-7 h-7" />,
      title: t('services.installation'),
      desc:
        language === 'ar'
          ? 'تركيب احترافي بواسطة فنيين معتمدين. يشمل الإعداد والمعايرة والاختبار والتشغيل الأول لجميع المعدات.'
          : 'Installation professionnelle par nos techniciens certifiés. Inclut la mise en service, le calibrage, les tests de fonctionnement et la mise en route initiale de tous vos équipements.',
      color: '#1E3A5F',
      features:
        language === 'ar'
          ? ['إعداد المعدات', 'معايرة دقيقة', 'اختبار التشغيل', 'ضمان الرضا']
          : ['Mise en service complète', 'Calibrage de précision', 'Tests de fonctionnement', 'Garantie satisfaction'],
    },
    {
      icon: <GraduationCap className="w-7 h-7" />,
      title: t('services.training'),
      desc:
        language === 'ar'
          ? 'تدريب الموظفين في عيادتك. جلسات تدريب عملية، أدوات تشغيل، وأفضل الممارسات للاستخدام الأمثل.'
          : 'Formation de votre personnel directement dans votre cabinet. Sessions de formation pratiques, manuels d\'utilisation et bonnes pratiques pour une utilisation optimale.',
      color: '#2A5F8F',
      features:
        language === 'ar'
          ? ['تدريب في العيادة', 'جلسات عملية', 'أدلة تشغيل', 'أفضل الممارسات']
          : ['Formation sur site', 'Sessions pratiques', 'Manuels d\'utilisation', 'Bonnes pratiques'],
    },
    {
      icon: <Headphones className="w-7 h-7" />,
      title: t('services.sav'),
      desc:
        language === 'ar'
          ? 'خدمة ما بعد البيع في أقل من 48 ساعة. دعم هاتفي، إصلاحات في الموقع، وتوفر قطع الغيار.'
          : 'Service après-vente en moins de 48h. Support téléphonique, interventions sur site, réparation et disponibilité des pièces détachées.',
      color: '#3A7CB8',
      features:
        language === 'ar'
          ? ['رد في 48 ساعة', 'دعم هاتفي', 'إصلاح في الموقع', 'قطع غيار متوفرة']
          : ['Réponse sous 48h', 'Support téléphonique', 'Réparation sur site', 'Pièces en stock'],
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: t('services.maintenance'),
      desc:
        language === 'ar'
          ? 'برامج صيانة وقائية لإطالة عمر معداتك. صيانة سنوية، فحوصات منتظمة، وتحديثات.'
          : 'Programmes de maintenance préventive pour prolonger la durée de vie de vos équipements. Entretien annuel, contrôles réguliers et mises à jour.',
      color: '#3B8C6E',
      features:
        language === 'ar'
          ? ['صيانة سنوية', 'فحوصات منتظمة', 'تحديثات', 'إطالة العمر الافتراضي']
          : ['Entretien annuel', 'Contrôles réguliers', 'Mises à jour', 'Longévité équipement'],
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: t('services.design'),
      desc:
        language === 'ar'
          ? 'استشارة تصميم وتخطيط العيادة. تحسين ترتيب المعدات وتوزيع المساحات لكفاءة قصوى.'
          : 'Conception et aménagement de votre cabinet dentaire. Optimisation de l\'agencement des équipements et de la distribution des espaces pour une efficacité maximale.',
      color: '#C0564F',
      features:
        language === 'ar'
          ? ['تصميم مخصص', 'تحسين المساحة', 'توزيع المعدات', 'كفاءة قصوى']
          : ['Design sur mesure', 'Optimisation espace', 'Agencement équipement', 'Efficacité maximale'],
    },
    {
      icon: <CreditCard className="w-7 h-7" />,
      title: t('services.financing'),
      desc:
        language === 'ar'
          ? 'خيارات تمويل مرنة لشراء معداتك. خطط دفع، خيارات تأجير، وحلول مالية مخصصة.'
          : 'Options de financement flexibles pour l\'acquisition de vos équipements. Plans de paiement échelonnés, options de leasing et solutions financières adaptées.',
      color: '#F0C05A',
      features:
        language === 'ar'
          ? ['دفعات مقسطة', 'خيارات تأجير', 'حلول مالية', 'أسعار تنافسية']
          : ['Paiement échelonné', 'Options de leasing', 'Solutions adaptées', 'Taux compétitifs'],
    },
  ];

  const processSteps = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: language === 'ar' ? 'استشارة' : 'Consultation',
      desc:
        language === 'ar'
          ? 'نناقش احتياجاتك ونحلل متطلباتك'
          : 'Nous discutons de vos besoins et analysons vos exigences',
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: language === 'ar' ? 'عرض سعر' : 'Devis',
      desc:
        language === 'ar'
          ? 'نقدم لك عرض سعر مفصل ومخصص'
          : 'Nous vous proposons un devis détaillé et personnalisé',
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: language === 'ar' ? 'تركيب' : 'Installation',
      desc:
        language === 'ar'
          ? 'فنيونا يقومون بالتركيب والمعايرة'
          : 'Nos techniciens installent et calibrent vos équipements',
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: language === 'ar' ? 'تكوين وخدمة' : 'Formation & SAV',
      desc:
        language === 'ar'
          ? 'تدريب فريقك وضمان خدمة مستمرة'
          : 'Formation de votre équipe et service après-vente continu',
    },
  ];

  const guarantees = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      text:
        language === 'ar'
          ? 'تركيب مضمون 100% رضا'
          : 'Installation garantie 100% satisfaction',
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      text: language === 'ar' ? 'فنيون معتمدون' : 'Techniciens certifiés',
    },
    {
      icon: <Wrench className="w-5 h-5" />,
      text:
        language === 'ar'
          ? 'قطع غيار في المخزون'
          : 'Pièces détachées en stock',
    },
    {
      icon: <Phone className="w-5 h-5" />,
      text:
        language === 'ar'
          ? 'دعم هاتفي 6 أيام / 7'
          : 'Support téléphonique 6j/7',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ backgroundColor: '#F0C05A' }}
          />
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
              {t('services.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Service Cards Grid */}
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
            <h2
              className="text-2xl sm:text-3xl font-bold dark:text-[#7AB0E0]"
              style={{ color: '#1E3A5F' }}
            >
              {language === 'ar' ? 'خدماتنا المتكاملة' : 'Nos Services Intégrés'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div whileHover={{ y: -5 }} className="h-full">
                  <Card className="border-0 shadow-sm hover:shadow-xl transition-all duration-300 h-full overflow-hidden card-lift">
                    <div className="h-1.5" style={{ backgroundColor: service.color }} />
                    <CardContent className="p-6">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-white shadow-md"
                        style={{ backgroundColor: service.color }}
                      >
                        {service.icon}
                      </div>
                      <h3
                        className="font-bold text-lg mb-2 dark:text-white"
                        style={{ color: '#1E3A5F' }}
                      >
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed mb-4">
                        {service.desc}
                      </p>
                      <ul className="space-y-2">
                        {service.features.map((feature, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: service.color }}
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Service Process Timeline */}
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
            <h2
              className="text-2xl sm:text-3xl font-bold dark:text-[#7AB0E0]"
              style={{ color: '#1E3A5F' }}
            >
              {language === 'ar' ? 'كيف نعمل' : 'Notre Processus'}
            </h2>
          </div>

          {/* Horizontal Timeline - Desktop */}
          <div className="hidden sm:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Connecting line */}
              <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200 dark:bg-white/10" />
              <motion.div
                className="absolute top-10 left-0 h-0.5"
                style={{ backgroundColor: '#1E3A5F' }}
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.3 }}
              />

              <div className="flex justify-between relative">
                {processSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2, duration: 0.5 }}
                    className="flex flex-col items-center text-center"
                    style={{ width: '25%' }}
                  >
                    {/* Step circle */}
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg mb-4 relative z-10"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {step.icon}
                      <span
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                      >
                        {i + 1}
                      </span>
                    </div>
                    <h4
                      className="font-bold text-sm mb-1 dark:text-white"
                      style={{ color: '#1E3A5F' }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed px-2">
                      {step.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Timeline - Mobile */}
          <div className="sm:hidden max-w-sm mx-auto">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
              <motion.div
                className="absolute left-6 top-0 w-0.5"
                style={{ backgroundColor: '#1E3A5F' }}
                initial={{ height: '0%' }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />

              <div className="space-y-8">
                {processSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex items-start gap-4 relative"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md shrink-0 relative z-10"
                      style={{ backgroundColor: '#1E3A5F' }}
                    >
                      {step.icon}
                    </div>
                    <div className="pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                        >
                          {i + 1}
                        </span>
                        <h4
                          className="font-bold text-sm dark:text-white"
                          style={{ color: '#1E3A5F' }}
                        >
                          {step.title}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Guarantee Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <Card
            className="border-0 shadow-sm overflow-hidden"
            style={{ backgroundColor: '#1E3A5F' }}
          >
            <div className="h-1" style={{ backgroundColor: '#F0C05A' }} />
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {language === 'ar' ? 'ضماناتنا' : 'Nos Garanties'}
                </h2>
                <p className="text-blue-200 text-sm">
                  {language === 'ar'
                    ? 'التزامنا تجاه رضاكم'
                    : 'Notre engagement envers votre satisfaction'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {guarantees.map((guarantee, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="text-center"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: '#F0C05A', color: '#1E3A5F' }}
                    >
                      {guarantee.icon}
                    </div>
                    <p className="text-white text-sm font-medium">{guarantee.text}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="border-0 shadow-sm overflow-hidden">
            <div className="h-1" style={{ backgroundColor: '#F0C05A' }} />
            <CardContent className="p-8 sm:p-12 text-center">
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3 dark:text-[#7AB0E0]"
                style={{ color: '#1E3A5F' }}
              >
                {language === 'ar' ? 'هل تحتاج إلى خدمة؟' : "Besoin d'un service ?"}
              </h2>
              <p className="text-gray-500 dark:text-gray-300 mb-6 max-w-lg mx-auto">
                {language === 'ar'
                  ? 'تواصل معنا للحصول على عرض سعر مخصص أو لمناقشة احتياجاتك'
                  : 'Contactez-nous pour obtenir un devis personnalisé ou discuter de vos besoins'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={() => navigate('/devis')}
                    className="h-12 px-8 font-semibold text-base text-white shadow-lg"
                    style={{ backgroundColor: '#1E3A5F' }}
                  >
                    <ArrowRight className={`w-4 h-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
                    {language === 'ar' ? 'طلب عرض سعر' : 'Demander un devis'}
                  </Button>
                </motion.div>
                <motion.a
                  href="tel:+213555123456"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200"
                  style={{ backgroundColor: '#3B8C6E10', color: '#3B8C6E' }}
                >
                  <Phone className="w-4 h-4" />
                  +213 555 123 456
                </motion.a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
