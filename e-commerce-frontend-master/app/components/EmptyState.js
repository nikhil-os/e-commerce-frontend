import React from "react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="text-center mt-10 text-gray-500">
      <img
        src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
        alt="Empty Cart"
        className="w-32 mx-auto mb-4 opacity-60"
      />
      <h3 className="text-xl font-semibold">Your cart is empty!</h3>
      <p className="text-sm mt-1">
        Looks like you haven&apos;t added anything yet.
      </p>
      <Link
        href="/products"
        className="inline-block mt-4 text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Browse Products
      </Link>
    </div>
  );
}
