'use client';
import { notFound } from 'next/navigation';
import { useEffect, useState, use, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Script from 'next/script';

export default function EmbedPlayer({ params }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  
  const [videoData, setVideoData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(false);
  
  const [fluidLoaded, setFluidLoaded] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const { data: vData, error: vErr } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (vErr || !vData) { setError(true); return; }
      setVideoData(vData);

      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(sData || { ads_head: '', link_offer: '', vast_urls: [] });

      await supabase.rpc('increment_hitcount', { video_id: videoId });
    }
    fetchData();
  }, [videoId]);

  useEffect(() => {
    if (fluidLoaded && videoData && settings && window.fluidPlayer && !playerRef.current) {
      
      // === LOGIKA VAST ACAK & ANTI-CACHE ===
      let vastTags = [...(settings.vast_urls || [])];
      
      // Tambahin cache-buster biar browser gak nyimpen tag yang sama terus
      vastTags = vastTags.map(url => {
        return url.includes('?') ? `${url}&cb=${Date.now()}` : `${url}?cb=${Date.now()}`;
      });
      
      // Acak urutan
      vastTags = vastTags.sort(() => Math.random() - 0.5);

      let primaryVast = vastTags.length > 0 ? vastTags[0] : null;
      let fallbackVasts = vastTags.length > 1 ? vastTags.slice(1) : [];

      let adListConfig = [];
      if (primaryVast) {
        adListConfig.push({ 
          roll: 'preRoll', 
          vastTag: primaryVast, 
          fallbackVastTags: fallbackVasts 
        });
      }

      const player = window.fluidPlayer(`embed-player-${videoId}`, {
        layoutControls: {
          autoPlay: false, mute: false, allowDownload: false, logo: { imageUrl: null },
          fillToContainer: true
        },
        vastOptions: { 
          adList: adListConfig,
          vastTimeout: 3000 // MAKSIMAL NUNGGU 3 DETIK! Kalo delay, buang, ganti tag selanjutnya.
        }
      });
      playerRef.current = player;

      const btnPlay = document.getElementById('btn-custom-play');
      const containerGede = document.getElementById('area-klik');

      const handlePlay = () => { if (btnPlay) btnPlay.style.display = 'none'; player.play(); };

      if (btnPlay) btnPlay.addEventListener('click', handlePlay);
      if (containerGede) {
        containerGede.addEventListener('click', (e) => {
          if (!e.target.closest('.fluid_controls_container')) handlePlay();
        });
      }

      player.on('play', () => { if (btnPlay) btnPlay.style.display = 'none'; });

      const linkPopunder = settings.link_offer;
      const jedaWaktu = 180000; 

      const jalankanPopunder = (e) => {
        if (!linkPopunder) return; 
        if (e.target.closest('.fluid_controls_container')) return;
        let waktuSekarang = new Date().getTime();
        let waktuTerakhir = localStorage.getItem('catatanPopunderStream');
        if (!waktuTerakhir || (waktuSekarang - waktuTerakhir > jedaWaktu)) {
          window.open(linkPopunder, '_blank');
          localStorage.setItem('catatanPopunderStream', waktuSekarang.toString());
        }
      };

      document.addEventListener('click', jalankanPopunder, true);

      return () => {
        document.removeEventListener('click', jalankanPopunder, true);
        if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
      };
    }
  }, [fluidLoaded, videoData, settings, videoId]);

  if (error) return notFound();
  
  return (
    <>
      <link rel="stylesheet" href="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css" type="text/css" />
      <Script 
        src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js" 
        strategy="afterInteractive"
        onLoad={() => setFluidLoaded(true)} 
      />

      {settings?.ads_head && <div dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Jost", sans-serif; }
        html, body { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #000; overflow: hidden; }
        
        /* === KUNCI UKURAN MENTOK SELAYAR === */
        .embed-container {
          position: absolute; top: 0; left: 0; 
          width: 100vw; height: 100vh;
          display: flex; justify-content: center; align-items: center; 
          background: #000; overflow: hidden;
        }
        
        .fluid_video_wrapper { 
          width: 100vw !important; height: 100vh !important; 
          max-width: 100% !important; max-height: 100% !important; 
        }
        
        video { 
          width: 100vw !important; height: 100vh !important; 
          max-width: 100% !important; max-height: 100% !important; 
          object-fit: contain !important; background-color: #000; 
        }
        
        .fluid_video_wrapper.fluid_player_layout_default .fluid_initial_play { display: none !important; }
        video::-webkit-media-controls-start-playback-button { display: none !important; -webkit-appearance: none; }

        .custom-play-btn {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 75px; height: 75px; background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          border-radius: 50%; display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 999; box-shadow: 0 0 25px rgba(58, 123, 213, 0.6);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .custom-play-btn:hover { transform: translate(-50%, -50%) scale(1.1); box-shadow: 0 0 35px rgba(58, 123, 213, 0.8); }
        .custom-play-btn svg { width: 35px; height: 35px; fill: white; margin-left: 5px; }

        .loading-screen {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: #000; display: flex; justify-content: center; align-items: center; z-index: 1000;
        }
        .spinner {
          width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.2);
          border-top: 3px solid #fff; border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>

      {videoData && (
        <div className="embed-container" id="area-klik">
          {!fluidLoaded && <div className="loading-screen"><div className="spinner"></div></div>}
          <div className="custom-play-btn" id="btn-custom-play" style={{ display: fluidLoaded ? 'flex' : 'none' }}>
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <video id={`embed-player-${videoId}`} playsInline poster={`/${videoId}.jpg`}>
            <source src={videoData.video} type="video/mp4" />
          </video>
        </div>
      )}
    </>
  );
}
