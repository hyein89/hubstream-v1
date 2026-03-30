'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [settings, setSettings] = useState({ sitename: 'SITENAME', link_offer: '#' });
  
  // Ambil referensi elemen persis kayak document.getElementById di HTML lo
  const fileInputRef = useRef(null);
  const initialViewRef = useRef(null);
  const progressViewRef = useRef(null);
  const resultViewRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);

  // Tarik Sitename dan Link Offer dari database
    // Tarik Sitename dan Link Offer dari database (Biarkan kode ini seperti semula)
  useEffect(() => {
    async function fetchSettings() {
      const { data } = await supabase.from('settings').select('sitename, link_offer').eq('id', 1).single();
      if (data) {
        setSettings({ 
          sitename: data.sitename || 'SITENAME', 
          link_offer: data.link_offer || '#' 
        });
      }
    }
    fetchSettings();
  }, []);

  // 1. Fungsi asli kamu untuk buka file picker (Biarkan seperti ini)
  const bukaFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // 2. Tambahkan fungsi baru ini untuk memicu iklan Monetag
  const handleUploadClick = () => {
    // Pastikan script Monetag sudah dimuat oleh browser
    if (typeof window !== 'undefined' && window.show_10806273) {
      window.show_10806273()
        .then(() => {
          // Iklan selesai ditonton/ditutup -> Jalankan fungsi buka file picker milikmu
          bukaFilePicker();
        })
        .catch((err) => {
          // Jika iklan di-block (misal pakai AdBlocker), tetap buka file picker 
          // supaya proses upload tidak macet dan web tetap terasa mulus.
          console.error("Iklan gagal dimuat:", err);
          bukaFilePicker();
        });
    } else {
      // Jika internet lambat dan script Monetag belum siap, langsung buka file picker
      bukaFilePicker();
    }
  };


  // 2. Fungsi saat file dipilih (Persis kayak Javascript asli lo)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      
      // Sembunyikan tulisan besar dan tombol upload
      if (initialViewRef.current) initialViewRef.current.style.display = 'none';
      
      // Tampilkan kotak progress bar
      if (progressViewRef.current) progressViewRef.current.style.display = 'block';

      let progress = 0;
      
      const simulasiUpload = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 5; 
        
        if (progress >= 100) progress = 100;

        // Update lebar bar dan teks HTML-nya
        if (progressBarRef.current) progressBarRef.current.style.width = progress + '%';
        if (progressTextRef.current) progressTextRef.current.innerText = progress + '% • Uploading...';

        if (progress === 100) {
          clearInterval(simulasiUpload);
          
          setTimeout(() => {
            if (progressViewRef.current) progressViewRef.current.style.display = 'none'; 
            if (resultViewRef.current) resultViewRef.current.style.display = 'flex';   
          }, 1000); 
        }
      }, 400); 
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/style.css" precedence="default" />

      <Header sitename={settings.sitename} />

      <main>
        
        <div id="initial-view" ref={initialViewRef}>
            <h1>Upload your videos and share</h1>
            <p className="subtitle">Free and simple premium video hosting.</p>
            
            <button className="btn-upload" onClick={bukaFilePicker}>
                Upload Video
            </button>
            {/* Input file disembunyikan pakai CSS asli lu, event onChange dipasang di sini */}
            <input 
              type="file" 
              id="file-input" 
              ref={fileInputRef} 
              accept="video/mp4,video/x-m4v,video/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
        </div>

        <div className="upload-process-area" id="progress-view" ref={progressViewRef} style={{ display: 'none' }}>
            <div className="progress-title">Uploading Video...</div>
            <div className="progress-bar-bg">
                <div className="progress-fill" id="progress-bar" ref={progressBarRef}></div>
            </div>
            <div className="progress-text" id="progress-text" ref={progressTextRef}>0% • Calculating time remaining...</div>
        </div>

        <div className="result-area" id="result-view" ref={resultViewRef} style={{ display: 'none' }}>
            <div className="result-msg">Upload Paused!</div>
            <div className="result-desc">Guest uploads are limited. Please create a free account to finish processing and get your shareable link.</div>
            
            <a href={settings.link_offer} className="btn-create-account" target="_blank" rel="noopener noreferrer">
                Create Free Account
            </a>
        </div>

        <article className="seo-article">
            <h2>The Best Way to Share Your Moments</h2>
            <p>{settings.sitename} provides lightning-fast video hosting with zero limits on bandwidth. Whether you are sharing funny clips, gameplays, or personal memories, our platform ensures your videos are delivered in the highest quality across all devices globally. Secure, private, and extremely easy to use.</p>
        </article>

      </main>

      <Footer />
    </>
  );
}
