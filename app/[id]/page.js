import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default async function HalamanTonton({ params }) {
  const { data } = await supabase.from('videos').select('*').eq('id', params.id).single();
  
  // Lempar ke 404 kalau ID gak ketemu
  if (!data) return notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
      <h2 style={{ margin: '0 0 15px 0' }}>{data.title}</h2>
      
      {/* Bungkus player dari halaman embed */}
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
