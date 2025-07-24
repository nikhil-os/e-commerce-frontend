"use client"
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', otp: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSendOTP = () => setOtpSent(true);
  const handleVerifyOTP = async () => {
    try {
        // Assuming you have an endpoint to verify OTP
        //const response = await fetch('http://localhost:8000/api/auth/verify-otp', { // Adjust URL as needed
        //    method: 'POST',
        //    headers: {
        //        'Content-Type': 'application/json',
        //    },
        //    body: JSON.stringify({ email: form.email, otp: form.otp }),
        //});

        //const data = await response.json();

        //if (response.ok) {
            setVerified(true);
        //} else {
        //    console.error('OTP verification failed:', data.message);
        //    alert('OTP verification failed: ' + data.message); // Show error message to user
        //}
        setVerified(true); //setting true for now.
    } catch (error) {
        console.error('OTP verification error:', error);
        alert('Failed to verify OTP. Please try again.'); // Show error message to user
    }
  }
  const handleSubmit = async e => {
    e.preventDefault();
     try {
          // Implement signup logic, e.g., call your backend API
          alert('Signup logic to be implemented.');
      } catch (error) {
          console.error('Signup error:', error);
          alert('Signup failed. Please try again.'); // Show error message to user
      }
  };

  return (
    <Layout>
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <h1 className="text-3xl font-bold text-white mb-4 text-center">Create Your Cosmic Account</h1>
            <p className="text-[#C9BBF7] text-center mb-8">Join the cosmic community and unlock stellar shopping experiences!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="fullname" type="text" placeholder="Full Name" className="input" value={form.fullname} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} required />
              <div className="flex items-center gap-2">
                <input name="phone" type="text" placeholder="Phone (+91...)" className="flex-1 input" value={form.phone} onChange={handleChange} required />
                <button type="button" onClick={handleSendOTP} className="btn btn-secondary px-4">Send OTP</button>
                {verified && <span className="text-green-400 font-medium text-sm flex items-center gap-1">✅ Verified</span>}
              </div>
              {otpSent && !verified ? (
                <div className="flex gap-2 mt-2">
                  <input name="otp" type="text" placeholder="Enter OTP" className="flex-1 input" value={form.otp} onChange={handleChange} />
                  <button type="button" onClick={handleVerifyOTP} className="btn btn-accent px-4">Verify OTP</button>
                </div>
              ) : null}
              <input name="password" type="password" placeholder="Password" className="input" value={form.password} onChange={handleChange} required />
              <button type="submit" className="btn btn-primary w-full">Sign Up</button>
            </form>
            <p className="mt-4 text-center text-sm text-[#C9BBF7]">
              Already have an account?
              <Link href="/users/login" className="text-[#8D7DFA] hover:underline font-semibold ml-1">Login here</Link>
            </p>
              
          </div>
        </div>
      </section>
    </Layout>
  );
} 