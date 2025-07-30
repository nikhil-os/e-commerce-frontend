"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAuth();

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product, quantity) => {
    try {
      console.log("Product being added:", product);

      if (!product || !product._id) {
        alert("Invalid product data");
        return;
      }

      const result = await addToCart(product._id, quantity);
      if (result.success) {
        alert(`Added ${quantity} of ${product.name} to cart`);
      } else {
        alert(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <Layout>
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((prod) => (
            <ProductCard
              key={prod._id}
              product={prod}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </Layout>
  );
}
