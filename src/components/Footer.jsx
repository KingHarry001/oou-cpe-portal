// src/components/Footer.jsx
import { Link } from "react-router-dom";
import oouCrest from "../assets/oou-crest.jpg";

const LINK_GROUPS = [
  {
    heading: "Get started",
    links: [
      { label: "Sign in", to: "/signin" },
      { label: "Create account", to: "/signup" },
      { label: "I'm a lecturer", to: "/signup?role=lecturer" },
    ],
  },
  {
    heading: "For students",
    links: [
      { label: "Weekly schedule", to: "/student" },
      { label: "Assignments", to: "/student" },
      { label: "Attendance", to: "/student" },
      { label: "Submit a complaint", to: "/student" },
      { label: "Department news", to: "/student" },
    ],
  },
  {
    heading: "For lecturers",
    links: [
      { label: "Manage classes", to: "/lecturer" },
      { label: "Attendance sessions", to: "/lecturer" },
      { label: "Assignments & grading", to: "/lecturer" },
      { label: "Student complaints", to: "/lecturer" },
      { label: "Course resources", to: "/lecturer" },
    ],
  },
  {
    heading: "For admins",
    links: [
      { label: "Manage users", to: "/admin" },
      { label: "Lecture locations", to: "/admin" },
      { label: "Announcements", to: "/admin" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 pt-16 pb-10 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src={oouCrest} alt="Olabisi Onabanjo University crest" className="h-9 w-9 object-contain" />
              <span className="font-medium text-sm">OOU CompEng</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-[180px]">
              One home for schedules, attendance, assignments and department news.
            </p>
          </div>

          {LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">{group.heading}</p>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-600 hover:text-black transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Olabisi Onabanjo University · Department of Computer Engineering</p>
          <p className="text-center md:text-right">
            SIWES project · 2024/25 session · Built by the frontend team
          </p>
        </div>
      </div>
    </footer>
  );
}