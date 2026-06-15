import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

// Storage bucket names
export const STORAGE_BUCKETS = {
  PRODUCT_IMAGES: 'product-images',
  BLOG_IMAGES: 'blog-images',
  LOGOS: 'logos',
  PDFS: 'pdfs',
} as const;

/**
 * Get the public URL for a file in a Supabase storage bucket
 */
export function getStorageUrl(bucket: string, path: string): string {
  if (!supabase) return '';
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || '';
}

/**
 * Get the URL for a PDF file stored in Supabase storage
 */
export function getPdfUrl(path: string): string {
  if (!path) return '';
  // If already a full URL, return as-is
  if (path.startsWith('http')) return path;
  return getStorageUrl(STORAGE_BUCKETS.PDFS, path);
}

/**
 * Upload a file to a Supabase storage bucket
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ url: string; error: string | null }> {
  if (!supabase) {
    return { url: '', error: 'Supabase not configured' };
  }

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) {
    return { url: '', error: error.message };
  }

  const url = getStorageUrl(bucket, path);
  return { url, error: null };
}

/**
 * Delete a file from a Supabase storage bucket
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: string | null }> {
  if (!supabase) {
    return { error: 'Supabase not configured' };
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error: error?.message || null };
}
