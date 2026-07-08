// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl font-medium tracking-tight mb-4">404</p>
        <h1 className="text-2xl font-medium mb-3">Page not found</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="inline-block bg-brand-black text-white rounded-full px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
