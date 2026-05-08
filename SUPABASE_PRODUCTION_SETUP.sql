-- ==========================================
-- VOID ARENA COMPREHENSIVE PRODUCTION OVERHAUL
-- This script will DROP and RECREATE all tables
-- ==========================================

-- 0. CLEANUP (Drop existing tables and types)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_submission_correct ON public.submissions;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_points_update();

DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.first_bloods CASCADE;
DROP TABLE IF EXISTS public.match_history CASCADE;
DROP TABLE IF EXISTS public.arena_activity_feed CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.challenge_files CASCADE;
DROP TABLE IF EXISTS public.tournament_participants CASCADE;
DROP TABLE IF EXISTS public.challenges CASCADE;
DROP TABLE IF EXISTS public.tournaments CASCADE;
DROP TABLE IF EXISTS public.teams CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TYPES
CREATE TYPE user_role AS ENUM ('player', 'admin');

-- 3. TABLES

-- PROFILES (Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    role user_role DEFAULT 'player',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TEAMS
CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    discord_url TEXT,
    points INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    members INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Recruiting',
    wins INTEGER DEFAULT 0,
    join_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
    captain_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOURNAMENTS
CREATE TABLE public.tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    banner_url TEXT,
    thumbnail_url TEXT,
    livestream_url TEXT,
    discord_url TEXT,
    start_date TEXT, 
    prize TEXT,
    region TEXT DEFAULT 'GLOBAL',
    status TEXT DEFAULT 'Upcoming',
    teams INTEGER DEFAULT 0,
    participation_mode TEXT DEFAULT 'Team' CHECK (participation_mode IN ('Solo', 'Team')),
    banned_system_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CHALLENGES
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    points INTEGER DEFAULT 100,
    flag TEXT NOT NULL,
    challenge_url TEXT,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    classic_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TOURNAMENT PARTICIPANTS
CREATE TABLE public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- CHALLENGE FILES
CREATE TABLE public.challenge_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    provider TEXT NOT NULL,
    external_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBMISSIONS
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    flag TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    points_awarded INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ARENA ACTIVITY FEED (Solves/Actions)
CREATE TABLE public.arena_activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    actor TEXT,
    action TEXT,
    target TEXT,
    points_delta INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- MATCH HISTORY
CREATE TABLE public.match_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_a UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    team_b UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'Scheduled',
    score TEXT DEFAULT '0-0',
    winner_id UUID REFERENCES public.teams(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FIRST BLOODS
CREATE TABLE public.first_bloods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id)
);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT,
    message TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.first_bloods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

-- Select Policies (Public)
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Public read challenge_files" ON public.challenge_files FOR SELECT USING (true);
CREATE POLICY "Public read participants" ON public.tournament_participants FOR SELECT USING (true);
CREATE POLICY "Public read submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Public read first_bloods" ON public.first_bloods FOR SELECT USING (true);
CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public read feed" ON public.arena_activity_feed FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON public.match_history FOR SELECT USING (true);

-- User Policies
CREATE POLICY "Users can join tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can submit flags" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin Policies
CREATE POLICY "Admin write tournaments" ON public.tournaments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write challenges" ON public.challenges FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write challenge_files" ON public.challenge_files FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin write notifications" ON public.notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. FUNCTIONS & TRIGGERS

-- Handle Points Update
CREATE OR REPLACE FUNCTION public.handle_points_update()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.is_correct = TRUE AND (OLD.is_correct = FALSE OR OLD.is_correct IS NULL)) THEN
        -- Update Profile Points
        UPDATE public.profiles 
        SET points = points + NEW.points_awarded 
        WHERE id = NEW.user_id;
        
        -- Update Team Points if team_id exists
        IF (NEW.team_id IS NOT NULL) THEN
            UPDATE public.teams 
            SET points = points + NEW.points_awarded 
            WHERE id = NEW.team_id;
        END IF;

        -- Add to Activity Feed
        INSERT INTO public.arena_activity_feed (user_id, actor, action, target, points_delta)
        SELECT 
            NEW.user_id, 
            p.username, 
            'captured', 
            c.title, 
            NEW.points_awarded
        FROM public.profiles p, public.challenges c
        WHERE p.id = NEW.user_id AND c.id = NEW.challenge_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_submission_correct
    AFTER INSERT OR UPDATE ON public.submissions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_points_update();

-- Handle New User (Auto-create profile)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'full_name',
        COALESCE((new.raw_user_meta_data->>'role')::user_role, 'player'::user_role)
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
