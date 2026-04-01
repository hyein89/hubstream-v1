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
  
  // State untuk memastikan script diload berurutan (Sangat penting agar IMA tidak error di Next.js)
  const [vjsLoaded, setVjsLoaded] = useState(false);
  const [imaSdkLoaded, setImaSdkLoaded] = useState(false);
  const [vjsAdsLoaded, setVjsAdsLoaded] = useState(false);
  const [vjsImaLoaded, setVjsImaLoaded] = useState(false);
  
  const allScriptsReady = vjsLoaded && imaSdkLoaded && vjsAdsLoaded && vjsImaLoaded;
  
  const videoNodeRef = useRef(null);
  const playerRef = useRef(null);

  // 1. Ambil Data dari Supabase (Tetap persis seperti kode asli lu)
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

  // 2. Inisialisasi Player & VAST (Hanya jalan setelah semua data & script siap)
  useEffect(() => {
    if (allScriptsReady && videoData && settings && videoNodeRef.current && !playerRef.current) {
      
      // Inisialisasi VideoJS
      const player = window.videojs(videoNodeRef.current);
      playerRef.current = player;

      // Logika VAST Acak & Anti-Cache bawaan lu
      let vastTags = [...(settings.vast_urls || [])];
      vastTags = vastTags.map(url => {
        return url.includes('?') ? `${url}&cb=${Date.now()}` : `${url}?cb=${Date.now()}`;
      });
      vastTags = vastTags.sort(() => Math.random() - 0.5);

      if (vastTags.length > 0) {
        let currentAdIndex = 0;

        player.ima({
            id: videoNodeRef.current.id,
            adTagUrl: vastTags[currentAdIndex],
            vastLoadTimeout: 10000,
            showCountdown: true
        });

        // Fallback VAST
        player.on('adserror', function() {
            currentAdIndex++;
            if (currentAdIndex < vastTags.length) {
                player.ima.changeAdTag(vastTags[currentAdIndex]);
                player.ima.requestAds();
            } else {
                player.play();
            }
        });

        player.on('play', function() {
            if (player.ima && !player.ima.adDisplayContainerInitialized) {
                player.ima.initializeAdDisplayContainer();
            }
        });
      }

      // 3. Logika Popunder (Disempurnakan biar kontrol video bisa diklik tanpa ngetrigger popunder)
      const linkPopunder = settings.link_offer;
      const jedaWaktu = 180000; 

      const jalankanPopunder = (e) => {
        if (!linkPopunder) return; 
        
        // Jangan jalankan popunder jika user klik tombol play, volume, atau bar durasi
        if (e.target.closest('.vjs-control-bar') || e.target.closest('.vjs-big-play-button')) return;
        
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
      };
    }
  }, [allScriptsReady, videoData, settings]);

  // Cleanup untuk Next.js agar tidak bocor memory saat pindah halaman
  useEffect(() => {
      return () => {
          if (playerRef.current) {
              playerRef.current.dispose();
              playerRef.current = null;
          }
      };
  }, []);

  if (error) return notFound();
  
  return (
    <>
      {/* CSS Wajib Video.js & Google IMA */}
      <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.css" rel="stylesheet" />

      {/* Script Diload Berurutan dengan System State React */}
      <Script src="https://vjs.zencdn.net/8.10.0/video.min.js" strategy="afterInteractive" onLoad={() => setVjsLoaded(true)} />
      {vjsLoaded && <Script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" strategy="afterInteractive" onLoad={() => setImaSdkLoaded(true)} />}
      {imaSdkLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.min.js" strategy="afterInteractive" onLoad={() => setVjsAdsLoaded(true)} />}
      {vjsAdsLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.min.js" strategy="afterInteractive" onLoad={() => setVjsImaLoaded(true)} />}

      {settings?.ads_head && <div dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: "Jost", sans-serif; }
        
        html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #000;
            overflow: hidden;
        }

        .video-container {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
        }

        /* Setup Video.js untuk mengisi penuh container */
        .video-js {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100% !important;
            max-height: 100% !important;
            background-color: #000;
        }

        /* Hapus lengkungan, kecuali untuk tombol play bulat yang lu mau */
        .vjs-tech, .vjs-poster, .vjs-control-bar, .vjs-menu-button {
            border-radius: 0 !important;
        }

        .vjs-big-play-button {
            border-radius: 90px !important;
            background-color: rgba(0, 0, 0, 0.7) !important;
            border: 2px solid #fff !important;
        }

        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
      `}</style>

      {videoData && (
        <div className="video-container" id="area-klik" onContextMenu={(e) => e.preventDefault()}>
          <div data-vjs-player>
            <video 
              ref={videoNodeRef}
              id={`vidly-player-${videoId}`}
              className="video-js vjs-default-skin vjs-big-play-centered vjs-fill" 
              controls 
              preload="auto" 
              playsInline
              poster={`/${videoId}.jpg`}
              controlsList="nodownload"
            >
              <source src={videoData.video} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
