-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
do $$ begin
    create type kyc_status as enum ('pending', 'approved', 'rejected');
    exception when duplicate_object then null;
end $$;

do $$ begin
    create type queue_status as enum ('waiting', 'in-progress', 'completed');
    exception when duplicate_object then null;
end $$;

-- Drop existing tables if they exist
drop table if exists kyc_applications;
drop table if exists queue_items;
drop table if exists dashboard_settings;
drop table if exists user_profiles cascade;

-- User profiles table
create table if not exists user_profiles (
  id uuid default uuid_generate_v4() primary key,
  full_name text,
  email text unique not null,
  phone_number text,
  role text default 'user',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add the metadata column if it doesn't exist (for safety)
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'user_profiles' 
    and column_name = 'metadata'
  ) then
    alter table user_profiles add column metadata jsonb default '{}'::jsonb;
  end if;
end $$;

-- Dashboard settings table
create table if not exists dashboard_settings (
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

-- Queue items table
create table if not exists queue_items (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  phone_number text not null,
  status queue_status default 'waiting',
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone,
  metadata jsonb default '{}'::jsonb
);

-- KYC applications table
create table if not exists kyc_applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_profiles(id),
  status kyc_status default 'pending',
  documents jsonb default '{}'::jsonb,
  submitted_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable row level security
alter table user_profiles enable row level security;
alter table dashboard_settings enable row level security;
alter table queue_items enable row level security;
alter table kyc_applications enable row level security;

-- Create policies
do $$ begin
    create policy "Enable read access for all users" on user_profiles for select using (true);
    exception when duplicate_object then null;
end $$;

do $$ begin
    create policy "Enable insert for authenticated users only" on user_profiles for insert with check (auth.role() = 'authenticated');
    exception when duplicate_object then null;
end $$;

do $$ begin
    create policy "Enable update for users based on email" on user_profiles for update using (auth.email() = email);
    exception when duplicate_object then null;
end $$;

-- Dashboard settings policies
create policy "Enable read access for own settings"
on dashboard_settings for select
using (auth.uid() = user_id);

create policy "Enable insert for own settings"
on dashboard_settings for insert
with check (auth.uid() = user_id);

create policy "Enable update for own settings"
on dashboard_settings for update
using (auth.uid() = user_id);

-- Queue items policies
create policy "Enable read access for all queue items"
on queue_items for select
using (true);

create policy "Enable insert for authenticated users"
on queue_items for insert
with check (auth.role() = 'authenticated');

create policy "Enable update for staff and admin"
on queue_items for update
using (auth.uid() in (
  select id from user_profiles 
  where role in ('staff', 'admin')
));

-- KYC applications policies
create policy "Enable read own applications"
on kyc_applications for select
using (auth.uid() = user_id);

create policy "Enable insert own applications"
on kyc_applications for insert
with check (auth.uid() = user_id);

create policy "Enable update own applications"
on kyc_applications for update
using (auth.uid() = user_id);

-- Enable realtime (only if not already enabled)
do $$ 
begin
    execute format('alter publication supabase_realtime add table if not exists user_profiles');
    execute format('alter publication supabase_realtime add table if not exists dashboard_settings');
    execute format('alter publication supabase_realtime add table if not exists queue_items');
    execute format('alter publication supabase_realtime add table if not exists kyc_applications');
exception when others then 
    null;
end $$;