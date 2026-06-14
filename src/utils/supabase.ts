import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PORTFOLIO_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PORTFOLIO_KEY env vars. " +
        "The portfolio must use a read-only, RLS-scoped credential (never service_role)."
    );
  }

  _client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
  return _client;
}
