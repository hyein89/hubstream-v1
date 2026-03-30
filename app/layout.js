import './globals.css';
import Script from 'next/script';
import { supabase } from '@/lib/supabase';

// Pakai generateMetadata biar bisa narik data dari Supabase secara otomatis (Server-Side)
export async function generateMetadata() {
  // Ambil sitename dan domain dari tabel settings
  const { data: settings } = await supabase
    .from('settings')
    .select('sitename, domain')
    .eq('id', 1)
    .single();

  // Set nilai default kalau misal databasenya lagi kosong/error
  const siteName = settings?.sitename || 'SITENAME';
  const domainURL = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  return {
    metadataBase: new URL(domainURL),
    title: {
      default: `${siteName} - Free Premium Video Hosting`,
      template: `%s | ${siteName}`
    },
    description: `${siteName} provides lightning-fast, premium video hosting with zero limits on bandwidth. Share your videos in the highest quality globally. Secure, private, and extremely easy to use.`,
    keywords: [
      'video hosting', 
      'free video upload', 
      'share videos online', 
      'premium video streaming', 
      siteName, 
      'unlimited bandwidth video',
      'secure video sharing'
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    
    // ICON WEB
    icons: {
      icon: '/apple-touch-icon.png',
      shortcut: '/apple-touch-icon.png',
      apple: '/apple-touch-icon.png', 
    },
    
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: '/',
    },
    
    // OPEN GRAPH (Buat Share ke WA/Facebook)
    openGraph: {
      title: `${siteName} - The Best Way to Share Your Moments`,
      description: 'Upload, host, and share your videos instantly with zero bandwidth limits. Experience lightning-fast premium streaming today.',
      url: '/',
      siteName: siteName,
      images: [
        {
          url: '/og-image.jpg', 
          width: 1200,
          height: 630,
          alt: `${siteName} Premium Video Hosting`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    
    // TWITTER CARD
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} - Free Premium Video Hosting`,
      description: 'Lightning-fast video hosting with zero limits on bandwidth. Secure, private, and extremely easy to use.',
      images: ['/og-image.jpg'],
    },
    
    // ROBOTS (Biar gampang di-index Google)
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

    <head>
       <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
    
        {/* 2. Pasang script Monetag di dalam tag <head> atau di luarnya */}
        <Script 
          src="//libtl.com/sdk.js" 
          data-zone="10806273" 
          data-sdk="show_10806273" 
          strategy="afterInteractive" 
        />
      </head>
    
      <body>{children}</body>
    </html>
  );
}
