"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState({
    fullname: "John Doe",
    email: "john@example.com",
    contact: "1234567890",
    profilepic: "",
    isAdmin: false,
    address: [
      {
        fullName: "John Doe",
        mobile: "9876543210",
        street: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400001",
        country: "India",
        isDefault: true,
      },
      {
        fullName: "John Doe",
        mobile: "9876543210",
        street: "456 Work Plaza, Office Building",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400002",
        country: "India",
        isDefault: false,
      },
    ],
    memberSince: new Date(2023, 0, 15), // Sample join date
    lastLogin: new Date(),
    preferences: {
      notifications: true,
      newsletter: true,
      twoFactorAuth: false,
    },
  });
  const [orders, setOrders] = useState([]);
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
    fetch("http://localhost:5000/api/users/orders", {
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
  }, [authUser, router]);

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
        <div className="min-h-screen bg-gradient-to-br from-[#8f6690] via-[#a578a8] to-[#b278a8] flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] via-[#a578a8] to-[#b278a8] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">My Account</h1>
            <p className="text-purple-100">
              Manage your profile and track your orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-gray-800">
                ₹{stats.totalSpent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.completedOrders}
              </div>
              <div className="text-sm text-gray-600">Completed Orders</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg">
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
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
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
                            className="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-white"
                          />
                        ) : (
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#8f6690] to-[#b278a8] flex items-center justify-center shadow-xl border-4 border-white">
                            <span className="text-4xl font-bold text-white">
                              {user.fullname?.charAt(0)?.toUpperCase() || "👤"}
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-gradient-to-r from-[#8f6690] to-[#b278a8] rounded-full p-2 shadow-lg">
                          <span className="text-white text-sm">📷</span>
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mt-4">
                        {user.fullname}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm mt-2">
                          👑 Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="lg:w-2/3">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600">
                          Full Name
                        </label>
                        <p className="text-lg text-gray-800 mt-1">
                          {user.fullname}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600">
                          Email Address
                        </label>
                        <p className="text-lg text-gray-800 mt-1">
                          {user.email}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600">
                          Phone Number
                        </label>
                        <p className="text-lg text-gray-800 mt-1">
                          {user.contact || "Not provided"}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600">
                          Member Since
                        </label>
                        <p className="text-lg text-gray-800 mt-1">
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
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="text-sm font-medium text-gray-600">
                          Last Login
                        </label>
                        <p className="text-lg text-gray-800 mt-1">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "Never logged in"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                      <Link
                        href="/users/edit-profile"
                        className="bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        ✏️ Edit Profile
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin/add-product"
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                        >
                          ➕ Add Product
                        </Link>
                      )}
                      <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-300 transition-all flex items-center gap-2">
                        🔒 Change Password
                      </button>
                      <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-medium hover:bg-blue-200 transition-all flex items-center gap-2">
                        📧 Update Email
                      </button>
                    </div>

                    {/* Account Health */}
                    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        💯 Account Health
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Profile Completion
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              85%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Security Score
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div className="w-16 h-2 bg-yellow-500 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-yellow-600">
                              Good
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          💡 Add a phone number and enable 2FA to improve your
                          security score
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Order History
                </h3>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="font-semibold text-gray-800">
                                  Order #{order._id}
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
                                <div>
                                  <span className="text-gray-600">
                                    Order Date:
                                  </span>
                                  <p className="font-medium">
                                    {formatDate(order.createdAt)}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">
                                    Total Amount:
                                  </span>
                                  <p className="font-medium text-lg">
                                    ₹{order.totalAmount?.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-gray-600">Items:</span>
                                  <p className="font-medium">
                                    {order.items?.length || 0} item(s)
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all">
                                View Details
                              </button>
                              {order.status === "Delivered" && (
                                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all">
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
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      No Orders Yet
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/products"
                      className="bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transition-all inline-flex items-center gap-2"
                    >
                      🛍️ Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Saved Addresses
                  </h3>
                  <button className="bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2">
                    ➕ Add New Address
                  </button>
                </div>
                {user.address && user.address.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.address.map((addr, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-xl p-6 relative"
                      >
                        {addr.isDefault && (
                          <span className="absolute top-4 right-4 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Default
                          </span>
                        )}
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {addr.fullName}
                        </h4>
                        <p className="text-gray-600 text-sm mb-1">
                          {addr.street}
                        </p>
                        <p className="text-gray-600 text-sm mb-1">
                          {addr.city}, {addr.state} - {addr.zip}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                          {addr.country}
                        </p>
                        <p className="text-gray-600 text-sm mb-4">
                          📞 {addr.mobile}
                        </p>
                        <div className="flex gap-2">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            Delete
                          </button>
                          {!addr.isDefault && (
                            <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📍</div>
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      No Addresses Saved
                    </h4>
                    <p className="text-gray-600 mb-6">
                      Add an address for faster checkout
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Privacy & Security
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-600">
                            Add extra security to your account
                          </p>
                        </div>
                        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-all">
                          {user.preferences?.twoFactorAuth
                            ? "Enabled"
                            : "Enable"}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-600">
                            Receive updates about your orders
                          </p>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            user.preferences?.notifications
                              ? "bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {user.preferences?.notifications
                            ? "Enabled"
                            : "Enable"}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-800">
                            Newsletter Subscription
                          </p>
                          <p className="text-sm text-gray-600">
                            Get the latest deals and updates
                          </p>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            user.preferences?.newsletter
                              ? "bg-gradient-to-r from-[#8f6690] to-[#b278a8] text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {user.preferences?.newsletter
                            ? "Subscribed"
                            : "Subscribe"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Data & Privacy
                    </h4>
                    <div className="space-y-4">
                      <button className="w-full text-left bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-all">
                        <p className="font-medium text-blue-800">
                          Download My Data
                        </p>
                        <p className="text-sm text-blue-600">
                          Get a copy of all your account data
                        </p>
                      </button>
                      <button className="w-full text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-all">
                        <p className="font-medium text-gray-800">
                          Privacy Settings
                        </p>
                        <p className="text-sm text-gray-600">
                          Control how your data is used
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">
                      Account Actions
                    </h4>
                    <div className="space-y-4">
                      <button className="w-full text-left bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:bg-yellow-100 transition-all">
                        <p className="font-medium text-yellow-800">
                          Deactivate Account
                        </p>
                        <p className="text-sm text-yellow-600">
                          Temporarily disable your account
                        </p>
                      </button>
                      <button className="w-full text-left bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-all">
                        <p className="font-medium text-red-800">
                          Delete Account
                        </p>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all data
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      🎯 Account Insights
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {stats.totalOrders}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Orders
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {user.memberSince
                            ? Math.floor(
                                (new Date() - new Date(user.memberSince)) /
                                  (1000 * 60 * 60 * 24)
                              )
                            : 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Days as Member
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          ₹
                          {Math.floor(
                            stats.totalSpent / (stats.totalOrders || 1)
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
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
