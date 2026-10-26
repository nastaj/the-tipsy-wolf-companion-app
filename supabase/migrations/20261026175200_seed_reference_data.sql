-- PLACEHOLDER reference data, mirroring the app mocks.
-- Resource names/prices are from the wireframe; levels, amenities and upgrades
-- are stand-ins until the game defines them.

insert into public.levels (id) values (1), (2), (3);

insert into public.market_items (id, name, category, price) values
  ('meat', 'Meat', 'resource', 1200),
  ('berries', 'Berries', 'resource', 2400),
  ('honey', 'Honey', 'resource', 650),
  ('wheat', 'Wheat', 'resource', 400),
  ('hearth-rug', 'Hearth Rug', 'amenity', 900),
  ('bards-stage', 'Bard''s Stage', 'amenity', 3200),
  ('larger-cellar', 'Larger Cellar', 'upgrade', 4500),
  ('extra-tables', 'Extra Tables', 'upgrade', 2800);
