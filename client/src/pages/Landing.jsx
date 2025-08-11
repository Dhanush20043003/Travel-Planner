// client/src/pages/Landing.jsx
import { Link } from 'react-router-dom';

export default function Landing(){
  return (
    <div className="min-h-screen bg-hero-gradient text-white">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-10">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Plan beautiful trips — effortlessly</h1>
          <p className="mb-6 text-lg max-w-xl">Create itineraries, track expenses, collaborate with friends, and share memories.</p>
          <Link to="/register" className="inline-block bg-white text-indigo-600 px-6 py-3 rounded font-semibold">Get Started</Link>
        </div>
        <div className="md:w-1/2">
          <img src="https://source.unsplash.com/800x600/?travel,beach" alt="hero" className="rounded-lg shadow-xl w-full"/>
        </div>
      </div>
    </div>
  );
}
