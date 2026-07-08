// src/components/dashboard/ResourcesPanel.jsx
import { useEffect, useState } from "react";
import { IconFiles } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../ui/EmptyState";

const TYPES = [
  { key: "course_outline", label: "Course outline" },
  { key: "pdf", label: "Lecture PDF" },
];

export default function ResourcesPanel() {
  const { profile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState({ courseId: "", type: "course_outline", fileName: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const [{ data: courseData }, { data: resData }] = await Promise.all([
        supabase.from("courses").select("id, code, title").eq("lecturer_id", profile.id),
        supabase
          .from("resources")
          .select("*, courses!inner(code, title, lecturer_id)")
          .eq("courses.lecturer_id", profile.id)
          .order("created_at", { ascending: false }),
      ]);
      setCourses(courseData || []);
      setResources(resData || []);
    };
    load();
  }, [profile.id]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.courseId || !form.fileName) return;

    const { data, error: insertError } = await supabase
      .from("resources")
      .insert({ course_id: form.courseId, type: form.type, name: form.fileName })
      .select("*, courses(code, title)")
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setResources([data, ...resources]);
    setForm({ courseId: "", type: "course_outline", fileName: "" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleUpload} className="rounded-3xl border border-gray-100 p-8 space-y-5">
        <h2 className="text-lg font-medium">Upload resource</h2>

        {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

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
                <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setForm({ ...form, type: t.key })}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
                form.type === t.key
                  ? "bg-brand-green/10 border-brand-green text-brand-greenDark"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">File</label>
          <input
            type="file"
            accept="application/pdf"
            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5"
            onChange={(e) => setForm({ ...form, fileName: e.target.files[0]?.name || "" })}
          />
        </div>

        <button
          disabled={courses.length === 0}
          className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40"
        >
          Upload
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Uploaded resources</h2>
        {resources.length === 0 ? (
          <EmptyState icon={IconFiles} label="Nothing uploaded yet" />
        ) : (
          <ul className="space-y-3">
            {resources.map((r) => (
              <li key={r.id} className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 text-sm">
                <span className="min-w-0">
                  <span className="block truncate">{r.name}</span>
                  {r.courses?.code && <span className="text-xs text-gray-400">{r.courses.code}</span>}
                </span>
                <span className="text-xs text-gray-400 capitalize shrink-0 ml-3">{r.type.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
