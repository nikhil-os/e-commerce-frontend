"use client";

import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";
import { useToast } from "./contexts/ToastContext";
import { useScrollAnimation } from "./hooks/useScrollAnimation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Scroll animation refs
  const [heroRef, heroVisible] = useScrollAnimation({ triggerOnce: false });
  const [productsRef, productsVisible] = useScrollAnimation({
    triggerOnce: false,
  });
  const [categoriesRef, categoriesVisible] = useScrollAnimation({
    triggerOnce: false,
  });
  const [featuresRef, featuresVisible] = useScrollAnimation({
    triggerOnce: false,
  });
  const [ctaRef, ctaVisible] = useScrollAnimation({ triggerOnce: false });

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
        toast.success(`🛒 Added ${quantity} of ${product.name} to cart`);
      } else {
        toast.error(result.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    }
  };

  return (
    <Layout>
      <Loader visible={loading} />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className={`relative py-20 overflow-hidden transition-all duration-1000 ${
          heroVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        {/* Background elements */}
        <div className="absolute inset-0 z-0">
          <div
            className={`absolute top-20 right-10 w-72 h-72 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl transition-all duration-1000 ${
              heroVisible ? "animate-floating" : ""
            }`}
          ></div>
          <div
            className={`absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl transition-all duration-1500 ${
              heroVisible ? "animate-floating" : ""
            }`}
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative z-10 container-custom">
          <div
            className={`flex flex-col-reverse md:flex-row items-center justify-between gap-12 transition-all duration-1000 ${
              heroVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className={`md:w-1/2 text-center md:text-left transition-all duration-1000 delay-300 ${
                heroVisible ? "animate-fadeInLeft" : "opacity-0 -translate-x-8"
              }`}
            >
              <h1 className="mb-6">
                Discover Stellar <br />
                <span className="text-[#8D7DFA]">Premium Products</span>
              </h1>
              <p className="text-xl text-[#C9BBF7] mb-8 max-w-lg">
                Explore our universe of high-quality items, curated across
                galaxies just for you.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center md:justify-start transition-all duration-1000 delay-500 ${
                  heroVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"
                }`}
              >
                <Link
                  href="/products"
                  className="transition-transform duration-300 transform btn btn-primary hover:scale-105"
                >
                  <span className="mr-2">🔭</span> Explore Collection
                </Link>
                <Link
                  href="/categories"
                  className="transition-transform duration-300 transform btn btn-secondary hover:scale-105"
                >
                  <span className="mr-2">🌠</span> Browse Categories
                </Link>
              </div>
            </div>

            <div
              className={`md:w-1/2 relative transition-all duration-1000 delay-700 ${
                heroVisible ? "animate-fadeInRight" : "opacity-0 translate-x-8"
              }`}
            >
              <div className="relative">
                <img
                  src="https://i.pinimg.com/736x/a9/31/33/a93133a28f7aa1346c34a2cbcd8a5312.jpg"
                  alt="Hero Image"
                  className={`relative rounded-2xl shadow-xl w-full object-cover h-[400px] z-10 transition-all duration-1000 ${
                    heroVisible ? "animate-scaleIn" : "opacity-0 scale-90"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section
        ref={productsRef}
        className={`py-16 min-h-screen flex items-center justify-center transition-all duration-1000 ${
          productsVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div
            className={`backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 transition-all duration-1000 ${
              productsVisible ? "animate-slideInUp" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className={`flex items-center justify-between mb-10 transition-all duration-1000 delay-300 ${
                productsVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"
              }`}
            >
              <div>
                <h2 className="mb-2">Featured Products</h2>
                <p className="text-[#C9BBF7]">
                  Handpicked cosmic treasures for your collection
                </p>
              </div>
              <Link
                href="/products"
                className="transition-transform duration-300 transform btn btn-secondary hover:scale-105"
              >
                View All
              </Link>
            </div>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
                productsVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"
              }`}
            >
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
      <section
        ref={categoriesRef}
        className={`py-16 relative overflow-hidden flex items-center justify-center transition-all duration-1000 ${
          categoriesVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div
            className={`backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 transition-all duration-1000 ${
              categoriesVisible
                ? "animate-slideInUp"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className={`text-center mb-12 transition-all duration-1000 delay-300 ${
                categoriesVisible
                  ? "animate-fadeInUp"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="mb-4">Shop by Category</h2>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                Discover our carefully curated collections across different
                cosmic realms
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/categories/womens">
                <div
                  className={`glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group transform ${
                    categoriesVisible ? "animate-scaleIn" : "opacity-0 scale-90"
                  }`}
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                      👗
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Women's Fashion
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Elegant styles for every occasion
                  </p>
                </div>
              </Link>

              <Link href="/categories/mens">
                <div
                  className={`glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group transform ${
                    categoriesVisible ? "animate-scaleIn" : "opacity-0 scale-90"
                  }`}
                  style={{ animationDelay: "0.8s" }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                      👔
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Men's Collection
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Contemporary styles for men
                  </p>
                </div>
              </Link>

              <Link href="/categories/accessories">
                <div
                  className={`glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group transform ${
                    categoriesVisible ? "animate-scaleIn" : "opacity-0 scale-90"
                  }`}
                  style={{ animationDelay: "1.0s" }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                      👜
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
                    Accessories
                  </h3>
                  <p className="text-[#C9BBF7] text-sm">
                    Complete your look with style
                  </p>
                </div>
              </Link>

              <Link href="/categories/footwear">
                <div
                  className={`glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group transform ${
                    categoriesVisible ? "animate-scaleIn" : "opacity-0 scale-90"
                  }`}
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="w-20 h-20 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                      👟
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-white">
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
      <section
        ref={featuresRef}
        className={`py-16 min-h-screen flex items-center justify-center transition-all duration-1000 ${
          featuresVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div
            className={`backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 transition-all duration-1000 ${
              featuresVisible ? "animate-slideInUp" : "opacity-0 translate-y-8"
            }`}
          >
            <div
              className={`text-center mb-12 transition-all duration-1000 delay-300 ${
                featuresVisible ? "animate-fadeInUp" : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="mb-4">Why Choose Us</h2>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                We offer an out-of-this-world shopping experience with stellar
                benefits
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div
                className={`glass-card p-8 text-center transition-all duration-1000 ${
                  featuresVisible
                    ? "animate-slideInLeft"
                    : "opacity-0 -translate-x-8"
                }`}
                style={{ animationDelay: "0.6s" }}
              >
                <div className="w-16 h-16 rounded-full bg-[#ff70c0]/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Fast Delivery
                </h3>
                <p className="text-[#C9BBF7]">
                  Lightning-fast shipping to your doorstep in the cosmos
                </p>
              </div>

              <div
                className={`glass-card p-8 text-center transition-all duration-1000 ${
                  featuresVisible ? "animate-bounceIn" : "opacity-0 scale-50"
                }`}
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-16 h-16 rounded-full bg-[#ff70c0]/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">🛡️</span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Secure Payments
                </h3>
                <p className="text-[#C9BBF7]">
                  Protected transactions with intergalactic security
                </p>
              </div>

              <div
                className={`glass-card p-8 text-center transition-all duration-1000 ${
                  featuresVisible
                    ? "animate-slideInRight"
                    : "opacity-0 translate-x-8"
                }`}
                style={{ animationDelay: "1.0s" }}
              >
                <div className="w-16 h-16 rounded-full bg-[#ff70c0]/20 mx-auto mb-6 flex items-center justify-center">
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="mb-4 text-xl font-bold text-white">
                  Premium Quality
                </h3>
                <p className="text-[#C9BBF7]">
                  Stellar quality products from across the universe
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className={`py-16 min-h-screen flex items-center justify-center transition-all duration-1000 ${
          ctaVisible ? "animate-fadeIn" : "opacity-0"
        }`}
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <div
            className={`backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-16 transition-all duration-1000 ${
              ctaVisible ? "animate-scaleIn" : "opacity-0 scale-90"
            }`}
          >
            <div
              className={`transition-all duration-1000 delay-300 ${
                ctaVisible ? "animate-bounceInUp" : "opacity-0 translate-y-8"
              }`}
            >
              <h2 className="mb-6 text-5xl">Ready to Explore?</h2>
              <p className="text-[#C9BBF7] text-xl mb-8 max-w-2xl mx-auto">
                Join millions of satisfied customers on their cosmic shopping
                journey. Discover products that are truly out of this world!
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/products">
                  <button
                    className={`cta-button transition-all duration-1000 delay-600 ${
                      ctaVisible
                        ? "animate-slideInLeft"
                        : "opacity-0 -translate-x-8"
                    }`}
                  >
                    Start Shopping
                  </button>
                </Link>
                <Link href="/about">
                  <button
                    className={`cta-button-secondary transition-all duration-1000 delay-800 ${
                      ctaVisible
                        ? "animate-slideInRight"
                        : "opacity-0 translate-x-8"
                    }`}
                  >
                    Learn More
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
