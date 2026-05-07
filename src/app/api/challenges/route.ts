import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('classic_enabled', true);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError ? 503 : 500 }
    );
  }
}
