"use client";
import React, { useState } from 'react';
import Layout from '../components/Layout';

export default function CheckoutPage() {
  // Placeholder state for addresses and cart
  const [addresses, setAddresses] = useState([]); // Fetch from API
  const [cart, setCart] = useState([]); // Fetch from API
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [form, setForm] = useState({ fullName: '', mobile: '', street: '', city: '', state: '', zip: '', country: '', isDefault: false });

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    // Implement save address logic (API call)
  };

  const handlePayment = () => {
    // Implement payment logic (API call)
  };

  return (
    <Layout>
      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div id="existing-address-section" className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Select Address</h3>
          {addresses.map((addr, i) => (
            <label key={i} className="block mb-2">
              <input type="radio" name="selectedAddress" value={i} checked={selectedAddress === i} onChange={() => setSelectedAddress(i)} />
              {addr.fullName}, {addr.street}, {addr.city}, {addr.state}, {addr.zip}
            </label>
          ))}
        </div>
      )}
      {/* New Address Form */}
      <form onSubmit={handleFormSubmit} className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">📬 Add New Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" placeholder="John Doe" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.fullName} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input type="text" name="mobile" placeholder="9876543210" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.mobile} onChange={handleFormChange} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
            <input type="text" name="street" placeholder="123 Main St" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.street} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" name="city" placeholder="Mumbai" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.city} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input type="text" name="state" placeholder="Maharashtra" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.state} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
            <input type="text" name="zip" placeholder="400001" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.zip} onChange={handleFormChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input type="text" name="country" placeholder="India" required className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" value={form.country} onChange={handleFormChange} />
          </div>
        </div>
        <div className="flex items-center mt-4">
          <input type="checkbox" name="isDefault" id="isDefault" className="mr-2" checked={form.isDefault} onChange={handleFormChange} />
          <label htmlFor="isDefault" className="text-sm text-gray-700">Make this my default address</label>
        </div>
        <div className="text-right">
          <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
            💾 Save Address
          </button>
        </div>
      </form>
      {/* Bill Summary Section */}
      <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow rounded">
        <h2 className="text-2xl font-bold mb-4">🧾 Bill Summary</h2>
        {cart.map((item, idx) => (
          <div key={idx} className="flex justify-between mb-2">
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p>₹{item.product.price * item.quantity}</p>
          </div>
        ))}
        <hr className="my-3" />
        <p className="text-md">Subtotal: ₹0</p>
        <p className="text-md">Delivery Fee: ₹0</p>
        <p className="text-lg font-bold mt-2">Total: ₹0</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="button"
          onClick={handlePayment}
        >
          Confirm Payment
        </button>
      </div>
    </Layout>
  );
} 