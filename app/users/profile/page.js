'use client';
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { apiFetch, buildApiUrl } from '../../utils/apiClient';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState({
    fullname: 'John Doe',
    email: 'john@example.com',
    contact: '1234567890',
    profilepic: '',
    isAdmin: false,
    address: [
      {
        fullName: 'John Doe',
        mobile: '9876543210',
        street: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400001',
        country: 'India',
        isDefault: true,
      },
      {
        fullName: 'John Doe',
        mobile: '9876543210',
        street: '456 Work Plaza, Office Building',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400002',
        country: 'India',
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authUser) {
      router.push('/users/login');
      return;
    }

    // Set user data from auth context
    setUser(authUser);
    setLoading(false);

    // Fetch orders
    apiFetch(buildApiUrl('api/users/orders'))
      .then((res) => res.json())
      .then((data) => {
        const payload = data?.data || data || {};
        const userOrders = payload.orders || [];
        const apiStats = payload.stats || {};

        setOrders(userOrders);

        setStats({
          totalOrders: apiStats.totalOrders ?? userOrders.length ?? 0,
          totalSpent:
            apiStats.totalSpent ??
            userOrders.reduce(
              (sum, order) => sum + (order.totalAmount || 0),
              0
            ),
          pendingOrders:
            apiStats.pendingOrders ??
            userOrders.filter((order) => order.status === 'Pending').length,
          completedOrders:
            apiStats.completedOrders ??
            userOrders.filter((order) => order.status === 'Delivered').length,
        });
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      });
  }, [authUser, router]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    const numericValue = Number(amount ?? 0);
    const safeValue = Number.isFinite(numericValue) ? numericValue : 0;

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(safeValue);
  };

  const averageOrderValue =
    stats.totalOrders > 0 ? stats.totalSpent / stats.totalOrders : 0;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#8f6690] via-[#a578a8] to-[#b278a8] flex items-center justify-center">
          <div className="px-6 py-3 text-xl font-semibold text-purple-900 shadow-lg bg-white/80 rounded-2xl">
            Loading...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#8f6690] via-[#a578a8] to-[#b278a8] py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="inline-block px-6 py-2 mb-2 text-4xl font-bold text-purple-900 shadow-lg bg-white/80 rounded-3xl">
              My Account
            </h1>
            <p className="text-purple-100">
              Manage your profile and track your orders
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
            <div className="p-6 text-center shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
              <div className="mb-2 text-3xl">📦</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.totalOrders}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="p-6 text-center shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
              <div className="mb-2 text-3xl">💰</div>
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(stats.totalSpent)}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            <div className="p-6 text-center shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
              <div className="mb-2 text-3xl">⏳</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.pendingOrders}
              </div>
              <div className="text-sm text-gray-600">Pending Orders</div>
            </div>
            <div className="p-6 text-center shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
              <div className="mb-2 text-3xl">✅</div>
              <div className="text-2xl font-bold text-gray-800">
                {stats.completedOrders}
              </div>
              <div className="text-sm text-gray-600">Completed Orders</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="p-2 mb-8 shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
            <div className="flex space-x-1">
              {[
                { id: 'profile', label: 'Profile Info', icon: '👤' },
                { id: 'orders', label: 'Order History', icon: '🛒' },
                { id: 'addresses', label: 'Addresses', icon: '📍' },
                { id: 'settings', label: 'Settings', icon: '⚙️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-700 shadow-md border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div className="overflow-hidden shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl">
            {activeTab === 'profile' && (
              <div className="p-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                  {/* Profile Picture Section */}
                  <div className="lg:w-1/3">
                    <div className="text-center">
                      <div className="relative inline-block">
                        {user.profilepic ? (
                          <img
                            src={`/uploads/${user.profilepic}`}
                            alt="Profile Picture"
                            className="object-cover w-40 h-40 border-4 border-white rounded-full shadow-xl"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-40 h-40 bg-white border-2 border-purple-200 rounded-full shadow-xl">
                            <span className="text-4xl font-bold text-purple-700">
                              {user.fullname?.charAt(0)?.toUpperCase() || '👤'}
                            </span>
                          </div>
                        )}
                        <div className="absolute p-2 bg-white border border-purple-200 rounded-full shadow-lg bottom-2 right-2">
                          <span className="text-sm font-semibold text-purple-700">
                            📷
                          </span>
                        </div>
                      </div>
                      <h2 className="mt-4 text-2xl font-bold text-gray-800">
                        {user.fullname}
                      </h2>
                      <p className="text-gray-600">{user.email}</p>
                      {user.isAdmin && (
                        <span className="inline-block px-3 py-1 mt-2 text-sm font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-full">
                          👑 Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="lg:w-2/3">
                    <h3 className="mb-6 text-xl font-semibold text-gray-800">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">
                          Full Name
                        </label>
                        <p className="mt-1 text-lg text-gray-800">
                          {user.fullname}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">
                          Email Address
                        </label>
                        <p className="mt-1 text-lg text-gray-800">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">
                          Phone Number
                        </label>
                        <p className="mt-1 text-lg text-gray-800">
                          {user.contact || 'Not provided'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">
                          Member Since
                        </label>
                        <p className="mt-1 text-lg text-gray-800">
                          {user.memberSince
                            ? new Date(user.memberSince).toLocaleDateString(
                                'en-IN',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )
                            : 'Recently joined'}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="text-sm font-medium text-gray-600">
                          Last Login
                        </label>
                        <p className="mt-1 text-lg text-gray-800">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString(
                                'en-IN',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )
                            : 'Never logged in'}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-8">
                      <Link
                        href="/users/edit-profile"
                        className="flex items-center gap-2 px-6 py-3 font-medium text-purple-700 transition-all bg-white border border-purple-200 shadow-sm rounded-xl hover:bg-purple-50 hover:border-purple-300"
                      >
                        ✏️ Edit Profile
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin/add-product"
                          className="flex items-center gap-2 px-6 py-3 font-medium text-green-700 transition-all border border-green-200 bg-green-50 rounded-xl hover:bg-green-100"
                        >
                          ➕ Add Product
                        </Link>
                      )}
                      <button className="flex items-center gap-2 px-6 py-3 font-medium text-gray-700 transition-all bg-gray-200 rounded-xl hover:bg-gray-300">
                        🔒 Change Password
                      </button>
                      <button className="flex items-center gap-2 px-6 py-3 font-medium text-blue-700 transition-all bg-blue-100 rounded-xl hover:bg-blue-200">
                        📧 Update Email
                      </button>
                    </div>

                    {/* Account Health */}
                    <div className="p-6 mt-8 border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                      <h4 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
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
                        <div className="mt-2 text-xs text-gray-500">
                          💡 Add a phone number and enable 2FA to improve your
                          security score
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-800">
                  Order History
                </h3>
                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((order, index) => {
                      const orderIdentifier =
                        order._id || order.id || `order-${index + 1}`;
                      return (
                        <div
                          key={orderIdentifier}
                          className="transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
                        >
                          <div className="p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h4 className="font-semibold text-gray-800">
                                    Order #{orderIdentifier}
                                  </h4>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status || 'Pending'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
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
                                    <p className="text-lg font-medium">
                                      {formatCurrency(order.totalAmount)}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Items:
                                    </span>
                                    <p className="font-medium">
                                      {order.items?.length || 0} item(s)
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button className="px-4 py-2 text-sm font-medium text-purple-700 transition-all bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300">
                                  View Details
                                </button>
                                {order.status === 'Delivered' && (
                                  <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300">
                                    Reorder
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-6xl">📦</div>
                    <h4 className="mb-2 text-xl font-semibold text-gray-800">
                      No Orders Yet
                    </h4>
                    <p className="mb-6 text-gray-600">
                      Start shopping to see your orders here
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-8 py-3 font-medium text-purple-700 transition-all bg-white border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300"
                    >
                      🛍️ Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Saved Addresses
                  </h3>
                  <button className="flex items-center gap-2 px-6 py-3 font-medium text-purple-700 transition-all bg-white border border-purple-200 rounded-xl hover:bg-purple-50 hover:border-purple-300">
                    ➕ Add New Address
                  </button>
                </div>
                {user.address && user.address.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {user.address.map((addr, index) => (
                      <div
                        key={index}
                        className="relative p-6 bg-white border border-gray-200 rounded-xl"
                      >
                        {addr.isDefault && (
                          <span className="absolute px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full top-4 right-4">
                            Default
                          </span>
                        )}
                        <h4 className="mb-2 font-semibold text-gray-800">
                          {addr.fullName}
                        </h4>
                        <p className="mb-1 text-sm text-gray-600">
                          {addr.street}
                        </p>
                        <p className="mb-1 text-sm text-gray-600">
                          {addr.city}, {addr.state} - {addr.zip}
                        </p>
                        <p className="mb-3 text-sm text-gray-600">
                          {addr.country}
                        </p>
                        <p className="mb-4 text-sm text-gray-600">
                          📞 {addr.mobile}
                        </p>
                        <div className="flex gap-2">
                          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            Edit
                          </button>
                          <button className="text-sm font-medium text-red-600 hover:text-red-800">
                            Delete
                          </button>
                          {!addr.isDefault && (
                            <button className="text-sm font-medium text-green-600 hover:text-green-800">
                              Set as Default
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mb-4 text-6xl">📍</div>
                    <h4 className="mb-2 text-xl font-semibold text-gray-800">
                      No Addresses Saved
                    </h4>
                    <p className="mb-6 text-gray-600">
                      Add an address for faster checkout
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-800">
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h4 className="mb-4 font-semibold text-gray-800">
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
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 transition-all bg-gray-200 rounded-lg hover:bg-gray-300">
                          {user.preferences?.twoFactorAuth
                            ? 'Enabled'
                            : 'Enable'}
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
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {user.preferences?.notifications
                            ? 'Enabled'
                            : 'Enable'}
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
                              ? 'bg-purple-100 text-purple-700 border border-purple-200'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {user.preferences?.newsletter
                            ? 'Subscribed'
                            : 'Subscribe'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h4 className="mb-4 font-semibold text-gray-800">
                      Data & Privacy
                    </h4>
                    <div className="space-y-4">
                      <button className="w-full p-4 text-left transition-all border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100">
                        <p className="font-medium text-blue-800">
                          Download My Data
                        </p>
                        <p className="text-sm text-blue-600">
                          Get a copy of all your account data
                        </p>
                      </button>
                      <button className="w-full p-4 text-left transition-all border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100">
                        <p className="font-medium text-gray-800">
                          Privacy Settings
                        </p>
                        <p className="text-sm text-gray-600">
                          Control how your data is used
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-200 rounded-xl">
                    <h4 className="mb-4 font-semibold text-gray-800">
                      Account Actions
                    </h4>
                    <div className="space-y-4">
                      <button className="w-full p-4 text-left transition-all border border-yellow-200 rounded-lg bg-yellow-50 hover:bg-yellow-100">
                        <p className="font-medium text-yellow-800">
                          Deactivate Account
                        </p>
                        <p className="text-sm text-yellow-600">
                          Temporarily disable your account
                        </p>
                      </button>
                      <button className="w-full p-4 text-left transition-all border border-red-200 rounded-lg bg-red-50 hover:bg-red-100">
                        <p className="font-medium text-red-800">
                          Delete Account
                        </p>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all data
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                    <h4 className="flex items-center gap-2 mb-4 font-semibold text-gray-800">
                      🎯 Account Insights
                    </h4>
                    <div className="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
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
                          {formatCurrency(averageOrderValue)}
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
