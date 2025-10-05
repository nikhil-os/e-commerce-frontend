'use client';

import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function FirebaseOtpPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const handleSendOTP = () => setStep(2);
  const handleVerifyOTP = () => setStep(3);
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="mb-4 text-2xl font-bold">
          📱 Phone Number Login (Firebase OTP)
        </h2>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91XXXXXXXXXX"
          className="px-4 py-2 mb-2 border rounded"
        />
        <div id="recaptcha-container"></div>
        <button
          onClick={handleSendOTP}
          className="px-4 py-2 mb-4 text-white bg-blue-500 rounded"
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
              className="px-4 py-2 mb-2 border rounded"
            />
            <button
              onClick={handleVerifyOTP}
              className="px-4 py-2 mb-4 text-white bg-purple-500 rounded"
            >
              Verify & Login
            </button>
          </>
        )}
      </main>
    </Layout>
  );
}
