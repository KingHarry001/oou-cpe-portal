// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-medium mb-2">Reset your password</h1>
        <p className="text-gray-500 mb-8">
          Enter your school email and we'll send you a reset link.
        </p>

        {sent ? (
          <p className="text-sm text-brand-greenDark bg-brand-green/10 rounded-xl px-4 py-3 mb-6">
            If an account exists for that email, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>
            )}
            <label className="text-sm font-medium block mb-2">Email</label>
            <input
              type="email"
              required
              placeholder="you@oouagoiwoye.edu.ng"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-6 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              disabled={loading}
              className="w-full bg-brand-green text-white rounded-full py-3.5 text-sm font-medium hover:bg-brand-greenDark transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <Link to="/signin" className="block text-center text-sm text-gray-500 hover:text-black mt-8 transition">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
