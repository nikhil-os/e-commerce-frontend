import React, { useState } from 'react';

export default function ProductCard({ product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border shadow-lg rounded-lg p-4 text-center bg-white transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300">
      {/* Image Box */}
      <div className="w-full h-48 flex items-center justify-center overflow-hidden bg-gray-100">
        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain" />
      </div>
      {/* Product Info */}
      <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
      <p className="text-gray-600">Price: ₹{product.price}</p>
      <p className="text-green-600">Discount: {product.discount}%</p>
      <p className="text-sm text-gray-500 mt-2">{product.description}</p>
      <p className="text-xs italic text-gray-400 mt-1">Category: {product.category}</p>
      {/* Quantity + Add to Cart */}
      <div className="mt-3 flex items-center justify-center">
        <input
          type="number"
          value={quantity}
          min={1}
          className="w-16 px-2 py-1 border rounded quantity-input"
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <button
          className="ml-2 bg-green-600 text-white px-3 py-1 rounded add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product, quantity)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 