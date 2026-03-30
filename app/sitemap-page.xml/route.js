import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: settings } = await supabase.from('settings').select('domain').eq('id', 1).single();
  const domain = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  // Daftar halaman statis publik
  const pages = ['', '/terms', '/privacy', '/dmca']; 

  const urlset = pages.map(page => `
    <url>
      <loc>${domain}${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
