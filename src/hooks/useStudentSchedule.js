// src/hooks/useStudentSchedule.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Loads the week's classes for a student's level. Shared by the student's
// weekly overview and attendance tabs so the query (and its select string)
// lives in one place and is fetched once per level rather than per tab visit.
export function useStudentSchedule(level) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!level) return;
    let active = true;
    supabase
      .from("classes")
      .select("*, courses!inner(code, title, level)")
      .eq("courses.level", level)
      .then(({ data }) => {
        if (!active) return;
        setClasses(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level]);

  return { classes, loading };
}
