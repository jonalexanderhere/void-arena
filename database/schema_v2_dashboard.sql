-- VOID ARENA Dashboard SQL v2
-- apply after base schema.sql

alter table if exists profiles
  add column if not exists xp_level integer default 1,
  add column if not exists xp_progress integer default 0;

create table if not exists arena_activity_feed (
  id uuid default uuid_generate_v4() primary key,
  actor text not null,
  action text not null,
  target text not null,
  points_delta integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists match_history (
  id uuid default uuid_generate_v4() primary key,
  team_a text not null,
  team_b text not null,
  status text not null,
  score text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into arena_activity_feed (actor, action, target, points_delta)
select 'SYSTEM', 'initialized', 'Dashboard feed ready', 0
where not exists (select 1 from arena_activity_feed);

insert into match_history (team_a, team_b, status, score)
select 'TBD', 'TBD', 'NO MATCH', '-'
where not exists (select 1 from match_history);

alter publication supabase_realtime add table arena_activity_feed;
alter publication supabase_realtime add table match_history;
