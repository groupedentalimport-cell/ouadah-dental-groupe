'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
  Bell,
  Download,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Upload,
  Home,
  ChevronDown,
  Clock3,
  Sun,
  Moon,
  ArrowUp,
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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

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

// Mock data for charts
const monthlyQuotesData = [
  { name: 'Jan', quotes: 8, revenue: 2400000 },
  { name: 'Fév', quotes: 12, revenue: 3600000 },
  { name: 'Mar', quotes: 15, revenue: 4500000 },
  { name: 'Avr', quotes: 10, revenue: 3000000 },
  { name: 'Mai', quotes: 18, revenue: 5400000 },
  { name: 'Jun', quotes: 22, revenue: 6600000 },
];

// Mock data for recent orders
const recentOrders = [
  { id: 'ORD-001', client: 'Dr. Benali', product: 'Fauteuil Osstem', date: '15/06/2026', status: 'delivered' },
  { id: 'ORD-002', client: 'Clinique El Amel', product: 'Radio Owandy', date: '14/06/2026', status: 'processing' },
  { id: 'ORD-003', client: 'Dr. Mansouri', product: 'Autoclave W&H', date: '13/06/2026', status: 'shipped' },
  { id: 'ORD-004', client: 'Dr. Khelifi', product: 'Compresseur Dürr', date: '12/06/2026', status: 'pending' },
  { id: 'ORD-005', client: 'Polyclinique Saida', product: 'Unité Ritter', date: '11/06/2026', status: 'delivered' },
];

// Mock notifications
const mockNotifications = [
  { id: 1, icon: ClipboardList, text: 'Nouvelle demande de devis', time: 'Il y a 5 min', color: GOLD, read: false },
  { id: 2, icon: Package, text: 'Produit en rupture de stock', time: 'Il y a 1h', color: DANGER, read: false },
  { id: 3, icon: MessageSquare, text: 'Nouveau message client', time: 'Il y a 3h', color: NAVY, read: true },
  { id: 4, icon: CheckCircle2, text: 'Devis #12 traité avec succès', time: 'Hier', color: SUCCESS, read: true },
];

