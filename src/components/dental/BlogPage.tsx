'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Tag, Package, ArrowRight, BookOpen, Flame } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPageSkeleton, ContentWithLoading } from '@/components/dental/Skeletons';

export default function BlogPage() {
  const { t, language, isRTL } = useTranslation();
  const { navigate } = useRouter();
  const { blogPosts, loading } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allCategories = useMemo(() => {
    const cats = new Set(blogPosts.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return blogPosts;
    return blogPosts.filter((p) => p.category === selectedCategory);
  }, [blogPosts, selectedCategory]);

  const featuredPost = useMemo(() => {
    if (selectedCategory !== 'all') return null;
    return blogPosts.length > 0 ? blogPosts[0] : null;
  }, [blogPosts, selectedCategory]);

  const regularPosts = useMemo(() => {
    if (selectedCategory !== 'all') return filteredPosts;
    return filteredPosts.slice(1);
  }, [filteredPosts, selectedCategory]);

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
    <ContentWithLoading loading={loading} skeleton={<BlogPageSkeleton />}>
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Gradient Header Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
        }}
      >
        {/* Decorative elements */}
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
          {/* Book icon watermark */}
          <BookOpen className="absolute bottom-4 right-8 w-32 h-32 text-white/5" />
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
              {t('blog.title')}
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-2xl mx-auto">
              {t('blog.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter - Enhanced Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allCategories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === cat
                  ? 'text-white shadow-md dark:shadow-lg'
                  : 'bg-white dark:bg-[#162236] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 shadow-sm dark:border dark:border-white/10'
              }`}
              style={selectedCategory === cat ? { backgroundColor: '#1E3A5F' } : {}}
            >
              {cat === 'all' ? t('blog.allCategories') : cat}
            </motion.button>
          ))}
        </div>

        {/* Featured Article */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5" style={{ color: '#F0C05A' }} />
              <span className="font-bold text-sm uppercase tracking-wider" style={{ color: '#F0C05A' }}>
                {t('blog.featured')}
              </span>
            </div>
            <Card
              className="group glass border-0 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/article/${featuredPost.slug}`)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                  {featuredPost.image ? (
                    <img
                      src={featuredPost.image}
                      alt={language === 'ar' ? featuredPost.title_ar : featuredPost.title_fr}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center min-h-[256px]"
                      style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5a8e)' }}
                    >
                      <BookOpen className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    {featuredPost.category && (
                      <Badge className="border-0 text-xs" style={{ backgroundColor: '#1E3A5F' }}>
                        {featuredPost.category}
                      </Badge>
                    )}
                    <span className="text-xs text-gray-400 dark:text-gray-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {featuredPost.read_time} {t('blog.readTime')}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-300">
                      {formatDate(featuredPost.date)}
                    </span>
                  </div>
                  <h2
                    className="font-bold text-xl sm:text-2xl mb-3 group-hover:text-[#2A5F8F] dark:group-hover:text-[#7AB0E0] transition-colors line-clamp-3 dark:text-white"
                    style={{ color: '#1E3A5F' }}
                  >
                    {language === 'ar' ? featuredPost.title_ar : featuredPost.title_fr}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
                    {language === 'ar' ? featuredPost.excerpt_ar : featuredPost.excerpt_fr}
                  </p>
                  <Button
                    variant="outline"
                    className="w-fit gap-2"
                    style={{ borderColor: '#1E3A5F', color: '#1E3A5F' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/article/${featuredPost.slug}`);
                    }}
                  >
                    {t('blog.readMore')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Blog Grid */}
        {regularPosts.length === 0 && !featuredPost ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{t('common.noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.08 }}
              >
                <motion.div whileHover={{ y: -5 }} className="h-full">
                  <Card
                    className="group glass border-0 shadow-sm dark:shadow-none hover:shadow-xl dark:hover:shadow-black/30 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
                    onClick={() => navigate(`/article/${post.slug}`)}
                  >
                    <div className="h-48 overflow-hidden relative" style={{ backgroundColor: '#f0f4f8' }}>
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={language === 'ar' ? post.title_ar : post.title_fr}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5a8e)' }}
                        >
                          <BookOpen className="w-10 h-10 text-white/30" />
                        </div>
                      )}
                      {/* Category badge overlay */}
                      {post.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="border-0 text-[10px] shadow-md" style={{ backgroundColor: '#1E3A5F' }}>
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs text-gray-400 dark:text-gray-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.read_time} {t('blog.readTimeBadge')}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-300">
                          {formatDate(post.date)}
                        </span>
                      </div>
                      <h3
                        className="font-bold text-base mb-2 line-clamp-2 group-hover:text-[#2A5F8F] dark:group-hover:text-[#7AB0E0] transition-colors dark:text-white"
                        style={{ color: '#1E3A5F' }}
                      >
                        {language === 'ar' ? post.title_ar : post.title_fr}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                        {language === 'ar' ? post.excerpt_ar : post.excerpt_fr}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-white/5">
                        <span className="text-xs text-gray-400 dark:text-gray-300">{formatDate(post.date)}</span>
                        <span className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all dark:text-[#7AB0E0]" style={{ color: '#1E3A5F' }}>
                          {t('blog.readMore')}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ContentWithLoading>
  );
}
