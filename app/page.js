"use client";

import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch with timeout
    setTimeout(() => {
      // Sample products data
      const sampleProducts = [
        {
          _id: "1",
          name: "Elegant Summer Dress",
          price: 2499,
          discount: 15,
          description: "Perfect for summer outings",
          category: "Women's Clothing",
          image:
            "https://i.pinimg.com/736x/98/b2/93/98b2939c723b0dd7284e63378bb65ee6.jpg",
        },
        {
          _id: "2",
          name: "Classic Denim Jacket",
          price: 3299,
          discount: 10,
          description: "Timeless style for all seasons",
          category: "Men's Fashion",
          image:
            "https://i.pinimg.com/736x/82/48/ab/8248abc28ceab53fecca5d00b1f7986e.jpg",
        },
        {
          _id: "3",
          name: "Designer Handbag",
          price: 4999,
          discount: 5,
          description: "Elegant accessory for any occasion",
          category: "Accessories",
          image:
            "https://i.pinimg.com/736x/9b/a7/ec/9ba7ec043aecef2f1fc3e2525ee00066.jpg",
        },
        {
          _id: "4",
          name: "Premium Leather Shoes",
          price: 3599,
          discount: 20,
          description: "Handcrafted for comfort and style",
          category: "Footwear",
          image:
            "https://i.pinimg.com/736x/83/24/e4/8324e4aa41326c46276416dca10b9677.jpg",
        },
      ];

      setProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const { addToCart, fetchCartData } = useAuth();

  const handleAddToCart = async (product, quantity) => {
    try {
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
      <Loader visible={loading} />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden ">
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
          <div className="absolute top-40 left-1/3 w-4 h-4 rounded-full bg-[#FFFFFF] opacity-60 animate-pulse"></div>
          <div className="absolute top-60 right-1/4 w-2 h-2 rounded-full bg-[#FFFFFF] opacity-60 animate-pulse"></div>
          <div className="absolute bottom-40 left-1/4 w-3 h-3 rounded-full bg-[#FFFFFF] opacity-60 animate-pulse"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="mb-6">
                Discover Stellar <br />
                <span className="text-[#8D7DFA]">Premium Products</span>
              </h1>
              <p className="text-xl text-[#C9BBF7] mb-8 max-w-lg">
                Explore our universe of high-quality items, curated across
                galaxies just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/products" className="btn btn-primary">
                  <span className="mr-2">🔭</span> Explore Collection
                </Link>
                <Link href="/categories" className="btn btn-secondary">
                  <span className="mr-2">🌠</span> Browse Categories
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#8D7DFA] opacity-20 blur-xl rounded-full"></div>
                <img
                  src="https://i.pinimg.com/736x/a9/31/33/a93133a28f7aa1346c34a2cbcd8a5312.jpg"
                  alt="Hero Image"
                  className="relative rounded-2xl shadow-xl w-full object-cover h-[400px] z-10"
                />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C9BBF7] bg-opacity-20 backdrop-blur-md rounded-2xl rotate-12 border border-white border-opacity-20 floating z-0"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-[#8D7DFA] bg-opacity-20 backdrop-blur-md rounded-full border border-white border-opacity-20 floating z-0"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 min-h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="mb-2">Featured Products</h2>
                <p className="text-[#C9BBF7]">
                  Handpicked cosmic treasures for your collection
                </p>
              </div>
              <Link href="/products" className="btn btn-secondary">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="text-center mb-12">
              <h2 className="mb-4">Explore Categories</h2>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                Discover our carefully curated collections across different
                cosmic realms
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Card 1 */}
              <Link href="/categories/womens">
                <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group">
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      👗
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Women's Fashion
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Elegant styles for every occasion
                  </p>
                </div>
              </Link>
              {/* ...other category cards... */}
              <Link href="/categories/mens">
                <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group">
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      👔
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Men's Collection
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Contemporary styles for men
                  </p>
                </div>
              </Link>
              <Link href="/categories/accessories">
                <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group">
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      👜
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Accessories
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Complete your look with style
                  </p>
                </div>
              </Link>
              <Link href="/categories/footwear">
                <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group">
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      👟
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Footwear
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Step into comfort and style
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 min-h-screen flex items-center justify-center">
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="text-center mb-12">
              <h2 className="mb-4">Why Choose Us</h2>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                We offer an out-of-this-world shopping experience with stellar
                benefits
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#C9BBF7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Quality Products
                </h3>
                <p className="text-[#C9BBF7]">
                  We source only the highest quality products from across the
                  universe
                </p>
              </div>
              {/* ...other features... */}
              <div className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#C9BBF7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Fast Delivery
                </h3>
                <p className="text-[#C9BBF7]">
                  Warp-speed shipping to get your products to you quickly
                </p>
              </div>
              <div className="card p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-[#C9BBF7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Secure Payments
                </h3>
                <p className="text-[#C9BBF7]">
                  Your transactions are protected by advanced security protocols
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#8f6690] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#b278a8] opacity-10 blur-3xl"></div>
        </div>

        {/* Foggy Glass Card */}
        <div className="relative z-10 max-w-2xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 flex flex-col items-center gap-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Join Our Cosmic Community
            </h2>
            <p className="text-lg md:text-xl text-[#C9BBF7] max-w-2xl mb-6">
              Subscribe to our newsletter and be the first to receive exclusive
              offers, interstellar product drops, and cosmic updates straight to
              your inbox.
            </p>
            <form className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-[#8D7DFA] text-white font-semibold hover:bg-[#7a6aea] transition duration-300 whitespace-nowrap shadow-lg"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
