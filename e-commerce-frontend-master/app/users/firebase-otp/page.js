"use client";
import React, { useState } from "react";
import Layout from "../../components/Layout";

export default function FirebaseOtpPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const handleSendOTP = () => setStep(2);
  const handleVerifyOTP = () => setStep(3);
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">
          📱 Phone Number Login (Firebase OTP)
        </h2>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91XXXXXXXXXX"
          className="mb-2 px-4 py-2 border rounded"
        />
        <div id="recaptcha-container"></div>
        <button
          onClick={handleSendOTP}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Send OTP
        </button>
        {step > 1 && (
          <>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="mb-2 px-4 py-2 border rounded"
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-purple-500 text-white px-4 py-2 rounded mb-4"
            >
              Verify & Login
            </button>
          </>
        )}
      </main>
    </Layout>
  );
}
