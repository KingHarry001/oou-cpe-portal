// src/components/dashboard/ClassesPanel.jsx
import { useEffect, useState } from "react";
import { IconMapPin, IconClock } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../ui/EmptyState";

export default function ClassesPanel() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    courseId: "",
    day: "Monday",
    startTime: "",
    endTime: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Both reads key off the lecturer's courses; fetch them in parallel rather
    // than waiting on the course list just to build the classes query. The
    // separate courses read still surfaces courses that have no classes yet
    // (needed for the dropdown).
    const [{ data: courseData }, { data: classData }] = await Promise.all([
      supabase.from("courses").select("id, code, title").eq("lecturer_id", profile.id),
      supabase
        .from("classes")
        .select("*, courses!inner(code, title)")
        .eq("courses.lecturer_id", profile.id),
    ]);

    setCourses(courseData || []);
    setClasses(classData || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: insertError } = await supabase
      .from("classes")
      .insert({
        course_id: form.courseId,
        day: form.day,
        start_time: form.startTime,
        end_time: form.endTime,
        location: form.location,
      })
      .select("*, courses(code, title)")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setClasses([...classes, data]);
    setForm({
      courseId: "",
      day: "Monday",
      startTime: "",
      endTime: "",
      location: "",
    });
  };

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-100 p-8 space-y-5"
      >
        <h2 className="text-lg font-medium">Add a class</h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {courses.length === 0 ? (
          <p className="text-sm text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
            No courses assigned to you yet — ask an admin to create one under
            your account.
          </p>
        ) : (
          <div>
            <label className="text-sm font-medium block mb-2">Course</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
            >
              <option value="">Select course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Day</label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
            >
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Location</label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              placeholder="e.g. Engr. Lecture Hall 2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Start time</label>
            <input
              type="time"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">End time</label>
            <input
              type="time"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
        </div>

        <button
          disabled={courses.length === 0}
          className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40"
        >
          Save class
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Your classes this week</h2>
        {classes.length === 0 ? (
          <EmptyState icon={IconClock} label="No classes added yet" />
        ) : (
          <ul className="space-y-3">
            {classes.map((c) => (
              <li key={c.id} className="border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-medium">
                  {c.courses?.code} - {c.courses?.title}
                </p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  <span>
                    {c.day} · {c.start_time}–{c.end_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <IconMapPin size={12} /> {c.location}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
