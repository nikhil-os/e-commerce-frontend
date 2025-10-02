-- SQL queries to fix broken Cloudinary demo image URLs in your backend database

-- For Products table
UPDATE products 
SET imageUrl = CASE 
  WHEN imageUrl LIKE '%sample_2.jpg%' THEN 'https://picsum.photos/400/400?random=1'
  WHEN imageUrl LIKE '%sample_3.jpg%' THEN 'https://picsum.photos/400/400?random=2'
  WHEN imageUrl LIKE '%sample_4.jpg%' THEN 'https://picsum.photos/400/400?random=3'
  WHEN imageUrl LIKE '%sample_5.jpg%' THEN 'https://picsum.photos/400/400?random=4'
  WHEN imageUrl LIKE '%clothing.jpg%' THEN 'https://picsum.photos/400/400?random=5'
  WHEN imageUrl LIKE '%electronics.jpg%' THEN 'https://picsum.photos/400/400?random=6'
  WHEN imageUrl LIKE '%home.jpg%' THEN 'https://picsum.photos/400/400?random=7'
  WHEN imageUrl LIKE '%books.jpg%' THEN 'https://picsum.photos/400/400?random=8'
  WHEN imageUrl LIKE '%sports.jpg%' THEN 'https://picsum.photos/400/400?random=9'
  ELSE imageUrl
END
WHERE imageUrl LIKE '%res.cloudinary.com/demo%';

-- For Categories table (if you have one)
UPDATE categories 
SET imageUrl = CASE 
  WHEN imageUrl LIKE '%clothing.jpg%' THEN 'https://picsum.photos/300/300?random=10'
  WHEN imageUrl LIKE '%electronics.jpg%' THEN 'https://picsum.photos/300/300?random=11'
  WHEN imageUrl LIKE '%home.jpg%' THEN 'https://picsum.photos/300/300?random=12'
  WHEN imageUrl LIKE '%books.jpg%' THEN 'https://picsum.photos/300/300?random=13'
  WHEN imageUrl LIKE '%sports.jpg%' THEN 'https://picsum.photos/300/300?random=14'
  ELSE imageUrl
END
WHERE imageUrl LIKE '%res.cloudinary.com/demo%';

-- Alternative: Use Unsplash Source images (more consistent)
-- UPDATE products 
-- SET imageUrl = CASE 
--   WHEN imageUrl LIKE '%sample_2.jpg%' THEN 'https://source.unsplash.com/400x400/?product'
--   WHEN imageUrl LIKE '%sample_3.jpg%' THEN 'https://source.unsplash.com/400x400/?gadget'
--   WHEN imageUrl LIKE '%sample_4.jpg%' THEN 'https://source.unsplash.com/400x400/?fashion'
--   WHEN imageUrl LIKE '%sample_5.jpg%' THEN 'https://source.unsplash.com/400x400/?tech'
--   WHEN imageUrl LIKE '%clothing.jpg%' THEN 'https://source.unsplash.com/400x400/?clothing'
--   WHEN imageUrl LIKE '%electronics.jpg%' THEN 'https://source.unsplash.com/400x400/?electronics'
--   WHEN imageUrl LIKE '%home.jpg%' THEN 'https://source.unsplash.com/400x400/?home'
--   WHEN imageUrl LIKE '%books.jpg%' THEN 'https://source.unsplash.com/400x400/?books'
--   WHEN imageUrl LIKE '%sports.jpg%' THEN 'https://source.unsplash.com/400x400/?sports'
--   ELSE imageUrl
-- END
-- WHERE imageUrl LIKE '%res.cloudinary.com/demo%';
