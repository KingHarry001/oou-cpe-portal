// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import StudentDashboard from "./pages/StudentDashboard";
import LecturerDashboard from "./pages/LecturerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Banned from "./pages/Banned";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import DevAuthOverride from "./dev/DevAuthOverride";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/banned" element={<Banned />} />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lecturer"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <LecturerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {import.meta.env.DEV && (
          <>
            <Route
              path="/dev/student"
              element={
                <DevAuthOverride role="student">
                  <StudentDashboard />
                </DevAuthOverride>
              }
            />
            <Route
              path="/dev/lecturer"
              element={
                <DevAuthOverride role="lecturer">
                  <LecturerDashboard />
                </DevAuthOverride>
              }
            />
            <Route
              path="/dev/admin"
              element={
                <DevAuthOverride role="admin">
                  <AdminDashboard />
                </DevAuthOverride>
              }
            />
          </>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}