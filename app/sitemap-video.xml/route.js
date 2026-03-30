import { supabase } from '@/lib/supabase';

export async function GET() {
  const { data: settings } = await supabase.from('settings').select('domain').eq('id', 1).single();
  const domain = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  // Tarik data ID dan tanggal pembuatan video dari supabase (Maksimal narik 10.000 video terbaru)
  const { data: videos } = await supabase
    .from('videos')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(10000);

  const urlset = (videos || []).map(vid => `
    <url>
      <loc>${domain}/${vid.id}</loc>
      <lastmod>${new Date(vid.created_at || Date.now()).toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>0.9</priority>
    </url>
  `).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
