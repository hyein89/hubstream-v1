export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  // AWAIT PARAMS DI API ROUTE
  const resolvedParams = await params;
  const id = resolvedParams.id.replace(/\.(jpg|png)$/, '');
  
  const { data } = await supabase.from('videos').select('image').eq('id', id).single();
  
  if (!data || !data.image) {
    return new NextResponse('Gambar Tidak Ditemukan', { status: 404 });
  }

  return NextResponse.redirect(data.image);
}
