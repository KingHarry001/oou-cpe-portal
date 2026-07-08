// src/pages/AdminDashboard.jsx
import { useState } from "react";
import { IconUsers, IconMapPin, IconSpeakerphone } from "@tabler/icons-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import UsersPanel from "../components/dashboard/UsersPanel";
import LocationsPanel from "../components/dashboard/LocationsPanel";
import AnnouncementsPanel from "../components/dashboard/AnnouncementsPanel";

const TABS = [
  { key: "users", label: "Users", icon: IconUsers },
  { key: "locations", label: "Locations", icon: IconMapPin },
  { key: "announcements", label: "Announcements", icon: IconSpeakerphone },
];

export default function AdminDashboard() {
  const [active, setActive] = useState("users");

  return (
    <DashboardLayout
      tabs={TABS}
      active={active}
      setActive={setActive}
      portalLabel="Admin portal"
      title="Admin Dashboard"
    >
      {active === "users" && <UsersPanel />}
      {active === "locations" && <LocationsPanel />}
      {active === "announcements" && <AnnouncementsPanel />}
    </DashboardLayout>
  );
}
