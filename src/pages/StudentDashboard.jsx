// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconLayoutGrid, IconClipboardList, IconCalendarCheck, IconMessageCircle,
  IconNews, IconLogout, IconMapPin,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import AttendanceCheckIn from "../components/dashboard/AttendanceCheckIn";
import MobileNav from "../components/dashboard/MobileNav";
import oouCrest from "../assets/oou-crest.jpg";

const TABS = [
  { key: "overview", label: "Weekly Overview", icon: IconLayoutGrid },
  { key: "assignments", label: "Assignments", icon: IconClipboardList },
  { key: "attendance", label: "Attendance", icon: IconCalendarCheck },
  { key: "complaint", label: "Submit Complaint", icon: IconMessageCircle },
  { key: "news", label: "News", icon: IconNews },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [active, setActive] = useState("overview");

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <MobileNav tabs={TABS} active={active} setActive={setActive} profile={profile} portalLabel="Department portal" />

      <aside className="w-72 border-r border-gray-100 px-6 py-8 hidden lg:flex lg:flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src={oouCrest} alt="OOU crest" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="font-medium text-sm">OOU CompEng</p>
              <p className="text-xs text-gray-400">Department portal</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition text-left ${
                  active === key ? "bg-[#0A0A0A] text-white" : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Icon size={18} strokeWidth={1.75} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 px-2 py-3 border-t border-gray-100">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
            {profile?.full_name?.[0] || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{profile?.full_name}</p>
            <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
          </div>
          <button onClick={signOut} className="text-gray-400 hover:text-gray-700 transition">
            <IconLogout size={18} strokeWidth={1.75} />
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full px-4 sm:px-6 md:px-12 py-6 sm:py-10 max-w-5xl">
        <header className="hidden lg:flex items-center justify-between mb-10">
          <h1 className="text-2xl font-medium">Student Dashboard</h1>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial="hidden" animate="show" exit="exit" variants={fadeUp}>
            {active === "overview" && <WeeklyOverview profile={profile} />}
            {active === "assignments" && <AssignmentsView />}
            {active === "attendance" && <AttendanceView profile={profile} />}
            {active === "complaint" && <ComplaintForm />}
            {active === "news" && <NewsView />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function WeeklyOverview({ profile }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (!profile?.level) return;
    loadSchedule();
  }, [profile]);

  const loadSchedule = async () => {
    const { data } = await supabase
      .from("classes")
      .select("*, courses!inner(code, title, level)")
      .eq("courses.level", profile.level);
    setClasses(data || []);
    setLoading(false);
  };

  const byDay = (day) => classes.filter((c) => c.day === day);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative bg-[#0A0A0A] text-white rounded-3xl p-6 sm:p-10 overflow-hidden w-full">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <p className="relative text-sm text-white/40 mb-2">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 className="relative text-2xl sm:text-3xl font-medium mb-6 sm:mb-8">
          {greeting}, <span className="font-voice italic font-normal text-brand-green">{profile?.full_name?.split(" ")[0] || "there"}</span>
        </h2>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Classes this week", value: String(classes.length) },
            { label: "Pending assignments", value: "0" },
            { label: "Department", value: "Comp. Eng." },
            { label: "Level", value: profile?.level || "—" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 rounded-2xl p-4 min-h-[76px] flex flex-col justify-between">
              <p className="text-xs text-white/40 mb-1 leading-snug">{s.label}</p>
              <p className="text-lg sm:text-xl font-medium text-brand-green">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <div className="rounded-3xl border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-medium">Weekly schedule</h3>
          <p className="text-sm text-gray-400 mb-6">All lectures for the coming week</p>
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : (
            <div className="space-y-4">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <div key={day} className="flex items-start justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <p className="text-xs font-medium text-gray-400 tracking-wide w-24 pt-0.5">{day.toUpperCase()}</p>
                  <div className="flex-1 text-right">
                    {byDay(day).length === 0 ? (
                      <p className="text-sm text-gray-400">No classes</p>
                    ) : (
                      byDay(day).map((c) => (
                        <p key={c.id} className="text-sm">
                          {c.courses.code} · {c.start_time}–{c.end_time} · {c.location}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 p-6 sm:p-8">
          <h3 className="text-lg font-medium">Upcoming deadlines</h3>
          <p className="text-sm text-gray-400 mb-6">Next 4 assignments</p>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-gray-400">No upcoming deadlines</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssignmentsView() {
  return (
    <div className="rounded-3xl border border-gray-100 p-10 sm:p-16 flex flex-col items-center text-center">
      <IconClipboardList size={32} className="text-gray-200 mb-4" strokeWidth={1.5} />
      <p className="text-gray-400">No assignments yet</p>
    </div>
  );
}

function AttendanceView({ profile }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.level) return;
    supabase
      .from("classes")
      .select("*, courses!inner(code, title, level)")
      .eq("courses.level", profile.level)
      .then(({ data }) => {
        setClasses(data || []);
        setLoading(false);
      });
  }, [profile]);

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  if (classes.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 p-10 sm:p-16 flex flex-col items-center text-center">
        <IconCalendarCheck size={32} className="text-gray-200 mb-4" strokeWidth={1.5} />
        <p className="text-gray-400">No classes to check into yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {classes.map((c) => (
        <div key={c.id} className="rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="text-sm font-medium">{c.courses.code} - {c.courses.title}</p>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <IconMapPin size={13} /> {c.location}
            </span>
          </div>
          <AttendanceCheckIn classId={c.id} />
        </div>
      ))}
    </div>
  );
}

function ComplaintForm() {
  return (
    <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
      <div className="rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg font-medium">Submit a complaint</h2>
          <p className="text-sm text-gray-400">Send an official message to a lecturer</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2">Lecturer</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option value="">Select lecturer</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Course (optional)</label>
            <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
              <option value="">Select course</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Subject</label>
          <input className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Short summary" />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Message</label>
          <textarea
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-32"
            placeholder="Describe your concern..."
          />
        </div>

        <button className="bg-brand-green text-white rounded-full px-6 py-3 text-sm font-medium hover:bg-brand-greenDark transition">
          Send complaint
        </button>
      </div>

      <div className="rounded-3xl border border-gray-100 p-6 sm:p-8">
        <h2 className="text-lg font-medium">My complaints</h2>
        <p className="text-sm text-gray-400 mb-6">Recent submissions and their status</p>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <IconMessageCircle size={28} className="text-gray-200 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-gray-400">Nothing submitted yet</p>
        </div>
      </div>
    </div>
  );
}

function NewsView() {
  return (
    <div className="rounded-3xl border border-gray-100 p-10 sm:p-16 flex flex-col items-center text-center">
      <IconNews size={32} className="text-gray-200 mb-4" strokeWidth={1.5} />
      <p className="text-gray-400">No news yet</p>
    </div>
  );
}