"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    fullname: "John Doe",
    email: "john@example.com",
    contact: "1234567890",
    profilepic: "",
    isAdmin: false,
    address: [],
    memberSince: new Date(2023, 0, 15),
    lastLogin: new Date(),
    preferences: {
      notifications: true,
      newsletter: true,
      twoFactorAuth: false,
    },
  });
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authUser) {
      router.push("/users/login");
      return;
    }

    // Set user data from auth context
    setUser(authUser);
    setLoading(false);

    // Fetch orders
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/orders`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const userOrders = data.orders || [];
        setOrders(userOrders);

        // Calculate stats
        const totalOrders = userOrders.length;
        const totalSpent = userOrders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );
        const pendingOrders = userOrders.filter(
          (order) => order.status === "Pending"
        ).length;
        const completedOrders = userOrders.filter(
          (order) => order.status === "Delivered"
        ).length;

        setStats({ totalOrders, totalSpent, pendingOrders, completedOrders });
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      });

    // Fetch addresses
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/checkout/addresses`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data.addresses || []);
      })
      .catch((err) => {
        console.error("Error fetching addresses:", err);
      });
  }, [authUser, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("🚀 Logged out successfully!");
      router.push("/");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] flex items-center justify-center">
          <div className="w-full max-w-md p-8 mx-4 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b9d] mx-auto mb-4"></div>
              <p className="text-lg text-white">Loading profile...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#2a1a2e] via-[#3d1a2e] to-[#1a0f1f] relative overflow-hidden">
        {/* Cosmic Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[#ff6b9d] opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-[#ffb3d9] opacity-10 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full bg-[#ff91ba] opacity-10 blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] bg-clip-text text-transparent mb-3">
              My Cosmic Profile
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-300">
              Manage your account and explore the universe of possibilities
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="p-6 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl text-center group hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                📦
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-300">Total Orders</div>
            </div>
            <div className="p-6 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl text-center group hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                💰
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                ₹{stats.totalSpent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-300">Total Spent</div>
            </div>
            <div className="p-6 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl text-center group hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                ⏳
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-300">Pending Orders</div>
            </div>
            <div className="p-6 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl text-center group hover:bg-white/15 transition-all duration-300">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                ✅
              </div>
              <div className="text-3xl font-bold text-white mb-1">
                {stats.completedOrders}
              </div>
              <div className="text-sm text-gray-300">Completed Orders</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="p-2 mb-8 border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl">
            <div className="flex space-x-1">
              {[
                { id: "profile", label: "Profile Info", icon: "👤" },
                { id: "orders", label: "Order History", icon: "🛒" },
                { id: "addresses", label: "Addresses", icon: "📍" },
                { id: "settings", label: "Settings", icon: "⚙️" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white shadow-lg transform scale-105"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div className="border shadow-2xl backdrop-blur-xl bg-white/10 border-white/20 rounded-3xl overflow-hidden">
            {activeTab === "profile" && (
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Profile Picture Section */}
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <div className="relative inline-block">
                        {user.profilepic ? (
                          <img
                            src={`/uploads/${user.profilepic}`}
                            alt="Profile Picture"
                            className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-[#ff6b9d]"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#ff6b9d] to-[#ffb3d9] flex items-center justify-center shadow-xl border-4 border-white/20">
                            <span className="text-5xl font-bold text-white">
                              {user.fullname?.charAt(0)?.toUpperCase() || "👤"}
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full p-3 shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-sm">📷</span>
                        </div>
                      </div>
                      <h2 className="text-3xl font-bold text-white mt-6 mb-2">
                        {user.fullname}
                      </h2>
                      <p className="text-gray-300 text-lg">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm mt-3 shadow-lg">
                          👑 Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="lg:w-2/3">
                    <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                      ✨ Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Full Name
                        </label>
                        <p className="text-xl text-white mt-2 font-medium">
                          {user.fullname}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Email Address
                        </label>
                        <p className="text-xl text-white mt-2 font-medium">
                          {user.email}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Phone Number
                        </label>
                        <p className="text-xl text-white mt-2 font-medium">
                          {user.contact || "Not provided"}
                        </p>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                          Member Since
                        </label>
                        <p className="text-xl text-white mt-2 font-medium">
                          {user.memberSince
                            ? new Date(user.memberSince).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Recently joined"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                      <Link
                        href="/users/edit-profile"
                        className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        ✏️ Edit Profile
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin/add-product"
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                        >
                          ➕ Add Product
                        </Link>
                      )}
                      <Link
                        href="/users/forgot-password"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        🔒 Reset Password
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                      >
                        🚪 Logout
                      </button>

                      {/* Disabled buttons - functionality not implemented yet */}
                      <button
                        disabled
                        className="bg-gray-500/30 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed flex items-center gap-2 opacity-50"
                        title="Feature coming soon"
                      >
                        � Change Password
                      </button>
                      <button
                        disabled
                        className="bg-gray-500/30 text-gray-400 px-6 py-3 rounded-xl font-medium cursor-not-allowed flex items-center gap-2 opacity-50"
                        title="Feature coming soon"
                      >
                        📧 Update Email
                      </button>
                    </div>

                    {/* Account Health */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-[#ff6b9d]/20 to-[#ffb3d9]/20 border border-[#ff6b9d]/30 rounded-2xl">
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2 text-lg">
                        💯 Account Health
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">
                            Profile Completion
                          </span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-3 bg-white/20 rounded-full">
                              <div className="w-28 h-3 bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-[#ff6b9d]">
                              85%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Security Score</span>
                          <div className="flex items-center gap-3">
                            <div className="w-32 h-3 bg-white/20 rounded-full">
                              <div className="w-20 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-yellow-400">
                              Good
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 mt-3 p-3 bg-white/5 rounded-lg">
                          💡 Complete your phone number and enable 2FA to
                          improve your security score
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
                  🛒 Order History
                </h3>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <h4 className="font-semibold text-white text-lg">
                                  Order #{order._id?.slice(-8) || "N/A"}
                                </h4>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status || "Pending"}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="bg-white/5 rounded-lg p-3">
                                  <span className="text-gray-400 block mb-1">
                                    Order Date:
                                  </span>
                                  <p className="font-medium text-white">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <span className="text-gray-400 block mb-1">
                                    Total Amount:
                                  </span>
                                  <p className="font-medium text-[#ff6b9d] text-lg">
                                    ₹{order.totalAmount?.toLocaleString()}
                                  </p>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <span className="text-gray-400 block mb-1">
                                    Items:
                                  </span>
                                  <p className="font-medium text-white">
                                    {order.items?.length || 0} item(s)
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                disabled
                                className="bg-gray-500/30 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                                title="Feature coming soon"
                              >
                                View Details
                              </button>
                              {order.status === "Delivered" && (
                                <button
                                  disabled
                                  className="bg-gray-500/30 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                                  title="Feature coming soon"
                                >
                                  Reorder
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">📦</div>
                    <h4 className="text-2xl font-semibold text-white mb-3">
                      No Orders Yet
                    </h4>
                    <p className="text-gray-300 mb-8 text-lg">
                      Start shopping to see your cosmic orders here
                    </p>
                    <Link
                      href="/products"
                      className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                    >
                      🛍️ Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold text-white flex items-center gap-2">
                    📍 Saved Addresses
                  </h3>
                  <Link
                    href="/checkout"
                    className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105"
                  >
                    ➕ Add New Address
                  </Link>
                </div>
                {addresses && addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr, index) => (
                      <div
                        key={index}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6 relative hover:bg-white/10 transition-all duration-300"
                      >
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            ✨ Default
                          </span>
                        )}
                        <h4 className="font-semibold text-white mb-3 text-lg">
                          {addr.fullName}
                        </h4>
                        <div className="space-y-2 text-gray-300">
                          <p className="text-sm">{addr.street}</p>
                          <p className="text-sm">
                            {addr.city}, {addr.state} - {addr.zip}
                          </p>
                          <p className="text-sm">{addr.country}</p>
                          <p className="text-sm flex items-center gap-2 mt-3">
                            📞 {addr.mobile}
                          </p>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            disabled
                            className="text-blue-400 hover:text-blue-300 text-sm font-medium cursor-not-allowed opacity-50"
                            title="Feature coming soon"
                          >
                            Edit
                          </button>
                          <button
                            disabled
                            className="text-red-400 hover:text-red-300 text-sm font-medium cursor-not-allowed opacity-50"
                            title="Feature coming soon"
                          >
                            Delete
                          </button>
                          {!addr.isDefault && (
                            <button
                              disabled
                              className="text-green-400 hover:text-green-300 text-sm font-medium cursor-not-allowed opacity-50"
                              title="Feature coming soon"
                            >
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="text-8xl mb-6">📍</div>
                    <h4 className="text-2xl font-semibold text-white mb-3">
                      No Addresses Saved
                    </h4>
                    <p className="text-gray-300 mb-8 text-lg">
                      Add an address for faster cosmic deliveries
                    </p>
                    <Link
                      href="/checkout"
                      className="bg-gradient-to-r from-[#ff6b9d] to-[#ffb3d9] text-white px-8 py-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2 hover:scale-105"
                    >
                      ➕ Add Your First Address
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                  ⚙️ Account Settings
                </h3>
                <div className="space-y-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="font-semibold text-white mb-6 text-xl flex items-center gap-2">
                      🔒 Privacy & Security
                    </h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="font-medium text-white">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-400">
                            Add extra security to your cosmic account
                          </p>
                        </div>
                        <button
                          disabled
                          className="bg-gray-500/30 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50"
                          title="Feature coming soon"
                        >
                          {user.preferences?.twoFactorAuth
                            ? "Enabled"
                            : "Enable"}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="font-medium text-white">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-400">
                            Receive cosmic updates about your orders
                          </p>
                        </div>
                        <button
                          disabled
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50 ${
                            user.preferences?.notifications
                              ? "bg-gray-500/30 text-gray-400"
                              : "bg-gray-500/30 text-gray-400"
                          }`}
                          title="Feature coming soon"
                        >
                          {user.preferences?.notifications
                            ? "Enabled"
                            : "Enable"}
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                        <div>
                          <p className="font-medium text-white">
                            Newsletter Subscription
                          </p>
                          <p className="text-sm text-gray-400">
                            Get the latest cosmic deals and updates
                          </p>
                        </div>
                        <button
                          disabled
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-50 ${
                            user.preferences?.newsletter
                              ? "bg-gray-500/30 text-gray-400"
                              : "bg-gray-500/30 text-gray-400"
                          }`}
                          title="Feature coming soon"
                        >
                          {user.preferences?.newsletter
                            ? "Subscribed"
                            : "Subscribe"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="font-semibold text-white mb-6 text-xl flex items-center gap-2">
                      📊 Data & Privacy
                    </h4>
                    <div className="space-y-4">
                      <button
                        disabled
                        className="w-full text-left bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 cursor-not-allowed opacity-50"
                        title="Feature coming soon"
                      >
                        <p className="font-medium text-blue-300">
                          Download My Data
                        </p>
                        <p className="text-sm text-blue-400">
                          Get a copy of all your cosmic account data
                        </p>
                      </button>
                      <button
                        disabled
                        className="w-full text-left bg-white/5 border border-white/10 rounded-xl p-4 cursor-not-allowed opacity-50"
                        title="Feature coming soon"
                      >
                        <p className="font-medium text-gray-300">
                          Privacy Settings
                        </p>
                        <p className="text-sm text-gray-400">
                          Control how your cosmic data is used
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h4 className="font-semibold text-white mb-6 text-xl flex items-center gap-2">
                      ⚠️ Account Actions
                    </h4>
                    <div className="space-y-4">
                      <button
                        disabled
                        className="w-full text-left bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 cursor-not-allowed opacity-50"
                        title="Feature coming soon"
                      >
                        <p className="font-medium text-yellow-300">
                          Deactivate Account
                        </p>
                        <p className="text-sm text-yellow-400">
                          Temporarily disable your cosmic account
                        </p>
                      </button>
                      <button
                        disabled
                        className="w-full text-left bg-red-500/20 border border-red-500/30 rounded-xl p-4 cursor-not-allowed opacity-50"
                        title="Feature coming soon"
                      >
                        <p className="font-medium text-red-300">
                          Delete Account
                        </p>
                        <p className="text-sm text-red-400">
                          Permanently delete your account and all cosmic data
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#ff6b9d]/20 to-[#ffb3d9]/20 border border-[#ff6b9d]/30 rounded-2xl p-6">
                    <h4 className="font-semibold text-white mb-6 text-xl flex items-center gap-2">
                      🎯 Cosmic Account Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#ff6b9d] mb-2">
                          {stats.totalOrders}
                        </div>
                        <div className="text-sm text-gray-300">
                          Total Orders
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#ff6b9d] mb-2">
                          {user.memberSince
                            ? Math.floor(
                                (new Date() - new Date(user.memberSince)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            : 0}
                        </div>
                        <div className="text-sm text-gray-300">
                          Days as Member
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="text-3xl font-bold text-[#ff6b9d] mb-2">
                          ₹
                          {Math.floor(
                            stats.totalSpent / (stats.totalOrders || 1)
                          )}
                        </div>
                        <div className="text-sm text-gray-300">
                          Avg Order Value
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
