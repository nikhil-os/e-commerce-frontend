"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  const { addToCart } = useAuth();
  const toast = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Reset selectedImage when product changes or when images are not available
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      if (selectedImage >= product.images.length) {
        setSelectedImage(0);
      }
    } else {
      setSelectedImage(0);
    }
  }, [product, selectedImage]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", productId);

        // For now, let's bypass the API and use sample data to test the UI
        console.log("Using sample data for testing");
        const sampleProduct = {
          _id: productId,
          name: "Premium Fashion Item",
          price: 2999,
          discount: 20,
          category: "Fashion",
          description:
            "Experience luxury and comfort with this premium fashion item. Crafted with the finest materials and attention to detail.",
          specifications: {
            Material: "100% Premium Cotton",
            Size: "Available in S, M, L, XL",
            Color: "Multiple colors available",
            Care: "Machine wash cold, tumble dry low",
            Origin: "Made in India",
          },
          images: [
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
          ],
          rating: 4.5,
          reviews: [
            {
              id: 1,
              user: "John Doe",
              rating: 5,
              comment: "Excellent quality and fast delivery!",
              date: "2024-01-15",
            },
            {
              id: 2,
              user: "Jane Smith",
              rating: 4,
              comment: "Great product, fits perfectly.",
              date: "2024-01-10",
            },
          ],
        };
        console.log("Setting sample product:", sampleProduct);
        setProduct(sampleProduct);
        setLoading(false);

        /* 
        // Temporarily commented out API call
        const response = await fetch(
          `https://e-commerce-backend-1-if2s.onrender.com/api/products/id/${productId}`
        );

        console.log("API Response status:", response.status);
        
        if (response.ok) {
          const productData = await response.json();
          console.log("Product data received:", productData);
          setProduct(productData);
        } else {
          console.error("Failed to fetch product, status:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          
          // Fallback to sample data if API fails
          console.log("Using fallback sample data");
          setProduct(sampleProduct);
        }
        */
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const discountedPrice = product?.discount
    ? product.price - (product.price * product.discount) / 100
    : product?.price;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`${quantity} item(s) added to cart!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push("/checkout");
    }
  };

  console.log("Current product state:", product);
  console.log("Loading state:", loading);

  if (loading)
    return (
      <Layout>
        <Loader />
      </Layout>
    );

  if (!product) {
    console.log("No product found, product is:", product);
    return (
      <Layout>
        <div className="py-20 text-center">Product not found</div>
      </Layout>
    );
  }

  if (!product.name) {
    console.log("Product has no name, product is:", product);
    return (
      <Layout>
        <div className="py-20 text-center">Product data incomplete</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="overflow-hidden border aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border-white/20">
                <img
                  src={
                    product.images &&
                    product.images.length > 0 &&
                    product.images[selectedImage]
                      ? product.images[selectedImage].startsWith("http")
                        ? product.images[selectedImage]
                        : `${process.env.NEXT_PUBLIC_API_URL}${product.images[selectedImage]}`
                      : "https://e-commerce-backend-1-if2s.onrender.com/placeholder-product.jpg"
                  }
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Image thumbnails */}
              <div className="flex space-x-2">
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#8D7DFA] scale-110"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <img
                        src={
                          image?.startsWith("http")
                            ? image
                            : `${process.env.NEXT_PUBLIC_API_URL}${image}` ||
                              "https://e-commerce-backend-1-if2s.onrender.com/placeholder-product.jpg"
                        }
                        alt={`${product.name} ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))
                ) : (
                  <div className="flex items-center justify-center w-20 h-20 border rounded-lg bg-white/10 border-white/20">
                    <span className="text-xs text-gray-400">No images</span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#8D7DFA] text-sm font-medium">
                    {typeof product.category === "object"
                      ? product.category?.name || "General"
                      : product.category}
                  </span>
                  {product.discount > 0 && (
                    <span className="bg-[#FF6B8E] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {product.discount}% OFF
                    </span>
                  )}
                </div>
                <h1 className="mb-4 text-4xl font-bold text-white">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center mb-4 space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "text-[#FFCC66]"
                            : "text-gray-400"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white">{product.rating}</span>
                  <span className="text-[#C9BBF7]">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-[#8D7DFA]">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-[#C9BBF7] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-white">Quantity:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bg-white/10 hover:bg-white/20"
                  >
                    -
                  </button>
                  <span className="w-12 font-medium text-center text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="flex items-center justify-center w-10 h-10 text-white transition-colors rounded-full bg-white/10 hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#8D7DFA] hover:bg-[#7C6CE8] text-white py-4 rounded-full font-medium transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-4 font-medium text-white transition-colors border rounded-full bg-white/10 hover:bg-white/20 border-white/20"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="flex space-x-8 border-b border-white/20">
              {["description", "specifications", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? "text-[#8D7DFA] border-b-2 border-[#8D7DFA]"
                      : "text-[#C9BBF7] hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="py-8">
              {activeTab === "description" && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-[#C9BBF7] text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between py-3 border-b border-white/10"
                      >
                        <span className="text-[#C9BBF7] font-medium">
                          {key}:
                        </span>
                        <span className="text-white">{value}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="p-6 rounded-lg bg-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-[#8D7DFA] flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {review.user.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">
                              {review.user}
                            </h4>
                            <p className="text-[#C9BBF7] text-sm">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "text-[#FFCC66]"
                                  : "text-gray-400"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-[#C9BBF7]">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
