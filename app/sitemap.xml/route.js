import { supabase } from '@/lib/supabase';

export async function GET() {
  // Tarik domain dari Seting Database
  const { data: settings } = await supabase.from('settings').select('domain').eq('id', 1).single();
  const domain = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
      <loc>${domain}/sitemap-page.xml</loc>
    </sitemap>
    <sitemap>
      <loc>${domain}/sitemap-video.xml</loc>
    </sitemap>
  </sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  });
}
