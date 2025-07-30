"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";

export default function Header({ user, onLogout }) {
  const { cartCount } = useAuth();

  return (
    <header className="cosmic-header sticky top-0 z-50 bg-gradient-to-r from-[#8f6690] to-[#b278a8] bg-opacity-80 backdrop-blur-xl rounded-2xl shadow-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#8D7DFA] to-[#C9BBF7] flex items-center justify-center shadow-[0_0_15px_rgba(141,125,250,0.5)] floating">
              <span className="text-xl font-bold text-white">🚀</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF6B8E] border-2 border-white"></div>
            </div>
            <span className="text-2xl font-bold tracking-wider text-white">
              COSMIC<span className="text-[#C9BBF7]">SHOP</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="nav-link text-white hover:text-[#C9BBF7] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/categories"
              className="nav-link text-white hover:text-[#C9BBF7] transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/products"
              className="nav-link text-white hover:text-[#C9BBF7] transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="nav-link text-white hover:text-[#C9BBF7] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="nav-link text-white hover:text-[#C9BBF7] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-[#483C7A] transition-colors"
            >
              <span className="sr-only">Cart</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B8E] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/users/profile"
                  className="flex items-center space-x-2 p-2 rounded-full bg-[#483C7A] hover:bg-[#5D4E8C] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#8D7DFA] to-[#9E91FF] flex items-center justify-center text-white font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden md:inline text-white">
                    {user.name || "User"}
                  </span>
                </Link>
                <button
                  onClick={onLogout}
                  className="hidden md:block btn btn-secondary text-sm py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/users/login"
                  className="btn btn-primary text-sm py-2"
                >
                  Login
                </Link>
                <Link
                  href="/users/signup"
                  className="hidden md:block btn btn-secondary text-sm py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-full hover:bg-[#483C7A] transition-colors">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
