// src/components/dashboard/MobileNav.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconMenu2, IconX, IconLogout } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext";
import TabNav from "./TabNav";
import oouCrest from "../../assets/oou-crest.jpg";

export default function MobileNav({ tabs, active, setActive, portalLabel }) {
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const selectTab = (key) => {
    setActive(key);
    setOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={oouCrest} alt="OOU crest" className="h-8 w-8 object-contain" />
          <div className="leading-tight">
            <p className="font-medium text-sm">OOU CompEng</p>
            <p className="text-[11px] text-gray-400">{portalLabel}</p>
          </div>
        </div>
        <button onClick={() => setOpen(true)} className="text-gray-500 p-1">
          <IconMenu2 size={22} strokeWidth={1.75} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 right-0 h-full w-72 bg-white z-50 px-6 py-6 flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex justify-end mb-8">
                  <button onClick={() => setOpen(false)} className="text-gray-400 p-1">
                    <IconX size={20} strokeWidth={1.75} />
                  </button>
                </div>
                <TabNav tabs={tabs} active={active} onSelect={selectTab} />
              </div>

              <div className="flex items-center gap-3 px-2 py-3 border-t border-gray-100">
                <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                  {profile?.full_name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profile?.full_name}</p>
                </div>
                <button onClick={signOut} className="text-gray-400 hover:text-gray-700 transition">
                  <IconLogout size={18} strokeWidth={1.75} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
