import React from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const { method } = router.query;

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Order Successful!</h2>
        <p className="text-gray-700 text-lg mb-2">Thank you for shopping with us.</p>
        <p className="text-sm text-gray-500">Payment method: {method ? method.toUpperCase() : ''}</p>
        <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600">
          Explore More Products
        </a>
      </div>
    </Layout>
  );
} 