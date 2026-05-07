import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('challenges')
      .select('*')
      .eq('classic_enabled', true);

    if (error) throw error;

    const normalized = (data ?? []).map((item: any) => ({
      ...item,
      file_url: item?.file_url ?? item?.files?.[0] ?? null,
      avatar_url: item?.avatar_url ?? null,
    }));

    return NextResponse.json(normalized);
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    const isSchemaError = typeof error?.message === 'string' && error.message.includes('Could not find the table');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError || isSchemaError ? 503 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    const difficultyMap: Record<string, string> = {
      Easy: 'easy',
      Medium: 'medium',
      Hard: 'hard',
      Insane: 'insane',
      Elite: 'elite',
    };

    const payload: any = {
      title: body?.title,
      category: body?.category,
      difficulty: difficultyMap[String(body?.difficulty)] ?? String(body?.difficulty ?? 'medium').toLowerCase(),
      challenge_url: body?.challenge_url || null,
      files: body?.file_url ? [body.file_url] : [],
      classic_enabled: true,
      flag: body?.flag || 'FLAG{SET_REAL_FLAG}',
    };

    if (!payload.title || !payload.category || !payload.difficulty) {
      return NextResponse.json({ error: 'title, category, difficulty wajib diisi.' }, { status: 400 });
    }

    let result = await supabase.from('challenges').insert(payload).select('*').single();
    if (result.error && typeof result.error.message === 'string' && result.error.message.includes('column')) {
      result = await supabase.from('challenges').insert(payload).select('*').single();
    }
    if (result.error) throw result.error;

    return NextResponse.json(
      {
        ...result.data,
        file_url: result.data?.file_url ?? result.data?.files?.[0] ?? null,
        avatar_url: result.data?.avatar_url ?? null,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const isEnvError = typeof error?.message === 'string' && error.message.includes('environment variables');
    const isSchemaError = typeof error?.message === 'string' && error.message.includes('Could not find the table');
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: isEnvError || isSchemaError ? 503 : 500 }
    );
  }
}
