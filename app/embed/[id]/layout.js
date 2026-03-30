import { supabase } from '@/lib/supabase';

export async function generateMetadata({ params }) {
  // Await params biar aman di Next.js terbaru
  const resolvedParams = await params;
  const videoId = resolvedParams.id;

  // 1. Tarik Judul dan Gambar Thumbnail dari tabel videos
  const { data: video } = await supabase
    .from('videos')
    .select('title, image')
    .eq('id', videoId)
    .single();

  // 2. Tarik nama Sitename & Domain dari tabel settings
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename, domain')
    .eq('id', 1)
    .single();

  const siteName = settings?.sitename || 'SITENAME';
  const domainURL = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  // Kalau videonya gak ada
  if (!video) {
    return {
      title: `Video Not Found | ${siteName}`,
      description: 'Video tidak ditemukan atau sudah dihapus.',
    };
  }

  // Pasang SEO dinamis untuk halaman Embed
  return {
    title: `${video.title} - Embed | ${siteName}`,
    description: `Watch and embed ${video.title} in HD quality from ${siteName}.`,
    openGraph: {
      title: video.title,
      description: `Watch ${video.title} for free.`,
      url: `${domainURL}/embed/${videoId}`,
      siteName: siteName,
      images: [
        {
          url: video.image, // Narik URL thumbnail .jpg dari Supabase
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
      images: [video.image], // Thumbnail bakal muncul gede
    },
  };
}

// Fungsi wajib buat ngebungkus halaman embed page.js lo
export default function EmbedLayout({ children }) {
  return <>{children}</>;
}
