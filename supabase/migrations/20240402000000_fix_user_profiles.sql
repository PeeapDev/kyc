-- First, drop all dependent objects
do $$ 
begin
    -- Drop policies
    drop policy if exists "Enable read access for all users" on user_profiles;
    drop policy if exists "Enable insert for authenticated users only" on user_profiles;
    drop policy if exists "Enable update for users based on email" on user_profiles;
    
    -- Drop dependent tables with cascade
    drop table if exists kyc_applications cascade;
    drop table if exists dashboard_settings cascade;
    drop table if exists queue_items cascade;
    drop table if exists user_profiles cascade;
exception when others then
    null;
end $$;

-- Recreate user_profiles table
create table user_profiles (
  id uuid default uuid_generate_v4() primary key,
  full_name text,
  email text unique not null,
  phone_number text,
  role text default 'user',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Recreate dependent tables
create table dashboard_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id),
  logo_url text,
  title text,
  theme text default 'light',
  time_format text default '12',
  preferences jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table kyc_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id),
  status kyc_status default 'pending',
  documents jsonb default '{}'::jsonb,
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

create table queue_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone_number text not null,
  status queue_status default 'waiting',
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- Enable RLS
alter table user_profiles enable row level security;
alter table dashboard_settings enable row level security;
alter table kyc_applications enable row level security;
alter table queue_items enable row level security;

-- Create policies
create policy "Enable read access for all users"
on user_profiles for select
using (true);

create policy "Enable insert for authenticated users only"
on user_profiles for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for users based on email"
on user_profiles for update
using (auth.email() = email);

create policy "Enable read access for own settings"
on dashboard_settings for select
using (auth.uid() = user_id);

create policy "Enable insert for own settings"
on dashboard_settings for insert
with check (auth.uid() = user_id);

create policy "Enable update for own settings"
on dashboard_settings for update
using (auth.uid() = user_id);

-- Enable realtime
alter publication supabase_realtime add table user_profiles;
alter publication supabase_realtime add table dashboard_settings;
alter publication supabase_realtime add table kyc_applications;
alter publication supabase_realtime add table queue_items; 