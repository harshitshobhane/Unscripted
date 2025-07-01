"use client";
import React, { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";
import Image from "next/image";

export default function ContactFormDemo() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);
    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      message: { value: string };
    };
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
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <Image src="/coding.png" alt="Contact" width={64} height={64} className="mb-4 rounded-full border-4 border-pink-200 dark:border-gray-700" />
        <h2 className="text-3xl font-extrabold text-pink-700 dark:text-pink-400 mb-2 text-center">Contact Us</h2>
        <p className="text-md text-gray-700 dark:text-gray-300 text-center mb-6">We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you soon.</p>
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
        <form className="space-y-5 w-full" onSubmit={handleSubmit}>
          <LabelInputContainer>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Jane Doe" type="text" required />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="jane@example.com" type="email" required />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              placeholder="Type your message..."
              required
              rows={4}
              className="shadow-input flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-pink-600"
            />
          </LabelInputContainer>
          <button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-zinc-900 text-lg"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
} 