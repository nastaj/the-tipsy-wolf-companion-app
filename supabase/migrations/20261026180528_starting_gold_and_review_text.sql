-- Keepers start with 500 gold.
alter table public.profiles alter column gold set default 500;

-- Match the app's Review model.
alter table public.reviews rename column body to text;
