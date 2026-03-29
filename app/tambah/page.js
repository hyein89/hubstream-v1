'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function TambahVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  // State baru untuk menampung ID video setelah sukses
  const [idSukses, setIdSukses] = useState(null);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Ambil judul otomatis dari nama file
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      // Sembunyikan notifikasi sukses kalau user pilih file baru
      setIdSukses(null);
    }
  };

  const uploadProses = async () => {
    if (!file) return;
    setLoading(true);
    setIdSukses(null); // Reset notifikasi sukses

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

      // Upload ke Storage langsung dari browser
      await supabase.storage.from('videos').upload(`${id}.mp4`, file);
      await supabase.storage.from('thumbnails').upload(`${id}.jpg`, blobImage);

      const urlVideo = supabase.storage.from('videos').getPublicUrl(`${id}.mp4`).data.publicUrl;
      const urlImage = supabase.storage.from('thumbnails').getPublicUrl(`${id}.jpg`).data.publicUrl;

      // Masukin data ke tabel SQL videos
      await supabase.from('videos').insert([{
        id, 
        title, 
        image: urlImage, 
        video: urlVideo, 
        hitcound: 0
      }]);

      // Tampilkan ID yang sukses ke user
      setIdSukses(id);
      
      // Reset input form
      setFile(null);
      setTitle('');

    } catch (err) {
      console.error(err);
      alert("Gagal upload."); // Error tetep pake alert karena ini case jarang
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#111', // Background gelap total
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        backgroundColor: '#fff', 
        padding: '30px', 
        border: 'none', 
        borderRadius: '0', // Wajib kotak kotak kotak!
        boxShadow: '10px 10px 0 #000' // Shadow kaku
      }}>
        <h1 style={{ margin: '0 0 25px 0', fontSize: '28px', fontWeight: 'bold' }}>
          Tambah Video
        </h1>
        
        {/* TAMPILAN JIKA UPLOAD SUKSES (Gantiin alert norak) */}
        {idSukses && (
          <div style={{ 
            backgroundColor: '#dcfce7', 
            border: '2px solid #166534', 
            padding: '20px', 
            marginBottom: '25px', 
            color: '#166534', 
            borderRadius: '0' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontWeight: 'bold' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Berhasil Diunggah!
            </div>
            
            {/* INI LINK HASILNYA SEKARANG ADA DI SINI */}
            <p style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
              ID Video: <strong style={{ fontSize: '16px' }}>/{idSukses}</strong>
            </p>
            
            <Link href={`/${idSukses}`} style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '8px', 
              backgroundColor: '#166534', 
              color: '#fff', 
              padding: '10px 15px', 
              textDecoration: 'none', 
              fontWeight: 'bold', 
              fontSize: '14px', 
              borderRadius: '0'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              Nonton Sekarang
            </Link>
          </div>
        )}

        {/* Form Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* AREA UPLOAD STYLED (Hiding the default input) */}
          <input 
            type="file" 
            id="fileInput"
            accept="video/*" 
            onChange={handleFile} 
            style={{ display: 'none' }} // Sembunyikan input jelek browser
          />
          <label htmlFor="fileInput" style={{
            border: file ? '2px solid #000' : '2px dashed #999',
            padding: '40px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: file ? '#eee' : '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '0'
          }}>
            {file ? (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                  <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                  <path d="M9 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                </svg>
                <span style={{ fontWeight: 'bold', fontSize: '14px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {file.name}
                </span>
                <span style={{ color: '#666', fontSize: '12px' }}>Ganti File</span>
              </>
            ) : (
              <>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="12" y1="18" x2="12" y2="6"></line>
                  <line x1="6" y1="12" x2="18" y2="12"></line>
                </svg>
                <span style={{ color: '#666', fontSize: '14px' }}>Klik untuk Pilih Video</span>
              </>
            )}
          </label>
          
          {/* Styled Text Input */}
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Judul Video"
            disabled={!file}
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginBottom: '5px', 
              border: '2px solid #000', // Border tebel kotak
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              fontSize: '14px',
              backgroundColor: !file ? '#eee' : '#fff',
              borderRadius: '0'
            }} 
          />
          
          {/* Styled Button */}
          <button 
            onClick={uploadProses} 
            disabled={loading || !file}
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: !file || loading ? '#666' : '#000', // Mati kalau loading
              color: '#fff', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              fontSize: '14px',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '10px',
              borderRadius: '0'
            }}
          >
            {loading ? (
              <>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" style={{animation: 'spin 1s linear infinite'}}>
                   <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                 </svg>
                 Memproses...
              </>
            ) : (
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
        
        {/* CSS animation sederhana buat loading spinner kotak */}
        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
