// client/src/pages/EditTrip.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchTrip() {
    try {
      const res = await api.get(`/trips/${id}`);
      const t = res.data;
      setTitle(t.title || "");
      setDestination(t.destination || "");
      setImageUrl(t.imageUrl || t.image || "");
      setDescription(t.description || "");
    } catch (err) {
      console.error("Failed to load trip", err);
      alert("Failed to load trip");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      await api.put(`/trips/${id}`, { title, destination, imageUrl, description });
      navigate(`/trip/${id}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update trip");
    }
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Trip</h1>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Destination</label>
            <input value={destination} onChange={(e) => setDestination(e.target.value)} required className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="w-full border px-3 py-2 rounded" />
            {imageUrl && <img src={imageUrl} alt="preview" className="mt-3 w-full h-48 object-cover rounded" />}
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full border px-3 py-2 rounded" />
          </div>

          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
