import React, { useState } from 'react';
import Layout from '../components/Layout';

const methods = ['cod', 'gpay', 'phonepe', 'slice'];

export default function PaymentPage() {
  const [selected, setSelected] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Implement payment confirmation logic
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">💳 Choose Payment Method</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {methods.map(method => (
            <label key={method} className="flex items-center space-x-3">
              <input
                type="radio"
                name="method"
                value={method}
                checked={selected === method}
                onChange={() => setSelected(method)}
                required
              />
              <span>{method.toUpperCase()}</span>
            </label>
          ))}
          <div className="mt-6 text-center">
            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 