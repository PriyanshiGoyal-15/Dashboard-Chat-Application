import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../../Components/Dashboard";
import User from "../../Components/User";
import Setting from "../../Components/Setting";
import Schedule from "../../Components/Schedule";
import AdminLayout from "../../Layout/AdminLayout";

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboards" element={<Dashboard />} />
        <Route path="users" element={<User />} />
        <Route path="settings" element={<Setting />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
