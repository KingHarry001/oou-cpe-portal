// src/components/dashboard/DashboardLayout.jsx
import { motion } from "framer-motion";
import { IconLogout } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import MobileNav from "./MobileNav";
import TabNav from "./TabNav";
import oouCrest from "../../assets/oou-crest.jpg";

// Shared shell for every role dashboard: mobile nav, desktop sidebar (crest,
// tab nav, profile footer with sign-out) and the animated content area. Each
// page supplies its tabs, active-tab state, labels and the active panel as
// children.
export default function DashboardLayout({ tabs, active, setActive, portalLabel, title, children }) {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <MobileNav tabs={tabs} active={active} setActive={setActive} portalLabel={portalLabel} />

      <aside className="w-72 border-r border-gray-100 px-6 py-8 hidden lg:flex lg:flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <img src={oouCrest} alt="OOU crest" className="h-10 w-10 object-contain" />
            <div className="leading-tight">
              <p className="font-medium text-sm">OOU CompEng</p>
              <p className="text-xs text-gray-400">{portalLabel}</p>
            </div>
          </div>

          <TabNav tabs={tabs} active={active} onSelect={setActive} />
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
          <h1 className="text-2xl font-medium">{title}</h1>
        </header>

        {/* Keyed remount + enter-only animation: swapping panels must not
            depend on an exit animation completing (AnimatePresence mode="wait"
            can stall in production builds and freeze the active panel). */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
