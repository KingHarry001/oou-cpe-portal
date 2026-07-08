// src/components/dashboard/AnnouncementsPanel.jsx
import { useEffect, useState } from "react";
import { IconSpeakerphone } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import EmptyState from "../ui/EmptyState";

const TYPES = [
  { key: "announcement", label: "Announcement" },
  { key: "news", label: "News" },
  { key: "insight", label: "Insight" },
];

export default function AnnouncementsPanel() {
  const [form, setForm] = useState({ type: "announcement", title: "", body: "", imageUrl: "" });
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      setPosts(data || []);
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { data, error: insertError } = await supabase
      .from("announcements")
      .insert({
        type: form.type,
        title: form.title,
        body: form.body,
        image_url: form.imageUrl || null,
      })
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setPosts([data, ...posts]);
    setForm({ type: form.type, title: "", body: "", imageUrl: "" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-100 p-8 space-y-5">
        <h2 className="text-lg font-medium">New post</h2>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>
        )}

        <div className="flex gap-2">
          {TYPES.map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setForm({ ...form, type: t.key })}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
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
          <label className="text-sm font-medium block mb-2">Title</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Body</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-28"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Image URL (optional)</label>
          <input
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm"
            placeholder="https://…"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />
        </div>

        <button className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition">
          Publish
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Recent posts</h2>
        {posts.length === 0 ? (
          <EmptyState icon={IconSpeakerphone} label="Nothing published yet" />
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="flex items-center gap-3 border border-gray-100 rounded-2xl p-4">
                <div className="h-12 w-12 rounded-xl bg-gray-100 shrink-0 overflow-hidden flex items-center justify-center">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <IconSpeakerphone size={18} className="text-gray-300" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-xs uppercase text-brand-greenDark font-medium">{p.type}</span>
                  <p className="text-sm font-medium truncate">{p.title}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
