import { createClient } from '@supabase/supabase-js';

// Kunci ini nanti diisi langsung di Vercel Dashboard
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
