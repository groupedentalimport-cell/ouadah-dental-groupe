'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  LayoutDashboard,
  Package,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Eye,
  Menu,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  MessageSquare,
  BookOpen,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Phone,
  Mail,
  MapPin,
  Globe,
  ExternalLink,
  ChevronRight,
  Activity,
  Star,
  Calendar,
  Hash,
  Image as ImageIcon,
  Tag,
  DollarSign,
  BarChart3,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { useAdminAuth } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type AdminTab = 'dashboard' | 'products' | 'blog' | 'quotes' | 'settings';

const NAVY = '#1E3A5F';
const GOLD = '#F0C05A';
const SUCCESS = '#3B8C6E';
const WARNING = '#E8963E';
const DANGER = '#C0564F';
const BG = '#f8fafc';

const tabVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function AdminPanel() {
  const { t, language, isRTL } = useTranslation();
  const { navigate, params } = useRouter();
  const { isAuthenticated, login, logout, loading: authLoading } = useAdminAuth();
  const { products, blogPosts, categories, getProductName, refresh } = useData();

  function getInitialTab(): AdminTab {
    if (typeof window === 'undefined') return 'dashboard';
    const hash = window.location.hash.slice(1);
    if (hash.includes('admin-products')) return 'products';
    if (hash.includes('admin-blog')) return 'blog';
    if (hash.includes('admin-quotes')) return 'quotes';
    if (hash.includes('admin-settings')) return 'settings';
    return 'dashboard';
  }

  const [activeTab, setActiveTab] = useState<AdminTab>(getInitialTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl" style={{ background: `linear-gradient(135deg, ${NAVY}, #2A5F8F)` }}>
            ODG
          </div>
          <div className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: NAVY }} />
            <span className="text-sm text-gray-500">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} t={t} />;
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, icon: LayoutDashboard, label: t('nav.dashboard'), path: '/admin-dashboard' },
    { id: 'products' as AdminTab, icon: Package, label: t('nav.products'), path: '/admin-products' },
    { id: 'blog' as AdminTab, icon: FileText, label: t('nav.blogPosts'), path: '/admin-blog' },
    { id: 'quotes' as AdminTab, icon: ClipboardList, label: t('nav.quotes'), path: '/admin-quotes' },
    { id: 'settings' as AdminTab, icon: Settings, label: t('nav.settings'), path: '/admin-settings' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-40 w-64 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-full' : '-translate-x-full')
        } flex flex-col`}
        style={{ background: `linear-gradient(180deg, ${NAVY} 0%, #0F2440 100%)` }}
      >
        {/* Sidebar Header */}
        <div className="p-5 flex items-center gap-3 border-b border-white/10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: `linear-gradient(135deg, ${GOLD}, #D4A84A)` }}
          >
            ODG
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-sm">ODG Admin</h2>
            <p className="text-blue-300/60 text-xs truncate">OUADAH Dental Groupe</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Sidebar Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    navigate(tab.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative group ${
                    isActive
                      ? 'text-white'
                      : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(240,192,90,0.2) 0%, rgba(240,192,90,0.05) 100%)',
                    borderLeft: `3px solid ${GOLD}`,
                  } : { borderLeft: '3px solid transparent' }}
                >
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-[#F0C05A]' : ''}`} />
                  <span className="flex-1 text-left">{tab.label}</span>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-[#F0C05A]/60" />
                  )}
                </button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-blue-200/70 hover:bg-white/5 hover:text-white transition-all duration-200"
          >
            <ExternalLink className="w-[18px] h-[18px]" />
            <span>Visiter le site</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>{t('nav.logout')}</span>
          </button>
          <div className="flex items-center gap-3 pt-3 mt-2 border-t border-white/10">
            <Avatar className="w-8 h-8" style={{ backgroundColor: GOLD }}>
              <AvatarFallback className="text-xs font-bold" style={{ color: NAVY }}>A</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">Administrateur</p>
              <p className="text-blue-300/50 text-[10px] truncate">admin@odg.dz</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header
          className="px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 border-b"
          style={{ backgroundColor: 'white', borderColor: '#e2e8f0' }}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg" style={{ color: NAVY }}>
                {tabs.find((tb) => tb.id === activeTab)?.label}
              </h1>
              <p className="text-[11px] text-gray-400 -mt-0.5 hidden sm:block">
                {activeTab === 'dashboard' && 'Vue d\'ensemble de votre activité'}
                {activeTab === 'products' && 'Gérez votre catalogue de produits'}
                {activeTab === 'blog' && 'Rédigez et gérez vos articles'}
                {activeTab === 'quotes' && 'Suivez les demandes de devis'}
                {activeTab === 'settings' && 'Configurez votre site'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/')}
              className="gap-1.5 text-xs h-8 hover:bg-[#1E3A5F] hover:text-white hover:border-[#1E3A5F] transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visiter</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <DashboardTab products={products} blogPosts={blogPosts} t={t} navigate={navigate} />
              </motion.div>
            )}
            {activeTab === 'products' && (
              <motion.div key="products" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <ProductsTab products={products} categories={categories} getProductName={getProductName} language={language} t={t} refresh={refresh} />
              </motion.div>
            )}
            {activeTab === 'blog' && (
              <motion.div key="blog" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <BlogTab blogPosts={blogPosts} language={language} t={t} refresh={refresh} />
              </motion.div>
            )}
            {activeTab === 'quotes' && (
              <motion.div key="quotes" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <QuotesTab t={t} refresh={refresh} />
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div key="settings" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <SettingsTab t={t} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// ============ Login Screen ============
function AdminLogin({ onLogin, t }: { onLogin: (p: string) => boolean; t: (k: string) => string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setShowError(true);
      return;
    }
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
      setShowError(true);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0F2440 50%, #1a3a5f 100%)` }}
    >
      {/* Dental-themed background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="dental-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <text x="10" y="30" fontSize="20" fill="white">🦷</text>
              <text x="50" y="70" fontSize="16" fill="white">⚙</text>
              <text x="35" y="45" fontSize="14" fill="white">✦</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dental-pattern)" />
        </svg>
      </div>

      {/* Decorative floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full opacity-10" style={{ background: GOLD, filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full opacity-10" style={{ background: '#3B8C6E', filter: 'blur(60px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-0 shadow-2xl overflow-hidden rounded-2xl">
          {/* Gold accent line at top */}
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${GOLD}, #D4A84A, ${GOLD})` }} />
          <CardContent className="p-8 sm:p-10">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg mb-4"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #2A5F8F)` }}
              >
                ODG
              </motion.div>
              <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
                {t('admin.login.title')}
              </h1>
              <p className="text-gray-400 text-sm mt-1">OUADAH Dental Groupe</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: NAVY }}>
                  {t('admin.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="password"
                    placeholder={t('admin.login.password')}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                      setShowError(false);
                    }}
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>

              <AnimatePresence>
                {(error || showError) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center gap-2 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEF2F2', color: DANGER }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {error ? t('admin.login.error') : 'Veuillez entrer un mot de passe'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${NAVY}, #2A5F8F)` }}
              >
                <Lock className="w-4 h-4 mr-2" />
                {t('admin.login.submit')}
              </Button>
            </form>

            {/* Forgot password link */}
            <div className="mt-5 text-center">
              <button className="text-xs text-gray-400 hover:text-[#1E3A5F] transition-colors hover:underline">
                Mot de passe oublié ?
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============ Dashboard ============
function DashboardTab({ products, blogPosts, t, navigate }: { products: any[]; blogPosts: any[]; t: (k: string) => string; navigate: (path: string) => void }) {
  const stats = [
    { icon: Package, label: t('admin.dashboard.totalProducts'), value: products.length, trend: '+2', trendUp: true, color: NAVY, bg: '#EEF2F7' },
    { icon: ClipboardList, label: t('admin.dashboard.totalQuotes'), value: 12, trend: '+5', trendUp: true, color: SUCCESS, bg: '#ECFDF5' },
    { icon: TrendingUp, label: t('admin.dashboard.newQuotes'), value: 3, trend: '+1', trendUp: true, color: GOLD, bg: '#FFFBEB' },
    { icon: BookOpen, label: t('admin.dashboard.totalBlog'), value: blogPosts.length, trend: '0', trendUp: true, color: WARNING, bg: '#FFF7ED' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Ajouter produit', color: NAVY, onClick: () => navigate('/admin-products') },
    { icon: FileText, label: 'Nouvel article', color: SUCCESS, onClick: () => navigate('/admin-blog') },
    { icon: ClipboardList, label: 'Voir les devis', color: WARNING, onClick: () => navigate('/admin-quotes') },
    { icon: Settings, label: 'Paramètres', color: '#6B7280', onClick: () => navigate('/admin-settings') },
  ];

  const recentActivity = [
    { icon: Package, text: 'Nouveau produit ajouté', time: 'Il y a 2h', color: NAVY },
    { icon: MessageSquare, text: 'Nouvelle demande de devis', time: 'Il y a 5h', color: GOLD },
    { icon: FileText, label: 'Article publié', text: 'Article de blog publié', time: 'Hier', color: SUCCESS },
    { icon: Users, text: 'Nouveau client enregistré', time: 'Il y a 2 jours', color: WARNING },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                    {stat.trend !== '0' && (
                      <Badge
                        className="text-[10px] px-1.5 py-0.5 font-medium border-0"
                        style={{
                          backgroundColor: stat.trendUp ? '#ECFDF5' : '#FEF2F2',
                          color: stat.trendUp ? SUCCESS : DANGER,
                        }}
                      >
                        {stat.trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold" style={{ color: NAVY }}>{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Two column: Recent Quotes Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Quotes Table */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ color: NAVY }}>
                Derniers devis
              </CardTitle>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5" style={{ borderColor: GOLD, color: NAVY }}>
                3 nouveaux
              </Badge>
            </div>
            <div className="h-0.5 w-12 rounded-full mt-2" style={{ backgroundColor: GOLD }} />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Client</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Date</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Total</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Dr. Benali', date: '15/06/2026', total: 'Sur devis', status: 'pending' },
                    { name: 'Clinique El Amel', date: '14/06/2026', total: 'Sur devis', status: 'contacted' },
                    { name: 'Dr. Mansouri', date: '13/06/2026', total: 'Sur devis', status: 'completed' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium" style={{ color: NAVY }}>{row.name}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs">{row.date}</td>
                      <td className="py-3 px-3 text-gray-600 text-xs">{row.total}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className="text-[10px] px-2 py-0.5 border-0 font-medium"
                          style={{
                            backgroundColor: row.status === 'pending' ? '#FEF3C7' : row.status === 'contacted' ? '#DBEAFE' : '#D1FAE5',
                            color: row.status === 'pending' ? WARNING : row.status === 'contacted' ? '#2563EB' : SUCCESS,
                          }}
                        >
                          {row.status === 'pending' ? 'En attente' : row.status === 'contacted' ? 'Contacté' : 'Traité'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold" style={{ color: NAVY }}>
              Activité récente
            </CardTitle>
            <div className="h-0.5 w-12 rounded-full mt-2" style={{ backgroundColor: GOLD }} />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm rounded-xl">
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-sm font-semibold" style={{ color: NAVY }}>
            Actions rapides
          </CardTitle>
          <div className="h-0.5 w-12 rounded-full mt-2" style={{ backgroundColor: GOLD }} />
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200 bg-white"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${action.color}12` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============ Products Tab ============
function ProductsTab({ products, categories, getProductName, language, t, refresh }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState({
    name_fr: '',
    name_ar: '',
    price: '',
    category_id: '',
    description_fr: '',
    brand: '',
    ref: '',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const name = getProductName(p, language).toLowerCase();
      const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase()) || (p.brand || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.category_id === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, filterCategory, language, getProductName]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find((c: any) => c.id === catId);
    return cat ? cat.name_fr : '';
  };

  const startEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: String(product.price),
      category_id: product.category_id,
      description_fr: product.description_fr || '',
      brand: product.brand || '',
      ref: product.ref || '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name_fr: '', name_ar: '', price: '', category_id: '', description_fr: '', brand: '', ref: '' });
    setEditProduct(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.name_fr.trim()) {
      toast.error('Le nom du produit est requis');
      return;
    }
    setSaving(true);
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) {
        toast.error('Supabase non configuré');
        resetForm();
        setSaving(false);
        return;
      }

      const data = {
        name_fr: form.name_fr,
        name_ar: form.name_ar,
        price: Number(form.price),
        category_id: form.category_id,
        description_fr: form.description_fr,
        brand: form.brand,
        ref: form.ref,
      };

      if (editProduct) {
        await supabase.from('products').update(data).eq('id', editProduct.id);
        toast.success('Produit mis à jour avec succès');
      } else {
        await supabase.from('products').insert([{ ...data, slug: form.name_fr.toLowerCase().replace(/\s+/g, '-') }]);
        toast.success('Produit ajouté avec succès');
      }
      refresh();
      resetForm();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('products').delete().eq('id', id);
      refresh();
      toast.success('Produit supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
    setDeleteConfirm(null);
  };

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price) || price === 0) return 'Sur devis';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg" style={{ color: NAVY }}>
            {t('admin.products.title')}
          </h2>
          <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: GOLD }} />
        </div>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gap-2 rounded-xl shadow-sm h-9"
          style={{ backgroundColor: NAVY }}
        >
          <Plus className="w-4 h-4" />
          {t('admin.products.add')}
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="border-0 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-lg border-gray-200 text-sm"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48 h-9 rounded-lg text-sm">
                <Filter className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name_fr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Form Modal */}
      <Dialog open={showForm} onOpenChange={(open) => { if (!open) resetForm(); }}>
        <DialogContent className="sm:max-w-2xl rounded-xl p-0 overflow-hidden">
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${NAVY}, ${GOLD})` }} />
          <DialogHeader className="px-6 pt-5">
            <DialogTitle style={{ color: NAVY }}>
              {editProduct ? t('admin.products.edit') : t('admin.products.add')}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">
              {editProduct ? 'Modifier les informations du produit' : 'Remplissez les informations du nouveau produit'}
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto py-4">
            {/* Two column: Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('admin.products.name')} (FR) *</label>
                <Input value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} className="h-9 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('admin.products.name')} (AR)</label>
                <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} dir="rtl" className="h-9 rounded-lg text-sm" />
              </div>
            </div>
            {/* Two column: Price + Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('admin.products.price')} (DA)</label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-9 rounded-lg text-sm" placeholder="0 = Sur devis" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('admin.products.category')}</label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger className="h-9 rounded-lg text-sm"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name_fr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Two column: Brand + Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('products.brand')}</label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="h-9 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">{t('products.ref')}</label>
                <Input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} className="h-9 rounded-lg text-sm" />
              </div>
            </div>
            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">{t('admin.products.description')}</label>
              <Textarea rows={3} value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} className="rounded-lg text-sm resize-none" />
            </div>
          </div>
          <DialogFooter className="px-6 pb-5 pt-2 gap-2">
            <Button variant="outline" onClick={resetForm} className="rounded-lg h-9 text-sm">
              {t('admin.products.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-lg h-9 text-sm" style={{ backgroundColor: NAVY }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Enregistrement...' : t('admin.products.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: NAVY }}>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500">
              Cette action est irréversible. Êtes-vous sûr de vouloir supprimer ce produit ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="rounded-lg text-white" style={{ backgroundColor: DANGER }}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">Aucun produit trouvé</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product: any, i: number) => {
            const catName = getCategoryName(product.category_id);
            const isPriceOnQuote = !product.price || product.price === 0;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden group">
                  {/* Image placeholder */}
                  <div className="h-36 relative overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={getProductName(product, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {/* Category badge */}
                    {catName && (
                      <Badge className="absolute top-2 left-2 text-[10px] px-2 py-0.5 border-0 font-medium" style={{ backgroundColor: 'rgba(30,58,95,0.85)', color: 'white' }}>
                        {catName}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm truncate" style={{ color: NAVY }}>
                      {getProductName(product, language)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      {product.brand && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-gray-200 text-gray-500">
                          {product.brand}
                        </Badge>
                      )}
                      {product.ref && (
                        <span className="text-[10px] text-gray-400">#{product.ref}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-sm font-semibold" style={{ color: isPriceOnQuote ? WARNING : NAVY }}>
                        {formatPrice(product.price)}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50" onClick={() => startEdit(product)}>
                          <Pencil className="w-3 h-3 text-blue-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50" onClick={() => setDeleteConfirm(product.id)}>
                          <Trash2 className="w-3 h-3 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============ Blog Tab ============
function BlogTab({ blogPosts, language, t, refresh }: any) {
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title_fr: '',
    title_ar: '',
    excerpt_fr: '',
    excerpt_ar: '',
    content_fr: '',
    content_ar: '',
    category: '',
    author: 'ODG Team',
  });

  const handleSave = async () => {
    if (!form.title_fr.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    setSaving(true);
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) {
        toast.error('Supabase non configuré');
        setShowForm(false);
        setSaving(false);
        return;
      }

      await supabase.from('blog_posts').insert([{
        title_fr: form.title_fr,
        title_ar: form.title_ar,
        excerpt_fr: form.excerpt_fr,
        excerpt_ar: form.excerpt_ar,
        content_fr: form.content_fr,
        content_ar: form.content_ar,
        category: form.category,
        author: form.author,
        slug: form.title_fr.toLowerCase().replace(/\s+/g, '-').substring(0, 60),
        date: new Date().toISOString().split('T')[0],
        read_time: 5,
        tags: [],
      }]);
      refresh();
      toast.success('Article ajouté avec succès');
      setShowForm(false);
      setForm({ title_fr: '', title_ar: '', excerpt_fr: '', excerpt_ar: '', content_fr: '', content_ar: '', category: '', author: 'ODG Team' });
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('blog_posts').delete().eq('id', id);
      refresh();
      toast.success('Article supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR'); } catch { return d; }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg" style={{ color: NAVY }}>{t('admin.blog.title')}</h2>
          <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: GOLD }} />
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 rounded-xl shadow-sm h-9" style={{ backgroundColor: NAVY }}>
          <Plus className="w-4 h-4" />
          {t('admin.blog.add')}
        </Button>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-2xl rounded-xl p-0 overflow-hidden">
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${NAVY}, ${GOLD})` }} />
          <DialogHeader className="px-6 pt-5">
            <DialogTitle style={{ color: NAVY }}>Nouvel article</DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">Rédigez un nouvel article pour le blog</DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Titre (FR) *</label>
                <Input value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} className="h-9 rounded-lg text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">عنوان (AR)</label>
                <Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" className="h-9 rounded-lg text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Extrait (FR)</label>
                <Textarea rows={2} value={form.excerpt_fr} onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })} className="rounded-lg text-sm resize-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">مقتطف (AR)</label>
                <Textarea rows={2} value={form.excerpt_ar} onChange={(e) => setForm({ ...form, excerpt_ar: e.target.value })} dir="rtl" className="rounded-lg text-sm resize-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Contenu (FR)</label>
              <Textarea rows={4} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} className="rounded-lg text-sm resize-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Catégorie</label>
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-9 rounded-lg text-sm" />
            </div>
          </div>
          <DialogFooter className="px-6 pb-5 pt-2 gap-2">
            <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-lg h-9 text-sm">
              {t('admin.products.cancel')}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-lg h-9 text-sm" style={{ backgroundColor: NAVY }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Enregistrement...' : t('admin.products.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Cards */}
      {blogPosts.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">Aucun article pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogPosts.map((post: any, i: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden group">
                {/* Featured Image */}
                <div className="h-36 relative overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                  {post.image_url ? (
                    <img src={post.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${NAVY}15, ${GOLD}15)` }}>
                      <BookOpen className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <Badge
                    className="absolute top-2 right-2 text-[10px] px-2 py-0.5 border-0 font-medium"
                    style={{
                      backgroundColor: post.status === 'published' ? '#D1FAE5' : '#FEF3C7',
                      color: post.status === 'published' ? SUCCESS : WARNING,
                    }}
                  >
                    {post.status === 'published' ? 'Publié' : 'Brouillon'}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2" style={{ color: NAVY }}>
                    {language === 'ar' ? post.title_ar : post.title_fr}
                  </h3>
                  {(post.excerpt_fr || post.excerpt_ar) && (
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                      {language === 'ar' ? post.excerpt_ar : post.excerpt_fr}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.date)}
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50" onClick={() => handleDelete(post.id)}>
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============ Quotes Tab ============
function QuotesTab({ t, refresh }: { t: (k: string) => string; refresh: () => void }) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchQuotes = async () => {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      const { data } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
      if (data) setQuotes(data);
      setLoading(false);
    };
    fetchQuotes();
  }, [refresh]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('quotes').update({ status }).eq('id', id);
      setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
      toast.success('Statut mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const statusConfig: Record<string, { bg: string; color: string; label: string; icon: any }> = {
    new: { bg: '#DBEAFE', color: '#2563EB', label: t('admin.quotes.new'), icon: AlertCircle },
    in_progress: { bg: '#FEF3C7', color: WARNING, label: t('admin.quotes.inProgress'), icon: Clock },
    processed: { bg: '#D1FAE5', color: SUCCESS, label: t('admin.quotes.processed'), icon: CheckCircle2 },
    archived: { bg: '#F3F4F6', color: '#6B7280', label: t('admin.quotes.archived'), icon: FileCheck },
  };

  const filteredQuotes = filterStatus === 'all' ? quotes : quotes.filter(q => q.status === filterStatus);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="border-0 shadow-sm rounded-xl">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-lg" style={{ color: NAVY }}>{t('admin.quotes.title')}</h2>
          <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: GOLD }} />
        </div>
        <div className="flex items-center gap-2">
          <Badge className="text-xs px-3 py-1 border-0" style={{ backgroundColor: '#DBEAFE', color: '#2563EB' }}>
            {quotes.filter(q => q.status === 'new').length} Nouveaux
          </Badge>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-8 rounded-lg text-xs">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="new">{t('admin.quotes.new')}</SelectItem>
              <SelectItem value="in_progress">{t('admin.quotes.inProgress')}</SelectItem>
              <SelectItem value="processed">{t('admin.quotes.processed')}</SelectItem>
              <SelectItem value="archived">{t('admin.quotes.archived')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <Card className="border-0 shadow-sm rounded-xl">
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-400 text-sm">Aucun devis pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuotes.map((quote, i) => {
            const sc = statusConfig[quote.status] || statusConfig.new;
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden">
                  {/* Status accent line */}
                  <div className="h-1" style={{ backgroundColor: sc.color }} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate" style={{ color: NAVY }}>
                          {quote.nom}
                        </h3>
                      </div>
                      <Badge
                        className="text-[10px] px-2 py-0.5 border-0 font-medium shrink-0 flex items-center gap-1"
                        style={{ backgroundColor: sc.bg, color: sc.color }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </Badge>
                    </div>

                    {/* Customer info */}
                    <div className="space-y-1.5 mb-4">
                      {quote.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{quote.email}</span>
                        </div>
                      )}
                      {quote.telephone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3 text-gray-400 shrink-0" />
                          {quote.telephone}
                        </div>
                      )}
                      {quote.wilaya && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          {quote.wilaya} {quote.type_client ? `• ${quote.type_client}` : ''}
                        </div>
                      )}
                    </div>

                    {quote.message && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4 bg-gray-50 p-2 rounded-lg">
                        {quote.message}
                      </p>
                    )}

                    <Separator className="mb-3" />

                    <div className="flex items-center justify-between">
                      <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {quote.created_at ? new Date(quote.created_at).toLocaleDateString('fr-FR') : ''}
                      </div>
                      <Select
                        value={quote.status}
                        onValueChange={(v) => updateStatus(quote.id, v)}
                      >
                        <SelectTrigger className="w-32 h-7 text-[10px] rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">{t('admin.quotes.new')}</SelectItem>
                          <SelectItem value="in_progress">{t('admin.quotes.inProgress')}</SelectItem>
                          <SelectItem value="processed">{t('admin.quotes.processed')}</SelectItem>
                          <SelectItem value="archived">{t('admin.quotes.archived')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============ Settings Tab ============
function SettingsTab({ t }: { t: (k: string) => string }) {
  const [settings, setSettings] = useState({
    brand_name: 'ODG',
    logo_url: '',
    phone: '+213 771 88 89 48',
    email: 'groupedentalimport@gmail.com',
    address: "Coopérative Azzouz Abdelkader, N°45, Oran",
    facebook: 'https://facebook.com/odg.algeria',
    instagram: 'https://instagram.com/odg.algeria',
    linkedin: 'https://linkedin.com/company/odg-algeria',
  });
  const [savingSection, setSavingSection] = useState<string | null>(null);

  const handleSaveSection = async (section: string) => {
    setSavingSection(section);
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (isSupabaseConfigured && supabase) {
        const sectionKeys: Record<string, string[]> = {
          general: ['brand_name', 'logo_url'],
          contact: ['phone', 'email', 'address'],
          social: ['facebook', 'instagram', 'linkedin'],
        };
        const keys = sectionKeys[section] || [];
        for (const key of keys) {
          await supabase
            .from('site_settings')
            .upsert({ key, value_fr: settings[key as keyof typeof settings], category: section, type: 'text' }, { onConflict: 'key' });
        }
      }
      toast.success(t('admin.settings.saved'));
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
    setSavingSection(null);
  };

  const sectionCard = (title: string, section: string, icon: any, children: React.ReactNode) => {
    const Icon = icon;
    return (
      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100" style={{ backgroundColor: '#f8fafc' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${NAVY}12` }}>
              <Icon className="w-4 h-4" style={{ color: NAVY }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: NAVY }}>{title}</h3>
          </div>
          <Button
            onClick={() => handleSaveSection(section)}
            disabled={savingSection === section}
            size="sm"
            className="gap-1.5 h-8 rounded-lg text-xs"
            style={{ backgroundColor: NAVY }}
          >
            {savingSection === section ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {savingSection === section ? '...' : t('admin.settings.save')}
          </Button>
        </div>
        <CardContent className="p-5">
          {children}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-bold text-lg" style={{ color: NAVY }}>{t('admin.settings.title')}</h2>
        <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: GOLD }} />
      </div>

      {/* General Section */}
      {sectionCard(t('admin.settings.logo'), 'general', Globe, (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Nom de marque</label>
            <Input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Logo URL</label>
            <Input value={settings.logo_url} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
        </div>
      ))}

      {/* Contact Section */}
      {sectionCard(t('admin.settings.contact'), 'contact', Phone, (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">{t('contact.phone')}</label>
            <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">{t('contact.email')}</label>
            <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-gray-600">{t('contact.address')}</label>
            <Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
        </div>
      ))}

      {/* Social Section */}
      {sectionCard(t('admin.settings.social'), 'social', Globe, (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Facebook</label>
            <Input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Instagram</label>
            <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">LinkedIn</label>
            <Input value={settings.linkedin} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
