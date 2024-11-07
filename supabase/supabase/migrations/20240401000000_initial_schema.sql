-- Initial database schema
create type kyc_status as enum ('pending', 'approved', 'rejected');

-- User profiles
create table if not exists user_profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text unique not null,
  phone_number text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Dashboard settings
create table if not exists dashboard_settings (
  user_id uuid references user_profiles(id),
  layout jsonb default '[]'::jsonb,
  widgets jsonb default '[]'::jsonb,
  theme text default 'light',
  preferences jsonb default '{}'::jsonb,
  primary key (user_id)
);

-- Enable realtime
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table dashboard_settings; 