import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_PORTFOLIO_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_PORTFOLIO_KEY env vars. " +
        "Use the Supabase secret API key (sb_secret_...) — not a legacy JWT."
    );
  }

  // Supabase secret/publishable keys (sb_secret_*) go in the apikey header.
  // Legacy JWT-based anon keys are no longer accepted after JWT signing key migration.

  _client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
  return _client;
}
