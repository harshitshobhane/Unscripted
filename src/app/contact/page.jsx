"use client";
import { useState } from "react";
import { Mail, User, MessageCircle } from "lucide-react";
import styles from "./contactPage.module.css";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubmitted(false);
    const form = e.currentTarget;
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
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to send message");
      }
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h2 className={styles.contactTitle}>Contact Us</h2>
      <p className={styles.contactDesc}>We&apos;d love to hear from you! Fill out the form below and we&apos;ll get back to you soon.</p>
      {submitted && (
        <div className={styles.successMsg}>
          Thank you! Your message has been sent.
        </div>
      )}
      {error && (
        <div className={styles.errorMsg}>
          {error}
        </div>
      )}
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <User className={styles.inputIcon} size={20} />
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Name"
            className={styles.contactInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <Mail className={styles.inputIcon} size={20} />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Email"
            className={styles.contactInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <MessageCircle className={styles.inputIcon} size={20} />
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Message"
            className={styles.contactTextarea}
          />
        </div>
        <button
          className={styles.contactButton}
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}  