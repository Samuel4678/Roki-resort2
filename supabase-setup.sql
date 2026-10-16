-- ROKI Resort backend. Paste this whole file into Supabase > SQL Editor > Run.
-- Admin = the user with email admin@rokiadmin.com (username "admin" on the login page).

create table if not exists events (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) <= 120),
  event_date date not null,
  event_time text check (char_length(event_time) <= 40),
  description text check (char_length(description) <= 500),
  image_url text,
  created_at timestamptz default now());

create table if not exists site_images (
  key text primary key check (key ~ '^[a-z]+$'),
  url text not null,
  updated_at timestamptz default now());

create table if not exists activity (
  id bigint generated always as identity primary key,
  session_id text check (char_length(session_id) <= 40),
  type text not null check (char_length(type) <= 40),
  detail text check (char_length(detail) <= 150),
  page text check (char_length(page) <= 100),
  device text check (char_length(device) <= 20),
  created_at timestamptz default now());

create or replace function is_admin() returns boolean language sql stable as
$$ select coalesce(auth.jwt() ->> 'email', '') = 'admin@rokiadmin.com' $$;

alter table events enable row level security;
alter table site_images enable row level security;
alter table activity enable row level security;

-- everyone can read events and swapped photos; only the admin can change them
create policy "read events" on events for select using (true);
create policy "admin writes events" on events for all using (is_admin()) with check (is_admin());
create policy "read images" on site_images for select using (true);
create policy "admin writes images" on site_images for all using (is_admin()) with check (is_admin());
-- visitors can only ADD activity rows; only the admin can read them
create policy "visitors log activity" on activity for insert to anon, authenticated with check (true);
create policy "admin reads activity" on activity for select using (is_admin());

-- public photo storage; only the admin can upload or delete
insert into storage.buckets (id, name, public) values ('site-images', 'site-images', true) on conflict (id) do nothing;
create policy "public reads photos" on storage.objects for select using (bucket_id = 'site-images');
create policy "admin uploads photos" on storage.objects for insert with check (bucket_id = 'site-images' and is_admin());
create policy "admin updates photos" on storage.objects for update using (bucket_id = 'site-images' and is_admin());
create policy "admin deletes photos" on storage.objects for delete using (bucket_id = 'site-images' and is_admin());
