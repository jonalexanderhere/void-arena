-- ==========================================
-- VOID ARENA COMPREHENSIVE PRODUCTION SETUP
-- ==========================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TABLES
-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    social_links JSONB DEFAULT '{}'::jsonb,
    role TEXT DEFAULT 'player' CHECK (role IN ('player', 'admin')),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist if table was created previously
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'player';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;

-- TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
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
CREATE TABLE IF NOT EXISTS public.tournaments (
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
CREATE TABLE IF NOT EXISTS public.challenges (
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
CREATE TABLE IF NOT EXISTS public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id)
);

-- CHALLENGE FILES
CREATE TABLE IF NOT EXISTS public.challenge_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    provider TEXT NOT NULL,
    external_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.submissions (
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

-- FIRST BLOODS
CREATE TABLE IF NOT EXISTS public.first_bloods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(challenge_id)
);

-- NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT,
    message TEXT,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.first_bloods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read profiles" ON public.profiles;
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read teams" ON public.teams;
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tournaments" ON public.tournaments;
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read challenges" ON public.challenges;
CREATE POLICY "Public read challenges" ON public.challenges FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read challenge_files" ON public.challenge_files;
CREATE POLICY "Public read challenge_files" ON public.challenge_files FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read participants" ON public.tournament_participants;
CREATE POLICY "Public read participants" ON public.tournament_participants FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read submissions" ON public.submissions;
CREATE POLICY "Public read submissions" ON public.submissions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read first_bloods" ON public.first_bloods;
CREATE POLICY "Public read first_bloods" ON public.first_bloods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read notifications" ON public.notifications;
CREATE POLICY "Public read notifications" ON public.notifications FOR SELECT USING (true);

-- User policies
DROP POLICY IF EXISTS "Users can join tournaments" ON public.tournament_participants;
CREATE POLICY "Users can join tournaments" ON public.tournament_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can submit flags" ON public.submissions;
CREATE POLICY "Users can submit flags" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Admin write access
DROP POLICY IF EXISTS "Admin write tournaments" ON public.tournaments;
CREATE POLICY "Admin write tournaments" ON public.tournaments FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin write challenges" ON public.challenges;
CREATE POLICY "Admin write challenges" ON public.challenges FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin write challenge_files" ON public.challenge_files;
CREATE POLICY "Admin write challenge_files" ON public.challenge_files FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. SCORING TRIGGERS
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
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_submission_correct ON public.submissions;
CREATE TRIGGER on_submission_correct
    AFTER INSERT OR UPDATE ON public.submissions
    FOR EACH ROW EXECUTE PROCEDURE public.handle_points_update();

-- 5. TRIGGERS (Auto-create profile on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, full_name, role)
    VALUES (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'full_name',
        COALESCE((new.raw_user_meta_data->>'role')::text, 'player')::user_role
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. INITIAL DATA / ADMIN MANAGEMENT
-- To promote a user to admin manually, run the following in your Supabase SQL Editor:
-- UPDATE public.profiles SET role = 'admin' WHERE username = 'YOUR_USERNAME';
-- OR
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'USER_UUID_FROM_AUTH';

-- Example: Set default admin if you have a specific username
-- UPDATE public.profiles SET role = 'admin' WHERE username = 'CYBER_PHOENIX';
