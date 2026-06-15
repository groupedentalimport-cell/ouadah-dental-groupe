'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// ============================================================
// Home Page Skeletons
// ============================================================

export function HeroSkeleton() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#1E3A5F' }}
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
        <Skeleton className="h-7 w-40 mx-auto mb-6 rounded-full animate-shimmer" />
        <Skeleton className="h-14 sm:h-16 md:h-20 w-3/4 mx-auto mb-6 animate-shimmer" />
        <Skeleton className="h-6 w-2/3 max-w-xl mx-auto mb-10 animate-shimmer" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Skeleton className="h-12 w-48 rounded-lg animate-shimmer" />
          <Skeleton className="h-12 w-48 rounded-lg animate-shimmer" />
        </div>
      </div>
    </section>
  );
}

export function StatsSkeleton() {
  return (
    <section className="py-16 sm:py-20" style={{ backgroundColor: '#1E3A5F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/[0.08]">
              <Skeleton className="w-14 h-14 rounded-xl mx-auto mb-4 animate-shimmer" />
              <Skeleton className="h-10 w-20 mx-auto mb-1.5 animate-shimmer" />
              <Skeleton className="h-4 w-24 mx-auto animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CategoriesSkeleton() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-3 animate-shimmer" />
          <Skeleton className="h-5 w-80 mx-auto animate-shimmer" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden h-48 sm:h-56">
              <Skeleton className="w-full h-full animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <Skeleton className="h-10 w-64 animate-shimmer" />
          <Skeleton className="hidden sm:block h-10 w-32 rounded-lg animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CatalogueCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSkeleton() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-6 w-24 mx-auto mb-4 rounded-full animate-shimmer" />
          <Skeleton className="h-10 w-72 mx-auto mb-3 animate-shimmer" />
          <Skeleton className="h-5 w-80 mx-auto animate-shimmer" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <Skeleton className="w-14 h-14 rounded-full shrink-0 animate-shimmer" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2 animate-shimmer" />
                  <Skeleton className="h-4 w-full animate-shimmer" />
                  <Skeleton className="h-4 w-3/4 mt-1 animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="overflow-hidden">
      <HeroSkeleton />
      <StatsSkeleton />
      <CategoriesSkeleton />
      <FeaturedProductsSkeleton />
      <WhyChooseUsSkeleton />
    </div>
  );
}

// ============================================================
// Catalogue Card Skeleton - mimics product card with image + text
// ============================================================

export function CatalogueCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#162236] rounded-xl overflow-hidden h-full flex flex-col shadow-sm dark:shadow-none">
      {/* Image placeholder with shimmer */}
      <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-white/5">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Skeleton className="h-3 w-16 mb-1 animate-shimmer" />
        <Skeleton className="h-4 w-3/4 mb-1 animate-shimmer" />
        <Skeleton className="h-3 w-full mt-1 mb-3 animate-shimmer" />
        <Skeleton className="h-3 w-2/3 mb-4 animate-shimmer" />
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/10">
          <Skeleton className="h-5 w-20 animate-shimmer" />
          <Skeleton className="h-8 w-24 rounded-md animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Blog Card Skeleton - mimics a blog card
// ============================================================

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#162236] rounded-xl overflow-hidden h-full flex flex-col shadow-sm dark:shadow-none">
      {/* Image placeholder */}
      <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-white/5">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
          <Skeleton className="h-3 w-20 animate-shimmer" />
        </div>
        <Skeleton className="h-5 w-full mb-1 animate-shimmer" />
        <Skeleton className="h-5 w-3/4 mb-3 animate-shimmer" />
        <Skeleton className="h-3 w-full animate-shimmer" />
        <Skeleton className="h-3 w-2/3 mb-4 animate-shimmer" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-3 w-24 animate-shimmer" />
          <Skeleton className="h-3 w-16 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Product Detail Skeleton - mimics the product detail layout
// ============================================================

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Skeleton className="h-10 w-28 rounded-lg mb-6 animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image skeleton */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white dark:bg-[#162236] relative">
              <div className="absolute inset-0 animate-shimmer" />
            </div>
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-white/5 relative">
                  <div className="absolute inset-0 animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
          {/* Info skeleton */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Skeleton className="h-4 w-20 animate-shimmer" />
              <Skeleton className="h-4 w-4 animate-shimmer" />
              <Skeleton className="h-4 w-24 animate-shimmer" />
              <Skeleton className="h-4 w-4 animate-shimmer" />
            </div>
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
              <Skeleton className="h-6 w-24 rounded-full animate-shimmer" />
            </div>
            <Skeleton className="h-9 w-3/4 mb-3 animate-shimmer" />
            <div className="flex flex-wrap gap-2 mb-5">
              <Skeleton className="h-7 w-28 rounded-full animate-shimmer" />
              <Skeleton className="h-7 w-24 rounded-full animate-shimmer" />
              <Skeleton className="h-7 w-20 rounded-full animate-shimmer" />
            </div>
            <Skeleton className="h-10 w-48 mb-6 rounded-lg animate-shimmer" />
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Skeleton className="h-16 rounded-lg animate-shimmer" />
              <Skeleton className="h-16 rounded-lg animate-shimmer" />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Skeleton className="h-7 w-28 rounded-full animate-shimmer" />
              <Skeleton className="h-7 w-32 rounded-full animate-shimmer" />
              <Skeleton className="h-7 w-24 rounded-full animate-shimmer" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg animate-shimmer" />
              <Skeleton className="h-12 w-full rounded-lg animate-shimmer" />
            </div>
          </div>
        </div>
        {/* Features, Specs, Description sections */}
        <div className="mt-12">
          <Skeleton className="h-48 w-full rounded-xl animate-shimmer" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-36 w-full rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Product Card Skeleton (shared between pages - legacy)
// ============================================================

export function ProductCardSkeleton() {
  return (
    <div className="border-0 shadow-sm rounded-xl overflow-hidden h-full flex flex-col">
      {/* Image area */}
      <Skeleton className="h-48 w-full animate-shimmer" />
      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Skeleton className="h-3 w-16 mb-1 animate-shimmer" />
        <Skeleton className="h-4 w-3/4 mb-1 animate-shimmer" />
        <Skeleton className="h-3 w-full mt-1 mb-3 animate-shimmer" />
        <Skeleton className="h-3 w-2/3 mb-4 animate-shimmer" />
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <Skeleton className="h-5 w-20 animate-shimmer" />
          <Skeleton className="h-8 w-24 rounded-md animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Catalogue Page Skeletons
// ============================================================

export function CatalogueHeaderSkeleton() {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1E3A5F 0%, #2A5F8F 50%, #1E3A5F 100%)',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="text-center mb-8">
          <Skeleton className="h-10 sm:h-12 w-64 mx-auto mb-3 animate-shimmer" />
          <Skeleton className="h-5 w-80 mx-auto animate-shimmer" />
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-9 flex-1 rounded-md animate-shimmer" />
            <Skeleton className="h-9 w-44 rounded-md animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogueSidebarSkeleton() {
  return (
    <div className="hidden lg:block w-60 shrink-0">
      <div className="bg-white dark:bg-[#162236] rounded-xl shadow-sm p-4 sticky top-24">
        <Skeleton className="h-4 w-24 mb-4 animate-shimmer" />
        <div className="space-y-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function CatalogueGridSkeleton() {
  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <CatalogueCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CataloguePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      <CatalogueHeaderSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-4 w-32 animate-shimmer" />
          <Skeleton className="h-8 w-24 rounded-md lg:hidden animate-shimmer" />
        </div>
        <div className="flex gap-6">
          <CatalogueSidebarSkeleton />
          <CatalogueGridSkeleton />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Blog Page Skeletons
// ============================================================

export function BlogArticleCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#162236] border-0 shadow-sm rounded-xl overflow-hidden h-full flex flex-col">
      <div className="h-48 relative overflow-hidden bg-gray-100 dark:bg-white/5">
        <div className="absolute inset-0 animate-shimmer" />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
          <Skeleton className="h-3 w-20 animate-shimmer" />
        </div>
        <Skeleton className="h-5 w-full mb-1 animate-shimmer" />
        <Skeleton className="h-5 w-3/4 mb-3 animate-shimmer" />
        <Skeleton className="h-3 w-full animate-shimmer" />
        <Skeleton className="h-3 w-2/3 mb-4 animate-shimmer" />
        <div className="flex items-center justify-between mt-auto">
          <Skeleton className="h-3 w-24 animate-shimmer" />
          <Skeleton className="h-3 w-16 animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function BlogPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      {/* Header */}
      <div style={{ backgroundColor: '#1E3A5F' }} className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-2 animate-shimmer" />
          <Skeleton className="h-5 w-72 animate-shimmer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-full animate-shimmer" />
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Product Detail Page Skeletons
// ============================================================

export function ProductDetailImageSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-square w-full rounded-2xl animate-shimmer" />
      <div className="flex gap-2 mt-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-lg animate-shimmer" />
        ))}
      </div>
    </div>
  );
}

export function ProductDetailInfoSkeleton() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-4 w-20 animate-shimmer" />
        <Skeleton className="h-4 w-4 animate-shimmer" />
        <Skeleton className="h-4 w-24 animate-shimmer" />
        <Skeleton className="h-4 w-4 animate-shimmer" />
      </div>
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <Skeleton className="h-6 w-16 rounded-full animate-shimmer" />
        <Skeleton className="h-6 w-24 rounded-full animate-shimmer" />
      </div>
      {/* Product Name */}
      <Skeleton className="h-9 w-3/4 mb-3 animate-shimmer" />
      {/* Brand & Ref */}
      <div className="flex flex-wrap gap-2 mb-5">
        <Skeleton className="h-7 w-28 rounded-full animate-shimmer" />
        <Skeleton className="h-7 w-24 rounded-full animate-shimmer" />
        <Skeleton className="h-7 w-20 rounded-full animate-shimmer" />
      </div>
      {/* Price */}
      <Skeleton className="h-10 w-48 mb-6 rounded-lg animate-shimmer" />
      {/* Meta info grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Skeleton className="h-16 rounded-lg animate-shimmer" />
        <Skeleton className="h-16 rounded-lg animate-shimmer" />
      </div>
      {/* Service badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Skeleton className="h-7 w-28 rounded-full animate-shimmer" />
        <Skeleton className="h-7 w-32 rounded-full animate-shimmer" />
        <Skeleton className="h-7 w-24 rounded-full animate-shimmer" />
      </div>
      {/* Buttons */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-lg animate-shimmer" />
        <Skeleton className="h-12 w-full rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

export function ProductDetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0c1622] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Skeleton className="h-10 w-28 rounded-lg mb-6 animate-shimmer" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductDetailImageSkeleton />
          <ProductDetailInfoSkeleton />
        </div>
        {/* Features, Specs, Description sections */}
        <div className="mt-12">
          <Skeleton className="h-48 w-full rounded-xl animate-shimmer" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-36 w-full rounded-xl animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Content Wrapper with Fade-in
// ============================================================

export function ContentWithLoading({
  loading,
  skeleton,
  children,
}: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  if (loading) {
    return <>{skeleton}</>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {children}
    </div>
  );
}
