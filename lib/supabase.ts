import { createClient } from '@supabase/supabase-js';

console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0,8) + "…")

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

