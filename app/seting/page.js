'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function PengaturanWeb() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State untuk form
  const [sitename, setSitename] = useState('');
  const [domain, setDomain] = useState('');
  const [adsHead, setAdsHead] = useState('');
  const [linkOffer, setLinkOffer] = useState('');
  const [vastUrls, setVastUrls] = useState([]); // Array untuk nampung banyak VAST

  // Tarik data pas halaman dibuka
  useEffect(() => {
    async function ambilData() {
      const { data } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (data) {
        setSitename(data.sitename || '');
        setDomain(data.domain || '');
        setAdsHead(data.ads_head || '');
        setLinkOffer(data.link_offer || '');
        setVastUrls(data.vast_urls || []);
      }
      setLoading(false);
    }
    ambilData();
  }, []);

  // Fungsi buat nambah kolom VAST baru
  const tambahVast = () => setVastUrls([...vastUrls, '']);
  
  // Fungsi buat update isi teks VAST
  const ubahVast = (index, value) => {
    const baru = [...vastUrls];
    baru[index] = value;
    setVastUrls(baru);
  };

  // Fungsi buat hapus kolom VAST
  const hapusVast = (index) => {
    setVastUrls(vastUrls.filter((_, i) => i !== index));
  };

  const simpanPengaturan = async () => {
    setSaving(true);
    // Bersihin array VAST dari kolom yang kosong sebelum disimpen
    const vastBersih = vastUrls.filter(url => url.trim() !== '');
    
    const { error } = await supabase.from('settings').upsert({
      id: 1, // Kita timpa terus data di baris pertama
      sitename,
      domain,
      ads_head: adsHead,
      link_offer: linkOffer,
      vast_urls: vastBersih
    });

    setSaving(false);
    if (error) {
      alert('Gagal menyimpan pengaturan!');
    } else {
      setVastUrls(vastBersih); // Update tampilan form
      alert('Pengaturan berhasil disimpan!');
    }
  };

  if (loading) return <div style={{ padding: '40px', background: '#111', color: '#fff', minHeight: '100vh' }}>Memuat data...</div>;

  return (
    <div style={{ background: '#111', minHeight: '100vh', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '30px', boxShadow: '10px 10px 0 #000' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Pengaturan Global</h1>
        </div>

        {/* Input Identitas Web */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Nama Situs (Sitename)</label>
            <input 
              type="text" value={sitename} onChange={e => setSitename(e.target.value)}
              placeholder="Contoh: HubStream"
              style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '0', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Domain Web</label>
            <input 
              type="text" value={domain} onChange={e => setDomain(e.target.value)}
              placeholder="domain.com"
              style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '0', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Input Offer */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Link Offer / Direct Link</label>
          <input 
            type="text" value={linkOffer} onChange={e => setLinkOffer(e.target.value)}
            placeholder="https://..."
            style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '0', boxSizing: 'border-box' }}
          />
        </div>

        {/* Input Ads JS Head (Textarea) */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Kode Ads JS (Untuk Head Embed)</label>
          <textarea 
            value={adsHead} onChange={e => setAdsHead(e.target.value)}
            placeholder="<script> ... </script>"
            rows="5"
            style={{ width: '100%', padding: '12px', border: '2px solid #000', borderRadius: '0', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />
          <small style={{ color: '#666' }}>*Kode ini hanya akan dirender di halaman embed video.</small>
        </div>

        {/* Dynamic Input VAST Tags */}
        <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', border: '2px solid #000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <label style={{ fontWeight: 'bold', margin: 0 }}>Daftar URL VAST Ads (XML)</label>
            <button 
              onClick={tambahVast}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '8px 15px', cursor: 'pointer', borderRadius: '0', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Tambah VAST
            </button>
          </div>

          {vastUrls.length === 0 && <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Belum ada URL VAST. Klik tombol tambah di atas.</p>}

          {vastUrls.map((url, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input 
                type="text" 
                value={url} 
                onChange={e => ubahVast(index, e.target.value)}
                placeholder="https://...vast.xml"
                style={{ flex: 1, padding: '10px', border: '2px solid #000', borderRadius: '0' }}
              />
              <button 
                onClick={() => hapusVast(index)}
                style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '0 15px', cursor: 'pointer', borderRadius: '0' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Tombol Simpan */}
        <button 
          onClick={simpanPengaturan}
          disabled={saving}
          style={{ width: '100%', padding: '15px', background: saving ? '#666' : '#166534', color: '#fff', border: 'none', fontWeight: 'bold', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>

      </div>
    </div>
  );
}
