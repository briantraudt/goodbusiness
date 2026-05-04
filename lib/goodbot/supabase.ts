import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;

const GOOD_BUSINESS_SUPABASE_URL = "https://qiyjzukzhwklkmpdxmfl.supabase.co";
const GOOD_BUSINESS_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wlKLDRgzNPEhy3sD92Htzg_5s7r-_QS";

export function getSupabaseAdmin() {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || GOOD_BUSINESS_SUPABASE_URL;
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    GOOD_BUSINESS_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !apiKey) {
    throw new Error("Supabase is not configured.");
  }

  adminClient = createClient(url, apiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
}
