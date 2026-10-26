import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

/**
 * Cache lifetime for uploads to the `images` bucket: a year. Every upload gets
 * a fresh timestamped path and is never overwritten, so a file at a given URL
 * never changes — a returning visitor can keep the cover videos rather than
 * fetching megabytes again each hour.
 */
export const UPLOAD_CACHE = '31536000';
