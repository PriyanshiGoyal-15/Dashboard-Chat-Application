import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../reduxTKL/authThunks";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    dispatch(signupUser(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        navigate("/login"); // redirect to login after signup
      }
    });
  };

  return (
    <div className="h-screen flex items-center justify-center mx-auto">
      <div className="w-96 p-2 bg-white shadow-2xl rounded-2xl border border-gray-300">
        <div className="text-center mb-6">
          <h1 className="font-bold text-3xl text-gray-800">Create Account</h1>
          <p className="text-gray-500 text-sm">Join us and get started!</p>
        </div>

        <form className="m-5 p-5" onSubmit={handleSignup}>
          <div>
            <label className="font-semibold text-gray-700">Name</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="mt-6">
            <label className="font-semibold text-gray-700">Email</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="mt-6">
            <label className="font-semibold text-gray-700">Phone</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded"
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mt-6">
            <label className="font-semibold text-gray-700">Password</label>
            <input
              className="w-full border border-gray-200 mt-1 px-4 py-2 rounded"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white py-2 mt-5 rounded-lg font-semibold"
          >
            {loading ? "Creating..." : "Signup"}
          </button>

          {error && <p className="text-red-500 text-center mt-3">{error}</p>}
        </form>

        <p className="text-center pb-5 text-sm">
          Already have an account?
          <Link to="/login" className="font-bold text-blue-500 ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
