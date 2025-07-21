import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function SignupPage() {
  // Placeholder: implement Firebase OTP and location logic as needed
  const [form, setForm] = useState({ fullname: '', email: '', phone: '', otp: '', password: '', confirmPassword: '', location: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSendOTP = () => { setOtpSent(true); };
  const handleVerifyOTP = () => { setVerified(true); };
  const handleGetLocation = () => { setForm(f => ({ ...f, location: 'Sample Location' })); };
  const handleSubmit = e => { e.preventDefault(); /* Implement signup logic */ };

  return (
    <Layout>
      <main className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full max-w-2xl p-8">
          <h2 className="text-2xl font-bold text-center mb-6 text-black dark:text-white">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="fullname" type="text" placeholder="Full Name" className="w-full px-4 py-2 border rounded-md text-black" value={form.fullname} onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email" className="w-full px-4 py-2 border rounded-md text-black" value={form.email} onChange={handleChange} required />
            <div className="flex items-center gap-2">
              <input name="phone" type="text" placeholder="Phone (+91...)" className="flex-1 px-4 py-2 border rounded-md text-black" value={form.phone} onChange={handleChange} required />
              <button type="button" onClick={handleSendOTP} className="bg-yellow-500 text-white px-4 rounded hover:bg-yellow-600">Send OTP</button>
              {verified && <span className="text-green-600 font-medium text-sm flex items-center gap-1">✅ Verified</span>}
            </div>
            {otpSent && !verified && (
              <div className="flex gap-2 mt-2">
                <input name="otp" type="text" placeholder="Enter OTP" className="flex-1 px-4 py-2 border rounded-md text-black" value={form.otp} onChange={handleChange} />
                <button type="button" onClick={handleVerifyOTP} className="bg-purple-500 text-white px-4 rounded hover:bg-purple-600">Verify OTP</button>
              </div>
            )}
            <input name="password" type="password" placeholder="Password" className="w-full px-4 py-2 border rounded-md text-black" value={form.password} onChange={handleChange} required />
            <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full px-4 py-2 border rounded-md text-black" value={form.confirmPassword} onChange={handleChange} required />
            <input name="location" type="text" placeholder="Fetching Location..." className="w-full px-4 py-2 border rounded-md text-black" value={form.location} readOnly />
            <button type="button" onClick={handleGetLocation} className="text-sm text-blue-500 underline">📍 Refresh Location</button>
            <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Signup</button>
          </form>
        </div>
      </main>
    </Layout>
  );
} 