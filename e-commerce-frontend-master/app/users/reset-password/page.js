"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault(); /* Implement reset logic */
  };
  return (
    <Layout>
      <main className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="email" value={form.email} />
          <input
            name="otp"
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded text-black"
            value={form.otp}
            onChange={handleChange}
          />
          <input
            name="newPassword"
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border rounded text-black"
            value={form.newPassword}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Reset Password
          </button>
        </form>
      </main>
    </Layout>
  );
}
