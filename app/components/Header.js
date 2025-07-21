"use client"
import React, { useState } from 'react';
import Link from 'next/link';

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => setMenuOpen((open) => !open);
  const handleLogout = (e) => {
    e.preventDefault();
    if (onLogout) onLogout();
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md">
      <div className="container-custom py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            <span className="text-3xl">🛒</span> Scratch
          </Link>
        </div>
        
        <ul className="hidden md:flex gap-6 items-center">
          <li><Link href="/" className="hover:text-indigo-200 transition-colors font-medium">Home</Link></li>
          <li><Link href="/categories" className="hover:text-indigo-200 transition-colors font-medium">Categories</Link></li>
          <li>
            {user ? (
              <Link href="/cart" className="hover:text-indigo-200 transition-colors font-medium">Cart</Link>
            ) : (
              <a href="#" id="cartToast" className="hover:text-indigo-200 transition-colors font-medium">Cart</a>
            )}
          </li>
          <li><Link href="/about" className="hover:text-indigo-200 transition-colors font-medium">About Us</Link></li>
          <li><Link href="/contact" className="hover:text-indigo-200 transition-colors font-medium">Contact</Link></li>
        </ul>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              id="menuButton"
              className="p-2 hover:bg-indigo-700 rounded-full transition-colors"
              onClick={handleMenuToggle}
              aria-label="User menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 text-gray-700 dark:text-gray-200 py-1 border border-gray-200 dark:border-gray-700">
                {user ? (
                  <>
                    <Link href="/users/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">👤 Profile</Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed">👤 Profile</div>
                    <Link href="/users/login" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">🔑 Login</Link>
                    <Link href="/users/signup" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">📝 Signup</Link>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md hover:bg-indigo-700 transition-colors" onClick={() => {}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
} 