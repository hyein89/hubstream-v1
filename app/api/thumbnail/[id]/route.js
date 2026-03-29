import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req, { params }) {
  // Buang ekstensi buat nyari ID-nya
  const id = params.id.replace(/\.(jpg|png)$/, '');
  
  const { data } = await supabase.from('videos').select('image').eq('id', id).single();
  
  if (!data || !data.image) {
    return new NextResponse('Gambar Tidak Ditemukan', { status: 404 });
  }

  // Lempar ke URL asli yang ada di Supabase
  return NextResponse.redirect(data.image);
}
