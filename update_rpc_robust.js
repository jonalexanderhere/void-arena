const { Client } = require('pg');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const pgUrl = envFile.match(/POSTGRES_URL="(.+?)"/)?.[1];

if (!pgUrl) {
    console.error('POSTGRES_URL not found');
    process.exit(1);
}

const client = new Client({
    connectionString: pgUrl,
    ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE OR REPLACE FUNCTION public.submit_flag(
    p_challenge_id UUID,
    p_flag TEXT,
    p_tournament_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    v_correct_flag TEXT;
    v_points INTEGER;
    v_user_id UUID;
    v_already_solved BOOLEAN;
BEGIN
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'AUTH ERROR: Not authenticated');
    END IF;

    -- Get challenge info
    SELECT flag, points INTO v_correct_flag, v_points 
    FROM public.challenges 
    WHERE id = p_challenge_id;

    IF v_correct_flag IS NULL THEN
        RETURN json_build_object('success', false, 'message', 'SYSTEM ERROR: Challenge data not found');
    END IF;

    -- Check if already solved
    SELECT EXISTS (
        SELECT 1 FROM public.solves 
        WHERE user_id = v_user_id 
        AND challenge_id = p_challenge_id 
        AND (p_tournament_id IS NULL OR tournament_id = p_tournament_id)
    ) INTO v_already_solved;

    IF v_already_solved THEN
        RETURN json_build_object('success', false, 'message', 'ALREADY CAPTURED: This flag is already in your record');
    END IF;

    -- Check flag (TRIMMED for robustness)
    IF TRIM(p_flag) = TRIM(v_correct_flag) THEN
        -- Record solve
        INSERT INTO public.solves (user_id, challenge_id, tournament_id)
        VALUES (v_user_id, p_challenge_id, p_tournament_id);

        -- Award points to profile
        UPDATE public.profiles 
        SET points = COALESCE(points, 0) + v_points,
            xp = COALESCE(xp, 0) + v_points
        WHERE id = v_user_id;

        RETURN json_build_object('success', true, 'message', 'CRITICAL HIT! Flag Captured successfully.');
    ELSE
        RETURN json_build_object('success', false, 'message', 'ACCESS DENIED: Flag signature mismatch.');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

client.connect()
    .then(() => client.query(sql))
    .then(() => {
        console.log('✅ RPC submit_flag updated with robust trimming and better messages');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Error updating RPC:', err.message);
        process.exit(1);
    });
