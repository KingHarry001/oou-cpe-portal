// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
import { mockSupabase } from "./mockSupabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// A real Supabase project is configured only when the URL is present and isn't
// the placeholder from .env.example.
const hasRealSupabase = Boolean(supabaseUrl) && !supabaseUrl.includes("your-project");

// Use the in-memory mock (see mockSupabase.js) when explicitly requested via
// VITE_USE_MOCK=true, or as a fallback whenever no real project is configured
// — this keeps the app from crashing at startup with "supabaseUrl is required".
// The moment real credentials are supplied, the real client takes over.
export const isMock = import.meta.env.VITE_USE_MOCK === "true" || !hasRealSupabase;

export const supabase = isMock ? mockSupabase : createClient(supabaseUrl, supabaseAnonKey);
