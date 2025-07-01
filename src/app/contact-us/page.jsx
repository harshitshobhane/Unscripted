"use client";
import React, { useState } from "react";
import Image from "next/image";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200));
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <div className="w-full max-w-4xl bg-white/90 dark:bg-zinc-900/90 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Illustration & Info */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-pink-200/60 to-purple-200/60 dark:from-zinc-800/80 dark:to-zinc-900/80">
          <Image src="/coding.png" alt="Contact" width={120} height={120} className="mb-6 rounded-full border-4 border-pink-200 dark:border-gray-700 shadow-lg" />
          <h1 className="text-4xl font-extrabold text-pink-700 dark:text-pink-300 mb-2 text-center">Contact Us</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-4 max-w-xs">
            We'd love to hear from you! Fill out the form and our team will get back to you soon.
          </p>
        </div>
        {/* Right Side: Form */}
        <div className="md:w-1/2 flex flex-col justify-center p-8">
          {submitted && (
            <div className="mb-4 p-3 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-center font-semibold animate-fade-in">
              Thank you! Your message has been sent.
            </div>
          )}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-center font-semibold animate-fade-in">
              {error}
            </div>
          )}
          <form className="space-y-7" onSubmit={handleSubmit}>
            <div className="relative">
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder=" "
                className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder-transparent"
              />
              <label htmlFor="name" className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-pink-600 dark:peer-focus:text-pink-400 bg-white dark:bg-zinc-900 px-1 pointer-events-none">
                Name
              </label>
            </div>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder=" "
                className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder-transparent"
              />
              <label htmlFor="email" className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-pink-600 dark:peer-focus:text-pink-400 bg-white dark:bg-zinc-900 px-1 pointer-events-none">
                Email
              </label>
            </div>
            <div className="relative">
              <textarea
                id="message"
                name="message"
                required
                rows={4}
                placeholder=" "
                className="peer w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition placeholder-transparent resize-none"
              />
              <label htmlFor="message" className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 dark:peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-pink-600 dark:peer-focus:text-pink-400 bg-white dark:bg-zinc-900 px-1 pointer-events-none">
                Message
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 text-lg"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 