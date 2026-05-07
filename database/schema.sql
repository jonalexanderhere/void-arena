-- VOID ARENA - Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('player', 'captain', 'moderator', 'admin', 'streamer', 'observer', 'super_admin');
create type tournament_type as enum ('single_elimination', 'double_elimination', 'swiss', 'round_robin');
create type tournament_status as enum ('upcoming', 'ongoing', 'completed', 'paused');
create type difficulty_level as enum ('easy', 'medium', 'hard', 'insane', 'elite');

-- 3. TABLES

-- Profiles (extends Supabase Auth users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  avatar_url text,
  role user_role default 'player',
  bio text,
  team_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teams
create table teams (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  captain_id uuid references profiles(id),
  invite_code text unique not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Update profiles to link to teams
alter table profiles add constraint fk_team foreign key (team_id) references teams(id) on delete set null;

-- Challenges
create table challenges (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null,
  difficulty difficulty_level default 'medium',
  initial_points integer default 500,
  minimum_points integer default 100,
  decay integer default 20,
  flag text not null,
  challenge_url text,
  files text[], -- URLs to files in Supabase Storage
  hints jsonb default '[]',
  speedrun_timer integer default 300, -- in seconds
  classic_enabled boolean default true,
  speedrun_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Submissions
create table submissions (
  id uuid default uuid_generate_v4() primary key,
  challenge_id uuid references challenges(id) on delete cascade,
  user_id uuid references profiles(id),
  team_id uuid references teams(id),
  flag text not null,
  is_correct boolean not null,
  points_awarded integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- First Bloods
create table first_bloods (
  id uuid default uuid_generate_v4() primary key,
  challenge_id uuid references challenges(id) on delete cascade unique,
  user_id uuid references profiles(id),
  team_id uuid references teams(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tournaments
create table tournaments (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  type tournament_type default 'single_elimination',
  status tournament_status default 'upcoming',
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tournament Teams (Many-to-Many)
create table tournament_teams (
  tournament_id uuid references tournaments(id) on delete cascade,
  team_id uuid references teams(id) on delete cascade,
  primary key (tournament_id, team_id)
);

-- Matches (for Speedrun Arena & Tournaments)
create table matches (
  id uuid default uuid_generate_v4() primary key,
  tournament_id uuid references tournaments(id) on delete cascade,
  team_a_id uuid references teams(id),
  team_b_id uuid references teams(id),
  winner_id uuid references teams(id),
  status text default 'scheduled', -- scheduled, in_progress, completed
  score_a integer default 0,
  score_b integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Rounds
create table rounds (
  id uuid default uuid_generate_v4() primary key,
  match_id uuid references matches(id) on delete cascade,
  challenge_id uuid references challenges(id),
  winner_id uuid references teams(id),
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  duration integer, -- actual duration in seconds
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Realtime Notifications
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  type text not null, -- 'first_blood', 'match_start', 'solve'
  message text not null,
  data jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. RLS POLICIES (Example: Profiles)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 5. REALTIME
-- Enable realtime for key tables
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table submissions;
alter publication supabase_realtime add table matches;
alter publication supabase_realtime add table rounds;
alter publication supabase_realtime add table first_bloods;
