"use client";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState({
    fullname: "John Doe",
    email: "john@example.com",
    contact: "1234567890",
    profilepic: "",
    isAdmin: false,
  });
  const [orders, setOrders] = useState([]);
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
    fetch("http://localhost:5000/api/checkout/orders", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
      });
  }, [authUser, router]);

  return (
    <Layout>
      <main className="bg-[#fdfaf6] min-h-screen py-10 px-4">
        <section className="max-w-xl p-6 mx-auto bg-white rounded shadow">
          <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold">
            <span>👤</span> Your Profile
          </h2>
          <div className="flex flex-col items-center mb-6 text-center">
            <img
              src={
                user.profilepic
                  ? `/uploads/${user.profilepic}`
                  : "/images/default-user.png"
              }
              alt="Profile Picture"
              className="object-cover w-32 h-32 mb-4 rounded-full shadow-md"
            />
            <p>
              <strong>Name:</strong> {user.fullname}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Contact:</strong> {user.contact}
            </p>
            <Link
              href="/users/edit-profile"
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              ✏️ Edit Profile
            </Link>
          </div>
          {user.isAdmin && (
            <div className="text-center">
              <Link
                href="/admin/add-product"
                className="inline-block px-4 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
              >
                ➕ Add New Product
              </Link>
            </div>
          )}
        </section>
        <section className="max-w-xl p-6 mx-auto mt-10 bg-white rounded shadow">
          <h3 className="flex items-center gap-2 mb-4 text-xl font-semibold">
            <span>🛒</span> Your Orders
          </h3>
          {orders.length > 0 ? (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order._id} className="p-4 bg-gray-100 border rounded">
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.total}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status || "Pending"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500">No orders found.</p>
          )}
        </section>
      </main>
    </Layout>
  );
}
