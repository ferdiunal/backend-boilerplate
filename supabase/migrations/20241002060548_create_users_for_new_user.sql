-- Create the function to handle the new user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, email, password, email_verified_at, phone, role, created_at)
  values (
    new.id, 
    new.email,
    new.encrypted_password,
    new.email_confirmed_at,
    new.phone, 
    COALESCE((new.raw_user_meta_data ->> 'role')::public.user_role_type, 'user_client'),
    new.created_at
  );
  return new;
end;
$$;

-- Create the trigger for the auth.users table
create trigger handle_new_user
  after insert on auth.users
  for each row execute procedure public.handle_new_user();