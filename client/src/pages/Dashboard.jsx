// client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { FaSuitcase, FaCalendarAlt, FaRunning, FaDollarSign } from "react-icons/fa";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trips");
      setTrips(res.data);
    } catch (err) {
      console.error("fetchTrips", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateSuccess = (newTrip) => {
    setCreateOpen(false);
    setTrips((prev) => [newTrip, ...prev]);
  };

  /* ---- Summary calculations ---- */
  const now = new Date();
  const totalTrips = trips.length;

  const upcomingTrips = trips.filter(
    (t) => t.startDate && new Date(t.startDate) > now
  ).length;

  const activeTrips = trips.filter(
    (t) =>
      t.startDate &&
      t.endDate &&
      new Date(t.startDate) <= now &&
      new Date(t.endDate) >= now
  ).length;

  const totalBudgetUsed = trips.reduce((sum, trip) => {
    const expensesTotal = (trip.expenses || []).reduce(
      (s, e) => s + (Number(e.amount) || 0),
      0
    );
    return sum + expensesTotal;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Travel Planner</h1>
            <div className="text-sm text-gray-500">
              Hello, {user?.name || "Traveler"}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/new-trip")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              New Trip
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
            >
              + Create Trip
            </button>
            {/* ✅ Only one logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* summary cards */}
      <section className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Trips"
          value={totalTrips}
          icon={<FaSuitcase size={24} />}
          gradient="from-blue-500 to-blue-700"
        />
        <SummaryCard
          title="Upcoming"
          value={upcomingTrips}
          icon={<FaCalendarAlt size={24} />}
          gradient="from-green-500 to-green-700"
        />
        <SummaryCard
          title="Active"
          value={activeTrips}
          icon={<FaRunning size={24} />}
          gradient="from-yellow-500 to-yellow-600"
        />
        <SummaryCard
          title="Total Budget Used"
          value={`$${totalBudgetUsed}`}
          icon={<FaDollarSign size={24} />}
          gradient="from-purple-500 to-purple-700"
        />
      </section>

      {/* main */}
      <main className="max-w-7xl mx-auto px-6 pb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Trips</h2>

        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading trips...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No trips yet — create one!</p>
            <button
              onClick={() => setCreateOpen(true)}
              className="px-5 py-2 bg-indigo-600 text-white rounded"
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <article
                key={t._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition"
                onClick={() => navigate(`/trip/${t._id}`)}
              >
                <div className="h-48 w-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      t.imageUrl ||
                      t.image ||
                      `https://source.unsplash.com/800x600/?${encodeURIComponent(
                        t.destination || "travel"
                      )}`
                    }
                    alt={t.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {t.title}
                  </h3>
                  <p className="text-sm text-gray-500">{t.destination}</p>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {t.description || "No description provided."}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-indigo-600 font-medium">
                      View details →
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Create Trip Modal */}
      {createOpen && (
        <CreateTripModal
          onClose={() => setCreateOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}

/* SummaryCard with gradient + icon */
function SummaryCard({ title, value, icon, gradient }) {
  return (
    <div className={`bg-gradient-to-r ${gradient} rounded-lg shadow p-4 text-white flex items-center gap-4`}>
      <div className="bg-white/20 p-3 rounded-full">{icon}</div>
      <div>
        <div className="text-sm opacity-90">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

/* CreateTripModal — same as before */
function CreateTripModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/trips", {
        ...form,
        budget: form.budget ? Number(form.budget) : 0,
      });
      onSuccess(res.data);
    } catch (err) {
      console.error("create trip", err);
      alert(err.response?.data?.message || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create New Trip</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="e.g. Goa Vacation"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                name="destination"
                value={form.destination}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="e.g. Goa, India"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                type="date"
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Budget (USD)
              </label>
              <input
                name="budget"
                value={form.budget}
                onChange={handleChange}
                type="number"
                min="0"
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="e.g. 1000"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Image URL
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                type="url"
                className="mt-1 w-full border rounded px-3 py-2"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="mt-1 w-full border rounded px-3 py-2"
              placeholder="Short description..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 text-white rounded"
            >
              {loading ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
