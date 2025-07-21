import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => { e.preventDefault(); /* Implement login logic */ };
  return (
    <Layout>
      <main className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center text-black dark:text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="email" type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black" value={form.email} onChange={handleChange} required />
            <input name="password" type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black" value={form.password} onChange={handleChange} required />
            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Login</button>
          </form>
          <p className="text-center text-sm mt-2">
            <Link href="/users/forgot-password" className="text-red-600 hover:underline">Forgot Password?</Link>
          </p>
          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?
            <Link href="/users/signup" className="text-blue-600 hover:underline font-semibold">Signup here</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
} 