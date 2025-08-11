// client/src/components/TripCard.jsx
export default function TripCard({ trip }) {
  const image = trip.coverPhoto || `https://source.unsplash.com/600x400/?${encodeURIComponent(trip.destination || 'travel')}`;
  return (
    <div className="rounded-xl overflow-hidden shadow hover:shadow-lg transition">
      <img src={image} alt={trip.title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{trip.title}</h3>
        <p className="text-sm text-gray-500">{trip.destination}</p>
        <p className="text-xs text-gray-400 mt-2">Created: {new Date(trip.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
