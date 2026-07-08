// src/components/dashboard/ComplaintsPanel.jsx
import { useEffect, useState } from "react";
import { IconMessageCircle } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../ui/EmptyState";

export default function ComplaintsPanel() {
  const { profile } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("complaints")
        .select("*, student:users!student_id(full_name), courses(code)")
        .eq("lecturer_id", profile.id)
        .order("created_at", { ascending: false });
      setComplaints(data || []);
    };
    load();
  }, [profile.id]);

  const patch = (id, fields) => {
    setComplaints((list) => list.map((c) => (c.id === id ? { ...c, ...fields } : c)));
    setSelected((s) => (s?.id === id ? { ...s, ...fields } : s));
  };

  const resolve = async (id) => {
    await supabase.from("complaints").update({ status: "resolved" }).eq("id", id);
    patch(id, { status: "resolved" });
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    await supabase.from("complaints").update({ reply, status: "resolved" }).eq("id", selected.id);
    patch(selected.id, { reply, status: "resolved" });
    setReply("");
  };

  const openDetail = (c) => {
    setSelected(c);
    setReply(c.reply || "");
  };

  return (
    <div className="grid md:grid-cols-[340px_1fr] gap-6">
      <div className="rounded-3xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
        {complaints.length === 0 ? (
          <EmptyState icon={IconMessageCircle} label="No complaints yet" className="py-16 px-6" />
        ) : (
          complaints.map((c) => (
            <button
              key={c.id}
              onClick={() => openDetail(c)}
              className={`w-full text-left p-5 hover:bg-gray-50 transition ${selected?.id === c.id ? "bg-gray-50" : ""}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-sm font-medium">{c.student?.full_name || "Unknown"}</p>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    c.status === "resolved" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {c.courses?.code ? `${c.courses.code} · ` : ""}{c.subject}
              </p>
            </button>
          ))
        )}
      </div>

      <div className="rounded-3xl border border-gray-100 p-8">
        {!selected ? (
          <EmptyState icon={IconMessageCircle} label="Select a complaint to view details" className="py-16" />
        ) : (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-medium">{selected.subject}</h2>
              <p className="text-xs text-gray-400 mt-1">
                From {selected.student?.full_name || "Unknown"}
                {selected.courses?.code ? ` · ${selected.courses.code}` : ""}
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-2xl p-4">{selected.message}</p>
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-32"
              placeholder="Write a reply..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                onClick={sendReply}
                disabled={!reply.trim()}
                className="bg-black text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-40"
              >
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
