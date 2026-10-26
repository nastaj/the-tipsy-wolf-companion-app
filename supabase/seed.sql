-- PLACEHOLDER game data, moved from the app mocks (leaderboard.mock.ts, reviews.mock.ts).
-- Adds test keepers (no password, cannot sign in) for the other leaderboard names;
-- Jakub's own runs and all reviews belong to ca9f6019-d64e-4b42-8c87-7e52d8b9e76f.
-- Run once: runs and reviews are not deduplicated.

begin;

-- Test keepers. handle_new_user() creates their profiles.
insert into auth.users (
  instance_id, id, aud, role, email, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
)
select
  '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
  'test-' || lower(name) || '@example.com', now(),
  '{"provider":"email","providers":["email"]}', jsonb_build_object('keeper_name', name), now(), now(),
  '', '', '', ''
from (values ('Wolf'), ('Deer'), ('Boar'), ('Fox')) as keeper (name)
where not exists (select 1 from auth.users u where u.email = 'test-' || lower(name) || '@example.com');

insert into public.level_runs (keeper_id, level_id, gold, time_seconds)
select coalesce(u.id, 'ca9f6019-d64e-4b42-8c87-7e52d8b9e76f'), run.level_id, run.gold, run.time_seconds
from (values
  ('Wolf', 1, 2400, 180), ('Deer', 1, 1700, 160), ('Boar', 1, 1500, 150), (null, 1, 1200, 130),
  ('Deer', 2, 3100, 245), ('Wolf', 2, 2950, 230), ('Fox', 2, 2200, 210), ('Boar', 2, 1800, 260), (null, 2, 2500, 240),
  ('Boar', 3, 4200, 320), ('Wolf', 3, 3900, 300)
) as run (keeper, level_id, gold, time_seconds)
left join auth.users u on u.email = 'test-' || lower(run.keeper) || '@example.com';

insert into public.reviews (keeper_id, level_id, author, epithet, rating, text, created_at)
select 'ca9f6019-d64e-4b42-8c87-7e52d8b9e76f', review.level_id, review.author, review.epithet, review.rating, review.text, review.created_at::timestamptz
from (values
  (3, 'Bram Oakfoot', 'Dwarven merchant', 5,
    'The venison stew warmed these old bones. A generous bowl and an ale worth stopping for.', '2026-10-18T19:30:00Z'),
  (2, 'Elara Reed', 'Elven ranger', 4,
    'Kind staff, but my ale arrived after the meal. Another server at dusk would do wonders.', '2026-10-17T21:10:00Z'),
  (1, 'Milo Thistle', 'Halfling bard', 5,
    'A crackling hearth, a lively crowd and room for my lute. I stayed for one more song.', '2026-10-16T20:45:00Z'),
  (1, 'Gorrim Ashbeard', 'Dwarven smith', 3,
    'Honest food, but the cellar ran dry of mead before midnight.', '2026-10-14T22:00:00Z'),
  (2, 'Sylwen Vale', 'Wandering cleric', 5,
    'Clean tables and a warm welcome. The honey cakes are a blessing.', '2026-10-12T18:20:00Z')
) as review (level_id, author, epithet, rating, text, created_at);

commit;
