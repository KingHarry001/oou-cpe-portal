// src/components/dashboard/AnnouncementsPanel.jsx
import { useState } from "react";
import { IconSpeakerphone } from "@tabler/icons-react";

export default function AnnouncementsPanel() {
  const [form, setForm] = useState({ type: "announcement", title: "", body: "" });
  const [posts, setPosts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPosts([{ ...form, id: Date.now() }, ...posts]);
    setForm({ type: form.type, title: "", body: "" });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-100 p-8 space-y-5">
        <h2 className="text-lg font-medium">New post</h2>

        <div className="flex gap-2">
          {[
            { key: "announcement", label: "Announcement" },
            { key: "news", label: "News" },
            { key: "insight", label: "Insight" },
          ].map((t) => (
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

        <button className="w-full bg-black text-white rounded-full py-3.5 text-sm font-medium hover:bg-gray-800 transition">
          Publish
        </button>
      </form>

      <div className="rounded-3xl border border-gray-100 p-8">
        <h2 className="text-lg font-medium mb-6">Recent posts</h2>
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <IconSpeakerphone size={28} className="text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">Nothing published yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="border border-gray-100 rounded-2xl p-4">
                <span className="text-xs uppercase text-brand-greenDark font-medium">{p.type}</span>
                <p className="text-sm font-medium mt-1">{p.title}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}