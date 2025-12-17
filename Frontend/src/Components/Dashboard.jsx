import React, { useEffect, useState } from "react";
import movieApi from "../api/movieApi";
import { motion } from "framer-motion";
import { FaSignOutAlt } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { io } from "socket.io-client";

/* ================= TOAST ================= */
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.className =
    "fixed top-6 right-6 z-50 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-bounce";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    fetchMovies();
    fetchUsers();

    // SOCKET.IO FOR REAL-TIME TOTAL USERS
    const socket = io(`${import.meta.env.VITE_ADMIN_API}`);
    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("total_users_update", (count) => {
      setTotalUsers(count);
    });

    return () => socket.disconnect();
  }, []);

  const logout = () => {
    localStorage.clear();
    showToast("Logged out successfully");
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const fetchMovies = async () => {
    try {
      const res = await movieApi.get("");
      setMovies(res.data.results.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch total users once on mount
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_ADMIN_API}/users`);
      const data = await res.json();
      setTotalUsers(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const totalMovies = movies.length;

  const avgRating = (
    movies.reduce((a, b) => a + b.vote_average, 0) / totalMovies || 0
  ).toFixed(1);

  const avgPopularity = (
    movies.reduce((a, b) => a + b.popularity, 0) / totalMovies || 0
  ).toFixed(0);

  const totalVotes = movies.reduce((a, b) => a + b.vote_count, 0);

  const ratingTrend = movies.map((m, i) => ({
    name: `Movie ${i + 1}`,
    rating: m.vote_average,
  }));
  const popularityTrend = movies.map((m, i) => ({
    name: `Movie ${i + 1}`,
    popularity: m.popularity,
  }));

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-500">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-8 space-y-12
      bg-linear-to-br from-indigo-100 via-purple-100 to-pink-100
      dark:from-gray-950 dark:via-gray-900 dark:to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-black">🎬 Dashboard</h1>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2 rounded-xl
          bg-red-500 hover:bg-red-600 text-white shadow-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Movies" value={totalMovies} />
        <KpiCard title="Avg Rating" value={avgRating} />
        <KpiCard title="Avg Popularity" value={avgPopularity} />
        <KpiCard title="Total Users" value={totalUsers} /> {/* REAL-TIME */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BAR CHART */}
        <ChartCard title="Popularity Comparison">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={movies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" hide />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="popularity"
                radius={[10, 10, 0, 0]}
                fill="#6366f1"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* LINE CHART */}
        <ChartCard title="Ratings Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ratingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* full width chart */}
      <ChartCard title="Popularity Growth Trend">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={popularityTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="popularity"
              stroke="#ec4899"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </motion.div>
  );
}

// KPI CARD
function KpiCard({ title, value }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.06 }}
      transition={{ type: "spring", stiffness: 180 }}
      className="relative overflow-hidden rounded-3xl p-6 text-center shadow-xl hover:shadow-blue-500/60 transition
      bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500"
    >
      <p className="text-lg font-extrabold uppercase tracking-wide text-white/80">
        {title}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-white">{value}</h2>
    </motion.div>
  );
}

// CHART CARD
function ChartCard({ title, children }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-3xl p-6 bg-white/70 dark:bg-gray-900/70
      backdrop-blur-xl border border-white/30 dark:border-gray-800
      shadow-[0_20px_50px_rgba(0,10,10,0.2)] transition"
    >
      <h2 className="mb-4 text-lg font-semibold text-gray-700 dark:text-white">
        {title}
      </h2>
      {children}
    </motion.div>
  );
}
