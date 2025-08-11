// client/src/components/CreateTripModal.jsx
import { useState } from 'react';
import api from '../api/axios';

export default function CreateTripModal({ onCreated }) {
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  async function uploadFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const res = await api.post('/upload', { image: reader.result });
          resolve(res.data.url);
        } catch (e) { reject(e); }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let url = null;
      if (file) url = await uploadFile(file);
      await api.post('/trips', { title, destination, coverPhoto: url });
      setTitle(''); setDestination(''); setFile(null);
      onCreated && onCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-3">
      <input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Trip title" className="w-full p-2 border rounded" />
      <input value={destination} onChange={e=>setDestination(e.target.value)} required placeholder="Destination" className="w-full p-2 border rounded" />
      <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
          {loading ? 'Saving...' : 'Save Trip'}
        </button>
      </div>
    </form>
  );
}
