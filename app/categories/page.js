import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const demoCategories = [
  {
    slug: 'womens',
    name: "Women's Clothing",
    description: 'Trendy and elegant dresses, tops, and ethnic wear.',
    image: 'https://i.pinimg.com/736x/98/b2/93/98b2939c723b0dd7284e63378bb65ee6.jpg',
  },
  {
    slug: 'mens',
    name: "Men's Fashion",
    description: 'Casual shirts, office wear, and festive looks.',
    image: 'https://i.pinimg.com/736x/82/48/ab/8248abc28ceab53fecca5d00b1f7986e.jpg',
  },
  {
    slug: 'handbags',
    name: 'Handbags & Purses',
    description: 'Stylish totes, clutches, and shoulder bags.',
    image: 'https://i.pinimg.com/736x/9b/a7/ec/9ba7ec043aecef2f1fc3e2525ee00066.jpg',
  },
  {
    slug: 'accessories',
    name: 'Jewellery & Accessories',
    description: 'Chic earrings, watches, sunglasses and more.',
    image: 'https://i.pinimg.com/736x/a5/47/b7/a547b7b16f191b0d03d31a130b05a54a.jpg',
  },
  {
    slug: 'footwear',
    name: 'Footwear',
    description: 'Stylish heels, sneakers, and traditional footwear.',
    image: 'https://i.pinimg.com/736x/83/24/e4/8324e4aa41326c46276416dca10b9677.jpg',
  },
  {
    slug: 'luxury',
    name: 'Luxury Collection',
    description: 'Exclusive designer pieces curated for elegance.',
    image: 'https://i.pinimg.com/736x/1c/c8/f5/1cc8f58797ed911aef8e08987f4e346f.jpg',
  },
];

export default function CategoriesPage() {
  return (
    <Layout>
      <section className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">🗂️ Explore Our Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {demoCategories.map(cat => (
            <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition duration-300">
              <img src={cat.image} alt={cat.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{cat.name}</h3>
                <p className="text-sm text-gray-600">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
} 