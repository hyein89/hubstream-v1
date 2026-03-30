'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default function HalamanTonton({ params }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;

  const [videoData, setVideoData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('link');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: vData, error: vErr } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (vErr || !vData) { setError(true); return; }
      setVideoData(vData);

      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(sData || { domain: 'domain.com', link_offer: '#', ads_native: '' });
      
      setLoading(false);
    }
    fetchData();
  }, [videoId]);

  useEffect(() => {
    const adContainer = document.getElementById('native-ad-container');
    if (adContainer && settings?.ads_native) {
      adContainer.innerHTML = ''; 
      try {
        const fragment = document.createRange().createContextualFragment(settings.ads_native);
        adContainer.appendChild(fragment);
      } catch (err) {
        console.error('Gagal render iklan native', err);
      }
    }
  }, [settings?.ads_native, loading]);

if (error) return notFound();
if (loading) return <div style={{ background: '#0d1117', height: '100vh' }} />;

  const domainURL = `https://${settings?.domain || 'domain.com'}`;
  const streamUrl = `${domainURL}/${videoId}`;
  const imageUrl = `${domainURL}/${videoId}.jpg`;
  const embedUrl = `${domainURL}/embed/${videoId}`;
  
  // ==========================================
  // FIX: MAKSA BROWSER BUAT LANGSUNG DOWNLOAD FILE!
  // ==========================================
  // Kita tambahin ?download=NamaVideo.mp4 di ujung link Supabase
  const downloadUrl = videoData.video 
    ? `${videoData.video}?download=${encodeURIComponent(videoData.title)}.mp4` 
    : '#';

  const dataKode = {
    'link': streamUrl,
    'forum': `[url=${streamUrl}][img]${imageUrl}[/img][/url]\n${videoData.title}`,
    'html': `<a href="${streamUrl}"><img src="${imageUrl}" border=0><br>${videoData.title}</a>\n[Video, Dilihat: ${videoData.hitcound} kali]`,
    'embed': `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" scrolling="no" allowfullscreen></iframe>`
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <link rel="stylesheet" href="/stream.css" precedence="default" />
      
      <style jsx global>{`
        body, html {
          background-color: #0d1117 !important;
          margin: 0;
          padding: 0;
        }
      `}</style>
      
      <div className="main-wrapper">
        <h1 className="video-title">{videoData.title}</h1>

        <div className="player-container" style={{ background: '#000', position: 'relative', overflow: 'hidden' }}>
          <iframe 
            id="stream-player" 
            src={`/embed/${videoId}`} 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            allowFullScreen 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>

        <div className="panel-wrap">
          <div className="panel-inner info-bar">
            <div className="info-left">
              <svg className="icon-cal" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="text-date">Uploaded: <strong>on {formatDate(videoData.created_at)}</strong></span>
              <span className="badge-flag" onClick={() => setIsModalOpen(true)} style={{cursor: 'pointer'}}>Flag video</span>
            </div>
            
            {/* FIX: Hapus target="_blank" biar gak buka tab baru */}
            <a href={downloadUrl} className="btn-download" download>Download</a>
            
          </div>
        </div>

        <div className="panel-inner" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="tabs-header">
            <button className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`} onClick={() => setActiveTab('link')}>Download Link</button>
            <button className={`tab-btn ${activeTab === 'forum' ? 'active' : ''}`} onClick={() => setActiveTab('forum')}>Forum Code</button>
            <button className={`tab-btn ${activeTab === 'html' ? 'active' : ''}`} onClick={() => setActiveTab('html')}>HTML Code</button>
            <button className={`tab-btn ${activeTab === 'embed' ? 'active' : ''}`} onClick={() => setActiveTab('embed')}>Embed Code</button>
          </div>
          <textarea id="code-output" className="code-textarea" readOnly value={dataKode[activeTab]} />
        </div>

        <div className="native-ad-area">
          <div className="ad-label">Advertisement</div>
          {settings?.ads_native ? (
            <div id="native-ad-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
          ) : (
            <img src="https://via.placeholder.com/728x90.png?text=Tempat+Native+Ads+Banner" style={{ maxWidth: '100%', height: 'auto', borderRadius: '0' }} alt="Ads" />
          )}
        </div>

      </div>

      <footer className="footer-area">
        <div className="footer-links">
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/dmca">DMCA</a>
          
        </div>
        <div className="footer-copyright">
          {settings?.sitename || 'StreamHG'} Copyright © {new Date().getFullYear()}. All rights reserved.
        </div>
      </footer>

      {isModalOpen && (
        <div className="modal-overlay" id="flagModal" onClick={(e) => { if(e.target.id === 'flagModal') setIsModalOpen(false) }} style={{ display: 'flex', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', zIndex: 9999, justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-box" style={{ background: '#161b22', padding: '20px', borderRadius: '0', width: '90%', maxWidth: '400px', border: '1px solid #30363d' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#fff' }}>Report Video</h3>
              <button className="close-modal" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div className="modal-group" style={{ marginBottom: '15px' }}>
              <label className="modal-label" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8b949e' }}>Reason</label>
              <div className="select-wrapper">
                <select className="modal-select" style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '0' }}>
                  <option>Broken video</option>
                  <option>Wrong video</option>
                  <option>Spam / Malware</option>
                </select>
              </div>
            </div>
            <div className="modal-group" style={{ marginBottom: '20px' }}>
              <label className="modal-label" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#8b949e' }}>Details</label>
              <input type="text" className="modal-input" placeholder="Optional details..." style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #30363d', borderRadius: '0', boxSizing: 'border-box' }} />
            </div>
            <button className="btn-submit" onClick={() => setIsModalOpen(false)} style={{ width: '100%', padding: '12px', background: '#238636', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '0' }}>Send Report</button>
          </div>
        </div>
      )}
    </>
  );
}
