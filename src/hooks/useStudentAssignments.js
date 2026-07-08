// src/hooks/useStudentAssignments.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Loads assignments for a student's level, soonest deadline first. Shared by
// the weekly overview (pending count + upcoming deadlines) and the assignments
// tab so the query lives in one place.
export function useStudentAssignments(level) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!level) return;
    let active = true;
    supabase
      .from("assignments")
      .select("*, courses!inner(code, title, level)")
      .eq("courses.level", level)
      .order("deadline")
      .then(({ data }) => {
        if (!active) return;
        setAssignments(data || []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [level]);

  return { assignments, loading };
}
