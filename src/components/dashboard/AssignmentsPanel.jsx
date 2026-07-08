// src/components/dashboard/AssignmentsPanel.jsx
import { useState } from "react";
import { IconClipboardList } from "@tabler/icons-react";

export default function AssignmentsPanel() {
  const [form, setForm] = useState({
    course: "",
    title: "",
    description: "",
    deadline: "",
    file: null,
  });
  const [assignments, setAssignments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAssignments([...assignments, { ...form, id: Date.now() }]);
    setForm({
      course: "",
      title: "",
      description: "",
      deadline: "",
      file: null,
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-gray-100 p-8 space-y-5"
      >
        <h2 className="text-lg font-medium">New assignment</h2>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Deadline</label>
            <input
              type="datetime-local"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Attach PDF</label>
            <input
              type="file"
              accept="application/pdf"
              className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />
          </div>
        </div>

        <button className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition">
          Publish assignment
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Published assignments</h2>
        {assignments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <IconClipboardList
              size={28}
              className="text-gray-200 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-sm text-gray-400">No assignments yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li key={a.id} className="border border-gray-100 rounded-2xl p-4">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Due {a.deadline || "no deadline set"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
