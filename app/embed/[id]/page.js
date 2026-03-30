'use client';
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
  
  // Ref untuk nyimpen instance player biar gak duplikat
  const playerRef = useRef(null);

  // 1. Ambil Data Video & Setting (Sama kayak kemarin)
  useEffect(() => {
    async function fetchData() {
      const { data: vData, error: vErr } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (vErr || !vData) {
        setError(true);
        return;
      }
      setVideoData(vData);

      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(sData || { ads_head: '', link_offer: '', vast_urls: [] });

      await supabase.rpc('increment_hitcount', { video_id: videoId });
    }
    fetchData();
  }, [videoId]);

  // 2. Setup Fluid Player, VAST Random, dan Popunder
  useEffect(() => {
    // Pastikan DOM, Script, dan Data udah siap
    if (fluidLoaded && videoData && settings && window.fluidPlayer && !playerRef.current) {
      
      // === LOGIKA ACAK VAST TAG ===
      let vastTags = [...(settings.vast_urls || [])];
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

      // Inisialisasi Player
      const playerId = `embed-player-${videoId}`;
      const player = window.fluidPlayer(playerId, {
        layoutControls: {
          autoPlay: false, 
          mute: false, 
          allowDownload: false, 
          logo: { imageUrl: null },
          fillToContainer: true // Biar full screen di containernya
        },
        vastOptions: {
          adList: adListConfig
        }
      });
      playerRef.current = player; // Simpan instance

      // === LOGIKA CUSTOM PLAY BUTTON ===
      const btnPlay = document.getElementById('btn-custom-play');
      const containerGede = document.getElementById('area-klik');

      const handlePlay = () => {
        if (btnPlay) btnPlay.style.display = 'none';
        player.play();
      };

      if (btnPlay) {
        btnPlay.addEventListener('click', handlePlay);
      }
      
      // Biar klik area video juga play (ranjau klik)
      if (containerGede) {
        containerGede.addEventListener('click', (e) => {
          // Jangan trigger kalau ngeklik control bar player
          if (!e.target.closest('.fluid_controls_container')) {
             handlePlay();
          }
        });
      }

      player.on('play', () => {
        if (btnPlay) btnPlay.style.display = 'none';
      });

      // === LOGIKA POPUNDER AGRESIF (3 Menit) ===
      const linkPopunder = settings.link_offer;
      const jedaWaktu = 180000; 

      const jalankanPopunder = (e) => {
        if (!linkPopunder) return; 
        
        // Jangan popunder kalau klik control bar asli
        if (e.target.closest('.fluid_controls_container')) return;

        let waktuSekarang = new Date().getTime();
        let waktuTerakhir = localStorage.getItem('catatanPopunderStream');

        if (!waktuTerakhir || (waktuSekarang - waktuTerakhir > jedaWaktu)) {
          window.open(linkPopunder, '_blank');
          localStorage.setItem('catatanPopunderStream', waktuSekarang.toString());
        }
      };

      document.addEventListener('click', jalankanPopunder, true);

      // Clean up
      return () => {
        document.removeEventListener('click', jalankanPopunder, true);
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
      };
    }
  }, [fluidLoaded, videoData, settings, videoId]);

  if (error) return <div style={{ color: '#fff', background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>404 Not Found</div>;
  
  // Tampilan loading area putih kaku biar gak ngelihat glitch video mentah
  if (!videoData || !settings || !fluidLoaded) return <div style={{ background: '#fff', height: '100vh', border: '5px solid #000', boxSizing: 'border-box' }} />;

  return (
    <>
      <link rel="stylesheet" href="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.css" type="text/css" />
      
      {/* Pake strategy afterInteractive biar cepet tereksekusi */}
      <Script 
        src="https://cdn.fluidplayer.com/v3/current/fluidplayer.min.js" 
        strategy="afterInteractive"
        onLoad={() => setFluidLoaded(true)} 
      />

      {/* RENDER KODE ADS HEAD */}
      {settings.ads_head && (
        <div dangerouslySetInnerHTML={{ __html: settings.ads_head }} />
      )}

      {/* STYLING BAWAAN (Bulet & Full Screen) */}
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
          position: relative; 
          width: 100vw; 
          height: 100vh;
          display: flex; 
          justify-content: center; 
          align-items: center;
          background: #000;
          overflow: hidden;
        }
        
        /* Maksa video Fluid Player Full Container */
        .fluid_video_wrapper { width: 100% !important; height: 100% !important; }
        video { 
          width: 100% !important; 
          height: 100% !important; 
          object-fit: contain; 
          background-color: #000; 
        }
        
        /* Sembunyikan tombol play bawaan browser di tengah */
        .fluid_video_wrapper.fluid_player_layout_default .fluid_initial_play {
          display: none !important;
        }
        
        /* Sembunyikan default play button mentah browser */
        video::-webkit-media-controls-start-playback-button {
          display: none !important;
          -webkit-appearance: none;
        }

        /* === 2. TOMBOL PLAY KUSTOM (Gw balikin jadi BULET) === */
        .custom-play-btn {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 75px; height: 75px;
          background: linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%);
          border-radius: 50%; /* BUuUuULET! */
          display: flex; justify-content: center; align-items: center;
          cursor: pointer; z-index: 999;
          box-shadow: 0 0 25px rgba(58, 123, 213, 0.6);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .custom-play-btn:hover { 
          transform: translate(-50%, -50%) scale(1.1); 
          box-shadow: 0 0 35px rgba(58, 123, 213, 0.8);
        }
        .custom-play-btn svg { width: 35px; height: 35px; fill: white; margin-left: 5px; }
      `}</style>

      <div className="embed-container" id="area-klik">
        {/* Tombol play kustom bulet */}
        <div className="custom-play-btn" id="btn-custom-play">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>

        {/* Video Player */}
        <video id={`embed-player-${videoId}`} playsInline poster={`/${videoId}.jpg`}>
          <source src={videoData.video} type="video/mp4" />
        </video>
      </div>
    </>
  );
}
