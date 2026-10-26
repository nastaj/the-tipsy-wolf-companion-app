/*
 * Domain models for the companion app.
 * PROVISIONAL: shapes will be revisited once the Unity game's data model and
 * the Supabase tables are defined.
 */

export interface LeaderboardEntry {
  rank: number;
  keeperName: string;
  /** Gold earned in the level run. */
  gold: number;
  /** Time taken for the level run, in seconds. */
  timeSeconds: number;
  isCurrentUser: boolean;
}

export type MarketCategory = 'resource' | 'amenity' | 'upgrade';

export interface MarketItem {
  id: string;
  name: string;
  category: MarketCategory;
  price: number;
  imageUrl?: string;
}

export interface Review {
  id: string;
  author: string;
  /** e.g. "Dwarven merchant" */
  epithet: string;
  rating: 1 | 2 | 3 | 4 | 5;
  level: number;
  text: string;
  createdAt: string; // ISO date
}

export type ReviewFilter = 'all' | 'five' | 'four-below';
export type ReviewSort = 'newest' | 'oldest';

export interface Reputation {
  average: number;
  reviewCount: number;
  levelCount: number;
}
