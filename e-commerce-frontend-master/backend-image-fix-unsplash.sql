-- Alternative image URLs for specific categories (more realistic)

-- For Categories table with specific themed images
UPDATE categories 
SET imageUrl = CASE 
  WHEN name LIKE '%clothing%' OR name LIKE '%fashion%' THEN 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
  WHEN name LIKE '%electronics%' OR name LIKE '%tech%' THEN 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=400&fit=crop'
  WHEN name LIKE '%home%' OR name LIKE '%furniture%' THEN 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop'
  WHEN name LIKE '%books%' OR name LIKE '%literature%' THEN 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  WHEN name LIKE '%sports%' OR name LIKE '%fitness%' THEN 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
END
WHERE imageUrl LIKE '%res.cloudinary.com/demo%';

-- For Products table with better fallback images
UPDATE products 
SET imageUrl = CASE 
  WHEN imageUrl LIKE '%sample_2.jpg%' THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
  WHEN imageUrl LIKE '%sample_3.jpg%' THEN 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  WHEN imageUrl LIKE '%sample_4.jpg%' THEN 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop'
  WHEN imageUrl LIKE '%sample_5.jpg%' THEN 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
  ELSE 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop'
END
WHERE imageUrl LIKE '%res.cloudinary.com/demo%';
