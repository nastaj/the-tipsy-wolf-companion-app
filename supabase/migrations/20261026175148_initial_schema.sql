-- Core schema for The Tipsy Wolf companion app.
--
-- Game tables (level_runs, reviews) are read-only for app clients: how the Unity
-- game writes to them is not decided yet, so there are no insert policies.
-- Gold is only spent through purchase_item(), never updated directly by clients.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profiles: one per auth user (a "keeper"), holds the gold purse.
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  keeper_name text not null check (char_length(keeper_name) between 1 and 40),
  -- PROVISIONAL starting purse, matches the mock. Revisit once the game defines gold.
  gold integer not null default 5000 check (gold >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create a profile on sign-up, using the keeper_name passed in user metadata.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, keeper_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'keeper_name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users who signed up before this migration.
insert into public.profiles (id, keeper_name)
select u.id, coalesce(nullif(trim(u.raw_user_meta_data ->> 'keeper_name'), ''), split_part(u.email, '@', 1))
from auth.users u
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Levels: reference data for the game's levels.
-- ---------------------------------------------------------------------------

create table public.levels (
  id smallint primary key check (id > 0),
  name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Level runs: every completed run, synced from the game.
-- ---------------------------------------------------------------------------

create table public.level_runs (
  id bigint generated always as identity primary key,
  keeper_id uuid not null references public.profiles (id) on delete cascade,
  level_id smallint not null references public.levels (id),
  gold integer not null check (gold >= 0),
  time_seconds integer not null check (time_seconds > 0),
  completed_at timestamptz not null default now()
);

create index level_runs_level_keeper_idx on public.level_runs (level_id, keeper_id);
create index level_runs_keeper_idx on public.level_runs (keeper_id);

-- Each keeper's best run per level (most gold, then fastest), ranked per level.
create view public.leaderboard
with (security_invoker = true)
as
select
  rank() over (partition by best.level_id order by best.gold desc, best.time_seconds asc) as rank,
  best.*
from (
  select distinct on (r.level_id, r.keeper_id)
    r.level_id,
    r.keeper_id,
    p.keeper_name,
    r.gold,
    r.time_seconds,
    r.completed_at
  from public.level_runs r
  join public.profiles p on p.id = r.keeper_id
  order by r.level_id, r.keeper_id, r.gold desc, r.time_seconds asc, r.completed_at asc
) best;

-- ---------------------------------------------------------------------------
-- Marketplace
-- ---------------------------------------------------------------------------

create type public.market_category as enum ('resource', 'amenity', 'upgrade');

create table public.market_items (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null,
  category public.market_category not null,
  price integer not null check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index market_items_category_idx on public.market_items (category) where is_active;

-- Ledger of purchases; the game can read these to grant items.
create table public.purchases (
  id bigint generated always as identity primary key,
  keeper_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null references public.market_items (id),
  price_paid integer not null check (price_paid >= 0),
  purchased_at timestamptz not null default now()
);

create index purchases_keeper_idx on public.purchases (keeper_id, purchased_at desc);
create index purchases_item_idx on public.purchases (item_id);

-- Spend gold on an item atomically. Returns the keeper's new gold balance.
-- Raises 'insufficient_gold' or 'unknown_item' (SQLSTATE P0001).
create function public.purchase_item(p_item_id text)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_keeper uuid := auth.uid();
  v_price integer;
  v_gold integer;
begin
  if v_keeper is null then
    raise exception 'not_authenticated' using errcode = '42501';
  end if;

  select price into v_price
  from public.market_items
  where id = p_item_id and is_active;

  if not found then
    raise exception 'unknown_item';
  end if;

  update public.profiles
  set gold = gold - v_price
  where id = v_keeper and gold >= v_price
  returning gold into v_gold;

  if not found then
    raise exception 'insufficient_gold';
  end if;

  insert into public.purchases (keeper_id, item_id, price_paid)
  values (v_keeper, p_item_id, v_price);

  return v_gold;
end;
$$;

revoke execute on function public.purchase_item(text) from public, anon;
grant execute on function public.purchase_item(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Reviews: patron reviews of a keeper's tavern, synced from the game.
-- ---------------------------------------------------------------------------

create table public.reviews (
  id bigint generated always as identity primary key,
  keeper_id uuid not null references public.profiles (id) on delete cascade,
  level_id smallint not null references public.levels (id),
  author text not null,
  -- e.g. "Dwarven merchant"
  epithet text,
  rating smallint not null check (rating between 1 and 5),
  body text not null,
  created_at timestamptz not null default now()
);

create index reviews_keeper_created_idx on public.reviews (keeper_id, created_at desc);
create index reviews_level_idx on public.reviews (level_id);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.levels enable row level security;
alter table public.level_runs enable row level security;
alter table public.market_items enable row level security;
alter table public.purchases enable row level security;
alter table public.reviews enable row level security;

-- Profiles are visible to signed-in keepers (names appear on the leaderboard).
create policy "Keepers can read profiles"
  on public.profiles for select to authenticated
  using (true);

-- Keepers may rename themselves, but never touch their gold.
revoke update on public.profiles from anon, authenticated;
grant update (keeper_name) on public.profiles to authenticated;

create policy "Keepers can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Keepers can read levels"
  on public.levels for select to authenticated
  using (true);

create policy "Keepers can read all level runs"
  on public.level_runs for select to authenticated
  using (true);

create policy "Keepers can read market items"
  on public.market_items for select to authenticated
  using (true);

create policy "Keepers can read their own purchases"
  on public.purchases for select to authenticated
  using ((select auth.uid()) = keeper_id);

create policy "Keepers can read reviews of their own tavern"
  on public.reviews for select to authenticated
  using ((select auth.uid()) = keeper_id);
