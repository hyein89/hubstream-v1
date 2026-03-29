'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';

export default function EmbedPlayer({ params }) {
  // BUKA PARAMS PAKAI React.use() KARENA INI CLIENT COMPONENT
  const resolvedParams = use(params);
  const videoId = resolvedParams.id;
  
  const [videoData, setVideoData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function init() {
      const { data, err } = await supabase.from('videos').select('video').eq('id', videoId).single();
      
      if (err || !data) {
        setError(true);
        return;
      }
      
      setVideoData(data);
      // Nambah hitcount
      await supabase.rpc('increment_hitcount', { video_id: videoId });
    }
    init();
  }, [videoId]);

  if (error) return <div style={{ color: '#fff', background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>404 Not Found</div>;
  if (!videoData) return <div style={{ background: '#000', height: '100vh' }} />;

  return (
    <div style={{ margin: 0, width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
      <video 
        src={videoData.video} 
        poster={`/${videoId}.jpg`} 
        controls 
        style={{ width: '100%', height: '100%', objectFit: 'contain', outline: 'none' }}
      />
    </div>
  );
}
