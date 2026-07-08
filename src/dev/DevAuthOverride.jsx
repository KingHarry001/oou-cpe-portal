// src/dev/DevAuthOverride.jsx
import { AuthContext } from "../context/AuthContext";

const MOCK_PROFILES = {
  student: { id: "dev-student", full_name: "King Harrison", email: "king@oouagoiwoye.edu.ng", role: "student", status: "active", level: "200" },
  lecturer: { id: "dev-lecturer", full_name: "Dr. Adeyemi", email: "adeyemi@oouagoiwoye.edu.ng", role: "lecturer", status: "active" },
  admin: { id: "dev-admin", full_name: "Admin User", email: "admin@oouagoiwoye.edu.ng", role: "admin", status: "active" },
};

export default function DevAuthOverride({ role, children }) {
  const fakeValue = {
    session: { user: { id: MOCK_PROFILES[role].id } },
    profile: MOCK_PROFILES[role],
    loading: false,
  };

  return <AuthContext.Provider value={fakeValue}>{children}</AuthContext.Provider>;
}