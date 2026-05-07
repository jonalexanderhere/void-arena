import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = getSupabase() as any;
    const { challengeId, flag, teamId, userId } = await req.json();

    // 1. Fetch challenge
    const { data: challenge, error: challError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challError || !challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    // 2. Validate flag
    const isCorrect = challenge.flag === flag;

    // 3. Log submission
    const { error: subError } = await supabase
      .from('submissions')
      .insert({
        challenge_id: challengeId,
        user_id: userId,
        team_id: teamId,
        flag,
        is_correct: isCorrect,
        points_awarded: isCorrect ? challenge.initial_points : 0 // Dynamic scoring handled separately or here
      });

    if (subError) throw subError;

    if (isCorrect) {
      // 4. Check for first blood
      const { data: fb } = await supabase
        .from('first_bloods')
        .select('*')
        .eq('challenge_id', challengeId)
        .single();

      if (!fb) {
        await supabase.from('first_bloods').insert({
          challenge_id: challengeId,
          user_id: userId,
          team_id: teamId
        });
        
        // 5. Notify via real-time table
        await supabase.from('notifications').insert({
          type: 'first_blood',
          message: `FIRST BLOOD captured by ${userId} on ${challenge.title}!`,
          data: { challengeId, userId, teamId }
        });
      }
    }

    return NextResponse.json({ correct: isCorrect });
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError ? 503 : 500 }
    );
  }
}
