import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: '', phone: '', otp: '', newPassword: '', confirmPassword: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSendOTP = () => setStep(2);
  const handleVerifyOTP = () => setStep(3);
  const handleSubmit = e => { e.preventDefault(); /* Implement password reset logic */ };
  return (
    <Layout>
      <main>
        <div className="mt-10 p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Reset Password via OTP</h2>
          {step === 1 && (
            <div>
              <input name="email" type="email" placeholder="Enter Email" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black" value={form.email} onChange={handleChange} />
              <input name="phone" type="text" placeholder="Enter Phone (+91...)" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black mt-2" value={form.phone} onChange={handleChange} />
              <div id="recaptcha-container"></div>
              <button type="button" onClick={handleSendOTP} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-2">Send OTP</button>
            </div>
          )}
          {step === 2 && (
            <div className="mt-4">
              <input name="otp" type="text" placeholder="Enter OTP" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black" value={form.otp} onChange={handleChange} />
              <button type="button" onClick={handleVerifyOTP} className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600 mt-2">Verify OTP</button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="mt-4">
              <input name="newPassword" type="password" placeholder="New Password" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black" value={form.newPassword} onChange={handleChange} />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 text-black mt-2" value={form.confirmPassword} onChange={handleChange} />
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Reset Password</button>
            </form>
          )}
        </div>
      </main>
    </Layout>
  );
} 