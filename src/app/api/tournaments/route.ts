import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError ? 503 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    const { error } = await supabase.from('tournaments').insert({
      name: body.name,
      description: body.description || '',
      date: body.date || new Date().toISOString(),
      region: body.region || 'Global',
      status: body.status || 'Upcoming',
      prize: body.prize || '$0',
      type: body.type || 'Solo',
      participation_mode: body.participation_mode || 'Individual',
      color: body.color || null,
    });

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}