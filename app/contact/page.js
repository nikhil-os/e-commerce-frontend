"use client"
import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Implement form submission logic (API call)
    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="max-w-3xl mx-auto py-16 px-6">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Contact Us</h1>
        {submitted ? (
          <div className="text-center text-green-600 font-semibold">Thank you for your message!</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 space-y-4">
            <input type="text" name="name" placeholder="Your Name" required className="w-full p-3 border rounded-md" value={form.name} onChange={handleChange} />
            <input type="email" name="email" placeholder="Your Email" required className="w-full p-3 border rounded-md" value={form.email} onChange={handleChange} />
            <textarea name="message" rows="5" placeholder="Your Message" required className="w-full p-3 border rounded-md" value={form.message} onChange={handleChange}></textarea>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Send Message</button>
          </form>
        )}
      </section>
    </Layout>
  );
} 