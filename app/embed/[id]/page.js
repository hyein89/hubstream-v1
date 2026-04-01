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

  // 1. AMBIL DATA DARI SUPABASE
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

  // --- LOGIKA POPUNDER (SCRIPT INJECTION DARI LU) ---
  useEffect(() => {
    if (!settings?.ads_head) return;

    // --- JALUR 2: PASANG IKLAN POPUNDER (DARI ADS_HEAD) ---
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

    // CLEANUP: Hapus popunder kalau user keluar halaman biar gak numpuk
    return () => {
      const scriptTuntaskan = document.querySelectorAll('.script-iklan-popunder');
      scriptTuntaskan.forEach(s => s.remove());
    };
  }, [settings?.ads_head]);

  // 2. SETUP VIDEO PLAYER & GOOGLE IMA VAST
  useEffect(() => {
    if (allScriptsReady && videoData && settings && videoNodeRef.current && !playerRef.current) {
      
      const player = window.videojs(videoNodeRef.current);
      playerRef.current = player;

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

        player.on('play', function() {
            if (player.ima && !player.ima.adDisplayContainerInitialized) {
                player.ima.initializeAdDisplayContainer();
            }
        });

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
    }
  }, [allScriptsReady, videoData, settings]);

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
      <link href="https://vjs.zencdn.net/8.10.0/video-js.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.css" rel="stylesheet" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.css" rel="stylesheet" />

      <Script src="https://vjs.zencdn.net/8.10.0/video.min.js" strategy="afterInteractive" onLoad={() => setVjsLoaded(true)} />
      {vjsLoaded && <Script src="https://imasdk.googleapis.com/js/sdkloader/ima3.js" strategy="afterInteractive" onLoad={() => setImaSdkLoaded(true)} />}
      {imaSdkLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-ads/7.3.2/videojs.ads.min.js" strategy="afterInteractive" onLoad={() => setVjsAdsLoaded(true)} />}
      {vjsAdsLoaded && <Script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-ima/2.2.0/videojs.ima.min.js" strategy="afterInteractive" onLoad={() => setVjsImaLoaded(true)} />}

      {/* Bagian dangerouslySetInnerHTML dihapus karena script udah diinjeksi manual sama useEffect popunder */}

      <style jsx global>{`
        html, body { width: 100%; height: 100%; margin: 0; padding: 0; background-color: #000; overflow: hidden; }
        .video-container { width: 100%; height: 100%; position: absolute; top: 0; left: 0; display: flex; justify-content: center; align-items: center; background: #000; }
        .video-js { width: 100vw !important; height: 100vh !important; }
        .vjs-big-play-button { border-radius: 90px !important; border: 2px solid #fff !important; } 
        video::-internal-media-controls-download-button { display:none; }
        video::-webkit-media-controls-enclosure { overflow:hidden; }
      `}</style>

      {videoData && (
        <div className="video-container" onContextMenu={(e) => e.preventDefault()}>
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
