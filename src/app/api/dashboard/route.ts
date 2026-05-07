import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase() as any;

    const [{ data: profile }, { data: feed }, { data: matches }, { count: totalChallenges }, { count: totalSolves }] = await Promise.all([
      supabase.from('profiles').select('id, username, avatar_url, bio, xp_level, xp_progress').order('created_at', { ascending: true }).limit(1).maybeSingle(),
      supabase.from('arena_activity_feed').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('match_history').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('challenges').select('*', { count: 'exact', head: true }),
      supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('is_correct', true),
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
