// src/components/dashboard/LiveAttendanceCount.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function LiveAttendanceCount({ session, totalStudents }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session) return;

    loadCount();

    const channel = supabase
      .channel(`attendance-${session.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "attendance_records", filter: `session_id=eq.${session.id}` },
        () => setCount((c) => c + 1)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [session]);

  const loadCount = async () => {
    const { count: c } = await supabase
      .from("attendance_records")
      .select("*", { count: "exact", head: true })
      .eq("session_id", session.id);
    setCount(c || 0);
  };

  const closesIn = Math.max(0, Math.floor((new Date(session.closes_at) - new Date()) / 60000));

  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 mb-1">Live check-ins</p>
      <p className="text-3xl font-semibold mb-2">
        {count} <span className="text-base font-normal text-gray-400">/ {totalStudents}</span>
      </p>
      <p className="text-xs text-gray-500">Closes in {closesIn} min</p>
    </div>
  );
}