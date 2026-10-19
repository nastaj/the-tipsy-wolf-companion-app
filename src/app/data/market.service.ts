import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MarketCategory, MarketItem } from './models';
import { MOCK_MARKET_ITEMS, MOCK_STARTING_GOLD } from './mock/market.mock';

export class InsufficientGoldError extends Error {
  constructor() {
    super('Not enough gold');
  }
}

/**
 * Marketplace catalogue and the keeper's gold purse.
 * MOCK: in-memory only, gold resets on reload. Swap for Supabase once gold is synced from Unity.
 */
@Injectable({ providedIn: 'root' })
export class MarketService {
  private readonly _gold = signal(MOCK_STARTING_GOLD);
  readonly gold = this._gold.asReadonly();

  getItems(category: MarketCategory, query = ''): Observable<MarketItem[]> {
    const q = query.trim().toLowerCase();
    return of(
      MOCK_MARKET_ITEMS.filter((item) => item.category === category && (!q || item.name.toLowerCase().includes(q))),
    );
  }

  purchase(item: MarketItem): Observable<void> {
    if (item.price > this._gold()) return throwError(() => new InsufficientGoldError());
    this._gold.update((gold) => gold - item.price);
    return of(undefined);
  }
}
