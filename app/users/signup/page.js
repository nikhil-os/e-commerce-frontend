"use client"
import React, { useState } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from '@/firebase/config'; // Import auth from your config
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function SignupPage() {
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', otp: '', password: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generateRecaptcha = () => {
    // Ensure this runs only on the client
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  };

  const handleSendOTP = async () => {
    setLoading(true);
    generateRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    try {
      const result = await signInWithPhoneNumber(auth, form.phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please check the phone number and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) {
      alert("Please send an OTP first.");
      return;
    }
    setLoading(true);
    try {
      await confirmationResult.confirm(form.otp);
      setVerified(true);
      alert("Phone number verified successfully!");
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async e => {
  e.preventDefault();
  if (!verified) {
    alert("Please verify your phone number first.");
    return;
  }
  setLoading(true);
  try {
    const res = await fetch('/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname: form.fullname,
        email: form.email,
        contact: form.phone,
        location: "default location", // or collect this too
        password: form.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Signup successful!");
      console.log(data); // ✅ contains token + user info
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('Signup failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <Layout>
      <div id="recaptcha-container"></div>
      <section className="relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-xl mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <h1 className="mb-4 text-3xl font-bold text-center text-white">Create Your Cosmic Account</h1>
            <p className="text-[#C9BBF7] text-center mb-8">Join the cosmic community and unlock stellar shopping experiences!</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="fullname" type="text" placeholder="Full Name" className="input" value={form.fullname} onChange={handleChange} required />
              <input name="email" type="email" placeholder="Email" className="input" value={form.email} onChange={handleChange} required />
              <div className="flex items-center gap-2">
                <input name="phone" type="tel" placeholder="Phone (+91...)" className="flex-1 input" value={form.phone} onChange={handleChange} required disabled={otpSent} />
                <button type="button" onClick={handleSendOTP} className="px-4 btn btn-secondary" disabled={otpSent || loading}>{otpSent ? 'Resend' : 'Send OTP'}</button>
                {verified && <span className="flex items-center gap-1 text-sm font-medium text-green-400">✅ Verified</span>}
              </div>
              {otpSent && !verified ? (
                <div className="flex gap-2 mt-2">
                  <input name="otp" type="text" placeholder="Enter OTP" className="flex-1 input" value={form.otp} onChange={handleChange} required />
                  <button type="button" onClick={handleVerifyOTP} className="px-4 btn btn-accent" disabled={loading}>{loading ? 'Verifying...' : 'Verify OTP'}</button>
                </div>
              ) : null}
              <input name="password" type="password" placeholder="Password" className="input" value={form.password} onChange={handleChange} required />
              <button type="submit" className="w-full btn btn-primary" disabled={!verified || loading}>{loading ? 'Signing up...' : 'Sign Up'}</button>
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