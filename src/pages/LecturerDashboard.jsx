// src/pages/LecturerDashboard.jsx
import { useState } from "react";
import {
  IconChalkboard, IconCalendarCheck, IconClipboardList,
  IconMessageCircle, IconFiles,
} from "@tabler/icons-react";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import ClassesPanel from "../components/dashboard/ClassesPanel";
import AttendancePanel from "../components/dashboard/AttendancePanel";
import AssignmentsPanel from "../components/dashboard/AssignmentsPanel";
import ComplaintsPanel from "../components/dashboard/ComplaintsPanel";
import ResourcesPanel from "../components/dashboard/ResourcesPanel";

const TABS = [
  { key: "classes", label: "My Classes", icon: IconChalkboard },
  { key: "attendance", label: "Attendance", icon: IconCalendarCheck },
  { key: "assignments", label: "Assignments", icon: IconClipboardList },
  { key: "complaints", label: "Complaints", icon: IconMessageCircle },
  { key: "resources", label: "Resources", icon: IconFiles },
];

export default function LecturerDashboard() {
  const [active, setActive] = useState("classes");

  return (
    <DashboardLayout
      tabs={TABS}
      active={active}
      setActive={setActive}
      portalLabel="Lecturer portal"
      title="Lecturer Dashboard"
    >
      {active === "classes" && <ClassesPanel />}
      {active === "attendance" && <AttendancePanel />}
      {active === "assignments" && <AssignmentsPanel />}
      {active === "complaints" && <ComplaintsPanel />}
      {active === "resources" && <ResourcesPanel />}
    </DashboardLayout>
  );
}
