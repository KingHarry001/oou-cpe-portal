// src/components/dashboard/ResourcesPanel.jsx
import { useState } from "react";
import { IconFiles } from "@tabler/icons-react";
import EmptyState from "../ui/EmptyState";

export default function ResourcesPanel() {
  const [form, setForm] = useState({ course: "", type: "course_outline", file: null });
  const [resources, setResources] = useState([]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return;
    setResources([...resources, { ...form, id: Date.now(), name: form.file.name }]);
    setForm({ course: "", type: "course_outline", file: null });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleUpload} className="rounded-3xl border border-gray-100 p-8 space-y-5">
        <h2 className="text-lg font-medium">Upload resource</h2>

        <div>
          <label className="text-sm font-medium block mb-2">Course</label>
          <select
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          >
            <option value="">Select course</option>
            <option>CPE 301 - Digital Logic</option>
            <option>CPE 405 - Software Engineering</option>
          </select>
        </div>

        <div className="flex gap-2">
          {[
            { key: "course_outline", label: "Course outline" },
            { key: "pdf", label: "Lecture PDF" },
          ].map((t) => (
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
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
          />
        </div>

        <button className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition">
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
                <span>{r.name}</span>
                <span className="text-xs text-gray-400 capitalize">{r.type.replace("_", " ")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}