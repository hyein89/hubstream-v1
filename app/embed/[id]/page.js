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
  
  const [vjsLoaded, setVjsLoaded] = useState(false);
  const [imaSdkLoaded, setImaSdkLoaded] = useState(false);
  const [vjsAdsLoaded, setVjsAdsLoaded] = useState(false);
  const [vjsImaLoaded, setVjsImaLoaded] = useState(false);
  
  const allScriptsReady = vjsLoaded && imaSdkLoaded && vjsAdsLoaded && vjsImaLoaded;
  
  const videoNodeRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const { data: vData, error: vErr } = await supabase.from('videos').select('*').eq('id', videoId).single();
      if (vErr || !vData) { setError(true); return; }
      setVideoData(vData);

      // link_offer udah gak kepake, tapi dibiarin aja takut datanya dibutuhin di tempat lain
      const { data: sData } = await supabase.from('settings').select('*').eq('id', 1).single();
      setSettings(sData || { link_offer: '', vast_urls: [] });

      await supabase.rpc('increment_hitcount', { video_id: videoId });
    }
    fetchData();
  }, [videoId]);

  useEffect(() => {
    if (allScriptsReady && videoData && settings && videoNodeRef.current && !playerRef.current) {
      
      const player = window.videojs(videoNodeRef.current);
      playerRef.current = player;

      // --- SETUP VAST GOOGLE IMA ---
      let vastTags = [...(settings.vast_urls || [])];
      vastTags = vastTags.map(url => url.includes('?') ? `${url}&cb=${Date.now()}` : `${url}?cb=${Date.now()}`);
      vastTags = vastTags.sort(() => Math.random() - 0.5);

      if (vastTags.length > 0) {
        let currentAdIndex = 0;

        player.ima({
            id: videoNodeRef.current.id,
            adTagUrl: vastTags[currentAdIndex],
            vastLoadTimeout: 10000,
            showCountdown: true
        });

        // Anti Suara Balap
        player.on('contentPauseRequested', () => { player.pause(); });
        player.on('contentResumeRequested', () => { player.play(); });

        player.on('adserror', function() {
            currentAdIndex++;
            if (currentAdIndex < vastTags.length) {
                player.ima.changeAdTag(vastTags[currentAdIndex]);
                player.ima.requestAds();
            } else {
                player.play(); 
            }
        });
      }

      // --- LOGIKA MONETAG REWARDED INTERSTITIAL ---
      const overlayKaca = document.getElementById('kaca-link-offer');
      
      const handleKlikPertama = () => {
        
        // 1. Panggil Iklan Monetag (Cek dulu biar gak error kalau script belum ngeload)
        try {
          if (typeof window.show_10806273 === 'function') {
            window.show_10806273().then(() => {
              // Fungsi ini dieksekusi setelah penonton selesai lihat iklan Monetag
              console.log('Iklan Monetag Selesai');
              // Opsional: Pastikan video kembali terputar
              if (player.paused()) player.play();
            }).catch(e => console.log('Monetag skip/error:', e));
          }
        } catch (error) {
          console.error("Gagal memuat iklan Monetag:", error);
        }

        // 2. Hancurkan Kaca Transparan biar VAST bisa muncul tanpa kedip
        if (overlayKaca) {
            overlayKaca.style.display = 'none';
        }

        // 3. Pancing sistem Google IMA dan putar video (Ini wajib ditaruh di luar .then() biar nembus blokir browser)
        if (player.ima && !player.ima.adDisplayContainerInitialized) {
          player.ima.initializeAdDisplayContainer();
        }
        player.play();
      };

      if (overlayKaca) {
        overlayKaca.addEventListener('click', handleKlikPertama);
      }

      return () => {
        if (overlayKaca) overlayKaca.removeEventListener('click', handleKlikPertama);
      };
    }
  }, [allScriptsReady, videoData, settings]);

  useEffect(() => {
      return () => { if (playerRef.current) { playerRef.current.dispose(); playerRef.current = null; } };
  }, []);

  if (error) return notFound();
  
  return (
    <>
      <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.css" rel="stylesheet" />

      <Script src="https://vjs.zencdn.net/8.10.0/video.min.js" strategy="afterInteractive" onLoad={() => setVjsLoaded(true)} />
      {vjsLoaded && <Script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" strategy="afterInteractive" onLoad={() => setImaSdkLoaded(true)} />}
      {imaSdkLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.min.js" strategy="afterInteractive" onLoad={() => setVjsAdsLoaded(true)} />}
      {vjsAdsLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.min.js" strategy="afterInteractive" onLoad={() => setVjsImaLoaded(true)} />}

      <style jsx global>{`
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #000; overflow: hidden; }
        .video-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center; background: #000; }
        .video-js { width: 100vw !important; height: 100vh !important; }
        .vjs-big-play-button { border-radius: 90px !important; border: 2px solid #fff !important; pointer-events: none; } 
        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
      `}</style>

      {videoData && (
        <div className="video-container" onContextMenu={(e) => e.preventDefault()}>
          
          {/* Lapisan Kaca yang nangkep Klik pertama untuk panggil Iklan Monetag */}
          <div id="kaca-link-offer" style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            zIndex: 9999, cursor: 'pointer', backgroundColor: 'transparent'
          }}></div>

          <div data-vjs-player style={{ width: '100%', height: '100%' }}>
            <video 
              ref={videoNodeRef}
              id={`vidly-player-${videoId}`}
              className="video-js vjs-default-skin vjs-big-play-centered" 
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
