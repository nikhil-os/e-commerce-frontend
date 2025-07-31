"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";

export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categorySlug: "",
    image: null,
    imageUrl: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch categories when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/categories", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again.");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((f) => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("categorySlug", form.categorySlug);

    // Handle either file upload or image URL
    if (form.image) {
      formData.append("image", form.image);
    } else if (form.imageUrl) {
      formData.append("imageUrl", form.imageUrl);
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/add-product",
        {
          method: "POST",
          body: formData,
          credentials: "include", // Important for admin authentication
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Product added successfully!");
        // Reset form
        setForm({
          name: "",
          description: "",
          price: "",
          categorySlug: "",
          image: null,
          imageUrl: "",
        });
      } else {
        setError(data.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <main className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">➕ Add New Product</h2>

        {/* Display success message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Display error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label className="block font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Category</label>
            <select
              name="categorySlug"
              value={form.categorySlug}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded"
              required
              disabled={loading && categories.length === 0}
            >
              <option value="">
                {loading && categories.length === 0
                  ? "Loading categories..."
                  : "Select Category"}
              </option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Image (Upload File)
            </label>
            <input
              type="file"
              name="image"
              className="w-full"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Image (URL)</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </form>
      </main>
    </Layout>
  );
}
