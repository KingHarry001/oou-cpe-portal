// src/hooks/useNews.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Loads department posts (news / announcements / insights), newest first.
export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setNews(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { news, loading };
}
