import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { detectProvider } from '@/lib/utils/storage';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase
      .from('challenges')
      .select('*, challenge_files(*)');

    if (error) throw error;

    const normalized = (data ?? []).map((item: any) => ({
      ...item,
      file_url: item?.challenge_files?.[0]?.external_url || item?.file_url || item?.files?.[0] || null,
      challenge_files: item.challenge_files || []
    }));

    return NextResponse.json(normalized);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await req.json();

    const payload: any = {
      title: body?.title,
      description: body?.description || '',
      points: parseInt(body?.points) || 100,
      category: body?.category,
      difficulty: String(body?.difficulty ?? 'medium').toLowerCase(),
      challenge_url: body?.challenge_url || null,
      classic_enabled: true,
      flag: body?.flag || 'FLAG{SET_REAL_FLAG}',
      tournament_id: body?.tournament_id || null,
    };

    if (!payload.title || !payload.category || !payload.difficulty) {
      return NextResponse.json({ error: 'title, category, difficulty wajib diisi.' }, { status: 400 });
    }

    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .insert(payload)
      .select()
      .single();

    if (challengeError) throw challengeError;

    // Handle external file URL if provided
    if (body?.file_url && challenge) {
      const providerInfo = detectProvider(body.file_url);
      const fileName = body.file_url.split('/').pop()?.split('?')[0] || 'challenge_file';
      
      await supabase.from('challenge_files').insert({
        challenge_id: challenge.id,
        file_name: fileName,
        provider: providerInfo.name,
        external_url: body.file_url
      });
    }

    return NextResponse.json(challenge, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 });
    }

    const { error } = await supabase.from('challenges').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Challenge deleted.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
