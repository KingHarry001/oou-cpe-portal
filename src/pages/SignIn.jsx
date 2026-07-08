// src/pages/SignIn.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { IconBrandGoogle } from "@tabler/icons-react";
import { supabase } from "../lib/supabaseClient";
import { roleHome } from "../lib/roles";
import GridBackground from "../components/ui/GridBackground";
import oouCrest from "../assets/oou-crest.jpg";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role, status")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profile?.status === "banned") {
      setError("This account has been suspended. Contact department admin.");
      return;
    }

    navigate(roleHome(profile?.role));
  };

  const signInWithGoogle = async () => {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Dark info panel */}
      <div className="relative bg-brand-black text-white px-10 md:px-16 py-16 flex flex-col justify-between overflow-hidden">
        <GridBackground />
        <img
          src={oouCrest}
          alt=""
          aria-hidden="true"
          className="absolute -right-16 -bottom-16 w-80 h-80 object-contain opacity-[0.06] pointer-events-none"
        />

        <div className="relative flex items-center gap-3">
          <img src={oouCrest} alt="Olabisi Onabanjo University crest" className="h-10 w-10 object-contain" />
          <span className="font-medium">OOU CompEng Portal</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative max-w-md"
        >
          <h1 className="text-4xl md:text-5xl font-medium leading-tight mb-6">
            Navigate university life{" "}
            <span className="font-voice italic font-normal text-brand-green">with clarity</span>
          </h1>
          <p className="text-white/55 leading-relaxed">
            One home for schedules, attendance, assignments, complaints and
            the latest news from the Department of Computer Engineering.
          </p>
        </motion.div>

        <p className="relative text-xs text-white/30">© 2026 Olabisi Onabanjo University</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-8 md:px-16 py-16 bg-white">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm"
        >
          <h2 className="text-3xl font-medium mb-2">Welcome back</h2>
          <p className="text-gray-500 mb-10">Sign in to continue to your dashboard.</p>

          <div className="flex bg-gray-100 rounded-full p-1 mb-8 text-sm font-medium">
            <span className="flex-1 text-center py-2 rounded-full bg-white shadow-sm">Sign in</span>
            <Link to="/signup" className="flex-1 text-center py-2 text-gray-500">
              Sign up
            </Link>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>
          )}

          <label className="text-sm font-medium block mb-2">Email</label>
          <input
            type="email"
            required
            placeholder="you@oouagoiwoye.edu.ng"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="text-sm font-medium block mb-2">Password</label>
          <input
            type="password"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="text-right mb-8">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-black transition">
              Forgot password?
            </Link>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-green text-white rounded-full py-3.5 text-sm font-medium hover:bg-brand-greenDark transition disabled:opacity-50 mb-6"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full border border-gray-200 rounded-full py-3.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition"
          >
            <IconBrandGoogle size={18} strokeWidth={1.5} />
            Continue with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
            By continuing you agree to abide by the OOU code of conduct.
          </p>
        </motion.form>
      </div>
    </div>
  );
}