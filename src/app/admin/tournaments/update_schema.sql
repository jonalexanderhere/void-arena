-- Update tournaments table
ALTER TABLE public.tournaments 
ADD COLUMN IF NOT EXISTS participation_mode TEXT DEFAULT 'Team' CHECK (participation_mode IN ('Solo', 'Team')),
ADD COLUMN IF NOT EXISTS banned_system_enabled BOOLEAN DEFAULT FALSE;

-- Update teams table for invite codes
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS join_code TEXT UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8);

-- Ensure teams have a captain/owner for management
ALTER TABLE public.teams 
ADD COLUMN IF NOT EXISTS captain_id UUID REFERENCES auth.users(id);

-- Create a table for tournament participants (for Solo or Team)
CREATE TABLE IF NOT EXISTS public.tournament_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
    player_id UUID REFERENCES auth.users(id), -- Null if it's a team participation
    team_id UUID REFERENCES public.teams(id),   -- Null if it's a solo participation
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, player_id),
    UNIQUE(tournament_id, team_id)
);
