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
      description: 'Contemporary styles for men.',
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
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#8D7DFA] opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#C9BBF7] opacity-10 blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-6xl w-full mx-auto">
          <div className="backdrop-blur-xl bg-[#7c527c]/60 border border-white/10 rounded-3xl shadow-xl p-10">
            <div className="text-center mb-12">
              <h1 className="mb-4">Explore Categories</h1>
              <p className="text-[#C9BBF7] max-w-2xl mx-auto">
                Discover our carefully curated collections across different cosmic realms.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {demoCategories.map(cat => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                  <div className="glass-card p-6 text-center hover:shadow-[0_0_20px_rgba(141,125,250,0.3)] transition-all duration-300 group cursor-pointer">
                    <div className="w-24 h-24 rounded-full bg-[#8D7DFA] bg-opacity-20 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
                    <p className="text-[#C9BBF7] text-sm">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 