"use client";
import React, { useState } from "react";
import Layout from "../components/Layout";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement form submission logic (API call)
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-3xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 flex flex-col md:flex-row gap-10">
            {/* Contact Info */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-center mb-8 md:mb-0">
              <h1 className="mb-4">Contact Us</h1>
              <p className="text-[#C9BBF7] mb-4 text-center md:text-left">
                Have a question, feedback, or just want to say hello? Our cosmic
                team is here to help!
              </p>
              <div className="space-y-2 text-[#C9BBF7] text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-[#8D7DFA] flex items-center justify-center text-white">
                    📧
                  </span>
                  <span>support@SCRATCH.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-[#8D7DFA] flex items-center justify-center text-white">
                    📞
                  </span>
                  <span>+91 123-456-7890</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-[#8D7DFA] flex items-center justify-center text-white">
                    📍
                  </span>
                  <span>Mumbai, India</span>
                </div>
              </div>
            </div>
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                className="input"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                required
                className="input"
                value={form.email}
                onChange={handleChange}
              />
              <textarea
                name="message"
                rows="1"
                placeholder="Your Message"
                required
                className="input"
                value={form.message}
                onChange={handleChange}
              ></textarea>
              <button type="submit" className="btn btn-primary w-full">
                Send Message
              </button>
              {submitted && (
                <div className="text-center text-green-400 font-semibold mt-2">
                  Thank you for your message!
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
