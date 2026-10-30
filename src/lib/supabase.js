import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const supabaseConfigReady = Boolean(url && publishableKey);
export const supabase = supabaseConfigReady ? createClient(url, publishableKey) : null;
