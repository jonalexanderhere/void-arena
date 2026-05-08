import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { challengeId, flag, teamId, userId, tournamentId } = await req.json();
    let isFirstBlood = false;

    // Get session for user context if userId not provided
    let effectiveUserId = userId;
    let userName = '';
    if (!effectiveUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        effectiveUserId = session.user.id;
        userName = session.user.email?.split('@')[0] ?? 'Player';
      }
    }

    // 1. Fetch challenge
    const { data: challenge, error: challError } = await supabase
      .from('challenges')
      .select('*')
      .eq('id', challengeId)
      .single();

    if (challError || !challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    // 2. Validate flag
    const isCorrect = challenge.flag === flag;
    const pointsAwarded = isCorrect ? (challenge.initial_points ?? challenge.points ?? 100) : 0;

    // 3. Log submission
    let subError: any = null;
    try {
      const result = await supabase
        .from('submissions')
        .insert({
          challenge_id: challengeId,
          user_id: effectiveUserId,
          team_id: teamId ?? null,
          flag,
          is_correct: isCorrect,
          points_awarded: pointsAwarded,
          tournament_id: tournamentId ?? null,
        });
      subError = result.error;
    } catch (e: any) {
      subError = e;
    }

    if (subError && !String(subError?.message).includes('column')) {
      // Try minimal insert if columns mismatch
      const minimal = await supabase.from('submissions').insert({
        challenge_id: challengeId,
        user_id: effectiveUserId,
        flag,
        is_correct: isCorrect,
      });
      if (minimal.error) throw minimal.error;
    }

    if (isCorrect) {
      // 4. Check for first blood (try both table names)
      let fb: any = null;
      try {
        const fbResult = await supabase
          .from('first_bloods')
          .select('*')
          .eq('challenge_id', challengeId)
          .maybeSingle();
        fb = fbResult.data;
      } catch {
        fb = null;
      }

      if (!fb) {
        isFirstBlood = true;
        try {
          await supabase.from('first_bloods').insert({
            challenge_id: challengeId,
            user_id: effectiveUserId,
            team_id: teamId ?? null,
          });
        } catch {}

        // 5. Notify via real-time table with full detail for sound/alert
        try {
          await supabase.from('notifications').insert({
            type: 'first_blood',
            message: `FIRST BLOOD by ${userName} on ${challenge.title}!`,
            data: {
              challengeId,
              userId: effectiveUserId,
              teamId: teamId ?? null,
              teamName: userName,
              challengeName: challenge.title,
              points: pointsAwarded,
            },
          });
        } catch {}
      }
    }

    return NextResponse.json({
      correct: isCorrect,
      firstBlood: isFirstBlood,
      challengeTitle: challenge.title,
      points: pointsAwarded,
      userName,
    });
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError ? 503 : 500 }
    );
  }
}
