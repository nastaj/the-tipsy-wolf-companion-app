import { Injectable, effect, inject, signal } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { SUPABASE } from '../core/supabase.client';
import { fromQuery } from './from-query';
import { MarketCategory, MarketItem } from './models';

export class InsufficientGoldError extends Error {
  constructor() {
    super('Not enough gold');
  }
}

/** Marketplace catalogue and the keeper's gold purse (`profiles.gold`). */
@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly supabase = inject(SUPABASE);
  private readonly auth = inject(AuthService);

  private readonly _gold = signal(0);
  readonly gold = this._gold.asReadonly();

  constructor() {
    // Reload the purse whenever a different keeper signs in.
    effect(() => {
      const userId = this.auth.user()?.id;
      if (!userId) {
        this._gold.set(0);
        return;
      }
      this.supabase
        .from('profiles')
        .select('gold')
        .eq('id', userId)
        .single()
        .then(({ data }) => {
          if (data && this.auth.user()?.id === userId)
            this._gold.set(data.gold);
        });
    });
  }

  getItems(category: MarketCategory, query = ''): Observable<MarketItem[]> {
    let request = this.supabase
      .from('market_items')
      .select('id, name, category, price, image_url')
      .eq('category', category)
      .eq('is_active', true)
      .order('price');

    const q = query.trim();
    if (q) request = request.ilike('name', `%${q.replace(/[\\%_]/g, '\\$&')}%`);

    return fromQuery(request).pipe(
      map((items) =>
        items.map(({ image_url, ...item }) => ({
          ...item,
          imageUrl: image_url ?? undefined,
        })),
      ),
    );
  }

  /** Spends gold on the item; the database checks and deducts the balance accordingly. */
  purchase(item: MarketItem): Observable<void> {
    return fromQuery(
      this.supabase.rpc('purchase_item', { p_item_id: item.id }),
    ).pipe(
      tap((gold) => this._gold.set(gold)),
      map(() => undefined),
      catchError((error: { message?: string }) =>
        throwError(() =>
          error.message === 'insufficient_gold'
            ? new InsufficientGoldError()
            : error,
        ),
      ),
    );
  }
}
