'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function PengaturanWeb() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State Notifikasi Kustom (Pengganti Alert)
  const [notif, setNotif] = useState({ tampil: false, pesan: '', tipe: 'sukses' });

  // State Form
  const [sitename, setSitename] = useState('');
  const [domain, setDomain] = useState('');
  const [adsHead, setAdsHead] = useState('');
  const [linkOffer, setLinkOffer] = useState('');
  const [adsNative, setAdsNative] = useState(''); // State Baru buat Native Banner
  const [vastUrls, setVastUrls] = useState([]);

  useEffect(() => {
    async function ambilData() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setSitename(data.sitename || '');
        setDomain(data.domain || '');
        setAdsHead(data.ads_head || '');
        setLinkOffer(data.link_offer || '');
        setAdsNative(data.ads_native || ''); // Tarik data Native Ads
        setVastUrls(data.vast_urls || []);
      }
      setLoading(false);
    }
    ambilData();
  }, []);

  const tampilkanNotif = (pesan, tipe) => {
    setNotif({ tampil: true, pesan, tipe });
    setTimeout(() => setNotif({ tampil: false, pesan: '', tipe: 'sukses' }), 3000); // Hilang otomatis 3 detik
  };

  const tambahVast = () => setVastUrls([...vastUrls, '']);
  const ubahVast = (index, value) => {
    const baru = [...vastUrls];
    baru[index] = value;
    setVastUrls(baru);
  };
  const hapusVast = (index) => setVastUrls(vastUrls.filter((_, i) => i !== index));

  const simpanPengaturan = async () => {
    setSaving(true);
    const vastBersih = vastUrls.filter(url => url.trim() !== '');
    
    const { error } = await supabase.from('settings').upsert({
      id: 1, 
      sitename,
      domain,
      ads_head: adsHead,
      link_offer: linkOffer,
      ads_native: adsNative, // Simpan Native Ads
      vast_urls: vastBersih
    });

    setSaving(false);
    if (error) {
      tampilkanNotif('Gagal menyimpan pengaturan! Cek koneksi.', 'error');
    } else {
      setVastUrls(vastBersih);
      tampilkanNotif('Pengaturan berhasil disimpan!', 'sukses');
    }
  };

  if (loading) return <div style={{ padding: '40px', background: '#0d1117', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Memuat data...</div>;

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* KODE CSS UNTUK RESPONSIVE & ANIMASI */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        .nav-container { background: #000; border-bottom: 2px solid #30363d; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
        .nav-brand { color: #fff; font-weight: bold; font-size: 18px; text-decoration: none; padding: 15px 0; display: flex; align-items: center; gap: 8px;}
        .nav-menu { display: flex; gap: 5px; overflow-x: auto; }
        .nav-item { color: #8b949e; text-decoration: none; padding: 15px 20px; font-size: 14px; font-weight: bold; transition: 0.2s; white-space: nowrap; }
        .nav-item:hover, .nav-item.active { color: #fff; background: #21262d; border-bottom: 2px solid #238636; }
        
        .main-content { max-width: 800px; margin: 40px auto; padding: 0 20px; }
        .card { background: #161b22; border: 1px solid #30363d; padding: 30px; border-radius: 0; }
        
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: #c9d1d9; font-weight: bold; }
        input[type="text"], textarea { width: 100%; padding: 12px; background: #0d1117; color: #c9d1d9; border: 1px solid #30363d; border-radius: 0; font-family: inherit; }
        input[type="text"]:focus, textarea:focus { outline: none; border-color: #58a6ff; }
        
        .btn-primary { width: 100%; padding: 15px; background: #238636; color: #fff; border: none; font-weight: bold; text-transform: uppercase; cursor: pointer; display: flex; justify-content: center; align-items: center; gap: 10px; border-radius: 0; transition: 0.2s; }
        .btn-primary:hover { background: #2ea043; }
        .btn-primary:disabled { background: #21262d; color: #8b949e; cursor: not-allowed; }

        .notif-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 15px 25px; color: #fff; font-weight: bold; border-radius: 0; z-index: 9999; display: flex; align-items: center; gap: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.5); animation: slideDown 0.3s ease-out; }
        .notif-sukses { background: #238636; border: 1px solid #2ea043; }
        .notif-error { background: #da3633; border: 1px solid #f85149; }

        @keyframes slideDown { from { top: -50px; opacity: 0; } to { top: 20px; opacity: 1; } }

        /* Mobile Responsive */
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; gap: 0; }
          .nav-container { flex-direction: column; align-items: flex-start; padding: 0; }
          .nav-brand { padding: 15px 20px; width: 100%; border-bottom: 1px solid #30363d; }
          .nav-menu { width: 100%; padding: 0 10px; }
          .nav-item { padding: 12px 15px; }
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
          {sitename || 'HubStream'}
        </Link>
        <div className="nav-menu">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="/list" className="nav-item">Daftar Video</Link>
          <Link href="/tambah" className="nav-item">Upload</Link>
          <Link href="/seting" className="nav-item active">Pengaturan</Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="card">
          <h2 style={{ color: '#fff', marginTop: 0, marginBottom: '25px', borderBottom: '1px solid #30363d', paddingBottom: '15px' }}>Konfigurasi Sistem</h2>

          <div className="form-grid">
            <div className="input-group">
              <label>Nama Situs (Sitename)</label>
              <input type="text" value={sitename} onChange={e => setSitename(e.target.value)} placeholder="HubStream" />
            </div>
            <div className="input-group">
              <label>Domain Utama</label>
              <input type="text" value={domain} onChange={e => setDomain(e.target.value)} placeholder="domain.com" />
            </div>
          </div>

          <div className="input-group">
            <label>Link Offer / Direct Link (Popunder)</label>
            <input type="text" value={linkOffer} onChange={e => setLinkOffer(e.target.value)} placeholder="https://..." />
          </div>

          <div className="input-group">
            <label>Kode JS Iklan (Untuk Head Embed)</label>
            <textarea value={adsHead} onChange={e => setAdsHead(e.target.value)} placeholder="<script>...</script>" rows="4" style={{ fontFamily: 'monospace' }} />
          </div>

          <div className="input-group">
            <label>Kode Native Ads Banner (HTML/JS)</label>
            <textarea value={adsNative} onChange={e => setAdsNative(e.target.value)} placeholder='<a href="..."><img src="..."></a>' rows="4" style={{ fontFamily: 'monospace' }} />
            <small style={{ color: '#8b949e', display: 'block', marginTop: '5px' }}>*Akan muncul di bawah panel tab halaman streaming utama.</small>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '20px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <label style={{ margin: 0 }}>Rotasi VAST Tags (XML)</label>
              <button onClick={tambahVast} style={{ background: '#21262d', color: '#c9d1d9', border: '1px solid #30363d', padding: '6px 12px', cursor: 'pointer', borderRadius: '0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> Tambah VAST
              </button>
            </div>

            {vastUrls.length === 0 && <p style={{ fontSize: '14px', color: '#8b949e', margin: 0 }}>Belum ada daftar VAST. Iklan video dimatikan.</p>}

            {vastUrls.map((url, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input type="text" value={url} onChange={e => ubahVast(index, e.target.value)} placeholder="https://...vast.xml" style={{ flex: 1 }} />
                <button onClick={() => hapusVast(index)} style={{ background: '#da3633', color: '#fff', border: 'none', padding: '0 15px', cursor: 'pointer' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))}
          </div>

          <button onClick={simpanPengaturan} disabled={saving} className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {saving ? 'Menyimpan...' : 'Simpan Semua Pengaturan'}
          </button>
        </div>
      </div>
    </div>
  );
}
