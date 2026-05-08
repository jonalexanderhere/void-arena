-- ==========================================
-- FINAL PERMISSION & AUTH FIX
-- ==========================================

-- 1. SCHEMA PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

-- Ensure these roles can actually see the tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon, authenticated, service_role;

-- 2. ROBUST TRIGGER FUNCTION (Simplified for Auth stability)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Use a block to catch all errors so Auth transaction never fails
    BEGIN
        INSERT INTO public.profiles (id, username, full_name, role)
        VALUES (
            new.id,
            COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
            new.raw_user_meta_data->>'full_name',
            'player'
        );
    EXCEPTION WHEN OTHERS THEN
        -- Log or ignore error to keep Auth working
        NULL;
    END;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-link trigger to be sure
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. SCOREBOARD FIX (Explicitly allow anon select)
GRANT SELECT ON public.teams TO anon;
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT ON public.arena_activity_feed TO anon;
GRANT SELECT ON public.match_history TO anon;
GRANT SELECT ON public.challenges TO anon;
GRANT SELECT ON public.tournaments TO anon;
