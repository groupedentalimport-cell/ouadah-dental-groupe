'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type RouteName =
  | 'home'
  | 'catalogue'
  | 'product'
  | 'compare'
  | 'wishlist'
  | 'blog'
  | 'article'
  | 'about'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-products-new'
  | 'admin-products-edit'
  | 'admin-blog'
  | 'admin-blog-new'
  | 'admin-blog-edit'
  | 'admin-messages'
  | 'admin-categories'
  | 'admin-settings'
  | 'mentions-legales'
  | 'politique-confidentialite'
  | 'conditions-vente'
  | 'promotions'
  | 'services'
  | 'clinic-wizard';

interface RouteParams {
  slug?: string;
  id?: string;
  [key: string]: string | undefined;
}

interface RouterContextType {
  route: RouteName;
  params: RouteParams;
  navigate: (path: string) => void;
  goBack: () => void;
  history: RouteName[];
}

const RouterContext = createContext<RouterContextType>({
  route: 'home',
  params: {},
  navigate: () => {},
  goBack: () => {},
  history: ['home'],
});

// Parse a path like "/product/my-product" into route + params
function parsePath(path: string): { route: RouteName; params: RouteParams } {
  const cleanPath = path.replace(/^\/|\/$/g, '');
  const parts = cleanPath.split('/').filter(Boolean);

  if (parts.length === 0 || (parts.length === 1 && parts[0] === '')) {
    return { route: 'home', params: {} };
  }

  const first = parts[0];

  // Route mapping
  const routeMap: Record<string, RouteName> = {
    '': 'home',
    catalogue: 'catalogue',
    product: 'product',
    compare: 'compare',
    wishlist: 'wishlist',
    blog: 'blog',
    article: 'article',
    about: 'about',
    contact: 'contact',
    'admin-login': 'admin-login',
    'admin': 'admin-dashboard',
    'admin-dashboard': 'admin-dashboard',
    'admin-products': 'admin-products',
    'admin-products-new': 'admin-products-new',
    'admin-products-edit': 'admin-products-edit',
    'admin-blog': 'admin-blog',
    'admin-blog-new': 'admin-blog-new',
    'admin-blog-edit': 'admin-blog-edit',
    'admin-messages': 'admin-messages',
    'admin-categories': 'admin-categories',
    'admin-settings': 'admin-settings',
    'mentions-legales': 'mentions-legales',
    'politique-confidentialite': 'politique-confidentialite',
    'conditions-vente': 'conditions-vente',
    promotions: 'promotions',
    services: 'services',
    'clinic-wizard': 'clinic-wizard',
  };

  // Handle /product/slug patterns
  if (first === 'product' && parts[1]) {
    return { route: 'product', params: { slug: parts[1] } };
  }
  if (first === 'article' && parts[1]) {
    return { route: 'article', params: { slug: parts[1] } };
  }
  if (first === 'admin-products-edit' && parts[1]) {
    return { route: 'admin-products-edit', params: { id: parts[1] } };
  }
  if (first === 'admin-blog-edit' && parts[1]) {
    return { route: 'admin-blog-edit', params: { id: parts[1] } };
  }

  const route = routeMap[first] || 'home';
  return { route, params: {} };
}

// Convert route + params back to a path string
function toPath(route: RouteName, params?: RouteParams): string {
  if (route === 'product' && params?.slug) return `/product/${params.slug}`;
  if (route === 'article' && params?.slug) return `/article/${params.slug}`;
  if (route === 'admin-products-edit' && params?.id) return `/admin-products-edit/${params.id}`;
  if (route === 'admin-blog-edit' && params?.id) return `/admin-blog-edit/${params.id}`;
  if (route === 'home') return '/';
  return `/${route}`;
}

function getInitialRoute(): { route: RouteName; params: RouteParams } {
  if (typeof window === 'undefined') return { route: 'home', params: {} };
  const hash = window.location.hash.slice(1);
  if (hash) {
    return parsePath(hash);
  }
  return { route: 'home', params: {} };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const initial = getInitialRoute();
  const [route, setRoute] = useState<RouteName>(initial.route);
  const [params, setParams] = useState<RouteParams>(initial.params);
  const [routeHistory, setRouteHistory] = useState<RouteName[]>([initial.route]);

  // Listen for hash changes (back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const parsed = parsePath(hash || '/');
      setRoute(parsed.route);
      setParams(parsed.params);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = useCallback((path: string) => {
    const parsed = parsePath(path);
    setRoute(parsed.route);
    setParams(parsed.params);
    setRouteHistory(prev => [...prev, parsed.route]);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    setRouteHistory(prev => {
      const newHistory = prev.slice(0, -1);
      const lastRoute = newHistory[newHistory.length - 1] || 'home';
      setRoute(lastRoute);
      setParams({});
      window.location.hash = toPath(lastRoute);
      return newHistory;
    });
  }, []);

  return (
    <RouterContext.Provider value={{ route, params, navigate, goBack, history: routeHistory }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}

export function useRouteParams() {
  return useContext(RouterContext).params;
}
