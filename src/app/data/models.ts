/*
 * Domain models for the companion app, mapped from the Supabase tables
 * (see supabase/migrations and database.types.ts).
 */

export interface LeaderboardEntry {
  rank: number;
  keeperId: string;
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
  id: number;
  author: string;
  /** e.g. "Dwarven merchant" */
  epithet: string | null;
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
