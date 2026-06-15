'use client';

import React from 'react';
import { LanguageProvider, useTranslation } from '@/lib/i18n';
import { RouterProvider, useRouter } from '@/lib/router';
import { DataProvider } from '@/lib/data-service';
import { SiteSettingsProvider } from '@/lib/site-settings';
import { AdminAuthProvider } from '@/lib/admin-auth';
import Navbar from '@/components/dental/Navbar';
import Footer from '@/components/dental/Footer';
import WhatsAppBubble from '@/components/dental/WhatsAppBubble';
import ChatBubble from '@/components/dental/ChatBubble';
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
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">{renderPage()}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppBubble />}
      {!isAdminRoute && <ChatBubble />}
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
