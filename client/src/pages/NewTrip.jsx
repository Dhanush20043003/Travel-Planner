// client/src/pages/NewTrip.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function NewTrip() {
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.destination.trim()) {
      setError("Title and destination are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title.trim(),
        destination: form.destination.trim(),
        description: form.description,
        imageUrl: form.imageUrl,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget ? Number(form.budget) : 0,
        travelers: form.travelers ? Number(form.travelers) : 1
      };
      await api.post("/trips", payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Create trip failed", err);
      setError("Failed to create trip. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const imagePreview = form.imageUrl || `https://source.unsplash.com/800x400/?${encodeURIComponent(form.destination || "travel")}`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: preview */}
          <div className="p-6 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white flex flex-col">
            <h2 className="text-2xl font-bold mb-2">Create Trip</h2>
            <p className="text-sm opacity-90 mb-4">Add your trip details and make it beautiful.</p>
            <div className="mt-auto">
              <img src={imagePreview} alt="preview" className="rounded-md shadow w-full h-40 object-cover" />
            </div>
          </div>

          {/* Right: form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input name="title" value={form.title} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" placeholder="Goa Vacation" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Destination</label>
                <input name="destination" value={form.destination} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" placeholder="Goa" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1 w-full border rounded px-3 py-2" placeholder="Short overview..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" placeholder="https://..." />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input name="startDate" value={form.startDate} onChange={handleChange} type="date" className="mt-1 w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input name="endDate" value={form.endDate} onChange={handleChange} type="date" className="mt-1 w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Budget (USD)</label>
                  <input name="budget" value={form.budget} onChange={handleChange} type="number" min="0" className="mt-1 w-full border rounded px-3 py-2" placeholder="1000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Travelers</label>
                  <input name="travelers" value={form.travelers} onChange={handleChange} type="number" min="1" className="mt-1 w-full border rounded px-3 py-2" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => navigate("/dashboard")} className="px-4 py-2 rounded bg-gray-200 mr-3">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-indigo-600 text-white">
                  {loading ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
