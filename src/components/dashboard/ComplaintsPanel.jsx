// src/components/dashboard/ComplaintsPanel.jsx
import { useState } from "react";
import { IconMessageCircle } from "@tabler/icons-react";

const MOCK_COMPLAINTS = [
  { id: 1, student: "Ada Lovelace", course: "CPE 301", subject: "Missing grade", status: "open" },
  { id: 2, student: "King Harrison", course: "CPE 405", subject: "Group project dispute", status: "resolved" },
];

export default function ComplaintsPanel() {
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  const resolve = (id) => {
    setComplaints(complaints.map((c) => (c.id === id ? { ...c, status: "resolved" } : c)));
  };

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-6">
      <div className="rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <IconMessageCircle size={28} className="text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">No complaints yet</p>
          </div>
        ) : (
          complaints.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-5 hover:bg-gray-50 transition ${selected?.id === c.id ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium">{c.student}</p>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    c.status === "resolved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">{c.course} · {c.subject}</p>
            </button>
          ))
        )}
      </div>

      <div className="rounded-3xl border border-gray-100 p-8">
        {!selected ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <IconMessageCircle size={28} className="text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">Select a complaint to view details</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-medium">{selected.subject}</h2>
              <p className="text-xs text-gray-400 mt-1">
                From {selected.student} · {selected.course}
              </p>
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-32"
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="flex gap-3">
              <button className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-800 transition">
                Send reply
              </button>
              {selected.status !== "resolved" && (
                <button
                  onClick={() => resolve(selected.id)}
                  className="border border-gray-200 rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-50 transition"
                >
                  Mark resolved
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}