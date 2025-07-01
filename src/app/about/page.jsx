"use client";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-purple-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-10 border border-purple-100 dark:border-purple-900"
      >
        <motion.h1
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
          className="text-4xl font-extrabold text-purple-700 dark:text-purple-300 mb-4 text-center tracking-tight"
        >
          About Unscripted
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-lg text-gray-700 dark:text-gray-200 text-center mb-4"
        >
          <span className="font-semibold text-purple-500 dark:text-purple-300">Unscripted</span> is a vibrant digital space for authentic stories, fresh perspectives, and creative ideas. We believe in the power of real voices and the beauty of unscripted moments.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-xl p-6 my-6 shadow-md border border-purple-200 dark:border-purple-800"
        >
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-200 mb-2 text-center">Our Mission</h2>
          <p className="text-md text-gray-700 dark:text-gray-200 text-center">
            To inspire, inform, and connect people through genuine content and community. We celebrate diversity, encourage curiosity, and foster creativity in every post.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mb-4"
        >
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-1 text-center">What Makes Us Different?</h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 text-center space-y-1">
            <li>Real stories from real people—no scripts, no filters.</li>
            <li>Modern, user-friendly design with a focus on accessibility and beauty.</li>
            <li>Community-driven: your voice matters here.</li>
            <li>Resources for learning, sharing, and growing together.</li>
            <li>Celebrating the journey, not just the destination.</li>
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-300 mb-1 text-center">Our Goal</h3>
          <p className="text-md text-gray-700 dark:text-gray-200 text-center">
            To build a welcoming platform where everyone can share their journey, learn from others, and find inspiration—whether you&apos;re a writer, reader, creator, or explorer.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
} 