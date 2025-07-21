"use client";

import React, { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import ProductCard from "./components/ProductCard";
import Link from "next/link";

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

  const handleAddToCart = (product, quantity) => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // Implement cart logic here
  };

  return (
    <Layout>
      <Loader visible={loading} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-16 px-6 md:px-16">
        <div className="container-custom flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 text-center md:text-left" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              <span className="inline-block text-5xl md:text-6xl">🛍️</span> Discover <br className="hidden md:block" /> 
              Premium Products
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Style, Quality & Elegance in Every Item — curated just for you.
            </p>
            <Link href="/categories" className="btn bg-white text-indigo-700 hover:bg-indigo-100 px-8 py-3 rounded-md shadow-lg transition-all transform hover:scale-105">
              🔎 Shop Now
            </Link>
          </div>

          <div className="md:w-1/2" data-aos="fade-left">
            <img 
              src="https://i.pinimg.com/736x/a9/31/33/a93133a28f7aa1346c34a2cbcd8a5312.jpg" 
              alt="Hero Outfit" 
              className="rounded-xl shadow-xl w-full object-cover h-[400px]" 
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => {
              const category = ["womens", "mens", "accessories", "footwear"][
                index
              ];
              return (
                <Link
                  key={product._id}
                  href={`/categories/${category}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-lg h-64">
                    <img
                      src={product.image}
                      alt={category}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <h3 className="text-white text-xl font-bold p-4">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Handpicked selections just for you
          </p>

          {products.length === 0 && !loading ? (
            <div className="text-center text-gray-500 py-12">
              <h3 className="text-2xl font-semibold mb-2">
                No products found.
              </h3>
              <p>Check back later or contact the store owner.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                text: "The quality of the products is exceptional. I've been shopping here for years and have never been disappointed.",
              },
              {
                name: "Raj Patel",
                text: "Fast shipping and excellent customer service. The attention to detail in packaging is impressive!",
              },
              {
                name: "Ananya Gupta",
                text: "I love the variety of products available. There's always something new and exciting to discover here.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {testimonial.text}
                </p>
                <p className="font-semibold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
