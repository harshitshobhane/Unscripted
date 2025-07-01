"use client";
import { useState } from "react";
import Image from "next/image";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 4000); // Auto-hide success
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 py-12 px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 border border-pink-100">
        <div className="flex flex-col items-center mb-6">
          <Image src="/coding.png" alt="Contact" width={80} height={80} className="mb-2" />
          <h1 className="text-4xl font-extrabold text-pink-700 mb-2 text-center">Contact Us</h1>
          <p className="text-lg text-gray-700 text-center mb-2">Have a question or want to reach out? Fill out the form below!</p>
        </div>
        {submitted && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-700 text-center font-semibold animate-fade-in">Thank you! Your message has been sent.</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-center font-semibold animate-fade-in">{error}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-pink-600 text-white font-bold text-lg shadow-md hover:bg-pink-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Sending...
              </span>
            ) : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}