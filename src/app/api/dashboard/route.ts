import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [{ data: profile }, { data: feed }, { data: matches }, { count: totalChallenges }, { count: totalSolves }] = await Promise.all([
      supabase.from('profiles').select('username, avatar_url, bio, xp_level, xp_progress').eq('id', userId).maybeSingle(),
      supabase.from('arena_activity_feed').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      supabase.from('match_history').select('*').or(`team_a.eq.${userId},team_b.eq.${userId}`).order('created_at', { ascending: false }).limit(3),
      supabase.from('challenges').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_correct', true),
    ]);

    const username = profile?.username ?? 'UNREGISTERED';
    const level = profile?.xp_level ?? 1;
    const progress = Number(profile?.xp_progress ?? 0);

    const safeFeed = Array.isArray(feed) ? feed : [];
    const safeMatches = Array.isArray(matches) ? matches : [];

    return NextResponse.json({
      profile: {
        username,
        avatar_url: profile?.avatar_url ?? null,
        bio: profile?.bio ?? 'No bio set yet.',
        level,
        progress,
      },
      stats: {
        total_points: safeFeed.reduce((acc: number, f: any) => acc + Number(f.points_delta ?? 0), 0),
        total_solves: totalSolves ?? 0,
        total_challenges: totalChallenges ?? 0,
      },
      feed: safeFeed,
      matches: safeMatches,
    });
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    return NextResponse.json(
      { error: error?.message ?? 'Internal server error' },
      { status: isEnvError ? 503 : 500 }
    );
  }
}
