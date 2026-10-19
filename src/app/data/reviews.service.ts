import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Reputation, Review, ReviewFilter, ReviewSort } from './models';
import { MOCK_REVIEWS } from './mock/reviews.mock';
import { MOCK_LEVEL_COUNT } from './mock/leaderboard.mock';

/** Patron reviews of the keeper's tavern. MOCK: swap for Supabase once reviews come from Unity. */
@Injectable({ providedIn: 'root' })
export class ReviewsService {
  getReputation(): Observable<Reputation> {
    const total = MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0);
    return of({
      average: MOCK_REVIEWS.length ? total / MOCK_REVIEWS.length : 0,
      reviewCount: MOCK_REVIEWS.length,
      levelCount: MOCK_LEVEL_COUNT,
    });
  }

  getReviews(filter: ReviewFilter, sort: ReviewSort): Observable<Review[]> {
    const filtered = MOCK_REVIEWS.filter((r) =>
      filter === 'five' ? r.rating === 5 : filter === 'four-below' ? r.rating <= 4 : true,
    );
    const direction = sort === 'newest' ? -1 : 1;
    return of(filtered.sort((a, b) => direction * a.createdAt.localeCompare(b.createdAt)));
  }
}
