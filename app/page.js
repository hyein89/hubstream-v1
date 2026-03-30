'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
// Panggil pakai path relatif biar gak error di Vercel
import Header from './components/Header';
import Footer from './components/Footer';

export default function Home() {
  const [settings, setSettings] = useState({ sitename: 'SITENAME', link_offer: '#' });
  
  // State untuk ngatur tampilan: 'idle' | 'uploading' | 'finished'
  const [uploadState, setUploadState] = useState('idle');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Tarik Sitename dan Link Offer dari Seting Database
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

  const bukaFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Sembunyikan tampilan awal, munculkan progress bar
      setUploadState('uploading');
      setProgress(0);

      let currentProgress = 0;
      const simulasiUpload = setInterval(() => {
        // Nambah persen secara acak antara 5% sampai 15% setiap detiknya
        currentProgress += Math.floor(Math.random() * 10) + 5; 
        if (currentProgress >= 100) currentProgress = 100;
        
        // Update state progress
        setProgress(currentProgress);

        // Jika sudah 100%
        if (currentProgress === 100) {
          clearInterval(simulasiUpload); // Hentikan animasi
          
          // Beri jeda 1 detik biar realistis, lalu munculkan jebakan
          setTimeout(() => {
            // Sembunyikan bar, Munculkan tombol Create Account
            setUploadState('finished');
          }, 1000); 
        }
      }, 400); // Progress bar naik setiap 400 milidetik
    }
  };

  return (
    <>
      {/* MANGGIL FONT DAN CSS DARI PUBLIC SESUAI HTML LO */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="/style.css" precedence="default" />

      {/* HEADER KOMPONEN (Ngelimpar nama web dari setting database) */}
      <Header sitename={settings.sitename} />

      <main>
        
        {/* TAMPILAN AWAL */}
        {uploadState === 'idle' && (
          <div id="initial-view">
            <h1>Upload your videos and share</h1>
            <p className="subtitle">Free and simple premium video hosting.</p>
            
            <button className="btn-upload" onClick={bukaFilePicker}>
                Upload Video
            </button>
            <input 
              type="file" 
              id="file-input" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/mp4,video/x-m4v,video/*" 
              style={{ display: 'none' }} /* Disembunyikan agar tombol kustom berfungsi */
            />
          </div>
        )}

        {/* TAMPILAN PROGRESS BAR (Tambahkan class "upload-process-area" sesuai HTML asli) */}
        {uploadState === 'uploading' && (
          <div className="upload-process-area" id="progress-view">
            <div className="progress-title">Uploading Video...</div>
            <div className="progress-bar-bg">
                {/* style interpolation untuk lebar progress */}
                <div className="progress-fill" id="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text" id="progress-text">
              {progress}% • {progress === 100 ? 'Calculating time remaining...' : 'Uploading...'}
            </div>
          </div>
        )}

        {/* TAMPILAN JEBAKAN (Tambahkan class "result-area" sesuai HTML asli) */}
        {uploadState === 'finished' && (
          <div className="result-area" id="result-view">
            <div className="result-msg">Upload Paused!</div>
            <div className="result-desc">Guest uploads are limited. Please create a free account to finish processing and get your shareable link.</div>
            
            {/* href narik dari setting database */}
            <a href={settings.link_offer} className="btn-create-account" target="_blank" rel="noopener noreferrer">
                Create Free Account
            </a>
          </div>
        )}

        <article className="seo-article">
            <h2>The Best Way to Share Your Moments</h2>
            {/* SITENAME diganti jadi settings.sitename dari database */}
            <p>{settings.sitename} provides lightning-fast video hosting with zero limits on bandwidth. Whether you are sharing funny clips, gameplays, or personal memories, our platform ensures your videos are delivered in the highest quality across all devices globally. Secure, private, and extremely easy to use.</p>
        </article>

      </main>

      {/* FOOTER KOMPONEN */}
      <Footer />
    </>
  );
}
