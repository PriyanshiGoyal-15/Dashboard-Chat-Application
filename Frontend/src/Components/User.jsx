import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSignOutAlt, FaUserShield, FaUser } from "react-icons/fa";

/* ================= TOAST ================= */
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.className =
    "fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-bounce";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logout function
  const logout = () => {
    localStorage.clear();
    showToast("Logged out successfully");
    setTimeout(() => {
      window.location.reload(); // or redirect to login page
    }, 1200);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading Users...
      </div>
    );

  if (!users.length)
    return (
      <div className="text-center mt-20 text-gray-500 text-lg">
        No users found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-2xl font-extrabold text-black mb-4 md:mb-0">
          👥Users
        </h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition transform hover:scale-105 hover:shadow-xl"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      {/* ================= USER CARDS GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
        {users.map((user) => (
          <div
            key={user._id}
            className="relative overflow-hidden rounded-3xl p-6 bg-white/70 backdrop-blur-md shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-200 mt-15"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <div
                className={`p-2 rounded-full ${
                  user.isAdmin
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {user.isAdmin ? <FaUserShield /> : <FaUser />}
              </div>
            </div>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Phone:</span> {user.phone}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Role:</span>{" "}
              {user.isAdmin ? "Admin" : "User"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default User;
