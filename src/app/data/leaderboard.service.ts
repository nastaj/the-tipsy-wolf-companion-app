import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { LeaderboardEntry } from './models';
import { MOCK_LEVEL_COUNT, MOCK_OWN_SCORES, MOCK_SCORES } from './mock/leaderboard.mock';

/** Leaderboard data. MOCK: swap the bodies for Supabase queries once scores are synced from Unity. */
@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly auth = inject(AuthService);

  getLevels(): Observable<number[]> {
    return of(Array.from({ length: MOCK_LEVEL_COUNT }, (_, i) => i + 1));
  }

  getLeaderboard(level: number): Observable<LeaderboardEntry[]> {
    const others = (MOCK_SCORES[level] ?? []).map((s) => ({ ...s, isCurrentUser: false }));
    const own = MOCK_OWN_SCORES[level];
    const all = own ? [...others, { ...own, keeperName: this.auth.keeperName(), isCurrentUser: true }] : others;

    return of(
      all
        .sort((a, b) => b.gold - a.gold || a.timeSeconds - b.timeSeconds)
        .map((entry, i) => ({ ...entry, rank: i + 1 })),
    );
  }
}
