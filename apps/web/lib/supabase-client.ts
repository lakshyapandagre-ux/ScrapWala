import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback dummy check to allow demo execution even before keys are supplied
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any);

/**
 * Trigger Google OAuth Sign-in
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured. Using local demo Google authentication.');
    return { data: null, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined,
    },
  });

  return { data, error };
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  return await supabase.auth.signInWithPassword({ email, password });
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, metadata: Record<string, any>) {
  if (!isSupabaseConfigured) {
    return { data: null, error: null };
  }
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
}

/**
 * Sign out
 */
export async function signOut() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}
