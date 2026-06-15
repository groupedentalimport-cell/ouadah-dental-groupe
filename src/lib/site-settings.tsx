'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface SiteSetting {
  id: string;
  key: string;
  value_fr: string | null;
  value_ar: string | null;
  value_json: Record<string, unknown> | unknown[] | null;
  category: string;
  label: string | null;
  type: string;
}

interface SiteSettingsContextType {
  settings: SiteSetting[];
  loading: boolean;
  getText: (key: string) => string;
  getJsonValue: (key: string) => Record<string, unknown> | unknown[] | null;
  refresh: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: [],
  loading: true,
  getText: () => '',
  getJsonValue: () => null,
  refresh: () => {},
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category', { ascending: true });

      if (!error && data) {
        setSettings(data as SiteSetting[]);
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getText = useCallback(
    (key: string): string => {
      const setting = settings.find((s) => s.key === key);
      if (!setting) return '';
      return setting.value_fr || setting.value_ar || '';
    },
    [settings]
  );

  const getJsonValue = useCallback(
    (key: string): Record<string, unknown> | unknown[] | null => {
      const setting = settings.find((s) => s.key === key);
      return setting?.value_json || null;
    },
    [settings]
  );

  return (
    <SiteSettingsContext.Provider
      value={{ settings, loading, getText, getJsonValue, refresh: fetchSettings }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
