"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function OrderSuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const orderIdParam = searchParams.get("orderId");
    if (orderIdParam) {
      setOrderId(orderIdParam);
    }
  }, [searchParams]);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleViewOrders = () => {
    router.push("/users/profile");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] relative overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#ff6b9d] opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[#c77dff] opacity-10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#7209b7] opacity-5 blur-3xl"></div>
        </div>

        <div className="relative z-10 pt-8 pb-16">
          <div className="max-w-2xl mx-auto px-4">
            {/* Success Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8 text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-white mb-4">
                🎉 Order Placed Successfully!
              </h1>

              <p className="text-gray-300 text-lg mb-6">
                Thank you for your purchase! Your order has been confirmed and
                is being processed.
              </p>

              {/* Order Details */}
              {orderId && (
                <div className="bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Order ID</p>
                  <p className="text-white font-mono text-lg font-semibold">
                    {orderId}
                  </p>
                </div>
              )}

              {/* What's Next */}
              <div className="bg-white/5 rounded-xl p-6 mb-8 border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-4">
                  What happens next?
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-[#ff6b9d] rounded-full mr-3"></div>
                    <span>Order confirmation email sent</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-[#ff6b9d] rounded-full mr-3"></div>
                    <span>Your order is being prepared</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-[#ff6b9d] rounded-full mr-3"></div>
                    <span>Shipping notification when dispatched</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <div className="w-2 h-2 bg-[#ff6b9d] rounded-full mr-3"></div>
                    <span>Estimated delivery: 3-5 business days</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleContinueShopping}
                  className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-8 py-3 rounded-xl hover:from-[#ff5588] hover:to-[#ff9fcc] transition-all duration-300 font-medium"
                >
                  Continue Shopping
                </button>

                {user && (
                  <button
                    onClick={handleViewOrders}
                    className="bg-white/10 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium border border-white/20"
                  >
                    View My Orders
                  </button>
                )}
              </div>

              {/* Support Info */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                  Need help? Contact our support team at{" "}
                  <a
                    href="mailto:support@example.com"
                    className="text-[#ff6b9d] hover:underline"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d] mx-auto"></div>
              <p className="text-white mt-4">Loading...</p>
            </div>
          </div>
        </Layout>
      }
    >
      <OrderSuccessPageContent />
    </Suspense>
  );
}
