import { supabase } from '@/lib/supabase';

// Ini fungsi khusus Server-Side Next.js buat narik SEO dinamis
export async function generateMetadata({ params }) {
  // Await params biar gak error di versi Next.js terbaru lo
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  // 1. Tarik Judul dan Gambar Thumbnail dari tabel videos
  const { data: video } = await supabase
    .from('videos')
    .select('title, image')
    .eq('id', videoId)
    .single();

  // 2. Tarik nama Sitename & Domain dari tabel settings biar tetep nyambung
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename, domain')
    .eq('id', 1)
    .single();

  const siteName = settings?.sitename || 'SITENAME';
  const domainURL = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  // Kalau videonya gak ada (URL salah / udah dihapus), SEO-nya jadi 404
  if (!video) {
    return {
      title: `Video Not Found | ${siteName}`,
      description: 'Video tidak ditemukan atau sudah dihapus.',
    };
  }

  // Kalau videonya ada, pasang SEO dinamisnya!
  return {
    title: `${video.title} - ${siteName}`,
    description: `Watch and stream ${video.title} in HD quality for free on ${siteName}.`,
    openGraph: {
      title: video.title,
      description: `Watch ${video.title} for free.`,
      url: `${domainURL}/${videoId}`,
      siteName: siteName,
      images: [
        {
          url: video.image, // Ini otomatis narik URL gambar .jpg dari Supabase lo
          width: 1280,
          height: 720,
          alt: video.title,
        },
      ],
      locale: 'en_US',
      type: 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: video.title,
      description: `Watch ${video.title} for free.`,
      images: [video.image], // Thumbnail bakal muncul gede di Twitter/X
    },
  };
}

// Ini fungsi wajib buat ngebungkus halaman page.js lo di dalamnya
export default function StreamLayout({ children }) {
  return <>{children}</>;
}
