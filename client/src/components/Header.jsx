import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">TP</span>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              Travel Planner
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 font-medium hover:text-indigo-600 transition"
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition shadow"
                >
                  Logout
                </button>
              </>
            )}
            {!user && (
              <>
                <Link
                  to="/"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition shadow"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition shadow"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
