"use client";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useAuth();
  const toast = useToast();

  // Fallback products in case API fails
  const fallbackProducts = [
    {
      _id: "fallback-1",
      name: "Elegant Summer Dress",
      price: 2499,
      discount: 15,
      description: "Perfect for summer outings",
      category: { name: "Women&apos;s Fashion", slug: "womens-fashion" },
      imageUrl:
        "https://i.pinimg.com/736x/98/b2/93/98b2939c723b0dd7284e63378bb65ee6.jpg",
    },
    {
      _id: "fallback-2",
      name: "Classic Denim Jacket",
      price: 3299,
      discount: 10,
      description: "Timeless style for all seasons",
      category: { name: "Men&apos;s Fashion", slug: "mens-fashion" },
      imageUrl:
        "https://i.pinimg.com/736x/82/48/ab/8248abc28ceab53fecca5d00b1f7986e.jpg",
    },
    {
      _id: "fallback-3",
      name: "Designer Handbag",
      price: 4999,
      discount: 5,
      description: "Elegant accessory for any occasion",
      category: { name: "Accessories", slug: "accessories" },
      imageUrl:
        "https://i.pinimg.com/736x/9b/a7/ec/9ba7ec043aecef2f1fc3e2525ee00066.jpg",
    },
    {
      _id: "fallback-4",
      name: "Premium Leather Shoes",
      price: 3599,
      discount: 20,
      description: "Handcrafted for comfort and style",
      category: { name: "Footwear", slug: "footwear" },
      imageUrl:
        "https://i.pinimg.com/736x/83/24/e4/8324e4aa41326c46276416dca10b9677.jpg",
    },
    {
      _id: "fallback-5",
      name: "Wireless Headphones",
      price: 4299,
      discount: 25,
      description: "Premium sound quality with noise cancellation",
      category: { name: "Electronics", slug: "electronics" },
      imageUrl:
        "https://i.pinimg.com/736x/f1/2d/3c/f12d3c8e9b4a7f8c6d5e4f3a2b1c0d9e.jpg",
    },
    {
      _id: "fallback-6",
      name: "Skincare Set",
      price: 2799,
      discount: 30,
      description: "Complete skincare routine for glowing skin",
      category: { name: "Beauty & Health", slug: "beauty-health" },
      imageUrl:
        "https://i.pinimg.com/736x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg",
    },
  ];

  const fallbackCategories = [
    { name: "Women&apos;s Fashion", slug: "womens-fashion" },
    { name: "Men&apos;s Fashion", slug: "mens-fashion" },
    { name: "Accessories", slug: "accessories" },
    { name: "Footwear", slug: "footwear" },
    { name: "Electronics", slug: "electronics" },
    { name: "Beauty & Health", slug: "beauty-health" },
  ];

  // Function to normalize product data from API response
  const normalizeProduct = (product) => {
    return {
      _id: product._id,
      name: product.name,
      price: product.price || 999, // Default price if not provided
      discount: product.discount || 0, // Default no discount
      image:
        product.imageUrl ||
        product.image ||
        "https://via.placeholder.com/300x200?text=Product",
      category: product.category?.name || product.category || "General",
      description: product.description || "No description available",
    };
  };

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
        .then((res) => res.json())
        .catch(() => ({ products: [] })),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
        .then((res) => res.json())
        .catch(() => ({ categories: [] })),
    ])
      .then(([productsData, categoriesData]) => {
        const loadedProducts =
          productsData.products && productsData.products.length > 0
            ? productsData.products.map(normalizeProduct)
            : fallbackProducts;
        const loadedCategories =
          categoriesData.categories && categoriesData.categories.length > 0
            ? categoriesData.categories
            : fallbackCategories;

        setProducts(loadedProducts);
        setCategories(loadedCategories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setProducts(fallbackProducts);
        setCategories(fallbackCategories);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product, quantity) => {
    try {
      if (!product || !product._id) {
        toast.error("Invalid product data");
        return;
      }

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

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.name?.toLowerCase() === selectedCategory ||
        product.category?.slug?.toLowerCase() === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <Layout>
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 border-4 border-[#8D7DFA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading cosmic products...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
          <div className="absolute top-40 left-1/3 w-4 h-4 rounded-full bg-[#FFFFFF] opacity-60 animate-pulse"></div>
          <div className="absolute top-60 right-1/4 w-2 h-2 rounded-full bg-[#FFFFFF] opacity-60 animate-pulse"></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center">
            <h1 className="mb-6">
              Cosmic <span className="text-[#8D7DFA]">Product Collection</span>
            </h1>
            <p className="text-xl text-[#C9BBF7] mb-8 max-w-3xl mx-auto">
              Explore our entire universe of premium products, handpicked from
              across the galaxy. Find everything you need in one stellar
              destination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories" className="btn btn-secondary">
                <span className="mr-2">🌌</span> Browse by Categories
              </Link>
              <Link href="/cart" className="btn btn-primary">
                <span className="mr-2">🛒</span> View Cart
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-5 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-5 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-8">
            {/* Filters and Search */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="w-full lg:w-1/3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 pl-12 rounded-xl bg-white/10 text-white placeholder-[#C9BBF7] focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
                    />
                    <svg
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#C9BBF7]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="w-full lg:w-1/3">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.slug}
                        value={cat.slug}
                        className="bg-[#7c527c] text-white"
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Filter */}
                <div className="w-full lg:w-1/3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#8D7DFA] backdrop-blur-md border border-white/10"
                  >
                    <option value="name" className="bg-[#7c527c] text-white">
                      Sort by Name
                    </option>
                    <option
                      value="price-low"
                      className="bg-[#7c527c] text-white"
                    >
                      Price: Low to High
                    </option>
                    <option
                      value="price-high"
                      className="bg-[#7c527c] text-white"
                    >
                      Price: High to Low
                    </option>
                  </select>
                </div>
              </div>

              {/* Results Info */}
              <div className="flex items-center justify-between">
                <p className="text-[#C9BBF7]">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                  {selectedCategory !== "all" && (
                    <span className="ml-2 px-3 py-1 bg-[#8D7DFA]/20 rounded-full text-sm">
                      {categories.find((cat) => cat.slug === selectedCategory)
                        ?.name || selectedCategory}
                    </span>
                  )}
                </p>
                {(selectedCategory !== "all" || searchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchTerm("");
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[#C9BBF7] hover:text-white transition-all duration-300"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#8D7DFA]/20 flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-[#C9BBF7]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No Products Found
                </h3>
                <p className="text-[#C9BBF7] mb-6">
                  We couldn&apos;t find any products matching your criteria. Try
                  adjusting your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                  }}
                  className="btn btn-primary"
                >
                  Show All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-[#8f6690] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-[#b278a8] opacity-10 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="text-lg text-[#C9BBF7] mb-8 max-w-2xl mx-auto">
              Explore our organized categories or contact our stellar support
              team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/categories" className="btn btn-primary">
                <span className="mr-2">🌟</span> Browse Categories
              </Link>
              <Link href="/contact" className="btn btn-secondary">
                <span className="mr-2">💬</span> Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
