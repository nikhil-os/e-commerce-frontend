"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";

// Fallback categories in case API fails
const fallbackCategories = [
  {
    slug: "womens-fashion",
    name: "Women's Fashion",
    description: "Trendy and elegant dresses, tops, and ethnic wear.",
    imageUrl:
      "https://i.pinimg.com/736x/98/b2/93/98b2939c723b0dd7284e63378bb65ee6.jpg",
  },
  {
    slug: "mens-fashion",
    name: "Men's Fashion",
    description: "Contemporary styles for men.",
    imageUrl:
      "https://i.pinimg.com/736x/82/48/ab/8248abc28ceab53fecca5d00b1f7986e.jpg",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Chic earrings, watches, sunglasses and more.",
    imageUrl:
      "https://i.pinimg.com/736x/a5/47/b7/a547b7b16f191b0d03d31a130b05a54a.jpg",
  },
  {
    slug: "footwear",
    name: "Footwear",
    description: "Stylish heels, sneakers, and traditional footwear.",
    imageUrl:
      "https://i.pinimg.com/736x/83/24/e4/8324e4aa41326c46276416dca10b9677.jpg",
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Latest gadgets & electronic devices",
    imageUrl:
      "https://i.pinimg.com/736x/1c/c8/f5/1cc8f58797ed911aef8e08987f4e346f.jpg",
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    description: "Essential appliances for your home",
    imageUrl:
      "https://i.pinimg.com/736x/9b/a7/ec/9ba7ec043aecef2f1fc3e2525ee00066.jpg",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        } else {
          // Use fallback categories if API returns empty list
          setCategories(fallbackCategories);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        // Use fallback categories on error
        setCategories(fallbackCategories);
        setLoading(false);
      });
  }, []);
  return (
    <Layout>
      <section className="relative flex items-center justify-center min-h-screen px-4 py-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="mb-12 text-center">
              <h1 className="mb-4">Explore Categories</h1>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                Discover our carefully curated collections across different
                cosmic realms.
              </p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-white">Loading categories...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/products/${cat.slug}`}>
                    <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group cursor-pointer">
                      <div className="w-24 h-24 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            cat.imageUrl ||
                            cat.image ||
                            "https://via.placeholder.com/150?text=Category"
                          }
                          alt={cat.name}
                          className="object-cover w-full h-full transition-transform duration-300 rounded-full group-hover:scale-110"
                        />
                      </div>
                      <h3 className="mb-2 text-xl font-bold text-white">
                        {cat.name}
                      </h3>
                      <p className="text-[#C9BBF7] text-sm">
                        {cat.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
