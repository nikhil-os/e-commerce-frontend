import React from 'react';
import Layout from '../components/Layout';

export default function AboutPage() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-700 text-lg leading-relaxed">
          Welcome to <span className="font-semibold">Scratch</span> — your ultimate destination for stylish fashion and lifestyle essentials.
          <br /><br />
          We are a passionate team dedicated to bringing you handpicked clothing, accessories, and luxury pieces with a seamless online shopping experience.
          <br /><br />
          From trendsetting looks to timeless classics, every product is chosen to help you express your unique style.
        </p>
      </section>
    </Layout>
  );
} 