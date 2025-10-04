"use client";
import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import ImageUploadModal from "../components/ImageUploadModal";
import { getCategoryImage, getCategoryAlt } from "../utils/categoryImages";

// Fallback categories in case API fails
const fallbackCategories = [
  {
    slug: "womens-fashion",
    name: "Women&apos;s Fashion",
    description: "Trendy and elegant dresses, tops, and ethnic wear.",
    imageUrl:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=600&fit=crop&crop=face",
  },
  {
    slug: "mens-fashion",
    name: "Men&apos;s Fashion",
    description: "Contemporary styles for men.",
    imageUrl:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Chic earrings, watches, sunglasses and more.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "footwear",
    name: "Footwear",
    description: "Stylish heels, sneakers, and traditional footwear.",
    imageUrl:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "electronics",
    name: "Electronics",
    description: "Latest gadgets & electronic devices",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "home-appliances",
    name: "Home Appliances",
    description: "Essential appliances for your home",
    imageUrl:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "beauty-health",
    name: "Beauty & Health",
    description: "Skincare, makeup, and wellness products",
    imageUrl:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "sports-fitness",
    name: "Sports & Fitness",
    description: "Workout gear, sports equipment, and activewear",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "books-media",
    name: "Books & Media",
    description: "Books, magazines, and digital content",
    imageUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "home-garden",
    name: "Home & Garden",
    description: "Furniture, decor, and gardening supplies",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "toys-games",
    name: "Toys & Games",
    description: "Fun for kids and adults alike",
    imageUrl:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop&crop=center",
  },
  {
    slug: "automotive",
    name: "Automotive",
    description: "Car accessories and maintenance products",
    imageUrl:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=800&h=600&fit=crop&crop=center",
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { user } = useAuth();
  const toast = useToast();

  const handleImageUpdate = (categorySlug, newImageUrl) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.slug === categorySlug ? { ...cat, imageUrl: newImageUrl } : cat
      )
    );
  };

  const openImageModal = (category, e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation();
    setSelectedCategory(category);
    setModalOpen(true);
  };
  const [imageLoadingStates, setImageLoadingStates] = useState({});

  const handleImageLoad = (slug) => {
    setImageLoadingStates((prev) => ({
      ...prev,
      [slug]: false,
    }));
  };

  const handleImageError = (slug, currentAttempt = "primary") => {
    if (currentAttempt === "primary") {
      // Try secondary image
      setImageLoadingStates((prev) => ({
        ...prev,
        [slug]: "secondary",
      }));
    } else {
      // Mark as error
      setImageLoadingStates((prev) => ({
        ...prev,
        [slug]: "error",
      }));
    }
  };

  useEffect(() => {
    // Set initial loading states
    fallbackCategories.forEach((cat) => {
      setImageLoadingStates((prev) => ({
        ...prev,
        [cat.slug]: true,
      }));
    });

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
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
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categories.map((cat) => (
                  <Link key={cat.slug} href={`/products/${cat.slug}`}>
                    <div className="glass-card overflow-hidden hover:shadow-[0_0_30px_rgba(141,125,250,0.4)] transition-all duration-500 group cursor-pointer relative transform hover:-translate-y-2">
                      {/* Admin Image Upload Button */}
                      {user?.isAdmin && (
                        <button
                          onClick={(e) => openImageModal(cat, e)}
                          className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-20 shadow-xl backdrop-blur-sm"
                          title="Update category image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Image Container */}
                      <div className="relative w-full h-32 bg-gradient-to-br from-[#8D7DFA]/20 to-[#b278a8]/20 overflow-hidden">
                        {imageLoadingStates[cat.slug] === true && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#8D7DFA]/30 to-[#b278a8]/30">
                            <div className="w-8 h-8 border-white rounded-full border-3 border-t-transparent animate-spin"></div>
                          </div>
                        )}
                        {imageLoadingStates[cat.slug] === "error" ? (
                          <div className="flex flex-col items-center justify-center h-full text-white/60">
                            <svg
                              className="w-10 h-10 mb-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-xs font-medium">
                              No Image
                            </span>
                          </div>
                        ) : (
                          <>
                            <img
                              src={
                                cat.imageUrl ||
                                cat.image ||
                                getCategoryImage(
                                  cat.slug,
                                  imageLoadingStates[cat.slug] === "secondary"
                                )
                              }
                              alt={getCategoryAlt(cat.slug, cat.name)}
                              className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${
                                imageLoadingStates[cat.slug] === true
                                  ? "opacity-0"
                                  : "opacity-100"
                              }`}
                              onLoad={() => handleImageLoad(cat.slug)}
                              onError={() =>
                                handleImageError(
                                  cat.slug,
                                  imageLoadingStates[cat.slug] === "secondary"
                                    ? "secondary"
                                    : "primary"
                                )
                              }
                              loading="lazy"
                            />
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/40 via-transparent to-transparent group-hover:opacity-100"></div>
                          </>
                        )}
                      </div>

                      {/* Content Container */}
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-bold text-white group-hover:text-[#C9BBF7] transition-colors duration-300">
                          {cat.name}
                        </h3>
                        <p className="text-[#C9BBF7] text-xs leading-relaxed line-clamp-1 mb-3">
                          {cat.description}
                        </p>

                        {/* Explore Button */}
                        <div className="flex items-center text-[#8D7DFA] group-hover:text-white transition-colors duration-300">
                          <span className="text-xs font-medium">Explore</span>
                          <svg
                            className="w-3 h-3 ml-1 transition-transform duration-300 transform group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categorySlug={selectedCategory?.slug}
        categoryName={selectedCategory?.name}
        currentImage={selectedCategory?.imageUrl || selectedCategory?.image}
        onImageUpdate={handleImageUpdate}
      />
    </Layout>
  );
}
