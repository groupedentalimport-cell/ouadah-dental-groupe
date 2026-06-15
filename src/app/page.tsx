'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider, useTranslation } from '@/lib/i18n';
import { RouterProvider, useRouter } from '@/lib/router';
import { DataProvider, useData } from '@/lib/data-service';
import { SiteSettingsProvider } from '@/lib/site-settings';
import { AdminAuthProvider } from '@/lib/admin-auth';
import Navbar from '@/components/dental/Navbar';
import Footer from '@/components/dental/Footer';
import WhatsAppBubble from '@/components/dental/WhatsAppBubble';
import ChatBubble from '@/components/dental/ChatBubble';
import CompareView from '@/components/dental/CompareView';
import CompareDrawer from '@/components/dental/CompareDrawer';
import HomePage from '@/components/dental/HomePage';
import CataloguePage from '@/components/dental/CataloguePage';
import ProductDetailPage from '@/components/dental/ProductDetailPage';
import BlogPage from '@/components/dental/BlogPage';
import ArticleDetailPage from '@/components/dental/ArticleDetailPage';
import AboutPage from '@/components/dental/AboutPage';
import ContactPage from '@/components/dental/ContactPage';
import QuoteWizardPage from '@/components/dental/QuoteWizardPage';
import {
  MentionsLegales,
  PolitiqueConfidentialite,
  ConditionsGeneralesVente,
} from '@/components/dental/LegalPages';
import AdminPanel from '@/components/dental/AdminPanel';
import ScrollToTop from '@/components/dental/ScrollToTop';

// Route-to-title mapping for dynamic page titles
const routeTitles: Record<string, string> = {
  home: 'ODG - Équipements Dentaires Professionnels',
  catalogue: 'Catalogue | ODG',
  compare: 'Comparaison | ODG',
  blog: 'Blog | ODG',
  article: 'Article | ODG',
  about: 'À propos | ODG',
  contact: 'Contact | ODG',
  devis: 'Demander un devis | ODG',
  'mentions-legales': 'Mentions légales | ODG',
  'politique-confidentialite': 'Politique de confidentialité | ODG',
  'conditions-vente': 'Conditions générales de vente | ODG',
};

function PageTitleUpdater() {
  const { route, params } = useRouter();
  const { products, blogPosts } = useData();

  useEffect(() => {
    let title = routeTitles[route] || 'ODG - Ouadah Dental Groupe';

    // Dynamic title for product detail page
    if (route === 'product' && params?.slug) {
      const product = products.find((p) => p.slug === params.slug);
      if (product) {
        title = `${product.name_fr} | ODG`;
      }
    }

    // Dynamic title for article detail page
    if (route === 'article' && params?.slug) {
      const article = blogPosts.find((a) => a.slug === params.slug);
      if (article) {
        title = `${article.title_fr} | ODG`;
      }
    }

    // Admin routes
    if (route.startsWith('admin')) {
      title = 'Administration | ODG';
    }

    document.title = title;
  }, [route, params, products, blogPosts]);

  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25,
};

function AppContent() {
  const { route } = useRouter();
  const { isRTL } = useTranslation();

  const isAdminRoute = route.startsWith('admin');

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'catalogue':
        return <CataloguePage />;
      case 'product':
        return <ProductDetailPage />;
      case 'compare':
        return <CompareView />;
      case 'blog':
        return <BlogPage />;
      case 'article':
        return <ArticleDetailPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'devis':
        return <QuoteWizardPage />;
      case 'mentions-legales':
        return <MentionsLegales />;
      case 'politique-confidentialite':
        return <PolitiqueConfidentialite />;
      case 'conditions-vente':
        return <ConditionsGeneralesVente />;
      default:
        if (isAdminRoute) return <AdminPanel />;
        return <HomePage />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <PageTitleUpdater />
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppBubble />}
      {!isAdminRoute && <ChatBubble />}
      {!isAdminRoute && <CompareDrawer />}
      {!isAdminRoute && <ScrollToTop />}
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <RouterProvider>
        <AdminAuthProvider>
          <SiteSettingsProvider>
            <DataProvider>
              <AppContent />
            </DataProvider>
          </SiteSettingsProvider>
        </AdminAuthProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}
