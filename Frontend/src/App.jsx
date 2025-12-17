import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Schedule from "./Components/Schedule";
import User from "./Components/User";
import Setting from "./Components/Setting";
import ChatHome from "./pages/user/ChatHome";
import ProtectedAdmin from "./auth/ProtectedAdmin";
import ProtectedUser from "./auth/ProtectedUser";
import Dashboard from "./Components/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Admin routes */}
      <Route
        path="/admin/*"
        element={
          <ProtectedAdmin>
            <AdminLayout />
          </ProtectedAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="users" element={<User />} />
        <Route path="settings" element={<Setting />} />
        {/* <Route path="dashboards" element={<Dashboard />} /> */}
      </Route>

      {/* User routes */}
      <Route
        path="/user/chat"
        element={
          <ProtectedUser>
            <ChatHome />
          </ProtectedUser>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
