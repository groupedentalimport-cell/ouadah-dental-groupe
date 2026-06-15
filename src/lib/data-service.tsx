'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useTranslation } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

// ============================================================
// Types
// ============================================================
export interface Category {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  icon: string;
  image: string;
  sort_order: number;
}

export interface Product {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  short_description_fr: string;
  short_description_ar: string;
  category_id: string;
  price: number;
  images: string[];
  specs: Record<string, string>[];
  features_fr: string[];
  features_ar: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_best_seller: boolean;
  brand: string;
  origin: string;
  warranty: string;
  delivery_time_fr: string;
  delivery_time_ar: string;
  installation_included: boolean;
  training_included: boolean;
  ref: string;
  target: string[];
  pdf_url: string;
  brochure_pdf: string;
  videos: { title_fr: string; title_ar: string; url: string; type: string }[];
  rating?: number;
  reviewCount?: number;
  created_at: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_fr: string;
  title_ar: string;
  excerpt_fr: string;
  excerpt_ar: string;
  content_fr: string;
  content_ar: string;
  image: string;
  author: string;
  date: string;
  read_time: number;
  tags: string[];
  category: string;
  created_at: string;
}

export interface ContactInfo {
  address: { fr: string; ar: string };
  phone: string;
  whatsapp: string;
  email: string;
  fax: string;
  hours: { fr: string; ar: string };
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
}

export interface QuoteSubmission {
  nom: string;
  email: string;
  telephone: string;
  wilaya: string;
  type_client: string;
  produits_selectionnes: { id: string; slug: string; name: string; quantity: number }[];
  message: string;
}

// ============================================================
// Default / Fallback Data
// ============================================================
const defaultContactInfo: ContactInfo = {
  address: {
    fr: 'Coopérative Azzouz Abdelkader, N°45, Commune d\'Es-Senia, Oran, Algérie',
    ar: 'تعاونية عزوز عبد القادر، رقم 45، بلدية السانية، وهران، الجزائر',
  },
  phone: '+213 771 88 89 48',
  whatsapp: '+213771888948',
  email: 'groupedentalimport@gmail.com',
  fax: '041 28 28 55',
  hours: {
    fr: 'Dimanche - Jeudi : 8h00 - 17h00',
    ar: 'الأحد - الخميس: 8:00 - 17:00',
  },
  social: {
    facebook: 'https://facebook.com/odg.algeria',
    instagram: 'https://instagram.com/odg.algeria',
    linkedin: 'https://linkedin.com/company/odg-algeria',
    youtube: '',
  },
};

// Default categories when Supabase is not available
const defaultCategories: Category[] = [
  {
    id: '1',
    slug: 'fauteuils',
    name_fr: 'Fauteuils Dentaires',
    name_ar: 'كراسي طب الأسنان',
    description_fr: 'Fauteuils dentaires de dernière génération avec ergonomie avancée',
    description_ar: 'كراسي أسنان من الجيل الأخير مع تصميم مريح متقدم',
    icon: 'Armchair',
    image: '/categories/fauteuils.jpg',
    sort_order: 1,
  },
  {
    id: '2',
    slug: 'unites',
    name_fr: 'Unités Dentaires',
    name_ar: 'وحدات طب الأسنان',
    description_fr: 'Unités dentaires complètes pour cabinet dentaire moderne',
    description_ar: 'وحدات أسنان كاملة لعيادة أسنان حديثة',
    icon: 'Monitor',
    image: '/categories/unites.jpg',
    sort_order: 2,
  },
  {
    id: '3',
    slug: 'radiologie',
    name_fr: 'Radiologie',
    name_ar: 'الأشعة',
    description_fr: 'Équipements de radiologie dentaire numérique et conventionnelle',
    description_ar: 'معدات أشعة الأسنان الرقمية والتقليدية',
    icon: 'Scan',
    image: '/categories/radiologie.jpg',
    sort_order: 3,
  },
  {
    id: '4',
    slug: 'sterilisation',
    name_fr: 'Stérilisation',
    name_ar: 'التعقيم',
    description_fr: 'Autoclaves et équipements de stérilisation professionnels',
    description_ar: 'أوتوكلاف ومعدات تعقيم احترافية',
    icon: 'Shield',
    image: '/categories/sterilisation.jpg',
    sort_order: 4,
  },
  {
    id: '5',
    slug: 'pneumatiques',
    name_fr: 'Pneumatiques',
    name_ar: 'الهوائية',
    description_fr: 'Compresseurs et équipements pneumatiques dentaires',
    description_ar: 'ضواغط ومعدات هوائية لطب الأسنان',
    icon: 'Wind',
    image: '/categories/pneumatiques.jpg',
    sort_order: 5,
  },
  {
    id: '6',
    slug: 'consommables',
    name_fr: 'Consommables',
    name_ar: 'المستهلكات',
    description_fr: 'Consommables et matériaux dentaires de qualité',
    description_ar: 'مواد ومستهلكات طب الأسنان عالية الجودة',
    icon: 'Package',
    image: '/categories/consommables.jpg',
    sort_order: 6,
  },
  {
    id: '7',
    slug: 'instruments',
    name_fr: 'Instruments',
    name_ar: 'الأدوات',
    description_fr: 'Instruments dentaires de précision',
    description_ar: 'أدوات أسنان دقيقة',
    icon: 'Wrench',
    image: '/categories/instruments.jpg',
    sort_order: 7,
  },
  {
    id: '8',
    slug: 'mobilier',
    name_fr: 'Mobilier',
    name_ar: 'الأثاث',
    description_fr: 'Mobilier de cabinet dentaire ergonomique',
    description_ar: 'أثاث عيادة أسنان مريح',
    icon: 'Lamp',
    image: '/categories/mobilier.jpg',
    sort_order: 8,
  },
];

