import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch('http://localhost:3000/cart')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setTotal(data.items ? data.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) : 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdate = (id, quantity) => {
    // Implement update logic (API call)
  };
  const handleRemove = (id) => {
    // Implement remove logic (API call)
  };

  return (
    <Layout>
      <main className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">🛒 Your Cart</h2>
        {items.length === 0 ? (
          <div className="text-center py-16">
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" className="mx-auto w-32 h-32 mb-4 opacity-70" />
            <h3 className="text-xl font-semibold text-gray-600">Oops! Your cart is empty</h3>
            <p className="text-gray-500">Looks like you haven't added anything to your cart yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map(item => (
                <div key={item.product._id} className="border rounded-lg shadow hover:shadow-lg overflow-hidden">
                  <img src={item.product.imageUrl || `/uploads/${item.product.imageFile}` || 'https://via.placeholder.com/300'} className="w-full h-48 object-cover" alt={item.product.name} />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">{item.product.description}</p>
                    <p className="text-blue-700 font-bold mt-2">₹{item.product.price}</p>
                    <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    <form className="mt-2 flex gap-2" onSubmit={e => { e.preventDefault(); handleUpdate(item.product._id, e.target.quantity.value); }}>
                      <input type="number" name="quantity" defaultValue={item.quantity} min="1" className="border px-2 py-1 rounded w-16 text-sm" />
                      <button className="px-2 py-1 bg-green-600 text-white text-sm rounded">Update</button>
                    </form>
                    <button className="text-red-500 text-sm mt-2" onClick={() => handleRemove(item.product._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-right">
              <p className="text-lg font-semibold">Subtotal: ₹{total}</p>
              <p className="text-sm text-gray-500">Delivery: ₹50</p>
              <p className="text-xl font-bold mt-1">Total: ₹{total + 50}</p>
              <form action="/checkout" method="GET" className="inline-block mt-4">
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">Proceed to Checkout</button>
              </form>
            </div>
          </>
        )}
      </main>
    </Layout>
  );
} 