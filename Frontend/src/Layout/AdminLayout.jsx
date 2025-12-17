import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-56 bg-white shadow-lg flex flex-col justify-between fixed h-screen">
        <div>
          <h1 className="text-4xl font-bold p-5">Dash.</h1>
          <hr className="border border-gray-100 mb-9" />

          <ul className="mt-16">
            <li className="hover:bg-blue-200">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-700 font-bold block py-2 px-6 bg-blue-100"
                    : "block py-2 px-6"
                }
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li className="hover:bg-blue-200">
              <NavLink
                to="/admin/schedule"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-700 font-bold block py-2 px-6 bg-blue-100"
                    : "block py-2 px-6"
                }
              >
                📅 Schedule
              </NavLink>
            </li>
            <li className="hover:bg-blue-200">
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-700 font-bold block py-2 px-6 bg-blue-100"
                    : "block py-2 px-6"
                }
              >
                👤 Users
              </NavLink>
            </li>
            <li className="hover:bg-blue-200">
              <NavLink
                to="/admin/settings"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-700 font-bold block py-2 px-6 bg-blue-100"
                    : "block py-2 px-6"
                }
              >
                ⚙️ Settings
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="p-6">
          <ul className="space-y-2">
            <li className="hover:text-teal-800">
              <a href="#">Help</a>
            </li>
            <li className="hover:text-teal-800">
              <a href="#">Contact Us</a>  
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 ml-56 p-6 min-h-screen overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
