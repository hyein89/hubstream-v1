'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import Script from 'next/script'; // Bawaan Next.js buat load JS eksternal

export default function EmbedPlayer({ params }) {
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  
  const [videoData, setVideoData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  // 1. Tarik Data Video & Seting dari Database
  useEffect(() => {
    async function fetchData() {
      // Ambil video
      const { data: vData, error: vErr } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (vErr || !vData) {
        setError(true);
        return;
      }
      setVideoData(vData);

      // Ambil setting
      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (sData) {
        setSettings(sData);
      } else {
        setSettings({ ads_head: '', link_offer: '', vast_urls: [] });
      }

      // Hitcount
      await supabase.rpc('increment_hitcount', { video_id: videoId });
    }
    fetchData();
  }, [videoId]);

  // 2. Setup Fluid Player, VAST Random, dan Popunder
  useEffect(() => {
    // Pastikan DOM, Script Fluid, dan Data udah siap semua
    if (playerReady && videoData && settings && window.fluidPlayer) {
      
      // --- LOGIKA ACAK VAST TAG ---
      let vastTags = [...(settings.vast_urls || [])];
      
      // Acak urutan array secara random
      vastTags = vastTags.sort(() => Math.random() - 0.5);
      
      // Ambil 1 buat utama, sisanya buat cadangan
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

      // Inisialisasi Player
      const player = window.fluidPlayer(`embed-player-${videoId}`, {
        layoutControls: {
          autoPlay: false, 
          mute: false, 
          allowDownload: false, 
          logo: { imageUrl: null },
          fillToContainer: true 
        },
        vastOptions: {
          adList: adListConfig
        }
      });

      // --- LOGIKA CUSTOM PLAY BUTTON ---
      const btnPlay = document.getElementById('btn-custom-play');
      if (btnPlay) {
        btnPlay.addEventListener('click', () => {
          btnPlay.style.display = 'none';
          player.play();
        });
      }

      player.on('play', () => {
        if (btnPlay) btnPlay.style.display = 'none';
      });

      // --- LOGIKA POPUNDER AGRESIF (3 Menit) ---
      const linkPopunder = settings.link_offer;
      const jedaWaktu = 180000; // 3 menit dalam ms

      const jalankanPopunder = () => {
        if (!linkPopunder) return; // Kalo link kosong, batalin
        
        let waktuSekarang = new Date().getTime();
        let waktuTerakhir = localStorage.getItem('catatanPopunderStream');

        if (!waktuTerakhir || (waktuSekarang - waktuTerakhir > jedaWaktu)) {
          window.open(linkPopunder, '_blank');
          localStorage.setItem('catatanPopunderStream', waktuSekarang.toString());
        }
      };

      // Pasang ranjau klik ke seluruh halaman
      document.addEventListener('click', jalankanPopunder, true);

      // Bersihin event listener pas halaman ditutup biar gak memory leak
      return () => {
        document.removeEventListener('click', jalankanPopunder, true);
        if (player) player.destroy();
      };
    }
  }, [playerReady, videoData, settings, videoId]);

  if (error) return <div style={{ color: '#fff', background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>404 Not Found</div>;
  if (!videoData || !settings) return <div style={{ background: '#000', height: '100vh' }} />;

  return (
    <>
      <link rel="stylesheet" href="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css" type="text/css" />
      
      {/* Script Fluid Player dimuat pakai cara Next.js */}
      <Script 
        src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js" 
        strategy="afterInteractive"
        onLoad={() => setPlayerReady(true)} 
      />

      {/* RENDER KODE ADS HEAD (Kalau ada di setting) */}
      {settings.ads_head && (
        <div dangerouslySetInnerHTML={{ __html: settings.ads_head }} />
      )}

      {/* STYLING BAWAAN (Modifikasi Border Radius Dihapus) */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap');
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: "Jost", sans-serif;
        }
        html, body {
          margin: 0; padding: 0; width: 100%; height: 100%;
          background-color: #000; overflow: hidden;
        }
        .embed-container {
          position: relative; width: 100vw; height: 100vh;
          display: flex; justify-content: center; align-items: center;
          background: #000;
        }
        .fluid_video_wrapper { width: 100% !important; height: 100% !important; }
        video { width: 100%; height: 100%; object-fit: contain; background-color: #000; }
        
        .fluid_video_wrapper.fluid_player_layout_default .fluid_initial_play {
          display: none !important;
        }

        .custom-play-btn {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 70px; height: 70px;
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 999;
          /* Desain kotak kaku dengan shadow */
          border-radius: 0; 
          border: 2px solid #fff;
          box-shadow: 6px 6px 0 rgba(58, 123, 213, 0.8);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .custom-play-btn:hover { 
          transform: translate(-50%, -50%) scale(1.05); 
          box-shadow: 10px 10px 0 rgba(58, 123, 213, 1);
        }
        .custom-play-btn svg { width: 30px; height: 30px; fill: white; margin-left: 4px; }
      `}</style>

      <div className="embed-container" id="area-klik">
        <div className="custom-play-btn" id="btn-custom-play">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>

        {/* Video dengan Poster otomatis dari API Next.js */}
        <video id={`embed-player-${videoId}`} playsInline poster={`/${videoId}.jpg`}>
          <source src={videoData.video} type="video/mp4" />
        </video>
      </div>
    </>
  );
}
