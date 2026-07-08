// src/lib/roles.js
// Single source of truth for role → landing route, so the post-login redirect
// can't drift from the route table in App.jsx.

export const ROLE_HOME = {
  admin: "/admin",
  lecturer: "/lecturer",
  student: "/student",
};

export const roleHome = (role) => ROLE_HOME[role] || "/student";
