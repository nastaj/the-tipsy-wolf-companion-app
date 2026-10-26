import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { SUPABASE } from '../core/supabase.client';
import { fromQuery } from './from-query';
import { Reputation, Review, ReviewFilter, ReviewSort } from './models';

/** Patron reviews of the signed-in keeper's tavern. */
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  private readonly supabase = inject(SUPABASE);

  getReputation(): Observable<Reputation> {
    const levelCount = this.supabase
      .from('levels')
      .select('id', { count: 'exact', head: true });

    return forkJoin({
      ratings: fromQuery(this.supabase.from('reviews').select('rating')),
      levelCount: fromQuery(
        levelCount.then(({ count, error }) => ({ data: count ?? 0, error })),
      ),
    }).pipe(
      map(({ ratings, levelCount }) => ({
        average: ratings.length
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0,
        reviewCount: ratings.length,
        levelCount,
      })),
    );
  }

  getReviews(filter: ReviewFilter, sort: ReviewSort): Observable<Review[]> {
    let query = this.supabase
      .from('reviews')
      .select('id, author, epithet, rating, level_id, text, created_at')
      .order('created_at', { ascending: sort === 'oldest' });

    if (filter === 'five') query = query.eq('rating', 5);
    if (filter === 'four-below') query = query.lte('rating', 4);

    return fromQuery(query).pipe(
      map((rows) =>
        rows.map((row) => ({
          id: row.id,
          author: row.author,
          epithet: row.epithet,
          rating: row.rating as Review['rating'],
          level: row.level_id,
          text: row.text,
          createdAt: row.created_at,
        })),
      ),
    );
  }
}
