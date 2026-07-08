// src/pages/Banned.jsx
import { IconBan } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";

export default function Banned() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <div className="h-14 w-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <IconBan size={28} className="text-red-600" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-medium mb-3">Account suspended</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          This account has been suspended. If you believe this is a mistake,
          contact the department admin.
        </p>
        <button
          onClick={signOut}
          className="bg-brand-black text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
