import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../core/auth/auth.service';
import { SUPABASE } from '../core/supabase.client';
import { fromQuery } from './from-query';
import { LeaderboardEntry } from './models';

/** Leaderboard data. Each keeper's best run per level, from the `leaderboard` view. */
@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly supabase = inject(SUPABASE);
  private readonly auth = inject(AuthService);

  getLevels(): Observable<number[]> {
    return fromQuery(
      this.supabase.from('levels').select('id').order('id'),
    ).pipe(map((levels) => levels.map((level) => level.id)));
  }

  getLeaderboard(level: number): Observable<LeaderboardEntry[]> {
    const query = this.supabase
      .from('leaderboard')
      .select('rank, keeper_id, keeper_name, gold, time_seconds')
      .eq('level_id', level)
      .order('rank')
      .order('time_seconds');

    return fromQuery(query).pipe(
      map((rows) =>
        rows.map((row) => ({
          rank: row.rank ?? 0,
          keeperId: row.keeper_id ?? '',
          keeperName: row.keeper_name ?? '',
          gold: row.gold ?? 0,
          timeSeconds: row.time_seconds ?? 0,
          isCurrentUser: row.keeper_id === this.auth.user()?.id,
        })),
      ),
    );
  }
}
