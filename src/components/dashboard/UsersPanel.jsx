// src/components/dashboard/UsersPanel.jsx
import { useEffect, useState } from "react";
import { IconUsers } from "@tabler/icons-react";
import { supabase } from "../../lib/supabaseClient";
import EmptyState from "../ui/EmptyState";

export default function UsersPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, role, status")
        .order("full_name");
      setUsers(data || []);
      setLoading(false);
    };
    loadUsers();
  }, []);

  const toggleBan = async (id, status) => {
    const newStatus = status === "banned" ? "active" : "banned";
    await supabase.from("users").update({ status: newStatus }).eq("id", id);
    setUsers(users.map((u) => (u.id === id ? { ...u, status: newStatus } : u)));
  };

  if (loading) return <p className="text-sm text-gray-400">Loading users...</p>;

  return (
    <div className="rounded-3xl border border-gray-100 overflow-hidden">
      {users.length === 0 ? (
        <EmptyState icon={IconUsers} label="No users yet" className="py-16" />
      ) : (
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead className="bg-gray-50 text-left text-gray-400">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-50">
                <td className="px-6 py-4">{u.full_name}</td>
                <td className="px-6 py-4 capitalize">{u.role}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      u.status === "banned" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="text-xs font-medium text-red-600 hover:underline"
                    onClick={() => toggleBan(u.id, u.status)}
                  >
                    {u.status === "banned" ? "Unban" : "Ban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}