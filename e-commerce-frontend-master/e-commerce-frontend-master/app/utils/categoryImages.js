// Category image configurations
export const categoryImageConfig = {
  // Fashion Categories
  "womens-fashion": {
    primary:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop&crop=face",
    fallback:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop&crop=center",
    alt: "Women&apos;s Fashion",
  },
  "mens-fashion": {
    primary:
      "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    alt: "Men&apos;s Fashion",
  },

  // Accessories
  accessories: {
    primary:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop&crop=center",
    alt: "Accessories",
  },

  // Footwear
  footwear: {
    primary:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop&crop=center",
    alt: "Footwear",
  },

  // Electronics
  electronics: {
    primary:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&crop=center",
    alt: "Electronics",
  },

  // Home & Garden
  "home-appliances": {
    primary:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&crop=center",
    alt: "Home Appliances",
  },
  "home-garden": {
    primary:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1616627426203-4b6aab2d6b75?w=400&h=400&fit=crop&crop=center",
    alt: "Home & Garden",
  },

  // Beauty & Health
  "beauty-health": {
    primary:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop&crop=center",
    alt: "Beauty & Health",
  },

  // Sports & Fitness
  "sports-fitness": {
    primary:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&crop=center",
    alt: "Sports & Fitness",
  },

  // Books & Media
  "books-media": {
    primary:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=center",
    alt: "Books & Media",
  },

  // Toys & Games
  "toys-games": {
    primary:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1558060370-d140bb8e8932?w=400&h=400&fit=crop&crop=center",
    alt: "Toys & Games",
  },

  // Automotive
  automotive: {
    primary:
      "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=400&fit=crop&crop=center",
    fallback:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=400&fit=crop&crop=center",
    alt: "Automotive",
  },
};

// Default fallback image
export const defaultCategoryImage = {
  primary:
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
  fallback: "https://via.placeholder.com/400x400/8D7DFA/FFFFFF?text=Category",
  alt: "Category",
};

// Function to get category image
export const getCategoryImage = (slug, useSecondary = false) => {
  const config = categoryImageConfig[slug];
  if (!config) {
    return useSecondary
      ? defaultCategoryImage.fallback
      : defaultCategoryImage.primary;
  }
  return useSecondary ? config.fallback : config.primary;
};

// Function to get category alt text
export const getCategoryAlt = (slug, name) => {
  const config = categoryImageConfig[slug];
  return config?.alt || name || "Category";
};
