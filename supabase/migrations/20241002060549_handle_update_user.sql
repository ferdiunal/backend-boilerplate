-- Create the function to handle the new user
create function public.handle_update_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.users
  set 
    email = new.email,
    phone = new.phone,
    role = COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role_type, 'user_client'),
    created_at = new.created_at,
    updated_at = new.updated_at,
    last_sign_in_at = new.last_sign_in_at,
    email_verified_at = new.email_confirmed_at,
    password = new.encrypted_password
  where id = new.id;
  return new;
end;
$$;

-- Create the trigger for the auth.users table
create trigger handle_update_user
  after update on auth.users
  for each row execute procedure public.handle_update_user();