// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconUsers, IconMapPin, IconSpeakerphone, IconLogout } from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import UsersPanel from "../components/dashboard/UsersPanel";
import LocationsPanel from "../components/dashboard/LocationsPanel";
import AnnouncementsPanel from "../components/dashboard/AnnouncementsPanel";
import MobileNav from "../components/dashboard/MobileNav";
import oouCrest from "../assets/oou-crest.jpg";

const TABS = [
  { key: "users", label: "Users", icon: IconUsers },
  { key: "locations", label: "Locations", icon: IconMapPin },
  { key: "announcements", label: "Announcements", icon: IconSpeakerphone },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [active, setActive] = useState("users");

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <MobileNav tabs={TABS} active={active} setActive={setActive} profile={profile} portalLabel="Admin portal" />

      <aside className="w-72 border-r border-gray-100 px-6 py-8 hidden lg:flex lg:flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src={oouCrest} alt="OOU crest" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="font-medium text-sm">OOU CompEng</p>
              <p className="text-xs text-gray-400">Admin portal</p>
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
          <h1 className="text-2xl font-medium">Admin Dashboard</h1>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial="hidden" animate="show" exit="exit" variants={fadeUp}>
            {active === "users" && <UsersPanel />}
            {active === "locations" && <LocationsPanel />}
            {active === "announcements" && <AnnouncementsPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}