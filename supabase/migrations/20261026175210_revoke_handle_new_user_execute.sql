-- handle_new_user() is a trigger function only; keep it off the RPC API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
