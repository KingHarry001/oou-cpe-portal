// src/components/dashboard/AttendancePanel.jsx
import { useEffect, useState } from "react";
import { IconCalendarCheck } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import LiveAttendanceCount from "./LiveAttendanceCount";
import EmptyState from "../ui/EmptyState";

export default function AttendancePanel() {
  const { profile } = useAuth();
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    classId: "",
    type: "attendance",
    opensAt: "",
    closesAt: "",
  });
  const [session, setSession] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClasses = async () => {
      const { data } = await supabase
        .from("classes")
        .select("id, day, start_time, courses!inner(code, title, lecturer_id)")
        .eq("courses.lecturer_id", profile.id);
      setClasses(data || []);
    };
    loadClasses();
  }, [profile.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: insertError } = await supabase
      .from("attendance_sessions")
      .insert({
        class_id: form.classId,
        is_test: form.type === "test",
        opens_at: form.opensAt,
        closes_at: form.closesAt,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSession(data);

    const { count } = await supabase
      .from("enrollments")
      .select("*", { count: "exact", head: true })
      .eq("class_id", form.classId);

    setEnrolledCount(count || 0);
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-100 p-8 max-w-lg space-y-5"
      >
        <h2 className="text-lg font-medium">Open a session</h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <div>
          <label className="text-sm font-medium block mb-2">Class</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            value={form.classId}
            onChange={(e) => setForm({ ...form, classId: e.target.value })}
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courses.code} · {c.day} {c.start_time}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {["attendance", "test"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setForm({ ...form, type: t })}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                form.type === t
                  ? "bg-brand-green/10 border-brand-green text-brand-greenDark"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {t === "attendance" ? "Attendance" : "Test window"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Opens at</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.opensAt}
              onChange={(e) => setForm({ ...form, opensAt: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Closes at</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.closesAt}
              onChange={(e) => setForm({ ...form, closesAt: e.target.value })}
            />
          </div>
        </div>

        <button className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition">
          Open window
        </button>
      </form>

      {session ? (
        <LiveAttendanceCount session={session} totalStudents={enrolledCount} />
      ) : (
        <div className="rounded-3xl border border-gray-100 max-w-lg">
          <EmptyState icon={IconCalendarCheck} label="No session open right now" />
        </div>
      )}
    </div>
  );
}
