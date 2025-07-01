"use client";
import { useState } from "react";
import Image from "next/image";
import ContactFormDemo from "../../components/ui/contact-form-demo";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-lg w-full bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-10 border border-pink-100 dark:border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <Image src="/coding.png" alt="Contact" width={80} height={80} className="mb-2 rounded-full border-4 border-pink-200 dark:border-gray-700" />
            <h1 className="text-4xl font-extrabold text-pink-700 dark:text-pink-400 mb-2 text-center">Contact Us</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-2">Have a question or want to reach out? Fill out the form below!</p>
          </div>
          <ContactFormDemo />
        </div>
      </div>
    </div>
  );
}