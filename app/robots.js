import { supabase } from '@/lib/supabase';

export default async function robots() {
  // Tarik domain lo dari database biar URL sitemap-nya otomatis bener
  const { data: settings } = await supabase
    .from('settings')
    .select('domain')
    .eq('id', 1)
    .single();

  const domain = settings?.domain ? `https://${settings.domain}` : 'https://domain.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // BLOKIR GOOGLE DARI HALAMAN ADMIN LO
      disallow: ['/seting', '/tambah', '/list'], 
    },
    // Ngarahin bot langsung ke sitemap utama lo yang udah diganti namanya
    sitemap: `${domain}/sitemap.xml`, 
  };
}
