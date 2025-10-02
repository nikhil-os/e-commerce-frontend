import React from 'react';
import Link from 'next/link';

export default function ProductCard({ product, onAddToCart }) {
  const { _id, name, price, discount, image, category } = product;
  
  // Calculate discounted price
  const discountedPrice = discount ? price - (price * discount / 100) : price;
  
  // Format price to INR
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card group relative overflow-hidden transition-all duration-500 hover:translate-y-[-8px] bg-[#D183A9]">
      {/* Discount badge */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-[#FF6B8E] text-white text-xs font-bold px-2 py-1 rounded-full">
          {discount}% OFF
        </div>
      )}
      
      {/* Category badge */}
      <div className="absolute top-3 right-3 z-10 bg-[#5D4E8C] bg-opacity-70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
        {category}
      </div>
      
      {/* Image container */}
      <Link href={`/products/${_id}`}>
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#3A3159] to-transparent opacity-0 group-hover:opacity-30 transition-opacity z-10"></div>
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
      </Link>
      
      {/* Content */}
      <div className="p-5 relative">
        {/* Floating glow orb */}
        <div className="absolute -top-4 right-8 w-8 h-8 rounded-full bg-[#8D7DFA] opacity-30 blur-md"></div>
        
        <Link href={`/products/${_id}`}>
          <h3 className="font-bold text-lg mb-2 text-white group-hover:text-[#C9BBF7] transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white">{formatPrice(discountedPrice)}</span>
            {discount > 0 && (
              <span className="text-sm text-[#C9BBF7] line-through opacity-70">{formatPrice(price)}</span>
            )}
          </div>
          
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < 4 ? 'text-[#FFCC66]' : 'text-[#7A6BC7]'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-[#C9BBF7] ml-1">(4.0)</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onAddToCart(product, 1)} 
            className="flex-1 bg-[#81537e] hover:bg-[#4c345e] text-white py-2 rounded-full text-sm font-medium transition-colors duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart
          </button>
          
          <button className="p-2 bg-[#81537e] hover:bg-[#4c345e] text-white rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 