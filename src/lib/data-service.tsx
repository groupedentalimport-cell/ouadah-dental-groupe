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
    videos: [],
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
    videos: [],
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
          price: (p.price || 0) as number,
          images: (p.images || []) as string[],
          specs: (p.specs || []) as Record<string, string>[],
          features_fr: (p.features_fr || []) as string[],
          features_ar: (p.features_ar || []) as string[],
          in_stock: (p.disponible ?? p.in_stock ?? true) as boolean,
          is_featured: (p.en_vedette ?? p.is_featured ?? false) as boolean,
          is_new: (p.is_new ?? false) as boolean,
          is_best_seller: (p.is_best_seller ?? false) as boolean,
          brand: (p.marque || p.brand || '') as string,
          origin: (p.origin || '') as string,
          warranty: (p.warranty || '') as string,
          delivery_time_fr: (p.delivery_time_fr || '') as string,
          delivery_time_ar: (p.delivery_time_ar || '') as string,
          installation_included: (p.installation_included ?? false) as boolean,
          training_included: (p.training_included ?? false) as boolean,
          ref: (p.ref || p.modele || '') as string,
          target: (p.cible || p.target || []) as string[],
          pdf_url: (p.pdf_url || '') as string,
          brochure_pdf: (p.brochure_pdf || '') as string,
          videos: (p.videos || []) as { title_fr: string; title_ar: string; url: string; type: string }[],
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
          image: (b.image || '') as string,
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

  const getProductShortDescription = useCallback((product: Product, lang: Language): string => {
    return lang === 'ar' ? product.short_description_ar : product.short_description_fr;
  }, []);

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
