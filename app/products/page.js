'use client'
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(prod => (
            <div key={prod._id} className="bg-white p-4 rounded shadow">
              <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
              <h3 className="text-lg font-semibold">{prod.name}</h3>
              <p className="text-gray-700">₹{prod.price}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
} 