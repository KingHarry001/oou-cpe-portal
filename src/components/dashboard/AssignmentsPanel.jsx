// src/components/dashboard/AssignmentsPanel.jsx
import { useEffect, useState } from "react";
import { IconClipboardList } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../ui/EmptyState";

const fmtDeadline = (d) =>
  d ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "no deadline set";

export default function AssignmentsPanel() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ courseId: "", title: "", description: "", deadline: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const [{ data: courseData }, { data: asnData }] = await Promise.all([
        supabase.from("courses").select("id, code, title").eq("lecturer_id", profile.id),
        supabase
          .from("assignments")
          .select("*, courses!inner(code, title, lecturer_id)")
          .eq("courses.lecturer_id", profile.id)
          .order("deadline"),
      ]);
      setCourses(courseData || []);
      setAssignments(asnData || []);
    };
    load();
  }, [profile.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: insertError } = await supabase
      .from("assignments")
      .insert({
        course_id: form.courseId,
        title: form.title,
        description: form.description,
        deadline: form.deadline || null,
      })
      .select("*, courses(code, title)")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setAssignments([...assignments, data]);
    setForm({ courseId: "", title: "", description: "", deadline: "" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-100 p-8 space-y-5"
      >
        <h2 className="text-lg font-medium">New assignment</h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
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

        <div>
          <label className="text-sm font-medium block mb-2">Title</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            placeholder="e.g. Assignment 3 - FSM design"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Description</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-28"
            placeholder="Instructions for students..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Deadline</label>
          <input
            type="datetime-local"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <button
          disabled={courses.length === 0}
          className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40"
        >
          Publish assignment
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Published assignments</h2>
        {assignments.length === 0 ? (
          <EmptyState icon={IconClipboardList} label="No assignments yet" />
        ) : (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li key={a.id} className="border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-medium">
                  {a.courses?.code ? `${a.courses.code} · ` : ""}{a.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">Due {fmtDeadline(a.deadline)}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
