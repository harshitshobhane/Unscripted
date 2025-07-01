"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-10 border border-purple-100">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4 text-center">About Unscripted</h1>
        <p className="text-lg text-gray-700 text-center mb-2">
          <span className="font-semibold text-purple-500">Unscripted</span> is a space for authentic stories, fresh perspectives, and creative ideas.
        </p>
        <p className="text-md text-gray-500 text-center">
          Our mission is to inspire, inform, and connect through genuine content and community. Join us as we celebrate the beauty of unscripted moments and voices.
        </p>
      </div>
    </div>
  );
} 