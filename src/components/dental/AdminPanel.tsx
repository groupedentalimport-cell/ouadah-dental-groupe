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
  ChevronLeft,
  Menu,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { useAdminAuth } from '@/lib/admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type AdminTab = 'dashboard' | 'products' | 'blog' | 'quotes' | 'settings';

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

  // Login screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#1E3A5F] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} t={t} />;
  }

  const tabs = [
    { id: 'dashboard' as AdminTab, icon: <LayoutDashboard className="w-5 h-5" />, label: t('nav.dashboard'), path: '/admin-dashboard' },
    { id: 'products' as AdminTab, icon: <Package className="w-5 h-5" />, label: t('nav.products'), path: '/admin-products' },
    { id: 'blog' as AdminTab, icon: <FileText className="w-5 h-5" />, label: t('nav.blogPosts'), path: '/admin-blog' },
    { id: 'quotes' as AdminTab, icon: <ClipboardList className="w-5 h-5" />, label: t('nav.quotes'), path: '/admin-quotes' },
    { id: 'settings' as AdminTab, icon: <Settings className="w-5 h-5" />, label: t('nav.settings'), path: '/admin-settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg">ODG Admin</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <nav className="p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.path);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('nav.logout')}
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <Eye className="w-4 h-4 mr-1" />
            Site
          </Button>
        </header>

        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <DashboardTab key="dashboard" products={products} blogPosts={blogPosts} t={t} />
            )}
            {activeTab === 'products' && (
              <ProductsTab key="products" products={products} categories={categories} getProductName={getProductName} language={language} t={t} refresh={refresh} />
            )}
            {activeTab === 'blog' && (
              <BlogTab key="blog" blogPosts={blogPosts} language={language} t={t} refresh={refresh} />
            )}
            {activeTab === 'quotes' && (
              <QuotesTab key="quotes" t={t} refresh={refresh} />
            )}
            {activeTab === 'settings' && (
              <SettingsTab key="settings" t={t} />
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(password)) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-sm border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl"
              style={{ backgroundColor: '#1E3A5F' }}
            >
              ODG
            </div>
            <h1 className="text-xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
              {t('admin.login.title')}
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder={t('admin.login.password')}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className="text-center"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{t('admin.login.error')}</p>
              )}
              <Button type="submit" className="w-full" style={{ backgroundColor: '#1E3A5F' }}>
                <Lock className="w-4 h-4 mr-2" />
                {t('admin.login.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============ Dashboard ============
function DashboardTab({ products, blogPosts, t }: { products: any[]; blogPosts: any[]; t: (k: string) => string }) {
  const stats = [
    { icon: <Package className="w-6 h-6" />, label: t('admin.dashboard.totalProducts'), value: products.length, color: '#1E3A5F' },
    { icon: <ClipboardList className="w-6 h-6" />, label: t('admin.dashboard.totalQuotes'), value: 0, color: '#2d5a8e' },
    { icon: <TrendingUp className="w-6 h-6" />, label: t('admin.dashboard.newQuotes'), value: 0, color: '#F0C05A' },
    { icon: <BookOpen className="w-6 h-6" />, label: t('admin.dashboard.totalBlog'), value: blogPosts.length, color: '#3b7dd8' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: '#1E3A5F' }}>{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// ============ Products Tab ============
function ProductsTab({ products, categories, getProductName, language, t, refresh }: any) {
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({
    name_fr: '',
    name_ar: '',
    price: '',
    category_id: '',
    description_fr: '',
    brand: '',
    ref: '',
  });

  const startEdit = (product: any) => {
    setEditProduct(product);
    setForm({
      name_fr: product.name_fr,
      name_ar: product.name_ar,
      price: String(product.price),
      category_id: product.category_id,
      description_fr: product.description_fr,
      brand: product.brand,
      ref: product.ref,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name_fr: '', name_ar: '', price: '', category_id: '', description_fr: '', brand: '', ref: '' });
    setEditProduct(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (!isSupabaseConfigured || !supabase) {
      resetForm();
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
    } else {
      await supabase.from('products').insert([{ ...data, slug: form.name_fr.toLowerCase().replace(/\s+/g, '-') }]);
    }
    refresh();
    resetForm();
  };

  const handleDelete = async (id: string) => {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('products').delete().eq('id', id);
    refresh();
  };

  const formatPrice = (price: number | undefined) => {
    if (price == null || isNaN(price)) return '— DA';
    return price.toLocaleString('fr-DZ') + ' DA';
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>
          {t('admin.products.title')}
        </h2>
        <Button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="gap-2"
          style={{ backgroundColor: '#1E3A5F' }}
        >
          <Plus className="w-4 h-4" />
          {t('admin.products.add')}
        </Button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" style={{ color: '#1E3A5F' }}>
                    {editProduct ? t('admin.products.edit') : t('admin.products.add')}
                  </h3>
                  <Button variant="ghost" size="icon" onClick={resetForm}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('admin.products.name')} (FR)</label>
                    <Input value={form.name_fr} onChange={(e) => setForm({ ...form, name_fr: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('admin.products.name')} (AR)</label>
                    <Input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })} dir="rtl" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('admin.products.price')}</label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('admin.products.category')}</label>
                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name_fr}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('products.brand')}</label>
                    <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">{t('products.ref')}</label>
                    <Input value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t('admin.products.description')}</label>
                  <Textarea rows={3} value={form.description_fr} onChange={(e) => setForm({ ...form, description_fr: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2" style={{ backgroundColor: '#1E3A5F' }}>
                    <Save className="w-4 h-4" />
                    {t('admin.products.save')}
                  </Button>
                  <Button variant="outline" onClick={resetForm}>{t('admin.products.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product List */}
      <div className="space-y-2">
        {products.map((product: any) => (
          <Card key={product.id} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#f0f4f8' }}>
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#1E3A5F' }}>
                  {getProductName(product, language)}
                </p>
                <p className="text-xs text-gray-500">{product.brand} • {product.ref}</p>
              </div>
              <span className="text-sm font-medium shrink-0">{formatPrice(product.price)}</span>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(product)}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(product.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// ============ Blog Tab ============
function BlogTab({ blogPosts, language, t, refresh }: any) {
  const [showForm, setShowForm] = useState(false);
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
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (!isSupabaseConfigured || !supabase) {
      setShowForm(false);
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
    setShowForm(false);
    setForm({ title_fr: '', title_ar: '', excerpt_fr: '', excerpt_ar: '', content_fr: '', content_ar: '', category: '', author: 'ODG Team' });
  };

  const handleDelete = async (id: string) => {
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    refresh();
  };

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR'); } catch { return d; }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>{t('admin.blog.title')}</h2>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2" style={{ backgroundColor: '#1E3A5F' }}>
          <Plus className="w-4 h-4" />
          {t('admin.blog.add')}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Titre (FR)</label>
                    <Input value={form.title_fr} onChange={(e) => setForm({ ...form, title_fr: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">عنوان (AR)</label>
                    <Input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} dir="rtl" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Extrait (FR)</label>
                    <Textarea rows={2} value={form.excerpt_fr} onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">مقتطف (AR)</label>
                    <Textarea rows={2} value={form.excerpt_ar} onChange={(e) => setForm({ ...form, excerpt_ar: e.target.value })} dir="rtl" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Contenu (FR)</label>
                  <Textarea rows={4} value={form.content_fr} onChange={(e) => setForm({ ...form, content_fr: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Catégorie</label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2" style={{ backgroundColor: '#1E3A5F' }}>
                    <Save className="w-4 h-4" />{t('admin.products.save')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>{t('admin.products.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {blogPosts.map((post: any) => (
          <Card key={post.id} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: '#1E3A5F' }}>
                  {language === 'ar' ? post.title_ar : post.title_fr}
                </p>
                <p className="text-xs text-gray-500">{post.author} • {formatDate(post.date)}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(post.id)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </motion.div>
  );
}

// ============ Quotes Tab ============
function QuotesTab({ t, refresh }: { t: (k: string) => string; refresh: () => void }) {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('quotes').update({ status }).eq('id', id);
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    processed: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  const statusLabels: Record<string, string> = {
    new: t('admin.quotes.new'),
    in_progress: t('admin.quotes.inProgress'),
    processed: t('admin.quotes.processed'),
    archived: t('admin.quotes.archived'),
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>{t('admin.quotes.title')}</h2>

      {quotes.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center text-gray-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun devis pour le moment</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {quotes.map((quote) => (
            <Card key={quote.id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{quote.nom}</p>
                    <p className="text-xs text-gray-500">{quote.email} • {quote.telephone}</p>
                    <p className="text-xs text-gray-400">{quote.wilaya} • {quote.type_client}</p>
                    {quote.message && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{quote.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={statusColors[quote.status] || statusColors.new}>
                      {statusLabels[quote.status] || quote.status}
                    </Badge>
                    <Select
                      value={quote.status}
                      onValueChange={(v) => updateStatus(quote.id, v)}
                    >
                      <SelectTrigger className="w-32 h-7 text-xs">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
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
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured && supabase) {
      for (const [key, value] of Object.entries(settings)) {
        await supabase
          .from('site_settings')
          .upsert({ key, value_fr: value, category: key.split('_')[0], type: 'text' }, { onConflict: 'key' });
      }
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <h2 className="font-bold text-lg" style={{ color: '#1E3A5F' }}>{t('admin.settings.title')}</h2>

      {saved && (
        <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {t('admin.settings.saved')}
        </div>
      )}

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{t('admin.settings.logo')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nom de marque</label>
              <Input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Logo URL</label>
              <Input value={settings.logo_url} onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{t('admin.settings.contact')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">{t('contact.phone')}</label>
              <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">{t('contact.email')}</label>
              <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">{t('contact.address')}</label>
              <Input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 space-y-4">
          <h3 className="font-semibold text-sm" style={{ color: '#1E3A5F' }}>{t('admin.settings.social')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Facebook</label>
              <Input value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Instagram</label>
              <Input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">LinkedIn</label>
              <Input value={settings.linkedin} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="gap-2"
        style={{ backgroundColor: '#1E3A5F' }}
      >
        <Save className="w-4 h-4" />
        {saving ? t('common.loading') : t('admin.settings.save')}
      </Button>
    </motion.div>
  );
}
