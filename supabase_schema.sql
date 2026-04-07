-- Run this entire script in Supabase: SQL Editor → New query → paste → Run

-- 1. Profiles (one row per user, created on sign-up)
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  created_at timestamptz default now()
);

-- Allow users to read/write only their own profile
alter table profiles enable row level security;
create policy "Own profile" on profiles
  for all using (auth.uid() = id);

-- 2. Game sessions (one row per completed game)
create table if not exists game_sessions (
  id         bigint generated always as identity primary key,
  user_id    uuid references profiles(id) on delete cascade not null,
  game_id    text not null,         -- 'memory' | 'stroop' | 'sequence' | 'pattern'
  score      int not null,
  accuracy   int not null,
  played_at  timestamptz default now()
);

alter table game_sessions enable row level security;
create policy "Own sessions" on game_sessions
  for all using (auth.uid() = user_id);

-- 3. Badges earned
create table if not exists user_badges (
  id         bigint generated always as identity primary key,
  user_id    uuid references profiles(id) on delete cascade not null,
  badge_id   text not null,
  earned_at  timestamptz default now(),
  unique(user_id, badge_id)
);

alter table user_badges enable row level security;
create policy "Own badges" on user_badges
  for all using (auth.uid() = user_id);

-- 4. Auto-create a profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
