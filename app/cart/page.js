'use client';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { user, cartItems, updateCartItem, removeFromCart, fetchCartData } =
    useAuth();
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/users/login');
      return;
    }

    const loadCart = async () => {
      try {
        await fetchCartData();
        setLoading(false);
      } catch (error) {
        console.error('Error loading cart:', error);
        setLoading(false);
      }
    };

    loadCart();
  }, [user, router, fetchCartData]);

  useEffect(() => {
    // Calculate total whenever cart items change
    if (cartItems) {
      setTotal(
        cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )
      );
    }
  }, [cartItems]);

  const handleUpdate = async (id, quantity) => {
    try {
      if (quantity < 1) {
        return handleRemove(id);
      }

      const result = await updateCartItem(id, quantity);

      if (!result.success) {
        toast.error(result.message || 'Failed to update cart');
      } else {
        toast.success('🛒 Cart updated successfully');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart. Please try again.');
    }
  };

  const handleRemove = async (id) => {
    try {
      if (window.confirm('Remove this item from cart?')) {
        const result = await removeFromCart(id);

        if (!result.success) {
          toast.error(result.message || 'Failed to remove item');
        } else {
          toast.success('🗑️ Item removed from cart');
        }
      }
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  return (
    <Layout>
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🛒 Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
              alt="Empty Cart"
              className="mx-auto w-32 h-32 mb-4 opacity-70"
            />
            <h3 className="text-xl font-semibold text-gray-600">
              Oops! Your cart is empty
            </h3>
            <p className="text-gray-500">
              Looks like you haven’t added anything to your cart yet.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="border rounded-lg shadow hover:shadow-lg overflow-hidden"
                >
                  <img
                    src={
                      item.product.imageUrl || 'https://via.placeholder.com/300'
                    }
                    className="w-full h-48 object-cover"
                    alt={item.product.name}
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.product.description}
                    </p>
                    <p className="text-blue-700 font-bold mt-2">
                      ₹{item.product.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {item.quantity}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() =>
                          handleUpdate(item.product._id, item.quantity - 1)
                        }
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 border rounded">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdate(item.product._id, item.quantity + 1)
                        }
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                      >
                        +
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white text-sm rounded ml-auto"
                        onClick={() => handleRemove(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right">
              <p className="text-lg font-semibold">Subtotal: ₹{total}</p>
              <p className="text-sm text-gray-500">Delivery: ₹50</p>
              <p className="text-xl font-bold mt-1">Total: ₹{total + 50}</p>
              <button
                onClick={() => router.push('/checkout')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
}