// Default featured products for when Supabase is not available
const defaultProducts: Product[] = [
  {
    id: '1',
    slug: 'fauteuil-dental-elite-pro',
    name_fr: 'Fauteuil Dentaire Elite Pro',
    name_ar: 'كرسي أسنان إيليت برو',
    description_fr: '<p>Le fauteuil dentaire Elite Pro offre un confort exceptionnel pour le praticien et le patient. Doté de la dernière technologie en matière d\'ergonomie et de contrôle, il représente le choix idéal pour les cabinets dentaires modernes.</p><h3>Caractéristiques principales</h3><ul><li>Positionnement automatique du patient</li><li>Écran tactile intégré</li><li>Éclairage LED haute performance</li><li>Système d\'aspiration silencieux</li></ul>',
    description_ar: '<p>كرسي أسنان إيليت برو يوفر راحة استثنائية للطبيب والمريض. مجهز بأحدث التكنولوجيا في مجال الراحة والتحكم، يمثل الخيار المثالي لعيادات الأسنان الحديثة.</p>',
    short_description_fr: 'Fauteuil dentaire haut de gamme avec écran tactile et positionnement automatique',
    short_description_ar: 'كرسي أسنان فاخر بشاشة لمس ووضعية تلقائية',
    category_id: '1',
    price: 3500000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
      { label_fr: 'Poids', label_ar: 'الوزن', value: '180 kg' },
      { label_fr: 'Dimensions', label_ar: 'الأبعاد', value: '200 x 80 x 140 cm' },
      { label_fr: 'Angle d\'inclinaison', label_ar: 'زاوية الميل', value: '-10° à 80°' },
    ],
    features_fr: ['Écran tactile 7 pouces', 'Positionnement automatique', 'Éclairage LED', 'Aspiration silencieuse', 'Garantie 5 ans'],
    features_ar: ['شاشة لمس 7 بوصة', 'وضعية تلقائية', 'إضاءة LED', 'شفط صامت', 'ضمان 5 سنوات'],
    in_stock: true,
    is_featured: true,
    is_new: true,
    is_best_seller: true,
    brand: 'ODG Elite',
    origin: 'Corée du Sud',
    warranty: '5 ans',
    delivery_time_fr: '2-4 semaines',
    delivery_time_ar: '2-4 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'FDE-001',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [
      { title_fr: 'Présentation du Fauteuil Elite Pro', title_ar: 'عرض كرسي إيليت برو', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'youtube' },
      { title_fr: 'Démonstration et fonctionnalités', title_ar: 'عرض توضيحي والميزات', url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', type: 'youtube' },
    ],
    rating: 4.8,
    reviewCount: 124,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'unite-dentaire-smart-touch',
    name_fr: 'Unité Dentaire Smart Touch',
    name_ar: 'وحدة أسنان سمارت تاتش',
    description_fr: '<p>L\'unité dentaire Smart Touch combine technologie de pointe et design élégant. Son interface intuitive permet un contrôle précis de tous les paramètres de traitement.</p>',
    description_ar: '<p>وحدة أسنان سمارت تاتش تجمع بين أحدث التكنولوجيا والتصميم الأنيق. واجهتها البديهية تسمح بالتحكم الدقيق في جميع معلمات العلاج.</p>',
    short_description_fr: 'Unité dentaire nouvelle génération avec interface tactile intuitive',
    short_description_ar: 'وحدة أسنان من الجيل الجديد بواجهة لمس بديهية',
    category_id: '2',
    price: 4200000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
      { label_fr: 'Syringe', label_ar: 'حقنة', value: '3 voies' },
      { label_fr: 'Turbine', label_ar: 'توربين', value: '2 connecteurs' },
    ],
    features_fr: ['Interface tactile', '4 connectiques', 'Spittoon céramique', 'Éclairage LED', 'Garantie 3 ans'],
    features_ar: ['واجهة لمس', '4 وصلات', 'بصاق خزفي', 'إضاءة LED', 'ضمان 3 سنوات'],
    in_stock: true,
    is_featured: true,
    is_new: false,
    is_best_seller: true,
    brand: 'SmartDent',
    origin: 'Chine',
    warranty: '3 ans',
    delivery_time_fr: '3-5 semaines',
    delivery_time_ar: '3-5 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'UDS-002',
    target: ['Clinique'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [
      { title_fr: 'Unité Dentaire Smart Touch - Vue d\'ensemble', title_ar: 'وحدة سمارت تاتش - نظرة عامة', url: 'https://www.youtube.com/watch?v=9bZkp7q19f0', type: 'youtube' },
    ],
    rating: 4.5,
    reviewCount: 89,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'radio-panoramique-digital-x',
    name_fr: 'Radio Panoramique Digital X',
    name_ar: 'أشعة بانورامية ديجيتال إكس',
    description_fr: '<p>Le radio panoramique Digital X offre une imagerie de haute qualité avec une exposition minimale aux rayons. Idéal pour les diagnostics précis et rapides.</p>',
    description_ar: '<p>الأشعة البانورامية ديجيتال إكس توفر تصويراً عالي الجودة بأقل تعرض للإشعاع. مثالية للتشخيص الدقيق والسريع.</p>',
    short_description_fr: 'Radio panoramique numérique haute résolution avec faible exposition',
    short_description_ar: 'أشعة بانورامية رقمية عالية الدقة مع تعرض منخفض',
    category_id: '3',
    price: 5800000,
    images: [],
    specs: [
      { label_fr: 'Résolution', label_ar: 'الدقة', value: '16 bit' },
      { label_fr: 'Tension', label_ar: 'الجهد', value: '60-90 kV' },
      { label_fr: 'Focale', label_ar: 'البؤرة', value: '0.5 mm' },
    ],
    features_fr: ['Haute résolution', 'Faible exposition', 'Logiciel 3D intégré', 'Capteur CCD', 'Garantie 2 ans'],
    features_ar: ['دقة عالية', 'تعرض منخفض', 'برنامج 3D مدمج', 'مستشعر CCD', 'ضمان سنتين'],
    in_stock: true,
    is_featured: true,
    is_new: true,
    is_best_seller: false,
    brand: 'DigiRay',
    origin: 'Italie',
    warranty: '2 ans',
    delivery_time_fr: '4-6 semaines',
    delivery_time_ar: '4-6 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'RPD-003',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.7,
    reviewCount: 56,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    slug: 'autoclave-class-b-pro',
    name_fr: 'Autoclave Classe B Pro',
    name_ar: 'أوتوكلاف كلاس برو',
    description_fr: '<p>L\'autoclave Classe B Pro garantit une stérilisation parfaite conforme aux normes internationales les plus strictes. Cycle rapide et traçabilité complète.</p>',
    description_ar: '<p>الأوتوكلاف كلاس برو يضمن تعقيماً مثالياً يتوافق مع أصرم المعايير الدولية. دورة سريعة وتتبع كامل.</p>',
    short_description_fr: 'Autoclave Classe B avec cycle rapide et traçabilité complète',
    short_description_ar: 'أوتوكلاف فئة ب مع دورة سريعة وتتبع كامل',
    category_id: '4',
    price: 1800000,
    images: [],
    specs: [
      { label_fr: 'Capacité', label_ar: 'السعة', value: '23 litres' },
      { label_fr: 'Température', label_ar: 'الحرارة', value: '121-134°C' },
      { label_fr: 'Cycle', label_ar: 'الدورة', value: '20-45 min' },
    ],
    features_fr: ['Classe B', 'Cycle rapide 20 min', 'Impression intégrée', 'Écran LCD', 'Garantie 2 ans'],
    features_ar: ['فئة ب', 'دورة سريعة 20 دقيقة', 'طباعة مدمجة', 'شاشة LCD', 'ضمان سنتين'],
    in_stock: true,
    is_featured: true,
    is_new: false,
    is_best_seller: true,
    brand: 'SterilPro',
    origin: 'Allemagne',
    warranty: '2 ans',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: true,
    training_included: false,
    ref: 'ACB-004',
    target: ['Clinique', 'Revendeur', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.6,
    reviewCount: 73,
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    slug: 'compresseur-silent-air',
    name_fr: 'Compresseur Silent Air',
    name_ar: 'ضاغط سايلنت إير',
    description_fr: '<p>Le compresseur Silent Air offre un débit d\'air exceptionnel avec un niveau sonore minimal. Parfait pour les cabinets requiring un environnement de travail silencieux.</p>',
    description_ar: '<p>ضاغط سايلنت إير يوفر تدفق هواء استثنائي مع مستوى ضوضاء أدنى. مثالي لعيادات الأسنان التي تتطلب بيئة عمل هادئة.</p>',
    short_description_fr: 'Compresseur dentaire silencieux avec débit d\'air haute performance',
    short_description_ar: 'ضاغط أسنان صامت مع تدفق هواء عالي الأداء',
    category_id: '5',
    price: 950000,
    images: [],
    specs: [
      { label_fr: 'Débit', label_ar: 'التدفق', value: '80 L/min' },
      { label_fr: 'Pression', label_ar: 'الضغط', value: '8 bar' },
      { label_fr: 'Niveau sonore', label_ar: 'مستوى الضوضاء', value: '< 45 dB' },
    ],
    features_fr: ['Ultra silencieux', 'Sans huile', 'Réservoir 50L', 'Double moteur', 'Garantie 2 ans'],
    features_ar: ['فائق الصمت', 'بدون زيت', 'خزان 50 لتر', 'محرك مزدوج', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    brand: 'AirTech',
    origin: 'France',
    warranty: '2 ans',
    delivery_time_fr: '1-2 semaines',
    delivery_time_ar: '1-2 أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'CSA-005',
    target: ['Clinique', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.3,
    reviewCount: 41,
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    slug: 'lampe-led-cure-pro',
    name_fr: 'Lampe LED Cure Pro',
    name_ar: 'مصباح LED كيور برو',
    description_fr: '<p>La lampe LED Cure Pro offre une polymérisation rapide et efficace pour tous les matériaux composites. Design ergonomique et légère.</p>',
    description_ar: '<p>مصباح LED كيور برو يوفر بلمرة سريعة وفعالة لجميع المواد المركبة. تصميم مريح وخفيف.</p>',
    short_description_fr: 'Lampe de polymérisation LED haute performance',
    short_description_ar: 'مصباح بلمرة LED عالي الأداء',
    category_id: '6',
    price: 45000,
    images: [],
    specs: [
      { label_fr: 'Longueur d\'onde', label_ar: 'طول الموجة', value: '420-480 nm' },
      { label_fr: 'Puissance', label_ar: 'القوة', value: '1200 mW/cm²' },
    ],
    features_fr: ['Polymerisation rapide', 'Sans fil', '3 modes', 'Écran LCD', 'Garantie 1 an'],
    features_ar: ['بلمرة سريعة', 'بدون سلك', '3 أوضاع', 'شاشة LCD', 'ضمان سنة'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: true,
    brand: 'CureMax',
    origin: 'Brésil',
    warranty: '1 an',
    delivery_time_fr: '1 semaine',
    delivery_time_ar: 'أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'LLC-006',
    target: ['Clinique', 'Revendeur', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.2,
    reviewCount: 67,
    created_at: new Date().toISOString(),
  },
  // ---- Additional Products for Richer Demo ----
  {
    id: '7',
    slug: 'fauteuil-dentaire-economique',
    name_fr: 'Fauteuil Dentaire Économique',
    name_ar: 'كرسي أسنان اقتصادي',
    description_fr: '<p>Le fauteuil dentaire Économique offre un excellent rapport qualité-prix pour les cabinets débutants ou les petites structures. Confortable et fiable, il répond à tous les besoins de base.</p>',
    description_ar: '<p>كرسي الأسنان الاقتصادي يوفر قيمة ممتازة مقابل السعر للعيادات الناشئة أو الهياكل الصغيرة. مريح وموثوق، يلبي جميع الاحتياجات الأساسية.</p>',
    short_description_fr: 'Fauteuil dentaire entry-level, abordable et fiable pour petits cabinets',
    short_description_ar: 'كرسي أسنان دخلي، اقتصادي وموثوق للعيادات الصغيرة',
    category_id: '1',
    price: 1800000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
      { label_fr: 'Poids', label_ar: 'الوزن', value: '140 kg' },
      { label_fr: 'Angle d\'inclinaison', label_ar: 'زاوية الميل', value: '-5° à 75°' },
    ],
    features_fr: ['Prix abordable', 'Confort de base', 'Commandes manuelles', 'Entretien facile', 'Garantie 2 ans'],
    features_ar: ['سعر اقتصادي', 'راحة أساسية', 'تحكم يدوي', 'صيانة سهلة', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: true,
    brand: 'DentaBase',
    origin: 'Chine',
    warranty: '2 ans',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: true,
    training_included: false,
    ref: 'FDE-007',
    target: ['Clinique', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 3.9,
    reviewCount: 38,
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    slug: 'unite-dentaire-compacte',
    name_fr: 'Unité Dentaire Compacte',
    name_ar: 'وحدة أسنان مدمجة',
    description_fr: '<p>L\'unité dentaire Compacte est conçue pour les petits cabinets avec un espace limité. Son design compact n\'en fait pas compromettre sur la fonctionnalité et le confort.</p>',
    description_ar: '<p>وحدة الأسنان المدمجة مصممة للعيادات الصغيرة ذات المساحة المحدودة. تصميمها المدمج لا يتنازل عن الوظائف والراحة.</p>',
    short_description_fr: 'Unité dentaire compacte idéale pour les petits espaces',
    short_description_ar: 'وحدة أسنان مدمجة مثالية للمساحات الصغيرة',
    category_id: '2',
    price: 2800000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
      { label_fr: 'Syringe', label_ar: 'حقنة', value: '3 voies' },
      { label_fr: 'Dimensions', label_ar: 'الأبعاد', value: '120 x 60 x 180 cm' },
    ],
    features_fr: ['Design compact', 'Turbine + micromoteur', 'Crachoir céramique', 'Éclairage LED', 'Garantie 2 ans'],
    features_ar: ['تصميم مدمج', 'توربين + ميكروموتور', 'بصاق خزفي', 'إضاءة LED', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    brand: 'CompactDent',
    origin: 'Corée du Sud',
    warranty: '2 ans',
    delivery_time_fr: '3-4 semaines',
    delivery_time_ar: '3-4 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'UDC-008',
    target: ['Clinique'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.4,
    reviewCount: 52,
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    slug: 'unite-dentaire-premium',
    name_fr: 'Unité Dentaire Premium',
    name_ar: 'وحدة أسنان بريميوم',
    description_fr: '<p>L\'unité dentaire Premium représente le summum de la technologie dentaire. Équipée de capteurs intelligents et d\'un bras articulé 6 axes, elle est conçue pour les praticiens exigeants.</p>',
    description_ar: '<p>وحدة الأسنان بريميوم تمثل قمة تكنولوجيا طب الأسنان. مجهزة بمستشعرات ذكية وذراع مفصلي 6 محاور، مصممة للأطباء المتميزين.</p>',
    short_description_fr: 'Unité dentaire haut de gamme avec capteurs intelligents et bras 6 axes',
    short_description_ar: 'وحدة أسنان فاخرة بمستشعرات ذكية وذراع 6 محاور',
    category_id: '2',
    price: 5500000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
      { label_fr: 'Turbine', label_ar: 'توربين', value: '3 connecteurs' },
      { label_fr: 'Écran', label_ar: 'الشاشة', value: '10 pouces tactile' },
    ],
    features_fr: ['Capteurs intelligents', 'Bras 6 axes', 'Écran 10 pouces', 'Hygiène automatisée', 'Garantie 5 ans'],
    features_ar: ['مستشعرات ذكية', 'ذراع 6 محاور', 'شاشة 10 بوصة', 'نظافة آلية', 'ضمان 5 سنوات'],
    in_stock: true,
    is_featured: true,
    is_new: true,
    is_best_seller: false,
    brand: 'PremiumDent',
    origin: 'Allemagne',
    warranty: '5 ans',
    delivery_time_fr: '4-6 semaines',
    delivery_time_ar: '4-6 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'UDP-009',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.9,
    reviewCount: 31,
    created_at: new Date().toISOString(),
  },
  {
    id: '10',
    slug: 'capteur-rvg-numerique',
    name_fr: 'Capteur RVG Numérique',
    name_ar: 'مستشعر RVG رقمي',
    description_fr: '<p>Le capteur RVG Numérique offre une imagerie rétroalvéolaire de haute qualité avec une résolution exceptionnelle. Compatible avec tous les logiciels de radiologie dentaire.</p>',
    description_ar: '<p>مستشعر RVG الرقمي يوفر تصويراً رجعياً سنخياً عالي الجودة بدقة استثنائية. متوافق مع جميع برامج أشعة الأسنان.</p>',
    short_description_fr: 'Capteur RVG haute résolution compatible tous logiciels',
    short_description_ar: 'مستشعر RVG عالي الدقة متوافق مع جميع البرامج',
    category_id: '3',
    price: 850000,
    images: [],
    specs: [
      { label_fr: 'Résolution', label_ar: 'الدقة', value: '26 lp/mm' },
      { label_fr: 'Taille active', label_ar: 'الحجم النشط', value: '30 x 40 mm' },
      { label_fr: 'Connectivité', label_ar: 'الاتصال', value: 'USB 2.0' },
    ],
    features_fr: ['Haute résolution 26 lp/mm', 'Compatible tous logiciels', 'Filaire USB', 'Stérilisable', 'Garantie 2 ans'],
    features_ar: ['دقة عالية 26 lp/mm', 'متوافق مع جميع البرامج', 'سلكي USB', 'قابل للتعقيم', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: true,
    brand: 'DigiRay',
    origin: 'France',
    warranty: '2 ans',
    delivery_time_fr: '1-2 semaines',
    delivery_time_ar: '1-2 أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'CRV-010',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.1,
    reviewCount: 44,
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    slug: 'radio-cephalometre',
    name_fr: 'Radio Céphalomètre',
    name_ar: 'جهاز أشعة سيفالوميتر',
    description_fr: '<p>Le radio céphalomètre permet des clichés céphalométriques de haute précision. Indispensable pour les orthodontistes et les chirurgiens maxillo-faciaux.</p>',
    description_ar: '<p>جهاز الأشعة السيفالوميتر يسمح بأشعة سيفالومترية عالية الدقة. ضرائي لمتقويمي الأسنان وجراحي الوجه والفكين.</p>',
    short_description_fr: 'Céphalomètre haute précision pour orthodontie et chirurgie',
    short_description_ar: 'سيفالوميتر عالي الدقة لتقويم الأسنان والجراحة',
    category_id: '3',
    price: 0,
    images: [],
    specs: [
      { label_fr: 'Tension', label_ar: 'الجهد', value: '60-90 kV' },
      { label_fr: 'Focale', label_ar: 'البؤرة', value: '0.5 mm' },
      { label_fr: 'Type', label_ar: 'النوع', value: 'Céphalomètre + panoramique' },
    ],
    features_fr: ['Haute précision', 'Mode panoramique intégré', 'Faible dose', 'Logiciel 3D', 'Garantie 2 ans'],
    features_ar: ['دقة عالية', 'وضع بانورامي مدمج', 'جرعة منخفضة', 'برنامج 3D', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    brand: 'Owandy',
    origin: 'France',
    warranty: '2 ans',
    delivery_time_fr: '4-6 semaines',
    delivery_time_ar: '4-6 أسابيع',
    installation_included: true,
    training_included: true,
    ref: 'RCP-011',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 3.5,
    reviewCount: 18,
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    slug: 'thermodesinfecteur-dental',
    name_fr: 'Thermodésinfecteur',
    name_ar: 'جهاز تطهير حراري',
    description_fr: '<p>Le thermodésinfecteur assure une désinfection thermique complète des instruments dentaires. Programmable et conforme aux normes EN ISO 15883.</p>',
    description_ar: '<p>جهاز التطهير الحراري يضمن تطهيراً حرارياً كاملاً لأدوات الأسنان. قابل للبرمجة ومتوافق مع معايير EN ISO 15883.</p>',
    short_description_fr: 'Thermodésinfecteur conforme EN ISO 15883 pour instruments dentaires',
    short_description_ar: 'جهاز تطهير حراري متوافق مع EN ISO 15883 لأدوات الأسنان',
    category_id: '4',
    price: 1200000,
    images: [],
    specs: [
      { label_fr: 'Capacité', label_ar: 'السعة', value: '16 litres' },
      { label_fr: 'Température', label_ar: 'الحرارة', value: '45-95°C' },
      { label_fr: 'Cycle', label_ar: 'الدورة', value: '30-60 min' },
    ],
    features_fr: ['Conforme EN ISO 15883', '5 programmes', 'Écran LCD', 'Séchage intégré', 'Garantie 2 ans'],
    features_ar: ['متوافق EN ISO 15883', '5 برامج', 'شاشة LCD', 'تجفيف مدمج', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    brand: 'SterilPro',
    origin: 'Italie',
    warranty: '2 ans',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: true,
    training_included: false,
    ref: 'TDS-012',
    target: ['Clinique', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.0,
    reviewCount: 29,
    created_at: new Date().toISOString(),
  },
  {
    id: '13',
    slug: 'sachet-sterilisation',
    name_fr: 'Sachet de Stérilisation',
    name_ar: 'أكياس تعقيم',
    description_fr: '<p>Sachets de stérilisation auto-adhésifs de haute qualité. Indicateur de stérilisation intégré. Disponible en plusieurs tailles.</p>',
    description_ar: '<p>أكياس تعقيم ذاتية اللصق عالية الجودة. مؤشر تعقيم مدمج. متوفرة بأحجام متعددة.</p>',
    short_description_fr: 'Sachets stérilisation auto-adhésifs avec indicateur intégré',
    short_description_ar: 'أكياس تعقيم ذاتية اللصق مع مؤشر مدمج',
    category_id: '4',
    price: 8500,
    images: [],
    specs: [
      { label_fr: 'Taille', label_ar: 'الحجم', value: '75 x 200 mm' },
      { label_fr: 'Quantité', label_ar: 'الكمية', value: '200 pièces/boîte' },
      { label_fr: 'Indicateur', label_ar: 'المؤشر', value: 'Classe 1' },
    ],
    features_fr: ['Auto-adhésif', 'Indicateur intégré', 'Papier médical 60g', 'Multiple tailles', 'Usage unique'],
    features_ar: ['ذاتي اللصق', 'مؤشر مدمج', 'ورق طبي 60g', 'أحجام متعددة', 'استخدام واحد'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: true,
    brand: 'MedPak',
    origin: 'Chine',
    warranty: '-',
    delivery_time_fr: '1 semaine',
    delivery_time_ar: 'أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'SST-013',
    target: ['Clinique', 'Comptoir', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.5,
    reviewCount: 156,
    created_at: new Date().toISOString(),
  },
  {
    id: '14',
    slug: 'compresseur-dentaire-50l',
    name_fr: 'Compresseur Dentaire 50L',
    name_ar: 'ضاغط أسنان 50 لتر',
    description_fr: '<p>Le compresseur dentaire 50L offre un débit d\'air suffisant pour alimenter 2 fauteuils simultanément. Sans huile et ultra silencieux, il est idéal pour les cabinets de taille moyenne.</p>',
    description_ar: '<p>ضاغط الأسنان 50 لتر يوفر تدفق هواء كافي لتغذية كرسيين في نفس الوقت. بدون زيت وفائق الصمت، مثالي للعيادات المتوسطة.</p>',
    short_description_fr: 'Compresseur sans huile 50L pour 2 fauteuils, ultra silencieux',
    short_description_ar: 'ضاغط بدون زيت 50 لتر لكرسيين، فائق الصمت',
    category_id: '5',
    price: 750000,
    images: [],
    specs: [
      { label_fr: 'Réservoir', label_ar: 'الخزان', value: '50 litres' },
      { label_fr: 'Débit', label_ar: 'التدفق', value: '100 L/min' },
      { label_fr: 'Niveau sonore', label_ar: 'مستوى الضوضاء', value: '< 48 dB' },
    ],
    features_fr: ['Sans huile', 'Réservoir 50L', '2 fauteuils', 'Ultra silencieux', 'Garantie 2 ans'],
    features_ar: ['بدون زيت', 'خزان 50 لتر', 'كرسيين', 'فائق الصمت', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: true,
    brand: 'AirTech',
    origin: 'Italie',
    warranty: '2 ans',
    delivery_time_fr: '1-2 semaines',
    delivery_time_ar: '1-2 أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'CD5-014',
    target: ['Clinique', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.3,
    reviewCount: 22,
    created_at: new Date().toISOString(),
  },
  {
    id: '15',
    slug: 'suceur-chirurgical',
    name_fr: 'Suceur Chirurgical',
    name_ar: 'شافط جراحي',
    description_fr: '<p>Le suceur chirurgical haute puissance est conçu pour les interventions chirurgicales lourdes. Aspiration puissante et silencieuse avec système de filtration avancé.</p>',
    description_ar: '<p>الشافط الجراحي عالي القوة مصمم للعمليات الجراحية الكبيرة. شفط قوي وصامت مع نظام ترشيح متقدم.</p>',
    short_description_fr: 'Suceur chirurgical haute puissance avec filtration avancée',
    short_description_ar: 'شافط جراحي عالي القوة مع ترشيح متقدم',
    category_id: '5',
    price: 650000,
    images: [],
    specs: [
      { label_fr: 'Puissance', label_ar: 'القوة', value: '1500 W' },
      { label_fr: 'Débit', label_ar: 'التدفق', value: '300 L/min' },
      { label_fr: 'Niveau sonore', label_ar: 'مستوى الضوضاء', value: '< 52 dB' },
    ],
    features_fr: ['Haute puissance', 'Filtration HEPA', 'Silencieux', '2 pots de récupération', 'Garantie 2 ans'],
    features_ar: ['قوة عالية', 'ترشيح HEPA', 'صامت', '2 وعاء تجميع', 'ضمان سنتين'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    brand: 'SurgiVac',
    origin: 'Allemagne',
    warranty: '2 ans',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: true,
    training_included: false,
    ref: 'SCH-015',
    target: ['Clinique'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 3.8,
    reviewCount: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: '16',
    slug: 'kit-composite-universel',
    name_fr: 'Kit Composite Universel',
    name_ar: 'طقم حشوة مركبة عالمي',
    description_fr: '<p>Le kit composite universel contient tout le nécessaire pour les restaurations esthétiques directes. Composites nano-hybrides de dernière génération avec teintes Vita.</p>',
    description_ar: '<p>طقم الحشوة المركبة العالمي يحتوي على كل ما يلزم للحشوات التجميلية المباشرة. حشوات نانو هجينة من الجيل الأخير بألوان فيتا.</p>',
    short_description_fr: 'Kit complet de composites nano-hybrides avec teintes Vita',
    short_description_ar: 'طقم كامل من الحشوات النانو هجينة بألوان فيتا',
    category_id: '6',
    price: 35000,
    images: [],
    specs: [
      { label_fr: 'Teintes', label_ar: 'الألوان', value: 'A1, A2, A3, A3.5, B1, B2, C2' },
      { label_fr: 'Conditionnement', label_ar: 'التعبئة', value: '4g par seringue' },
      { label_fr: 'Type', label_ar: 'النوع', value: 'Nano-hybride' },
    ],
    features_fr: ['7 teintes Vita', 'Nano-hybride', 'Polymérisation LED', 'Haute résistance', 'Esthétique supérieure'],
    features_ar: ['7 ألوان فيتا', 'نانو هجين', 'بلمرة LED', 'مقاومة عالية', 'جمالية فائقة'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: true,
    brand: 'FillDent',
    origin: 'Brésil',
    warranty: '-',
    delivery_time_fr: '1 semaine',
    delivery_time_ar: 'أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'KCU-016',
    target: ['Clinique', 'Comptoir', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.4,
    reviewCount: 83,
    created_at: new Date().toISOString(),
  },
  {
    id: '17',
    slug: 'matrice-interdentaire',
    name_fr: 'Matrice Interdentaire',
    name_ar: 'شريط بين سنوي',
    description_fr: '<p>Les matrices interdentaires sont essentielles pour les restaurations de classe II. Design anatomique pour une adaptation parfaite aux surfaces proximales.</p>',
    description_ar: '<p>الشرائط البين سنوية أساسية لحشوات الدرجة الثانية. تصميم تشريحي للتكييف المثالي مع الأسطح القريبة.</p>',
    short_description_fr: 'Matrices interdentaires anatomiques pour restaurations classe II',
    short_description_ar: 'شرائط بين سنوية تشريحية لحشوات الدرجة الثانية',
    category_id: '6',
    price: 12000,
    images: [],
    specs: [
      { label_fr: 'Matériau', label_ar: 'المادة', value: 'Acier inoxydable' },
      { label_fr: 'Quantité', label_ar: 'الكمية', value: '50 pièces/boîte' },
      { label_fr: 'Tailles', label_ar: 'الأحجام', value: 'S, M, L' },
    ],
    features_fr: ['Acier inoxydable', '3 tailles', 'Réutilisable', 'Design anatomique', 'Compatibilité universelle'],
    features_ar: ['ستانلس ستيل', '3 أحجام', 'قابل لإعادة الاستخدام', 'تصميم تشريحي', 'توافق عالمي'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    brand: 'MatriPro',
    origin: 'Chine',
    warranty: '-',
    delivery_time_fr: '1 semaine',
    delivery_time_ar: 'أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'MID-017',
    target: ['Clinique', 'Comptoir'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 3.7,
    reviewCount: 25,
    created_at: new Date().toISOString(),
  },
  {
    id: '18',
    slug: 'kit-instruments-chirurgicaux',
    name_fr: 'Kit Instruments Chirurgicaux',
    name_ar: 'طقم أدوات جراحية',
    description_fr: '<p>Le kit instruments chirurgicaux complet comprend tous les instruments nécessaires pour les extractions et interventions chirurgicales dentaires. Acier inoxydable de qualité chirurgicale.</p>',
    description_ar: '<p>طقم الأدوات الجراحية الكامل يشمل جميع الأدوات اللازمة للخلع والعمليات الجراحية للأسنان. ستانلس ستيل بجودة جراحية.</p>',
    short_description_fr: 'Kit complet d\'instruments chirurgicaux en acier inox de qualité',
    short_description_ar: 'طقم كامل من الأدوات الجراحية من الستانلس ستيل',
    category_id: '7',
    price: 85000,
    images: [],
    specs: [
      { label_fr: 'Matériau', label_ar: 'المادة', value: 'Acier inox chirurgical' },
      { label_fr: 'Nombre de pièces', label_ar: 'عدد القطع', value: '15 instruments' },
      { label_fr: 'Étui', label_ar: 'الحقيبة', value: 'Valise aluminium' },
    ],
    features_fr: ['15 instruments', 'Acier inox chirurgical', 'Valise aluminium', 'Stérilisable', 'Garantie 5 ans'],
    features_ar: ['15 أداة', 'ستانلس ستيل جراحي', 'حقيبة ألمنيوم', 'قابل للتعقيم', 'ضمان 5 سنوات'],
    in_stock: true,
    is_featured: true,
    is_new: false,
    is_best_seller: true,
    brand: 'SurgiDent',
    origin: 'Pakistan',
    warranty: '5 ans',
    delivery_time_fr: '1-2 semaines',
    delivery_time_ar: '1-2 أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'KIC-018',
    target: ['Clinique', 'Comptoir', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.6,
    reviewCount: 62,
    created_at: new Date().toISOString(),
  },
  {
    id: '19',
    slug: 'miroir-dentaire-n5',
    name_fr: 'Miroir Dentaire N°5',
    name_ar: 'مرآة أسنان رقم 5',
    description_fr: '<p>Le miroir dentaire N°5 est un instrument de diagnostic essentiel. Surface réfléchissante haute définition avec manche ergonomique anti-glisse.</p>',
    description_ar: '<p>مرآة الأسنان رقم 5 أداة تشخيص أساسية. سطح عاكس عالي الدقة مع مقبض مريح مانع للانزلاق.</p>',
    short_description_fr: 'Miroir dentaire N°5 haute définition avec manche ergonomique',
    short_description_ar: 'مرآة أسنان رقم 5 عالية الدقة مع مقبض مريح',
    category_id: '7',
    price: 2500,
    images: [],
    specs: [
      { label_fr: 'Diamètre', label_ar: 'القطر', value: '22 mm' },
      { label_fr: 'Matériau', label_ar: 'المادة', value: 'Acier inox' },
      { label_fr: 'Surface', label_ar: 'السطح', value: 'Miroir rhodium' },
    ],
    features_fr: ['Miroir rhodium', 'Manche anti-glisse', 'Stérilisable', 'Haute définition', 'Usage durable'],
    features_ar: ['مرآة روديوم', 'مقبض مانع للانزلاق', 'قابل للتعقيم', 'دقة عالية', 'استخدام دائم'],
    in_stock: true,
    is_featured: false,
    is_new: false,
    is_best_seller: true,
    brand: 'InstruMed',
    origin: 'Pakistan',
    warranty: '-',
    delivery_time_fr: '1 semaine',
    delivery_time_ar: 'أسبوع',
    installation_included: false,
    training_included: false,
    ref: 'MD5-019',
    target: ['Clinique', 'Comptoir', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.0,
    reviewCount: 97,
    created_at: new Date().toISOString(),
  },
  {
    id: '20',
    slug: 'meuble-rangement-dentaire',
    name_fr: 'Meuble Rangement Dentaire',
    name_ar: 'خزانة أسنان',
    description_fr: '<p>Le meuble de rangement dentaire offre un espace de stockage optimisé pour les instruments et consommables. Design moderne et fonctionnel avec tiroirs silencieux.</p>',
    description_ar: '<p>خزانة الأسنان توفر مساحة تخزين محسنة للأدوات والمستهلكات. تصميم عصري وعملي مع أدراج صامتة.</p>',
    short_description_fr: 'Meuble de rangement moderne avec tiroirs silencieux pour cabinet',
    short_description_ar: 'خزانة عصرية مع أدراج صامتة للعيادة',
    category_id: '8',
    price: 280000,
    images: [],
    specs: [
      { label_fr: 'Dimensions', label_ar: 'الأبعاد', value: '80 x 45 x 85 cm' },
      { label_fr: 'Tiroirs', label_ar: 'الأدراج', value: '5 tiroirs' },
      { label_fr: 'Matériau', label_ar: 'المادة', value: 'MDF haute densité' },
    ],
    features_fr: ['5 tiroirs silencieux', 'Surface anti-rayures', 'Roulettes freinées', 'Serrure intégrée', 'Montage facile'],
    features_ar: ['5 أدراج صامتة', 'سطح مقاوم للخدش', 'عجلات فرامل', 'قفل مدمج', 'تركيب سهل'],
    in_stock: true,
    is_featured: false,
    is_new: true,
    is_best_seller: false,
    brand: 'CabDent',
    origin: 'Turquie',
    warranty: '1 an',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: false,
    training_included: false,
    ref: 'MRD-020',
    target: ['Clinique'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 3.6,
    reviewCount: 11,
    created_at: new Date().toISOString(),
  },
  {
    id: '21',
    slug: 'lampe-scialytique-led',
    name_fr: 'Lampe Scialytique LED',
    name_ar: 'مصباح إضاءة LED',
    description_fr: '<p>La lampe scialytique LED offre un éclairage homogène et puissant sans ombrage. Indice de rendu de couleur élevé pour un diagnostic précis des teintes dentaires.</p>',
    description_ar: '<p>مصباح الإضاءة LED يوفر إضاءة متجانسة وقوية بدون ظلال. مؤشر تجسيد الألوان عالي لتشخيص دقيق لألوان الأسنان.</p>',
    short_description_fr: 'Lampe scialytique LED haute performance sans ombrage',
    short_description_ar: 'مصباح إضاءة LED عالي الأداء بدون ظلال',
    category_id: '8',
    price: 420000,
    images: [],
    specs: [
      { label_fr: 'Intensité', label_ar: 'الشدة', value: '30 000 lux' },
      { label_fr: 'Température', label_ar: 'الحرارة', value: '5000 K' },
      { label_fr: 'IRC', label_ar: 'IRC', value: '> 95' },
    ],
    features_fr: ['30 000 lux', 'Sans ombrage', 'IRC > 95', 'Réglable 3 niveaux', 'Garantie 3 ans'],
    features_ar: ['30 000 لوكس', 'بدون ظلال', 'IRC > 95', '3 مستويات تعديل', 'ضمان 3 سنوات'],
    in_stock: true,
    is_featured: true,
    is_new: true,
    is_best_seller: false,
    brand: 'LightMed',
    origin: 'Chine',
    warranty: '3 ans',
    delivery_time_fr: '2-3 semaines',
    delivery_time_ar: '2-3 أسابيع',
    installation_included: true,
    training_included: false,
    ref: 'LSL-021',
    target: ['Clinique', 'Revendeur'],
    pdf_url: '',
    brochure_pdf: '',
    videos: [],
    rating: 4.8,
    reviewCount: 36,
    created_at: new Date().toISOString(),
  },
];

const defaultBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'tendances-equipements-dentaires-2024',
    title_fr: 'Tendances Équipements Dentaires 2024',
    title_ar: 'اتجاهات معدات طب الأسنان 2024',
    excerpt_fr: 'Découvrez les dernières innovations en matière d\'équipements dentaires qui transforment la pratique dentaire moderne.',
    excerpt_ar: 'اكتشف أحدث الابتكارات في معدات طب الأسنان التي تحول ممارسة طب الأسنان الحديثة.',
    content_fr: '<p>L\'année 2024 marque un tournant dans l\'évolution des équipements dentaires. Les technologies numériques, l\'intelligence artificielle et l\'ergonomie avancée redéfinissent les standards de la pratique dentaire.</p><h3>1. L\'imagerie 3D</h3><p>Les systèmes d\'imagerie 3D deviennent de plus en plus accessibles, permettant des diagnostics plus précis et des plans de traitement personnalisés.</p><h3>2. Le fauteuil connecté</h3><p>Les fauteuils dentaires de nouvelle génération intègrent des capteurs IoT pour un suivi en temps réel et une maintenance prédictive.</p>',
    content_ar: '<p>عام 2024 يمثل نقطة تحول في تطور معدات طب الأسنان. التكنولوجيا الرقمية والذكاء الاصطناعي والراحة المتقدمة تعيد تعريف معايير ممارسة طب الأسنان.</p>',
    image: '',
    author: 'ODG Team',
    date: '2024-03-15',
    read_time: 5,
    tags: ['innovation', 'technologie', '2024'],
    category: 'innovation',
    created_at: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    slug: 'guide-choix-fauteuil-dentaire',
    title_fr: 'Guide de choix : Comment choisir son fauteuil dentaire',
    title_ar: 'دليل الاختيار: كيف تختار كرسي الأسنان',
    excerpt_fr: 'Tous les critères à considérer pour choisir le fauteuil dentaire adapté à votre cabinet et votre pratique.',
    excerpt_ar: 'جميع المعايير التي يجب مراعاتها لاختيار كرسي الأسنان المناسب لعيادتك وممارستك.',
    content_fr: '<p>Le choix d\'un fauteuil dentaire est une décision importante qui impacte directement la qualité de vos soins et le confort de vos patients. Voici les critères essentiels à considérer.</p>',
    content_ar: '<p>اختيار كرسي أسنان قرار مهم يؤثر مباشرة على جودة الرعاية وراحة المرضى. إليك المعايير الأساسية للنظر فيها.</p>',
    image: '',
    author: 'ODG Team',
    date: '2024-02-20',
    read_time: 8,
    tags: ['guide', 'fauteuil', 'choix'],
    category: 'guide',
    created_at: '2024-02-20T10:00:00Z',
  },
  {
    id: '3',
    slug: 'importance-sterilisation-cabinet',
    title_fr: 'L\'importance de la stérilisation en cabinet dentaire',
    title_ar: 'أهمية التعقيم في عيادة الأسنان',
    excerpt_fr: 'Pourquoi la stérilisation est essentielle et comment choisir les bons équipements pour garantir la sécurité de vos patients.',
    excerpt_ar: 'لماذا التعقيم ضروري وكيفية اختيار المعدات المناسبة لضمان سلامة المرضى.',
    content_fr: '<p>La stérilisation est un pilier fondamental de la pratique dentaire. Un cabinet dentaire bien équipé en matière de stérilisation garantit non seulement la sécurité des patients mais aussi celle du personnel.</p>',
    content_ar: '<p>التعقيم هو ركيزة أساسية في ممارسة طب الأسنان. عيادة أسنان مجهزة جيداً في مجال التعقيم تضمن سلامة المرضى والموظفين.</p>',
    image: '',
    author: 'ODG Team',
    date: '2024-01-10',
    read_time: 6,
    tags: ['sterilisation', 'securite', 'hygiene'],
    category: 'securite',
    created_at: '2024-01-10T10:00:00Z',
  },
];

// ============================================================
// Data Context
// ============================================================
interface DataContextType {
  categories: Category[];
  products: Product[];
  blogPosts: BlogPost[];
  contactInfo: ContactInfo;
  loading: boolean;
  error: string | null;
  refresh: () => void;
  getCategoryName: (cat: Category, lang: Language) => string;
  getProductName: (product: Product, lang: Language) => string;
  getProductDescription: (product: Product, lang: Language) => string;
  getProductShortDescription: (product: Product, lang: Language) => string;
}

const DataContext = createContext<DataContextType>({
  categories: defaultCategories,
  products: defaultProducts,
  blogPosts: defaultBlogPosts,
  contactInfo: defaultContactInfo,
  loading: false,
  error: null,
  refresh: () => {},
  getCategoryName: () => '',
  getProductName: () => '',
  getProductDescription: () => '',
  getProductShortDescription: () => '',
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(defaultBlogPosts);
  const [contactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      // Use default data when Supabase is not configured
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch categories - map Supabase column names to our interface
      const { data: catsData, error: catsError } = await supabase
        .from('categories')
        .select('*')
        .order('ordre', { ascending: true });

      if (!catsError && catsData && catsData.length > 0) {
        const mapped = catsData.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          slug: c.slug as string,
          name_fr: (c.nom_fr || c.name_fr || '') as string,
          name_ar: (c.nom_ar || c.name_ar || '') as string,
          description_fr: (c.description_fr || '') as string,
          description_ar: (c.description_ar || '') as string,
          icon: (c.icone || c.icon || 'Package') as string,
          image: (c.image || `/categories/${c.slug}.jpg`) as string,
          sort_order: (c.ordre || c.sort_order || 0) as number,
        }));
        setCategories(mapped);
      }

      // Fetch products - map Supabase column names to our interface
      const { data: prodsData, error: prodsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!prodsError && prodsData && prodsData.length > 0) {
        const mapped = prodsData.map((p: Record<string, unknown>) => ({
          id: p.id as string,
          slug: p.slug as string,
          name_fr: (p.nom_fr || p.name_fr || '') as string,
          name_ar: (p.nom_ar || p.name_ar || '') as string,
          description_fr: (p.description_fr || '') as string,
          description_ar: (p.description_ar || '') as string,
          short_description_fr: (p.short_description_fr || (p.description_fr as string || '').substring(0, 120)) as string,
          short_description_ar: (p.short_description_ar || (p.description_ar as string || '').substring(0, 120)) as string,
          category_id: p.category_id as string,
          price: 0 as number, // Price not stored in Supabase - set on admin
          images: ((p.images || []) as string[]).map((img: string) => {
            // If already a full URL, return as-is
            if (img.startsWith('http')) return img;
            // Otherwise prefix with Supabase storage URL
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            return `${supabaseUrl}/storage/v1/object/public/product-images/${img}`;
          }),
          specs: ((p.specs && (p.specs as Record<string, string>[]).length > 0) ? p.specs : [
            { label_fr: 'Puissance', label_ar: 'القوة', value: '220V / 50Hz' },
            { label_fr: 'Garantie', label_ar: 'الضمان', value: (p.warranty || '2 ans') as string },
            { label_fr: 'Marque', label_ar: 'العلامة التجارية', value: (p.marque || p.brand || '') as string },
          ]) as Record<string, string>[],
          features_fr: ((p.features_fr && (p.features_fr as string[]).length > 0) ? p.features_fr : [
            'Installation professionnelle incluse',
            'Formation du personnel incluse',
            'Service après-vente 48h',
            'Garantie constructeur',
          ]) as string[],
          features_ar: ((p.features_ar && (p.features_ar as string[]).length > 0) ? p.features_ar : [
            'تركيب احترافي مشمول',
            'تدريب الموظفين مشمول',
            'خدمة ما بعد البيع 48 ساعة',
            'ضمان الشركة المصنعة',
          ]) as string[],
          in_stock: (p.disponible ?? p.in_stock ?? true) as boolean,
          is_featured: (p.en_vedette ?? p.is_featured ?? false) as boolean,
          is_new: (p.is_new ?? false) as boolean,
          is_best_seller: (p.is_best_seller ?? false) as boolean,
          brand: (p.marque || p.brand || '') as string,
          origin: (p.origin || 'International') as string,
          warranty: (p.warranty || '2 ans') as string,
          delivery_time_fr: (p.delivery_time_fr || '2-4 semaines') as string,
          delivery_time_ar: (p.delivery_time_ar || '2-4 أسابيع') as string,
          installation_included: (p.installation_included ?? true) as boolean,
          training_included: (p.training_included ?? true) as boolean,
          ref: (p.ref || p.modele || '') as string,
          target: (p.cible || p.target || []) as string[],
          pdf_url: (p.pdf_url || '') as string,
          brochure_pdf: (p.brochure_pdf || '') as string,
          videos: (p.videos || []) as { title_fr: string; title_ar: string; url: string; type: string }[],
          rating: (p.rating ?? undefined) as number | undefined,
          reviewCount: (p.review_count ?? p.reviewCount ?? undefined) as number | undefined,
          created_at: p.created_at as string,
        }));
        setProducts(mapped);
      }

      // Fetch blog posts - map Supabase column names
      const { data: blogData, error: blogError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!blogError && blogData && blogData.length > 0) {
        const mapped = blogData.map((b: Record<string, unknown>) => ({
          id: b.id as string,
          slug: b.slug as string,
          title_fr: (b.titre_fr || b.title_fr || '') as string,
          title_ar: (b.titre_ar || b.title_ar || '') as string,
          excerpt_fr: (b.excerpt_fr || '') as string,
          excerpt_ar: (b.excerpt_ar || '') as string,
          content_fr: (b.content_fr || '') as string,
          content_ar: (b.content_ar || '') as string,
          image: (() => {
            const img = (b.image || '') as string;
            if (!img || img.startsWith('http')) return img;
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
            return `${supabaseUrl}/storage/v1/object/public/blog-images/${img}`;
          })(),
          author: (b.author || 'ODG Team') as string,
          date: (b.date || b.created_at || '') as string,
          read_time: (b.read_time || 5) as number,
          tags: (b.tags || []) as string[],
          category: (b.category || '') as string,
          created_at: b.created_at as string,
        }));
        setBlogPosts(mapped);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getCategoryName = useCallback((cat: Category, lang: Language): string => {
    return lang === 'ar' ? cat.name_ar : cat.name_fr;
  }, []);

  const getProductName = useCallback((product: Product, lang: Language): string => {
    return lang === 'ar' ? product.name_ar : product.name_fr;
  }, []);

  const getProductDescription = useCallback((product: Product, lang: Language): string => {
    return lang === 'ar' ? product.description_ar : product.description_fr;
  }, []);

  // Strip HTML tags for clean plain-text display
  const stripHtml = useCallback((html: string): string => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();
  }, []);

  const getProductShortDescription = useCallback((product: Product, lang: Language): string => {
    const raw = lang === 'ar' ? product.short_description_ar : product.short_description_fr;
    return stripHtml(raw);
  }, [stripHtml]);

  return (
    <DataContext.Provider
      value={{
        categories,
        products,
        blogPosts,
        contactInfo,
        loading,
        error,
        refresh: fetchData,
        getCategoryName,
        getProductName,
        getProductDescription,
        getProductShortDescription,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
