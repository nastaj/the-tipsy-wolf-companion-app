import { Injectable, computed, inject, signal } from '@angular/core';
import type { Session } from '@supabase/supabase-js';
import { SUPABASE } from '../supabase.client';

export interface SignUpResult {
  /** True when Supabase requires the user to confirm their email before signing in. */
  needsConfirmation: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SUPABASE);

  private readonly _session = signal<Session | null>(null);
  readonly session = this._session.asReadonly();
  readonly user = computed(() => this._session()?.user ?? null);
  readonly isSignedIn = computed(() => !!this.user());
  readonly keeperName = computed(() => {
    const user = this.user();
    const name = user?.user_metadata?.['keeper_name'];
    return typeof name === 'string' && name ? name : (user?.email?.split('@')[0] ?? 'Keeper');
  });

  /** Resolves once the persisted session (if any) has been restored. */
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.supabase.auth
      .getSession()
      .then(({ data }) => this._session.set(data.session))
      .catch(() => this._session.set(null));

    this.supabase.auth.onAuthStateChange((_event, session) => this._session.set(session));
  }

  async signIn(email: string, password: string): Promise<void> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    this._session.set(data.session);
  }

  async signUp(email: string, password: string, keeperName: string): Promise<SignUpResult> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { keeper_name: keeperName } },
    });
    if (error) throw error;
    if (data.session) this._session.set(data.session);
    return { needsConfirmation: !data.session };
  }

  async signOut(): Promise<void> {
    // Clear locally even if the network call fails, so the user is never stuck signed in.
    await this.supabase.auth.signOut().catch(() => undefined);
    this._session.set(null);
  }
}
