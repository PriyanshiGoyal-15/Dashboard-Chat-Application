import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../reduxTKL/authThunks.js";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, user, isAdmin } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(loginUser({ email, password }));

      // 🔥 Check if login was successful
      if (res.meta.requestStatus === "fulfilled") {
        console.log("Login Success", res.payload);

        if (isAdmin) {
          navigate("/admin/dashboard");
          return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const storedIsAdmin = JSON.parse(
          localStorage.getItem("isAdmin") || "false"
        );

        if (storedIsAdmin || storedUser?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/chat");
        }
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center mx-auto bg-gray-100">
      <div className="w-96 p-2 h-auto bg-white rounded-2xl shadow-2xl border border-gray-300">
        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-gray-800">Login</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome back! Please enter your details
          </p>
        </div>

        <form className="m-5 p-5" onSubmit={handleLogin}>
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded focus:ring-2 focus:ring-blue-300"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-6">
            <label className="font-semibold text-gray-700">Password</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded focus:ring-2 focus:ring-blue-300"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 mt-5 rounded-lg font-semibold"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        </form>

        <p className="text-center mb-6 text-sm">
          Don't have an account?
          <Link to="/signup" className="font-bold text-blue-500 ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
