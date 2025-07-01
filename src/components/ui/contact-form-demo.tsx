"use client";
import React, { useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { cn } from "../../lib/utils";

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
    <div className="shadow-input mx-auto w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-2">
        Contact Us
      </h2>
      <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300">
        We'd love to hear from you! Fill out the form below and we'll get back to you soon.
      </p>
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
      <form className="space-y-4" onSubmit={handleSubmit}>
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
            className="shadow-input flex w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600"
          />
        </LabelInputContainer>
        <button
          className="w-full py-2 rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow transition hover:from-pink-600 hover:to-purple-600 dark:bg-zinc-800"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
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