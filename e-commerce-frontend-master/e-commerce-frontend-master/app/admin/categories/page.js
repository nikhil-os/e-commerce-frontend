"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`);
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Set up form for editing
  const handleEdit = (category) => {
    setEditingCategory(category._id);
    setName(category.name);
    setDescription(category.description || "");
    setImagePreview(category.imageUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      if (selectedImage) {
        formData.append("categoryImage", selectedImage);
      }

  let url = `${process.env.NEXT_PUBLIC_API_URL}/api/categories`;
      let method = "POST";

      // If editing, use PUT request
      if (editingCategory) {
        url = `${url}/${editingCategory}`;
        method = "PUT";
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in as an admin");
        setSubmitLoading(false);
        return;
      }

      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(
          `Category ${editingCategory ? "updated" : "created"} successfully!`
        );
        // Reset form
        setName("");
        setDescription("");
        setSelectedImage(null);
        setImagePreview(null);
        setEditingCategory(null);

        // Refresh categories list
        fetchCategories();
      } else {
        setError(
          data.message ||
            `Failed to ${editingCategory ? "update" : "create"} category`
        );
      }
    } catch (err) {
      console.error("Error submitting category:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl p-6 mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Manage Categories</h1>
          <Link
            href="/admin"
            className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700"
          >
            Back to Admin
          </Link>
        </div>

        {/* Category Form */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>

          {submitMessage && (
            <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded">
              {submitMessage}
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-1 text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label htmlFor="image" className="block mb-1 text-sm font-medium">
                Category Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-32 h-32 border border-gray-300 rounded"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-purple-600 rounded hover:bg-purple-700 disabled:bg-gray-400"
                disabled={submitLoading}
              >
                {submitLoading
                  ? "Processing..."
                  : editingCategory
                  ? "Update Category"
                  : "Add Category"}
              </button>

              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setName("");
                    setDescription("");
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories List */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-semibold">Existing Categories</h2>

          {loading ? (
            <p>Loading categories...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Slug</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-t border-gray-200">
                      <td className="p-2">
                        {category.imageUrl ? (
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="object-cover w-12 h-12 rounded"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 text-sm text-gray-500 bg-gray-100 rounded">
                            No image
                          </div>
                        )}
                      </td>
                      <td className="p-2">{category.name}</td>
                      <td className="p-2">{category.slug}</td>
                      <td className="p-2">{category.description || "-"}</td>
                      <td className="p-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="px-3 py-1 mr-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
