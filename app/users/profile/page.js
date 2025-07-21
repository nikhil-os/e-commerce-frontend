import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function ProfilePage() {
  // Placeholder: fetch user and orders from API
  const [user, setUser] = useState({ fullname: 'John Doe', email: 'john@example.com', contact: '1234567890', profilepic: '', isAdmin: false });
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch user and orders from API
  }, []);

  return (
    <Layout>
      <main className="bg-[#fdfaf6] min-h-screen py-10 px-4">
        <section className="max-w-xl mx-auto p-6 bg-white rounded shadow">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span>👤</span> Your Profile
          </h2>
          <div className="flex flex-col items-center text-center mb-6">
            <img src={user.profilepic ? `/uploads/${user.profilepic}` : '/images/default-user.png'} alt="Profile Picture" className="w-32 h-32 rounded-full object-cover shadow-md mb-4" />
            <p><strong>Name:</strong> {user.fullname}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact:</strong> {user.contact}</p>
            <Link href="/users/edit-profile" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">✏️ Edit Profile</Link>
          </div>
          {user.isAdmin && (
            <div className="text-center">
              <Link href="/admin/add-product" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">➕ Add New Product</Link>
            </div>
          )}
        </section>
        <section className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🛒</span> Your Orders
          </h3>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map(order => (
                <li key={order._id} className="border p-4 rounded bg-gray-100">
                  <p><strong>Order ID:</strong> {order._id}</p>
                  <p><strong>Total:</strong> ₹{order.total}</p>
                  <p><strong>Status:</strong> {order.status || 'Pending'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No orders found.</p>
          )}
        </section>
      </main>
    </Layout>
  );
} 