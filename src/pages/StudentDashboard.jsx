// src/pages/StudentDashboard.jsx
import { useState } from "react";
import {
  IconLayoutGrid, IconClipboardList, IconCalendarCheck, IconMessageCircle,
  IconNews, IconMapPin,
} from "@tabler/icons-react";
import { useAuth } from "../context/AuthContext";
import { useStudentSchedule } from "../hooks/useStudentSchedule";
import { useStudentAssignments } from "../hooks/useStudentAssignments";
import { useNews } from "../hooks/useNews";
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
  // attendance tabs doesn't refetch the same list each time.
  const { classes, loading } = useStudentSchedule(profile?.level);
  const { assignments, loading: assignmentsLoading } = useStudentAssignments(profile?.level);

  return (
    <DashboardLayout
      tabs={TABS}
      active={active}
      setActive={setActive}
      portalLabel="Department portal"
      title="Student Dashboard"
    >
      {active === "overview" && <WeeklyOverview profile={profile} classes={classes} loading={loading} assignments={assignments} />}
      {active === "assignments" && <AssignmentsView assignments={assignments} loading={assignmentsLoading} />}
      {active === "attendance" && <AttendanceView classes={classes} loading={loading} />}
      {active === "complaint" && <ComplaintForm />}
      {active === "news" && <NewsView />}
    </DashboardLayout>
  );
}

function WeeklyOverview({ profile, classes, loading, assignments }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const byDay = (day) => classes.filter((c) => c.day === day);
  const pending = assignments.filter((a) => !a.deadline || new Date(a.deadline) >= new Date());
  const upcoming = pending.slice(0, 4);

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
            { label: "Pending assignments", value: String(pending.length) },
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
          {upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-gray-400">No upcoming deadlines</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((a) => (
                <li key={a.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium">{a.courses.code} · {a.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Due {a.deadline ? new Date(a.deadline).toLocaleDateString([], { month: "short", day: "numeric" }) : "—"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function AssignmentsView({ assignments, loading }) {
  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  if (assignments.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 p-10 sm:p-16 flex flex-col items-center text-center">
        <IconClipboardList size={32} className="text-gray-200 mb-4" strokeWidth={1.5} />
        <p className="text-gray-400">No assignments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((a) => {
        const overdue = a.deadline && new Date(a.deadline) < new Date();
        return (
          <div key={a.id} className="rounded-3xl border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-brand-greenDark font-medium">{a.courses.code}</p>
                <p className="text-sm font-medium mt-0.5">{a.title}</p>
                {a.description && <p className="text-sm text-gray-500 mt-2 leading-relaxed">{a.description}</p>}
              </div>
              <span
                className={`shrink-0 text-xs px-2.5 py-1 rounded-full font-medium ${
                  overdue ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
                }`}
              >
                {a.deadline
                  ? `${overdue ? "Closed" : "Due"} ${new Date(a.deadline).toLocaleDateString([], { month: "short", day: "numeric" })}`
                  : "No deadline"}
              </span>
            </div>
          </div>
        );
      })}
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
  const { news, loading } = useNews();

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  if (news.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 p-10 sm:p-16 flex flex-col items-center text-center">
        <IconNews size={32} className="text-gray-200 mb-4" strokeWidth={1.5} />
        <p className="text-gray-400">No news yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((n) => (
        <article key={n.id} className="rounded-3xl border border-gray-100 overflow-hidden flex flex-col">
          <div className="aspect-[16/10] bg-gray-100 shrink-0 overflow-hidden">
            {n.image_url ? (
              <img src={n.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <IconNews size={26} className="text-gray-300" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase tracking-wide font-medium text-brand-greenDark bg-brand-green/10 rounded-full px-2 py-0.5">
                {n.type}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(n.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
              </span>
            </div>
            <h3 className="text-base font-medium leading-snug line-clamp-2 min-h-[2.75rem]">{n.title}</h3>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-3 min-h-[3.75rem]">{n.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
