-- Drop existing table if it exists
drop table if exists queue_items;

-- Create queue_items table
create table queue_items (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null,
  queue_number text not null,
  status text default 'waiting',
  joined_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Enable RLS
alter table queue_items enable row level security;

-- Create policy to allow all operations (we can restrict this later)
create policy "Enable all operations for queue_items"
  on queue_items
  for all
  using (true)
  with check (true);

-- Enable realtime
alter publication supabase_realtime add table queue_items; 