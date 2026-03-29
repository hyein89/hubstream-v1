export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';

export default async function HalamanTonton({ params }) {
  // Kita bongkar semua balasan dari Supabase
  const { data, error } = await supabase.from('videos').select('*').eq('id', params.id).single();
  
  // JANGAN DILEMPAR KE 404. KITA TAMPILIN ERROR ASLINYA DI LAYAR!
  if (error || !data) {
    return (
      <div style={{ padding: '20px', background: '#000', color: '#0f0', fontFamily: 'monospace', minHeight: '100vh' }}>
        <h2>⚠️ MODE DETEKSI ERROR ⚠️</h2>
        <p><strong>ID Video di URL:</strong> {params.id}</p>
        <p><strong>Pesan Error dari Database:</strong></p>
        <pre style={{ background: '#222', padding: '10px', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(error, null, 2) || "Tidak ada pesan error (Data kosong)"}
        </pre>
        <p><strong>Status Data:</strong></p>
        <pre style={{ background: '#222', padding: '10px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
        <br/>
        <p><i>*Tolong screenshot atau copy tulisan warna hijau ini dan kirim ke gw*</i></p>
      </div>
    );
  }

  // Kalau sukses, tampilkan video seperti biasa
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
