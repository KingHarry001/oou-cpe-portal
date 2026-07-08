// src/components/dashboard/AttendanceCheckIn.jsx
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";

export default function AttendanceCheckIn({ classId }) {
  const { profile } = useAuth();
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | open | closed | none | checked-in
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOpenSession();
    const interval = setInterval(loadOpenSession, 15000); // re-poll every 15s
    return () => clearInterval(interval);
  }, [classId]);

  const loadOpenSession = async () => {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from("attendance_sessions")
      .select("*")
      .eq("class_id", classId)
      .lte("opens_at", now)
      .gte("closes_at", now)
      .order("opens_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) {
      setStatus("none");
      return;
    }

    setSession(data);

    const { data: existing } = await supabase
      .from("attendance_records")
      .select("id")
      .eq("session_id", data.id)
      .eq("student_id", profile.id)
      .maybeSingle();

    setStatus(existing ? "checked-in" : "open");
  };

  const checkIn = async () => {
    const { error } = await supabase.from("attendance_records").insert({
      session_id: session.id,
      student_id: profile.id,
    });

    if (error) {
      // unique constraint violation means they already checked in — treat as success
      setMessage(error.code === "23505" ? "Already checked in" : error.message);
    } else {
      setMessage("Attendance marked");
    }
    setStatus("checked-in");
  };

  if (status === "loading") return <p className="text-sm text-gray-500">Checking for open sessions...</p>;

  if (status === "none") {
    return (
      <div className="rounded-2xl border border-gray-200 p-4 text-sm text-gray-500">
        No attendance window is open right now.
      </div>
    );
  }

  if (status === "checked-in") {
    return (
      <div className="rounded-2xl border border-brand-green bg-brand-green/10 p-4 text-sm text-brand-greenDark font-medium">
        {message || "You're marked present"} ✓
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
      <p className="text-sm">
        {session.is_test ? "A test window is" : "Attendance is"} open — closes{" "}
        {new Date(session.closes_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      <button
        onClick={checkIn}
        className="w-full bg-brand-green text-white rounded-full py-2.5 text-sm font-medium hover:bg-brand-greenDark"
      >
        Mark me present
      </button>
    </div>
  );
}