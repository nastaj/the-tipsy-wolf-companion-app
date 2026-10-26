import { Observable, from, map } from 'rxjs';

/** Wraps a Supabase query or RPC call as an Observable, erroring when Supabase returns an error. */
export function fromQuery<T>(query: PromiseLike<{ data: T | null; error: unknown }>): Observable<T> {
  return from(query).pipe(
    map(({ data, error }) => {
      if (error) throw error;
      return data as T;
    }),
  );
}
