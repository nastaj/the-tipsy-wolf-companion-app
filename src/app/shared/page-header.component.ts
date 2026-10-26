import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { AuthService } from '../core/auth/auth.service';
import { ThemeService } from '../core/theme/theme.service';
import { MarketService } from '../data/market.service';

@Component({
  selector: 'app-page-header',
  imports: [IonIcon, DecimalPipe],
  template: `
    <header class="border-b border-border bg-bg pt-[calc(var(--ion-safe-area-top,0px)+1rem)]">
      <div class="mx-auto flex max-w-5xl items-start justify-between gap-3 px-4 pb-3 lg:px-8">
        <div class="min-w-0">
          <p class="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">The Tipsy Wolf // Ledger</p>
          <h1 class="text-2xl leading-tight wrap-break-word text-ink sm:text-3xl">{{ title() }}</h1>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <span
            class="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-3 py-1 text-sm font-black text-gold"
            data-testid="gold-balance"
            aria-label="Gold balance"
          >
            {{ market.gold() | number }}G
          </span>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-full border border-border bg-surface text-ink"
            [attr.aria-label]="themeLabel()"
            [title]="themeLabel()"
            data-testid="theme-toggle"
            (click)="theme.cycle()"
          >
            <ion-icon aria-hidden="true" [name]="themeIcon()" class="text-lg" />
          </button>

          <button
            type="button"
            class="grid size-9 place-items-center rounded-full border border-border bg-surface text-ink lg:hidden"
            aria-label="Sign out"
            title="Sign out"
            (click)="signOut()"
          >
            <ion-icon aria-hidden="true" name="log-out-outline" class="text-lg" />
          </button>
        </div>
      </div>
    </header>
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();

  protected readonly market = inject(MarketService);
  protected readonly theme = inject(ThemeService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly themeIcon = computed(
    () => ({ system: 'contrast-outline', light: 'sunny-outline', dark: 'moon-outline' })[this.theme.preference()],
  );
  protected readonly themeLabel = computed(() => `Theme: ${this.theme.preference()} (tap to change)`);

  protected async signOut(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
