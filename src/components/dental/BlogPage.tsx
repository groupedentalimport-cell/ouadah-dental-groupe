'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Package, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { blogPosts } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allCategories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return blogPosts;
    return blogPosts.filter((p) => p.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {t('blog.title')}
            </h1>
            <p className="text-blue-200">{t('blog.subtitle')}</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
              }`}
              style={selectedCategory === cat ? { backgroundColor: '#1E3A5F' } : {}}
            >
              {cat === 'all' ? t('products.all') : cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="group border-0 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/article/${post.slug}`)}
                >
                  <div className="h-48 overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={language === 'ar' ? post.title_ar : post.title_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5a8e)' }}
                      >
                        <span className="text-white/50 text-4xl font-bold">ODG</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-[10px]">
                          {post.category}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.read_time} {t('blog.readTime')}
                      </span>
                    </div>
                    <h3
                      className="font-bold text-base mb-2 line-clamp-2 group-hover:text-[#1E3A5F] transition-colors"
                      style={{ color: '#1E3A5F' }}
                    >
                      {language === 'ar' ? post.title_ar : post.title_fr}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
                      {language === 'ar' ? post.excerpt_ar : post.excerpt_fr}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
                      <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#1E3A5F' }}>
                        {t('blog.readMore')}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
