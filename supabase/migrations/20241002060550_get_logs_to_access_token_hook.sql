-- Create the auth hook function
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.user_role_type;
begin
  -- Fetch the user role from the users table
  select role into user_role from public.users where id = (event->>'user_id')::uuid LIMIT 1;

  claims := event->'claims';

  if user_role is not null then
    -- Set the claim
    claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  else
    claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
  end if;

  -- Update the 'claims' object in the original event
  event := jsonb_set(event, '{claims}', claims);

  -- Return the modified or original event
  return event;
end;
$$;

-- Grant usage and execute permissions
grant usage on schema public to supabase_auth_admin;

grant execute
  on function public.custom_access_token_hook
  to supabase_auth_admin;

revoke execute
  on function public.custom_access_token_hook
  from authenticated, anon, public;

-- Permissions on the users table
grant select
  on table public.users
  to supabase_auth_admin;

revoke all
  on table public.users
  from authenticated, anon, public;

-- Policy to allow auth admin to read user roles
create policy "Allow auth admin to read user roles logs" ON public.users
as permissive for select
to supabase_auth_admin
using (true);