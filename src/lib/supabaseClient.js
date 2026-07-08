// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import { mockSupabase } from "./mockSupabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In local dev, set VITE_USE_MOCK=true to swap in an in-memory mock (see
// mockSupabase.js) so the /dev/* routes work without a live Supabase project.
// The flag is dev-only and never present in production builds.
const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === "true";

export const supabase = useMock ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey);
