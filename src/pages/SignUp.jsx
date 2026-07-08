// src/pages/SignUp.jsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IconBrandGoogle } from "@tabler/icons-react";
import { supabase } from "../lib/supabaseClient";
import { roleHome } from "../lib/roles";
import GridBackground from "../components/ui/GridBackground";
import oouCrest from "../assets/oou-crest.jpg";

export default function SignUp() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Only lecturer/student can self-register; admins are provisioned separately.
  const role = searchParams.get("role") === "lecturer" ? "lecturer" : "student";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.endsWith("@oouagoiwoye.edu.ng")) {
      setError("Please use your school email (@oouagoiwoye.edu.ng)");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      full_name: form.fullName,
      email: form.email,
      role,
    });

    setLoading(false);
    if (profileError) {
      setError(profileError.message);
      return;
    }

    navigate(roleHome(role));
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

      <div className="flex items-center justify-center px-8 md:px-16 py-16 bg-white">
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm"
        >
          <h2 className="text-3xl font-medium mb-2">Create your account</h2>
          <p className="text-gray-500 mb-10">
            {role === "lecturer"
              ? "Sign up as a lecturer with your school email."
              : "Sign up with your school email to get started."}
          </p>

          <div className="flex bg-gray-100 rounded-full p-1 mb-8 text-sm font-medium">
            <Link to="/signin" className="flex-1 text-center py-2 text-gray-500">
              Sign in
            </Link>
            <span className="flex-1 text-center py-2 rounded-full bg-white shadow-sm">Sign up</span>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3 mb-6">{error}</p>
          )}

          <label className="text-sm font-medium block mb-2">Full name</label>
          <input
            required
            placeholder="Ada Lovelace"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

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
            minLength={6}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm mb-8 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            disabled={loading}
            className="w-full bg-brand-green text-white rounded-full py-3.5 text-sm font-medium hover:bg-brand-greenDark transition disabled:opacity-50 mb-6"
          >
            {loading ? "Creating account..." : "Create account"}
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