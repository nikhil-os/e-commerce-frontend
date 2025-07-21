import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function ProductsByCategoryPage() {
  const router = useRouter();
  const { category } = router.query;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:3000/products/category/${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <Layout>
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{category}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map(prod => (
              <div key={prod._id} className="bg-white p-4 rounded shadow">
                <img src={prod.image} alt={prod.name} className="w-full h-40 object-cover mb-2" />
                <h3 className="text-lg font-semibold">{prod.name}</h3>
                <p className="text-gray-700">₹{prod.price}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found in this category.</p>
          )}
        </div>
      </section>
    </Layout>
  );
} 