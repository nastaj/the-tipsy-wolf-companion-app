import { InjectionToken } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import type { Database } from '../data/database.types';

export const isSupabaseConfigured = !!(
  environment.supabase.url && environment.supabase.anonKey
);

// Until a Supabase project exists we still need a client instance, so we point it
// at a placeholder project. Every auth call will fail.
export const PLACEHOLDER_SUPABASE_URL = 'https://placeholder.supabase.co';

export const SUPABASE = new InjectionToken<SupabaseClient<Database>>(
  'SupabaseClient',
  {
    providedIn: 'root',
    factory: () => {
      if (!isSupabaseConfigured) {
        console.warn(
          '[supabase] Not configured - fill in environment.supabase.',
        );
      }
      return createClient<Database>(
        environment.supabase.url || PLACEHOLDER_SUPABASE_URL,
        environment.supabase.anonKey || 'placeholder-anon-key',
      );
    },
  },
);
