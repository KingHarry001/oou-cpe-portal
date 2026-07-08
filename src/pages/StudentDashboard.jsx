// src/pages/StudentDashboard.jsx
import { useState } from "react";
import {
  IconLayoutGrid, IconClipboardList, IconCalendarCheck, IconMessageCircle,
  IconNews, IconMapPin,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { useStudentSchedule } from "../hooks/useStudentSchedule";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AttendanceCheckIn from "../components/dashboard/AttendanceCheckIn";
import GridBackground from "../components/ui/GridBackground";

const TABS = [
  { key: "overview", label: "Weekly Overview", icon: IconLayoutGrid },
  { key: "assignments", label: "Assignments", icon: IconClipboardList },
  { key: "attendance", label: "Attendance", icon: IconCalendarCheck },
  { key: "complaint", label: "Submit Complaint", icon: IconMessageCircle },
  { key: "news", label: "News", icon: IconNews },
];

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [active, setActive] = useState("overview");
  // Fetched once per level here so switching between the overview and
  // attendance tabs doesn't refetch the same class list each time.
  const { classes, loading } = useStudentSchedule(profile?.level);

  return (
    <DashboardLayout
      tabs={TABS}
      active={active}
      setActive={setActive}
      portalLabel="Department portal"
      title="Student Dashboard"
    >
      {active === "overview" && <WeeklyOverview profile={profile} classes={classes} loading={loading} />}
      {active === "assignments" && <AssignmentsView />}
      {active === "attendance" && <AttendanceView classes={classes} loading={loading} />}
      {active === "complaint" && <ComplaintForm />}
      {active === "news" && <NewsView />}
    </DashboardLayout>
  );
}

function WeeklyOverview({ profile, classes, loading }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const byDay = (day) => classes.filter((c) => c.day === day);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="relative bg-brand-black text-white rounded-3xl p-6 sm:p-10 overflow-hidden w-full">
        <GridBackground size={40} />
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
              {WEEKDAYS.map((day) => (
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

function AttendanceView({ classes, loading }) {
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
