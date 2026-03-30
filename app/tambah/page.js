'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function TambahVideo() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [idSukses, setIdSukses] = useState(null);
  
  // State untuk Notifikasi & Tombol Copy
  const [notif, setNotif] = useState({ tampil: false, pesan: '', tipe: 'sukses' });
  const [copyText, setCopyText] = useState('Copy Link');

  const tampilkanNotif = (pesan, tipe) => {
    setNotif({ tampil: true, pesan, tipe });
    setTimeout(() => setNotif({ tampil: false, pesan: '', tipe: 'sukses' }), 3000);
  };

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setTitle(selected.name.replace(/\.[^/.]+$/, ""));
      setIdSukses(null);
      setCopyText('Copy Link'); // Reset teks tombol copy
    }
  };

  const salinLink = () => {
    const fullURL = `${window.location.origin}/${idSukses}`;
    navigator.clipboard.writeText(fullURL);
    setCopyText('Copied!');
    tampilkanNotif('Link berhasil disalin ke clipboard!', 'sukses');
    setTimeout(() => setCopyText('Copy Link'), 2000); // Balikin teks tombol setelah 2 detik
  };

  const uploadProses = async () => {
    if (!file) return;
    setLoading(true);
    setIdSukses(null);

    try {
      const id = Math.random().toString(36).substring(2, 8);
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

      await supabase.storage.from('videos').upload(`${id}.mp4`, file);
      await supabase.storage.from('thumbnails').upload(`${id}.jpg`, blobImage);

      const urlVideo = supabase.storage.from('videos').getPublicUrl(`${id}.mp4`).data.publicUrl;
      const urlImage = supabase.storage.from('thumbnails').getPublicUrl(`${id}.jpg`).data.publicUrl;

      await supabase.from('videos').insert([{
        id, title, image: urlImage, video: urlVideo, hitcound: 0
      }]);

      setIdSukses(id);
      tampilkanNotif('Video Berhasil Diunggah!', 'sukses');
      setFile(null);
      setTitle('');
    } catch (err) {
      console.error(err);
      tampilkanNotif('Gagal mengunggah video. Cek koneksi.', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* CSS GLOBAL (Copy dari halaman setting) */}
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background-color: #0d1117 !important; margin: 0; padding: 0; }
        
        .nav-container { background: #000; border-bottom: 2px solid #30363d; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { color: #fff; font-weight: bold; font-size: 18px; text-decoration: none; padding: 15px 0; display: flex; align-items: center; gap: 8px;}
        .nav-menu { display: flex; gap: 5px; overflow-x: auto; }
        .nav-item { color: #8b949e; text-decoration: none; padding: 15px 20px; font-size: 14px; font-weight: bold; transition: 0.2s; white-space: nowrap; border-bottom: 2px solid transparent;}
        .nav-item:hover, .nav-item.active { color: #fff; background: #21262d; border-bottom-color: #238636; }
        
        .main-content { max-width: 500px; margin: 60px auto; padding: 0 20px; }
        .card { background: #161b22; border: 1px solid #30363d; padding: 30px; border-radius: 0; box-shadow: 10px 10px 0 rgba(0,0,0,0.5); }
        
        .input-text { width: 100%; padding: 12px; background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; border-radius: 0; font-family: inherit; margin-bottom: 20px; font-size: 14px;}
        .input-text:focus { outline: none; border-color: #58a6ff; }
        .input-text:disabled { background: #21262d; color: #8b949e;}

        .btn-upload { width: 100%; padding: 15px; background: #238636; color: #fff; border: none; font-weight: bold; text-transform: uppercase; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; border-radius: 0; transition: 0.2s; font-size: 14px;}
        .btn-upload:hover { background: #2ea043; }
        .btn-upload:disabled { background: #21262d; color: #8b949e; cursor: not-allowed; }

        .notif-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 15px 25px; color: #fff; font-weight: bold; border-radius: 0; z-index: 9999; display: flex; align-items: center; gap: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); animation: slideDown 0.3s ease-out; font-size: 14px;}
        .notif-sukses { background: #238636; border: 1px solid #2ea043; }
        .notif-error { background: #da3633; border: 1px solid #f85149; }

        @keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 20px; opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .nav-container { flex-direction: column; align-items: flex-start; padding: 0; }
          .nav-brand { padding: 15px 20px; width: 100%; border-bottom: 1px solid #30363d; }
          .nav-menu { width: 100%; padding: 0 10px; }
          .nav-item { padding: 12px 15px; font-size: 13px; }
          .main-content { margin: 30px auto; }
        }
      `}</style>

      {/* NOTIFIKASI KUSTOM */}
      {notif.tampil && (
        <div className={`notif-toast ${notif.tipe === 'sukses' ? 'notif-sukses' : 'notif-error'}`}>
          {notif.tipe === 'sukses' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          )}
          {notif.pesan}
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <nav className="nav-container">
        <Link href="/" className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#238636" strokeWidth="2" strokeLinecap="square"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          HubStream
        </Link>
        <div className="nav-menu">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="/list" className="nav-item">Daftar Video</Link>
          <Link href="/tambah" className="nav-item active">Upload</Link>
          <Link href="/seting" className="nav-item">Pengaturan</Link>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        <div className="card">
          <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '25px', fontSize: '24px', fontWeight: 'bold' }}>Tambah Video Baru</h2>
          
          {/* AREA UPLOAD STYLED */}
          <input type="file" id="fileInput" accept="video/*" onChange={handleFile} style={{ display: 'none' }} />
          <label htmlFor="fileInput" style={{
            border: file ? '2px solid #fff' : '2px dashed #30363d',
            padding: '50px 20px', textAlign: 'center', cursor: 'pointer',
            backgroundColor: file ? '#21262d' : '#0d1117',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px',
            marginBottom: '20px', borderRadius: '0'
          }}>
            {file ? (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2ea043" strokeWidth="2" strokeLinecap="square">
                  <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                  <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                  <path d="M9 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"></path>
                </svg>
                <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '14px', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                <span style={{ color: '#8b949e', fontSize: '12px' }}>(Ganti File)</span>
              </>
            ) : (
              <>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#30363d" strokeWidth="2" strokeLinecap="square">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                  <line x1="8.5" y1="10" x2="8.5" y2="14"></line>
                  <line x1="6.5" y1="12" x2="10.5" y2="12"></line>
                </svg>
                <span style={{ color: '#8b949e', fontSize: '14px', fontWeight: 'bold' }}>Klik untuk Pilih Video</span>
                <span style={{ color: '#666', fontSize: '12px' }}>Format MP4, MKV, AVI, dll</span>
              </>
            )}
          </label>
          
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tulis judul video di sini..." disabled={!file} className="input-text" />
          
          <button onClick={uploadProses} disabled={loading || !file} className="btn-upload">
            {loading ? (
              <>
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" style={{animation: 'spin 1s linear infinite'}}>
                   <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                 </svg>
                 Memproses Video...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                MULAI UPLOAD
              </>
            )}
          </button>

          {/* AREA JIKA SUKSES (Dalam card) */}
          {idSukses && (
            <div style={{ marginTop: '25px', padding: '20px', backgroundColor: '#0d1117', border: '1px solid #2ea043' }}>
              <div style={{ color: '#2ea043', fontWeight: 'bold', fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Upload Sukses!
              </div>
              
              <div style={{ background: '#21262d', padding: '10px', color: '#fff', fontSize: '14px', fontFamily: 'monospace', textOverflow: 'ellipsis', overflow: 'hidden', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {`/${idSukses}`}
                
                {/* Tombol Copy Link */}
                <button onClick={salinLink} style={{ background: copyText === 'Copied!' ? '#2ea043' : '#0d1117', color: '#fff', border: 'none', padding: '5px 10px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  {copyText}
                </button>
              </div>
              
              <Link href={`/${idSukses}`} target="_blank" style={{ color: '#58a6ff', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                Nonton Sekarang 
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
