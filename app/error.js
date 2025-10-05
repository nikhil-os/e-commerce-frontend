'use client';

import React from 'react';
import Link from 'next/link';
import Layout from './components/Layout';

export default function ErrorPage({ error }) {
  return (
    <Layout>
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          ❌ Oops! Something went wrong
        </h1>
        <p className="text-lg text-gray-700">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </Layout>
  );
}