// Animated Counter Component
function AnimatedCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

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
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Breadcrumb helper
  const getBreadcrumbItems = () => {
    const items = [{ label: 'ODG Admin', onClick: () => navigate('/admin-dashboard') }];
    const currentTab = tabs.find((tb) => tb.id === activeTab);
    if (currentTab) {
      items.push({ label: currentTab.label, onClick: () => {} });
    }
    return items;
  };

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
            {/* Notification Bell */}
            <NotificationBell t={t} />

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

        {/* Breadcrumb Navigation */}
        <div className="px-4 sm:px-6 py-2 border-b" style={{ borderColor: '#f1f5f9' }}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  className="cursor-pointer text-xs text-gray-400 hover:text-[#1E3A5F] flex items-center gap-1"
                  onClick={() => navigate('/admin-dashboard')}
                >
                  <Home className="w-3 h-3" />
                  Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              {getBreadcrumbItems().slice(1).map((item, i, arr) => (
                <React.Fragment key={i}>
                  <BreadcrumbSeparator className="text-gray-300">
                    <ChevronRight className="w-3 h-3" />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem>
                    {i === arr.length - 1 ? (
                      <BreadcrumbPage className="text-xs font-medium" style={{ color: NAVY }}>
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink className="cursor-pointer text-xs text-gray-400" onClick={item.onClick}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="flex-1 p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                <DashboardTab products={products} blogPosts={blogPosts} t={t} navigate={navigate} language={language} />
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

        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
              style={{ backgroundColor: NAVY }}
              title={t('general.back_to_top')}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============ Notification Bell ============
function NotificationBell({ t }: { t: (k: string) => string }) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-4.5 h-4.5 text-gray-500" />
          {unreadCount > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: DANGER, width: '18px', height: '18px' }}
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 rounded-xl p-0 overflow-hidden">
        <div className="px-4 py-3 flex items-center justify-between border-b" style={{ backgroundColor: '#f8fafc' }}>
          <span className="font-semibold text-sm" style={{ color: NAVY }}>{t('admin.notifications')}</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] font-medium hover:underline" style={{ color: NAVY }}>
              Tout marquer lu
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-xs text-gray-400">{t('admin.no_notifications')}</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div
                  key={notif.id}
                  className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${notif.color}15` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: notif.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{notif.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: NAVY }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============ Login Screen ============
function AdminLogin({ onLogin, t }: { onLogin: (email: string, password: string) => boolean; t: (k: string) => string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setShowError(true);
      return;
    }
    if (!onLogin(email, password)) {
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: NAVY }}>
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="admin@odg.dz"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(false);
                      setShowError(false);
                    }}
                    className="pl-10 h-11 rounded-xl border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium" style={{ color: NAVY }}>
                  {t('admin.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(false);
                      setShowError(false);
                    }}
                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 focus:border-[#1E3A5F] focus:ring-[#1E3A5F]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                      {error ? 'Identifiants incorrects. Veuillez réessayer.' : 'Veuillez remplir tous les champs'}
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
function DashboardTab({ products, blogPosts, t, navigate, language }: { products: any[]; blogPosts: any[]; t: (k: string) => string; navigate: (path: string) => void; language: string }) {
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
    { icon: FileText, text: 'Article de blog publié', time: 'Hier', color: SUCCESS },
    { icon: Users, text: 'Nouveau client enregistré', time: 'Il y a 2 jours', color: WARNING },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats with Animated Counters */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4" style={{ color: NAVY }} />
          <h3 className="text-sm font-semibold" style={{ color: NAVY }}>{t('admin.quick_stats')}</h3>
        </div>
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
                <Card className="border-0 shadow-sm rounded-xl hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="h-0.5" style={{ backgroundColor: stat.color }} />
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
                      <p className="text-2xl font-bold" style={{ color: NAVY }}>
                        <AnimatedCounter target={stat.value} />
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Monthly Quotes Chart */}
      <Card className="border-0 shadow-sm rounded-xl overflow-hidden">
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${NAVY}12` }}>
              <BarChart3 className="w-4 h-4" style={{ color: NAVY }} />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold" style={{ color: NAVY }}>
                {t('admin.monthly_quotes')}
              </CardTitle>
              <p className="text-[10px] text-gray-400">6 derniers mois</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[10px] px-2 py-0.5" style={{ borderColor: SUCCESS, color: SUCCESS }}>
            +32%
          </Badge>
        </div>
        <CardContent className="p-5">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyQuotesData}>
                <defs>
                  <linearGradient id="colorQuotes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NAVY} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={NAVY} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="quotes" stroke={NAVY} strokeWidth={2} fillOpacity={1} fill="url(#colorQuotes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders Table + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-xl">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold" style={{ color: NAVY }}>
                {t('admin.recent_orders')}
              </CardTitle>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5" style={{ borderColor: GOLD, color: NAVY }}>
                5 récentes
              </Badge>
            </div>
            <div className="h-0.5 w-12 rounded-full mt-2" style={{ backgroundColor: GOLD }} />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">{t('admin.order_id')}</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">{t('admin.client_name')}</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Produit</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500 hidden md:table-cell">Date</th>
                    <th className="text-left py-2.5 px-3 text-xs font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-3 font-medium text-xs" style={{ color: NAVY }}>{row.id}</td>
                      <td className="py-3 px-3 text-xs text-gray-700">{row.client}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs hidden sm:table-cell">{row.product}</td>
                      <td className="py-3 px-3 text-gray-500 text-xs hidden md:table-cell">{row.date}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className="text-[10px] px-2 py-0.5 border-0 font-medium"
                          style={{
                            backgroundColor:
                              row.status === 'delivered' ? '#D1FAE5' :
                              row.status === 'processing' ? '#DBEAFE' :
                              row.status === 'shipped' ? '#FEF3C7' : '#F3F4F6',
                            color:
                              row.status === 'delivered' ? SUCCESS :
                              row.status === 'processing' ? '#2563EB' :
                              row.status === 'shipped' ? WARNING : '#6B7280',
                          }}
                        >
                          {row.status === 'delivered' ? 'Livré' :
                           row.status === 'processing' ? 'En cours' :
                           row.status === 'shipped' ? 'Expédié' : 'En attente'}
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
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [productStatuses, setProductStatuses] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({
    name_fr: '',
    name_ar: '',
    price: '',
    category_id: '',
    description_fr: '',
    brand: '',
    ref: '',
    image_url: '',
    specs: [] as { key: string; value: string }[],
  });

  // Initialize product statuses
  useEffect(() => {
    const statuses: Record<string, boolean> = {};
    products.forEach((p: any) => {
      statuses[p.id] = p.active !== false;
    });
    setProductStatuses(statuses);
  }, [products]);

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
      image_url: product.image_url || '',
      specs: product.specs || [],
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name_fr: '', name_ar: '', price: '', category_id: '', description_fr: '', brand: '', ref: '', image_url: '', specs: [] });
    setEditProduct(null);
    setShowForm(false);
    setShowPreview(false);
  };

  const addSpecPair = () => {
    setForm({ ...form, specs: [...form.specs, { key: '', value: '' }] });
  };

  const updateSpecPair = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...form.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: val };
    setForm({ ...form, specs: newSpecs });
  };

  const removeSpecPair = (index: number) => {
    setForm({ ...form, specs: form.specs.filter((_, i) => i !== index) });
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
        image_url: form.image_url,
        specs: form.specs.filter(s => s.key.trim()),
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

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) return;
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      if (!isSupabaseConfigured || !supabase) return;
      await supabase.from('products').delete().in('id', Array.from(selectedProducts));
      refresh();
      toast.success(`${selectedProducts.size} produit(s) supprimé(s)`);
      setSelectedProducts(new Set());
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const toggleProductStatus = (id: string) => {
    setProductStatuses(prev => ({ ...prev, [id]: !prev[id] }));
    toast.success(`Produit ${productStatuses[id] ? 'désactivé' : 'activé'}`);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p: any) => p.id)));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const exportCSV = () => {
    const headers = ['Nom FR', 'Nom AR', 'Prix', 'Catégorie', 'Marque', 'Référence', 'Statut'];
    const rows = filteredProducts.map((p: any) => [
      p.name_fr || '',
      p.name_ar || '',
      p.price || 0,
      getCategoryName(p.category_id),
      p.brand || '',
      p.ref || '',
      productStatuses[p.id] ? t('admin.active') : t('admin.inactive'),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'odg_products.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success(t('admin.export_csv') + ' - OK');
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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="gap-2 rounded-xl shadow-sm h-9"
            style={{ backgroundColor: NAVY }}
          >
            <Plus className="w-4 h-4" />
            {t('admin.products.add')}
          </Button>
          <Button
            variant="outline"
            onClick={exportCSV}
            className="gap-2 rounded-xl h-9 text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {t('admin.export_csv')}
          </Button>
        </div>
      </div>

      {/* Bulk Actions + Search & Filter */}
      <Card className="border-0 shadow-sm rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
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
            {/* Bulk action bar */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 text-xs font-medium hover:underline"
                style={{ color: NAVY }}
              >
                {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? (
                  <CheckSquare className="w-3.5 h-3.5" />
                ) : (
                  <Square className="w-3.5 h-3.5" />
                )}
                {selectedProducts.size === filteredProducts.length && filteredProducts.length > 0 ? t('admin.deselect_all') : t('admin.select_all')}
              </button>
              {selectedProducts.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="gap-1.5 h-7 text-[10px] rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 border-red-200"
                >
                  <Trash2 className="w-3 h-3" />
                  {t('admin.bulk_delete')} ({selectedProducts.size})
                </Button>
              )}
              <span className="text-[10px] text-gray-400 ml-auto">
                {filteredProducts.length} produit(s)
              </span>
            </div>
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
            {/* Image Preview/Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">{t('admin.products.images')} / Image URL</label>
              <div className="flex gap-3 items-start">
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: '#f8fafc' }}>
                  {form.image_url ? (
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <Input
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="h-9 rounded-lg text-sm"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-[10px] text-gray-400">Entrez l&apos;URL de l&apos;image du produit</p>
                </div>
              </div>
            </div>
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
            {/* Specs Key-Value Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-600">{t('products.specs')}</label>
                <Button variant="outline" size="sm" onClick={addSpecPair} className="h-7 text-[10px] gap-1 rounded-lg">
                  <Plus className="w-3 h-3" /> Ajouter
                </Button>
              </div>
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={spec.key}
                    onChange={(e) => updateSpecPair(idx, 'key', e.target.value)}
                    placeholder="Caractéristique"
                    className="h-8 rounded-lg text-xs flex-1"
                  />
                  <Input
                    value={spec.value}
                    onChange={(e) => updateSpecPair(idx, 'value', e.target.value)}
                    placeholder="Valeur"
                    className="h-8 rounded-lg text-xs flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeSpecPair(idx)}>
                    <X className="w-3 h-3 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="px-6 pb-5 pt-2 gap-2">
            <Button variant="outline" onClick={() => setShowPreview(true)} className="rounded-lg h-9 text-sm gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {t('admin.preview')}
            </Button>
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-lg rounded-xl p-0 overflow-hidden">
          <div className="h-1" style={{ background: `linear-gradient(90deg, ${GOLD}, ${NAVY})` }} />
          <DialogHeader className="px-6 pt-5">
            <DialogTitle style={{ color: NAVY }}>{t('admin.preview')}</DialogTitle>
            <DialogDescription className="text-gray-400 text-xs">Aperçu du produit</DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-6">
            <Card className="border border-gray-100 rounded-xl overflow-hidden">
              <div className="h-40 flex items-center justify-center" style={{ backgroundColor: '#f0f4f8' }}>
                {form.image_url ? (
                  <img src={form.image_url} alt={form.name_fr} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
              </div>
              <CardContent className="p-4 space-y-2">
                <h3 className="font-semibold" style={{ color: NAVY }}>{form.name_fr || 'Nom du produit'}</h3>
                {form.brand && <Badge variant="outline" className="text-[10px]">{form.brand}</Badge>}
                <p className="text-sm font-semibold" style={{ color: !form.price || Number(form.price) === 0 ? WARNING : NAVY }}>
                  {formatPrice(Number(form.price))}
                </p>
                {form.description_fr && <p className="text-xs text-gray-500 line-clamp-3">{form.description_fr}</p>}
                {form.specs.length > 0 && form.specs.some(s => s.key.trim()) && (
                  <div className="space-y-1 pt-2 border-t border-gray-100">
                    {form.specs.filter(s => s.key.trim()).map((s, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-gray-500">{s.key}</span>
                        <span className="font-medium" style={{ color: NAVY }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
            const isActive = productStatuses[product.id] !== false;
            const isSelected = selectedProducts.has(product.id);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`border-0 shadow-sm rounded-xl hover:shadow-md transition-all duration-300 overflow-hidden group ${!isActive ? 'opacity-60' : ''} ${isSelected ? 'ring-2' : ''}`} style={isSelected ? { ringColor: GOLD } : {}}>
                  {/* Selection checkbox + Image */}
                  <div className="h-36 relative overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {/* Checkbox overlay */}
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelectProduct(product.id)}
                        className="bg-white/80 border-gray-300"
                      />
                    </div>
                    {product.image_url ? (
                      <img src={product.image_url} alt={getProductName(product, language)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    {/* Category badge */}
                    {catName && (
                      <Badge className="absolute top-2 right-2 text-[10px] px-2 py-0.5 border-0 font-medium" style={{ backgroundColor: 'rgba(30,58,95,0.85)', color: 'white' }}>
                        {catName}
                      </Badge>
                    )}
                    {/* Status toggle */}
                    <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
                      <span className="text-[9px] font-medium" style={{ color: isActive ? SUCCESS : '#94a3b8' }}>
                        {isActive ? t('admin.active') : t('admin.inactive')}
                      </span>
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleProductStatus(product.id)}
                        className="scale-75"
                      />
                    </div>
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
                    <img src={post.image_url} alt={post.title_fr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
    whatsapp: '+21377188948',
    // Business Hours
    hours_mon_fri: '08:00 - 17:00',
    hours_sat: '08:00 - 13:00',
    hours_sun: 'Fermé',
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
          social: ['facebook', 'instagram', 'linkedin', 'whatsapp'],
          hours: ['hours_mon_fri', 'hours_sat', 'hours_sun'],
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

  const handlePreviewChanges = () => {
    window.open('/', '_blank');
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-lg" style={{ color: NAVY }}>{t('admin.settings.title')}</h2>
          <div className="h-0.5 w-12 rounded-full mt-1" style={{ backgroundColor: GOLD }} />
        </div>
        <Button
          onClick={handlePreviewChanges}
          variant="outline"
          className="gap-2 rounded-xl h-9 text-xs"
          style={{ borderColor: GOLD, color: NAVY }}
        >
          <Eye className="w-3.5 h-3.5" />
          {t('admin.preview_changes')}
        </Button>
      </div>

      {/* General / Logo Section */}
      {sectionCard(t('admin.settings.logo'), 'general', Globe, (
        <div className="space-y-4">
          {/* Logo Upload Section */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: '#f8fafc' }}>
              {settings.logo_url ? (
                <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain p-1" />
              ) : (
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto text-gray-300" />
                  <span className="text-[9px] text-gray-400 mt-1 block">{t('admin.logo_upload')}</span>
                </div>
              )}
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-gray-600">Logo URL</label>
              <Input value={settings.logo_url} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} className="h-9 rounded-lg text-sm" placeholder="https://example.com/logo.png" />
              <p className="text-[10px] text-gray-400">Entrez l&apos;URL de votre logo (PNG, SVG recommandé)</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600">Nom de marque</label>
            <Input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} className="h-9 rounded-lg text-sm" />
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

      {/* Social Media Section */}
      {sectionCard(t('admin.social_links'), 'social', Globe, (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Facebook className="w-3.5 h-3.5 text-blue-600" /> Facebook
            </label>
            <Input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-pink-500" /> Instagram
            </label>
            <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-blue-700" /> LinkedIn
            </label>
            <Input value={settings.linkedin} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-green-500" /> {t('admin.whatsapp')}
            </label>
            <Input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} className="h-9 rounded-lg text-sm" placeholder="+213XXXXXXXXX" />
          </div>
        </div>
      ))}

      {/* Business Hours Section */}
      {sectionCard(t('admin.business_hours'), 'hours', Clock3, (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Lundi - Vendredi
            </label>
            <Input value={settings.hours_mon_fri} onChange={(e) => setSettings({ ...settings, hours_mon_fri: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-orange-400" /> Samedi
            </label>
            <Input value={settings.hours_sat} onChange={(e) => setSettings({ ...settings, hours_sat: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-gray-400" /> Dimanche
            </label>
            <Input value={settings.hours_sun} onChange={(e) => setSettings({ ...settings, hours_sun: e.target.value })} className="h-9 rounded-lg text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}
