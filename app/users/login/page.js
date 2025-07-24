"use client"; 
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
        credentials: 'include' // Important for cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      console.log('Login successful:', data);
      // Redirect to home page or dashboard
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-md w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">Sign In to CosmicShop</h1>
            <p className="text-[#C9BBF7] text-center mb-8">Welcome back, cosmic traveler! Enter your credentials to access your account.</p>
            {error && <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg mb-4 text-center">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="email" type="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} required />
              <input name="password" type="password" placeholder="Password" className="input" value={form.password} onChange={handleChange} required />
              <button 
                type="submit" 
                className="btn btn-primary w-full flex justify-center items-center"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
            </form>
            <p className="text-center text-sm mt-4 text-[#C9BBF7]">
              <Link href="/users/forgot-password" className="hover:underline">Forgot Password?</Link>
            </p>
            <p className="mt-4 text-center text-sm text-[#C9BBF7]">
              Don't have an account?
              <Link href="/users/signup" className="text-[#8D7DFA] hover:underline font-semibold ml-1">Signup here</Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 