import React, { useEffect, useState } from "react";
import {
  FaUserEdit,
  FaLock,
  FaPalette,
  FaCheckCircle,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Setting() {
  /* ================= THEME ================= */
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  /* ================= PROFILE ================= */
  const [profile, setProfile] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("profile")) || {
        name: "Admin User",
        email: "admin@gmail.com",
      }
    );
  });

  const saveProfile = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    showToast("Profile updated successfully");
  };

  /* ================= PASSWORD ================= */
  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const updatePassword = () => {
    if (!password.current || !password.newPass || !password.confirm) {
      showToast("All fields are required");
      return;
    }
    if (password.newPass !== password.confirm) {
      showToast("Passwords do not match");
      return;
    }
    setPassword({ current: "", newPass: "", confirm: "" });
    showToast("Password updated successfully");
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    showToast("Logged out successfully");
    setTimeout(() => {
      window.location.reload(); // or navigate("/login")
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-extrabold text-black dark:text-white">
            ⚙️ Settings
          </h1>

          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* TOAST */}
        {toast && (
          <div className="fixed top-6 right-6 z-50">
            <div className="flex gap-2 items-center bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg">
              <FaCheckCircle /> {toast}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PROFILE */}
          <Card title="Profile" icon={<FaUserEdit />}>
            <Input
              label="Full Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email Address"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <PrimaryButton text="Save Profile" onClick={saveProfile} />
          </Card>

          {/* SECURITY */}
          <Card title="Security" icon={<FaLock />}>
            <Input
              type="password"
              label="Current Password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
            />
            <Input
              type="password"
              label="New Password"
              value={password.newPass}
              onChange={(e) =>
                setPassword({ ...password, newPass: e.target.value })
              }
            />
            <Input
              type="password"
              label="Confirm Password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
            />
            <PrimaryButton text="Update Password" onClick={updatePassword} />
          </Card>

          {/* APPEARANCE */}
          <Card title="Appearance" icon={<FaPalette />}>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">
                Dark Mode
              </span>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative w-16 h-8 bg-gray-300 dark:bg-indigo-600 rounded-full transition"
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    theme === "dark" ? "translate-x-8" : ""
                  }`}
                />
              </button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Choose a theme that matches your environment
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-xl transition space-y-5">
    <div className="flex gap-2 items-center text-xl font-semibold text-gray-800 dark:text-white border-b pb-2 dark:border-gray-700">
      {icon} {title}
    </div>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300
      dark:border-gray-600 dark:bg-gray-700 dark:text-white
      focus:ring-2 focus:ring-indigo-500 outline-none transition"
    />
  </div>
);

const PrimaryButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition"
  >
    {text}
  </button>
);
