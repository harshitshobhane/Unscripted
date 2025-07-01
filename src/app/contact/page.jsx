"use client";
import ContactFormDemo from "../../components/ui/contact-form-demo";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <ContactFormDemo />
      </div>
    </div>
  );
}