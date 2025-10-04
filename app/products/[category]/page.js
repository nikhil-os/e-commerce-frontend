"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "../../components/Layout";
import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function ProductsByCategoryPage() {
  const params = useParams();
  const category = params?.category;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAuth();
  const toast = useToast();

  // Fallback products in case API fails
  const fallbackProducts = [
    {
      _id: "p1",
      name: "Stylish T-Shirt",
      price: 999,
      image: "https://via.placeholder.com/300x200?text=T-Shirt",
      description: "Comfortable and stylish t-shirt for everyday wear",
    },
    {
      _id: "p2",
      name: "Designer Jeans",
      price: 2499,
      image: "https://via.placeholder.com/300x200?text=Jeans",
      description: "Premium quality denim jeans",
    },
    {
      _id: "p3",
      name: "Casual Shoes",
      price: 1999,
      image: "https://via.placeholder.com/300x200?text=Shoes",
      description: "Comfortable casual shoes for daily use",
    },
  ];

  const handleAddToCart = async (product, quantity) => {
    try {
      const result = await addToCart(product._id, quantity);
      if (result.success) {
        toast.success(`🛒 Added ${quantity} of ${product.name} to cart`);
      } else {
        toast.error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  useEffect(() => {
    if (!category) return;

    // Try both API endpoints to increase chance of success
    const fetchProducts = async () => {
      try {
        // First try the products API route
        const res = await fetch(
          `https://e-commerce-backend-1-if2s.onrender.com/api/products/category/${category}`
        );
        const data = await res.json();
        setProducts(data.products || []);
        setLoading(false);
      } catch (err1) {
        try {
          // If that fails, try the categories API route
          const res = await fetch(
            `https://e-commerce-backend-1-if2s.onrender.com/api/categories/${category}`
          );
          const data = await res.json();
          setProducts(data.products || []);
          setLoading(false);
        } catch (err2) {
          // If both fail, use fallback data
          console.error("Error fetching products:", err1, err2);
          setProducts(fallbackProducts);
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <Layout>
      <section className="relative min-h-screen px-4 py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-white capitalize">
              {category} Collection
            </h1>
            <p className="text-[#C9BBF7] max-w-2xl mx-auto">
              Discover our collection of {category} products, carefully selected
              for quality and style.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-white">Loading products...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center backdrop-blur-xl bg-white/5 rounded-2xl">
              <p className="text-white">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
