import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

/** True once real project settings are filled in. */
export const isSupabaseConfigured = !!(
  environment.supabase.url && environment.supabase.anonKey
);

// Until a Supabase project exists we still need a client instance, so we point it
// at a placeholder project. Every auth call will fail (or be intercepted in E2E tests).
export const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';

export const SUPABASE = new InjectionToken<SupabaseClient>('SupabaseClient', {
  providedIn: 'root',
  factory: () => {
    if (!isSupabaseConfigured) {
      console.warn('[supabase] Not configured - fill in environment.supabase.');
    }
    return createClient(
      environment.supabase.url || PLACEHOLDER_SUPABASE_URL,
      environment.supabase.anonKey || 'placeholder-anon-key',
    );
  },
});
