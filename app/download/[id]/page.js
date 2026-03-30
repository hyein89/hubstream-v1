'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function HalamanDownload({ params }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenUrl = searchParams.get('token');

  const [videoData, setVideoData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aksesDitolak, setAksesDitolak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // ==========================================
    // 1. CEK KEAMANAN TOKEN
    // ==========================================
    const tokenCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(`dl_token_${videoId}=`))
      ?.split('=')[1];

    if (!tokenUrl || !tokenCookie || tokenUrl !== tokenCookie) {
      setAksesDitolak(true);
      setLoading(false);
      return;
    }

    // ==========================================
    // 2. HAPUS TOKEN BIAR SEKALI PAKAI
    // ==========================================
    document.cookie = `dl_token_${videoId}=; path=/; max-age=0;`;

    // ==========================================
    // 3. AMBIL DATA VIDEO & IKLAN DARI DATABASE
    // ==========================================
    async function fetchData() {
      const { data: vData } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (!vData) { setAksesDitolak(true); return; }
      setVideoData(vData);

      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(sData || { sitename: 'StreamHG', domain: 'domain.com', ads_native: '' });
      setLoading(false);
    }
    fetchData();
  }, [videoId, tokenUrl]);

  // ==========================================
  // 4. LOGIKA TIMER MUNDUR 5 DETIK
  // ==========================================
  useEffect(() => {
    if (loading || aksesDitolak) return;

    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setIsReady(true);
    }
  }, [timeLeft, loading, aksesDitolak]);

  // ==========================================
  // 5. PASANG SCRIPT IKLAN (HEAD & NATIVE BANNER)
  // ==========================================
  // ==========================================
    // ==========================================
  // 5. PASANG SCRIPT IKLAN (DUAL CORE: NATIVE & HEAD/POPUNDER)
  // ==========================================
  useEffect(() => {
    if (loading || aksesDitolak) return;

    // --- JALUR 1: PASANG IKLAN NATIVE BANNER (KOTAK BAWAH) ---
    if (settings?.ads_native) {
      const adContainer = document.getElementById('native-ad-container');
      if (adContainer) {
        adContainer.innerHTML = ''; 
        const tempDivNative = document.createElement('div');
        tempDivNative.innerHTML = settings.ads_native;

        Array.from(tempDivNative.childNodes).forEach(node => {
          if (node.tagName === 'SCRIPT') {
            // Kalau banner native-nya pakai script JS, kita paksa jalan
            const scriptBanner = document.createElement('script');
            Array.from(node.attributes).forEach(attr => scriptBanner.setAttribute(attr.name, attr.value));
            if (node.innerHTML) scriptBanner.innerHTML = node.innerHTML;
            adContainer.appendChild(scriptBanner);
          } else {
            // Kalau cuma banner gambar HTML biasa
            adContainer.appendChild(node.cloneNode(true));
          }
        });
      }
    }

    // --- JALUR 2: PASANG IKLAN POPUNDER (DARI ADS_HEAD) ---
    if (settings?.ads_head) {
      const tempDivHead = document.createElement('div');
      tempDivHead.innerHTML = settings.ads_head;

      const elemenScriptHead = tempDivHead.querySelectorAll('script');
      elemenScriptHead.forEach(scriptLama => {
        const scriptPopunder = document.createElement('script');
        Array.from(scriptLama.attributes).forEach(attr => scriptPopunder.setAttribute(attr.name, attr.value));
        if (scriptLama.innerHTML) scriptPopunder.innerHTML = scriptLama.innerHTML;
        
        scriptPopunder.className = 'script-iklan-popunder';
        document.body.appendChild(scriptPopunder);
      });
    }

    // CLEANUP: Hapus popunder kalau user keluar halaman biar gak numpuk
    return () => {
      const scriptTuntaskan = document.querySelectorAll('.script-iklan-popunder');
      scriptTuntaskan.forEach(s => s.remove());
    };

  // Pastikan ads_native dan ads_head dua-duanya dipantau
  }, [settings?.ads_native, settings?.ads_head, loading, aksesDitolak]);


  
  if (loading) return <div style={{ background: '#0d1117', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Checking Secure Connection...</div>;

    if (aksesDitolak) return (
    <div style={{ background: '#0d1117', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#da3633', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>403 Access Denied</h1>
      
      {/* FIX: text-align diubah jadi textAlign */}
      <p style={{ color: '#8b949e', marginBottom: '20px', textAlign: 'center' }}>Invalid or expired token. Please generate a new link from the video page.</p>
      
      <button onClick={() => router.push(`/${videoId}`)} style={{ padding: '10px 20px', background: '#238636', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Return to Video</button>
    </div>
  );


  const downloadUrl = videoData?.video ? `${videoData.video}?download=${encodeURIComponent(videoData.title)}.mp4` : '#';

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      
      <style jsx global>{`
        body, html { background-color: #0d1117; color: #c9d1d9; margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; font-family: "Jost", sans-serif; }
        .main-wrapper { width: 100%; max-width: 850px; padding: 30px 15px; flex-grow: 1; display: flex; flex-direction: column; gap: 20px; }
        .video-title { text-align: center; font-size: clamp(18px, 4vw, 22px); font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; }
        .image-placeholder { width: 100%; background: #000; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6); aspect-ratio: 16/9; border: 1px solid rgba(255,255,255,0.05); position: relative; }
        .image-placeholder img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.3; }
        .timer-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .timer-circle { width: 80px; height: 80px; border: 4px solid rgba(255,255,255,0.1); border-top: 4px solid #3b82f6; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 28px; font-weight: 800; color: white; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); animation: rotate 1s linear infinite; }
        @keyframes rotate { 0% { border-top-color: #3b82f6; } 50% { border-top-color: #ec4899; } 100% { border-top-color: #3b82f6; } }
        .btn-ready { background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%); color: white; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 16px; font-weight: 700; box-shadow: 0 0 20px rgba(58, 123, 213, 0.4); animation: pulse 1.5s infinite; cursor: pointer; border: none; }
        .btn-ready:hover { opacity: 0.9; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .ready-text { text-align: center; font-size: 15px; color: #ffffff; background: #161b22; padding: 15px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
        .native-ad-area { width: 100%; background: #161b22; border: 1px dashed rgba(255,255,255,0.2); border-radius: 10px; padding: 20px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 120px; }
        .ad-label { font-size: 10px; text-transform: uppercase; color: #8b949e; margin-bottom: 10px; letter-spacing: 1px; }
        .footer-area { width: 100%; background: #161b22; padding: 30px 15px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto; }
        .footer-links { display: flex; justify-content: center; gap: 20px; margin-bottom: 15px; flex-wrap: wrap; }
        .footer-links a { color: #8b949e; text-decoration: none; font-size: 13px; transition: color 0.2s; }
        .footer-links a:hover { color: #ffffff; }
        .footer-copyright { font-size: 12px; color: rgba(139, 148, 158, 0.6); }
      `}</style>

      <div className="main-wrapper">
        <h1 className="video-title">{videoData?.title || 'Loading...'}</h1>

        <div className="image-placeholder">
          <img src={videoData?.image} alt={videoData?.title} />

          <div className="timer-center">
            {!isReady ? (
              <>
                <div className="timer-circle">
                  <span>{timeLeft}</span>
                </div>
                <p style={{ fontSize: '13px', color: 'white', fontWeight: 600, marginTop: '10px' }}>Please wait...</p>
              </>
            ) : (
              <a href={downloadUrl} className="btn-ready">
                Download File
              </a>
            )}
          </div>
        </div>

        <div className="ready-text">
          {!isReady 
            ? "Your download link is being generated. Please wait a few seconds." 
            : "Your file is ready to download. Please click the button inside the image above."}
        </div>

        <div className="native-ad-area">
          <div className="ad-label">Advertisement</div>
          {settings?.ads_native ? (
            <div id="native-ad-container" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}></div>
          ) : (
            <img src="https://via.placeholder.com/728x90.png?text=Tempat+Native+Ads+Banner" style={{ maxWidth: '100%', height: 'auto', borderRadius: '6px' }} alt="Ads" />
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
          {settings?.sitename} Copyright © {new Date().getFullYear()}. All rights reserved.
        </div>
      </footer>
    </>
  );
}
