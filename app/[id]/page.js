export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function HalamanTonton({ params }) {
  // CARA BARU BACA PARAMS DI NEXT.JS 16+ (Ini kunci benerinnya!)
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  const { data } = await supabase.from('videos').select('*').eq('id', videoId).single();
  
  if (!data) return notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ margin: '0 0 15px 0' }}>{data.title}</h2>
      
      <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
        <iframe 
          src={`/embed/${data.id}`} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
        />
      </div>
      
      <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
        Dilihat: {data.hitcound} kali
      </p>
    </div>
  );
}
