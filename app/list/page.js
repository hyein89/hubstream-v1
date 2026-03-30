'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DaftarVideo() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 10; // Jumlah video per halaman
  
  // Notifikasi & Modal
  const [notif, setNotif] = useState({ tampil: false, pesan: '', tipe: 'sukses' });
  const [modalHapus, setModalHapus] = useState({ tampil: false, id: null, title: '' });

  const tampilkanNotif = (pesan, tipe) => {
    setNotif({ tampil: true, pesan, tipe });
    setTimeout(() => setNotif({ tampil: false, pesan: '', tipe: 'sukses' }), 3000);
  };

  const fetchVideos = async () => {
    setLoading(true);
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    // Ambil data beserta total hitungannya
    const { data, count, error } = await supabase
      .from('videos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (!error) {
      setVideos(data || []);
      setTotal(count || 0);
    } else {
      tampilkanNotif('Gagal mengambil data video', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, [page]); // Akan ngambil data ulang setiap kali 'page' berubah

  const salinLink = (id) => {
    const fullURL = `${window.location.origin}/${id}`;
    navigator.clipboard.writeText(fullURL);
    tampilkanNotif('Link video disalin!', 'sukses');
  };

  const konfirmasiHapus = (id, title) => {
    setModalHapus({ tampil: true, id, title });
  };

  const eksekusiHapus = async () => {
    if (!modalHapus.id) return;
    
    // Hapus dari database
    const { error } = await supabase.from('videos').delete().eq('id', modalHapus.id);
    
    if (error) {
      tampilkanNotif('Gagal menghapus video!', 'error');
    } else {
      // (Opsional) Hapus file fisik dari storage biar gak menu-menuhin kapasitas
      await supabase.storage.from('videos').remove([`${modalHapus.id}.mp4`]);
      await supabase.storage.from('thumbnails').remove([`${modalHapus.id}.jpg`]);

      tampilkanNotif('Video berhasil dihapus!', 'sukses');
      setModalHapus({ tampil: false, id: null, title: '' });
      fetchVideos(); // Refresh tabel
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { background-color: #0d1117 !important; margin: 0; padding: 0; }
        
        /* NAVIGASI */
        .nav-container { background: #000; border-bottom: 2px solid #30363d; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { color: #fff; font-weight: bold; font-size: 18px; text-decoration: none; padding: 15px 0; display: flex; align-items: center; gap: 8px;}
        .nav-menu { display: flex; gap: 5px; overflow-x: auto; }
        .nav-item { color: #8b949e; text-decoration: none; padding: 15px 20px; font-size: 14px; font-weight: bold; transition: 0.2s; white-space: nowrap; border-bottom: 2px solid transparent;}
        .nav-item:hover, .nav-item.active { color: #fff; background: #21262d; border-bottom-color: #238636; }
        
        .main-content { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
        .card { background: #161b22; border: 1px solid #30363d; padding: 25px; border-radius: 0; box-shadow: 10px 10px 0 rgba(0,0,0,0.5); }
        
        /* TABEL SCROLLABLE */
        .table-responsive { width: 100%; overflow-x: auto; border: 1px solid #30363d; margin-bottom: 20px; background: #0d1117; }
        table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { padding: 12px 15px; border-bottom: 1px solid #30363d; color: #c9d1d9; font-size: 14px; white-space: nowrap; }
        th { background: #21262d; color: #fff; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;}
        tr:hover td { background: #1c2128; }
        
        /* TRUNCATE JUDUL */
        .truncate-text { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block; vertical-align: middle; }

        /* BUTTONS */
        .btn-action { padding: 6px 12px; font-size: 12px; font-weight: bold; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; border-radius: 0; text-transform: uppercase; }
        .btn-copy { background: #21262d; color: #58a6ff; border: 1px solid #30363d; }
        .btn-copy:hover { background: #30363d; }
        .btn-delete { background: #da3633; color: #fff; }
        .btn-delete:hover { background: #b62324; }

        .btn-page { background: #238636; color: #fff; padding: 8px 15px; border: none; cursor: pointer; font-weight: bold; border-radius: 0; text-transform: uppercase; font-size: 12px;}
        .btn-page:disabled { background: #21262d; color: #8b949e; cursor: not-allowed; }

        /* MODAL KUSTOM */
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; justify-content: center; align-items: center; z-index: 9999; }
        .modal-box { background: #161b22; padding: 25px; border: 1px solid #30363d; width: 90%; max-width: 400px; border-radius: 0; box-shadow: 10px 10px 0 #000; }
        
        /* NOTIF TOAST */
        .notif-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 15px 25px; color: #fff; font-weight: bold; border-radius: 0; z-index: 10000; display: flex; align-items: center; gap: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); animation: slideDown 0.3s ease-out; font-size: 14px;}
        .notif-sukses { background: #238636; border: 1px solid #2ea043; }
        .notif-error { background: #da3633; border: 1px solid #f85149; }

        @keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 20px; opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) {
          .nav-container { flex-direction: column; align-items: flex-start; padding: 0; }
          .nav-brand { padding: 15px 20px; width: 100%; border-bottom: 1px solid #30363d; }
          .nav-menu { width: 100%; padding: 0 10px; }
          .nav-item { padding: 12px 15px; font-size: 13px; }
        }
      `}</style>

      {/* NOTIFIKASI TOAST */}
      {notif.tampil && (
        <div className={`notif-toast ${notif.tipe === 'sukses' ? 'notif-sukses' : 'notif-error'}`}>
          {notif.pesan}
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {modalHapus.tampil && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 style={{ color: '#fff', margin: '0 0 15px 0' }}>Hapus Video?</h3>
            <p style={{ color: '#8b949e', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
              Anda yakin ingin menghapus video <strong style={{ color: '#fff' }}>"{modalHapus.title}"</strong>? Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn-action btn-copy" onClick={() => setModalHapus({ tampil: false, id: null, title: '' })}>Batal</button>
              <button className="btn-action btn-delete" onClick={eksekusiHapus}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP NAV */}
      <nav className="nav-container">
        <Link href="/" className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#238636" strokeWidth="2" strokeLinecap="square"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
          HubStream
        </Link>
        <div className="nav-menu">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="/list" className="nav-item active">Daftar Video</Link>
          <Link href="/tambah" className="nav-item">Upload</Link>
          <Link href="/seting" className="nav-item">Pengaturan</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #30363d', paddingBottom: '15px', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Kelola Video</h2>
            <div style={{ background: '#21262d', padding: '5px 10px', border: '1px solid #30363d', color: '#58a6ff', fontSize: '13px', fontWeight: 'bold' }}>
              TOTAL: {total} VIDEO
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Judul Video</th>
                  <th>ID</th>
                  <th>Views</th>
                  <th>Tanggal</th>
                  <th style={{ textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#8b949e' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" style={{animation: 'spin 1s linear infinite', marginBottom: '10px'}}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                      </svg>
                      <br/>Memuat data...
                    </td>
                  </tr>
                ) : videos.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#8b949e' }}>Belum ada video yang diupload.</td>
                  </tr>
                ) : (
                  videos.map((vid) => (
                    <tr key={vid.id}>
                      <td>
                        <img src={vid.image} alt="thumb" style={{ width: '60px', height: '40px', objectFit: 'cover', border: '1px solid #30363d', display: 'block' }} />
                      </td>
                      <td>
                        <Link href={`/${vid.id}`} target="_blank" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>
                          <span className="truncate-text" title={vid.title}>{vid.title}</span>
                        </Link>
                      </td>
                      <td style={{ fontFamily: 'monospace', color: '#8b949e' }}>{vid.id}</td>
                      <td>{vid.hitcound || 0}</td>
                      <td>{formatDate(vid.created_at)}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                          <button className="btn-action btn-copy" onClick={() => salinLink(vid.id)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copy
                          </button>
                          <button className="btn-action btn-delete" onClick={() => konfirmasiHapus(vid.id, vid.title)}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {!loading && total > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
              <button className="btn-page" onClick={() => setPage(page - 1)} disabled={page === 1}>
                &laquo; Prev
              </button>
              <span style={{ color: '#8b949e', fontSize: '13px', fontWeight: 'bold' }}>
                Halaman {page} dari {totalPages || 1}
              </span>
              <button className="btn-page" onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
                Next &raquo;
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
