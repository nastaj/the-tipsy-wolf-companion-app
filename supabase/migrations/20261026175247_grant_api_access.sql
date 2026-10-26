-- This project does not auto-grant table privileges to the API roles, so grant
-- them explicitly. RLS still decides which rows each keeper sees.
grant select on
  public.profiles,
  public.levels,
  public.level_runs,
  public.leaderboard,
  public.market_items,
  public.purchases,
  public.reviews
to authenticated;

-- service_role bypasses RLS; reserved for trusted writers (e.g. a future game sync).
grant select, insert, update, delete on
  public.profiles,
  public.levels,
  public.level_runs,
  public.market_items,
  public.purchases,
  public.reviews
to service_role;
grant select on public.leaderboard to service_role;
