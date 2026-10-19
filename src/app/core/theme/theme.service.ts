import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'ttw-theme';
const ORDER: ThemePreference[] = ['system', 'light', 'dark'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');

  readonly preference = signal<ThemePreference>(readStoredPreference());
  private readonly systemDark = signal(this.media?.matches ?? false);
  readonly isDark = computed(() =>
    this.preference() === 'system' ? this.systemDark() : this.preference() === 'dark',
  );

  constructor() {
    this.media?.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      const root = this.document.documentElement;
      const dark = this.isDark();
      // `.dark` drives Tailwind tokens, `.ion-palette-dark` drives Ionic's components.
      root.classList.toggle('dark', dark);
      root.classList.toggle('ion-palette-dark', dark);
    });

    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, this.preference());
      } catch {
        // Storage unavailable (private mode etc.) - preference just won't persist.
      }
    });
  }

  /** Cycles system → light → dark → system. */
  cycle(): void {
    const next = ORDER[(ORDER.indexOf(this.preference()) + 1) % ORDER.length];
    this.preference.set(next);
  }
}

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return ORDER.includes(stored as ThemePreference) ? (stored as ThemePreference) : 'system';
  } catch {
    return 'system';
  }
}
