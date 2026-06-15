'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Share2, Facebook, Twitter, Link2, Package, Tag } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useRouter } from '@/lib/router';
import { useData } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ArticleDetailPage() {
  const { t, language, isRTL } = useTranslation();
  const { params, navigate, goBack } = useRouter();
  const { blogPosts } = useData();

  const article = useMemo(
    () => blogPosts.find((p) => p.slug === params.slug),
    [blogPosts, params.slug]
  );

  const relatedArticles = useMemo(
    () =>
      article
        ? blogPosts
            .filter((p) => p.category === article.category && p.id !== article.id)
            .slice(0, 3)
        : [],
    [blogPosts, article]
  );

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

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article
      ? language === 'ar'
        ? article.title_ar
        : article.title_fr
      : '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('common.noResults')}</p>
          <Button onClick={() => navigate('/blog')} className="mt-4" style={{ backgroundColor: '#1E3A5F' }}>
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const title = language === 'ar' ? article.title_ar : article.title_fr;
  const content = language === 'ar' ? article.content_ar : article.content_fr;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={() => navigate('/blog')}
          className="mb-6 gap-2"
          style={{ color: '#1E3A5F' }}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('blog.backToBlog')}
        </Button>

        {/* Article Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {article.category && (
            <Badge variant="secondary" className="mb-3">
              {article.category}
            </Badge>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4" style={{ color: '#1E3A5F' }}>
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <span>
              {t('blog.by')} {article.author}
            </span>
            <span>{formatDate(article.date)}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time} {t('blog.readTime')}
            </span>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.image && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl overflow-hidden mb-8"
          >
            <img
              src={article.image}
              alt={title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-sm mb-8">
            <CardContent className="p-6 sm:p-8">
              <div
                className="prose max-w-none prose-headings:text-[#1E3A5F] prose-a:text-[#1E3A5F]"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Share */}
        <div className="flex items-center gap-3 mb-12">
          <span className="text-sm font-medium text-gray-500">{t('blog.share')}:</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => handleShare('copy')}
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#1E3A5F' }}>
              {t('blog.related')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rp) => (
                <Card
                  key={rp.id}
                  className="group border-0 shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => navigate(`/article/${rp.slug}`)}
                >
                  <div className="h-32 overflow-hidden" style={{ backgroundColor: '#f0f4f8' }}>
                    {rp.image ? (
                      <img
                        src={rp.image}
                        alt={language === 'ar' ? rp.title_ar : rp.title_fr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1E3A5F, #2d5a8e)' }}
                      >
                        <span className="text-white/50 text-lg font-bold">ODG</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2" style={{ color: '#1E3A5F' }}>
                      {language === 'ar' ? rp.title_ar : rp.title_fr}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(rp.date)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
