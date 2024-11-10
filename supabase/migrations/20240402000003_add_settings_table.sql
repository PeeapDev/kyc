-- Drop existing policies first
do $$ 
begin
    drop policy if exists "Allow read access to app_settings" on app_settings;
    drop policy if exists "Allow update for authenticated users" on app_settings;
    drop policy if exists "Allow public read access to settings bucket" on storage.objects;
    drop policy if exists "Allow authenticated users to upload to settings bucket" on storage.objects;
exception when others then null;
end $$;

-- Create app_settings table
create table if not exists app_settings (
  id uuid default uuid_generate_v4() primary key,
  logo_url text,
  company_name text,
  theme text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS
alter table app_settings enable row level security;

-- Create policies
create policy "Allow read access to app_settings"
  on app_settings for select
  using (true);

create policy "Allow update for authenticated users"
  on app_settings for update
  using (auth.role() = 'authenticated');

-- Create storage bucket if it doesn't exist
insert into storage.buckets (id, name)
values ('settings', 'settings')
on conflict do nothing;

-- Storage policies
create policy "Allow public read access to settings bucket"
  on storage.objects for select
  using (bucket_id = 'settings');

create policy "Allow authenticated users to upload to settings bucket"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'settings'); 