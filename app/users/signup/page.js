"use client";
import React, { useState } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
// import { auth } from '@/firebase/config'; // Import auth from your config
import { auth } from "../../firebase/config";

import Layout from "../../components/Layout";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    phone: "",
    otp: "",
    password: "",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateRecaptcha = () => {
    // Ensure this runs only on the client
    if (typeof window !== "undefined" && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
          },
        }
      );
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
      console.error("OTP verification failed:", error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!verified) {
      alert("Please verify your phone number first.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
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
            <h1 className="mb-4 text-3xl font-bold text-center text-white">
              Create Your Cosmic Account
            </h1>
            <p className="text-[#C9BBF7] text-center mb-8">
              Join the cosmic community and unlock stellar shopping experiences!
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullname"
                type="text"
                placeholder="Full Name"
                className="input"
                value={form.fullname}
                onChange={handleChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-2">
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone (+91...)"
                  className="flex-1 input"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={otpSent}
                />
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="px-4 btn btn-secondary"
                  disabled={otpSent || loading}
                >
                  {otpSent ? "Resend" : "Send OTP"}
                </button>
                {verified && (
                  <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                    ✅ Verified
                  </span>
                )}
              </div>
              {otpSent && !verified ? (
                <div className="flex gap-2 mt-2">
                  <input
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="flex-1 input"
                    value={form.otp}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOTP}
                    className="px-4 btn btn-accent"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              ) : null}
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input w-full"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={!verified || loading}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-[#C9BBF7]">
              Already have an account?
              <Link
                href="/users/login"
                className="text-[#8D7DFA] hover:underline font-semibold ml-1"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
