"use client";
import React, { useState } from 'react';
import Layout from '../../components/Layout';

export default function AddProductPage() {
  const [form, setForm] = useState({ name: '', description: '', price: '', categorySlug: '', image: null, imageUrl: '' });
  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };
  const handleSubmit = e => { e.preventDefault(); /* Implement add product logic */ };
  return (
    <Layout>
      <main className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block font-medium mb-1">Product Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border px-4 py-2 rounded"></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Price (₹)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border px-4 py-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Category</label>
            <select name="categorySlug" value={form.categorySlug} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
              {/* Map categories from API here */}
              <option value="">Select Category</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Image (Upload File)</label>
            <input type="file" name="image" className="w-full" onChange={handleChange} />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Image (URL)</label>
            <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="w-full border px-4 py-2 rounded" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Product</button>
        </form>
      </main>
    </Layout>
  );
} 