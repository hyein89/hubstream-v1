'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TambahVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Ambil judul otomatis dari nama file
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const uploadProses = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const id = Math.random().toString(36).substring(2, 8);
      
      // Ambil frame video
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      await new Promise(r => video.onloadeddata = r);
      video.currentTime = 1;
      await new Promise(r => video.onseeked = r);
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      const blobImage = await new Promise(r => canvas.toBlob(r, 'image/jpeg'));

      // Upload ke Storage
      await supabase.storage.from('videos').upload(`${id}.mp4`, file);
      await supabase.storage.from('thumbnails').upload(`${id}.jpg`, blobImage);

      const urlVideo = supabase.storage.from('videos').getPublicUrl(`${id}.mp4`).data.publicUrl;
      const urlImage = supabase.storage.from('thumbnails').getPublicUrl(`${id}.jpg`).data.publicUrl;

      // Masukin ke DB
      await supabase.from('videos').insert([{
        id, 
        title, 
        image: urlImage, 
        video: urlVideo, 
        hitcound: 0
      }]);

      alert(`Berhasil! Link video: /${id}`);
      window.location.reload();
    } catch (err) {
      alert("Terjadi kesalahan saat upload.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', background: '#fff', border: '1px solid #ddd' }}>
      <h2 style={{ marginTop: 0 }}>Tambah Video</h2>
      
      <input 
        type="file" 
        accept="video/*" 
        onChange={handleFile} 
        style={{ marginBottom: '15px', display: 'block', width: '100%' }} 
      />
      
      <input 
        type="text" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="Judul Video"
        style={{ 
          width: '100%', padding: '10px', marginBottom: '15px', 
          border: '1px solid #ccc', boxSizing: 'border-box'
        }} 
      />
      
      <button 
        onClick={uploadProses} 
        disabled={loading || !file}
        style={{ 
          width: '100%', padding: '12px', background: '#000', color: '#fff', 
          border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
        }}
      >
        {loading ? 'Proses...' : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            Upload
          </>
        )}
      </button>
    </div>
  );
}
