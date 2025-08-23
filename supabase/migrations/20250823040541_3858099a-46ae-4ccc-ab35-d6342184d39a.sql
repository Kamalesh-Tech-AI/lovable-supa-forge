-- Add sample projects with approved status
INSERT INTO public.projects (
  title, 
  description, 
  price_inr, 
  category, 
  tech_stack, 
  features, 
  status,
  seller_id,
  screenshot_url,
  images
) VALUES 
(
  'E-commerce Dashboard',
  'Complete e-commerce admin dashboard with inventory management, order tracking, and analytics.',
  45000,
  'dashboard',
  '["React", "Node.js", "PostgreSQL", "Tailwind CSS"]',
  '["Real-time analytics", "Inventory management", "Order tracking", "User management", "Payment integration"]',
  'approved',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg',
  '["dashboard-1.jpg", "dashboard-2.jpg", "dashboard-3.jpg"]'
),
(
  'Portfolio Website Template',
  'Modern responsive portfolio website template with dark/light mode, animations, and contact form.',
  15000,
  'portfolio',
  '["React", "TypeScript", "Framer Motion", "Tailwind CSS"]',
  '["Responsive design", "Dark mode", "Smooth animations", "Contact form", "SEO optimized"]',
  'approved',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg',
  '["portfolio-1.jpg", "portfolio-2.jpg"]'
),
(
  'Task Management App',
  'Full-featured task management application with team collaboration, deadlines, and progress tracking.',
  35000,
  'saas app',
  '["Vue.js", "Express.js", "MongoDB", "Socket.io"]',
  '["Team collaboration", "Deadline tracking", "Progress visualization", "Real-time updates", "File attachments"]',
  'approved',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg',
  '["task-app-1.jpg", "task-app-2.jpg", "task-app-3.jpg"]'
),
(
  'Restaurant Landing Page',
  'Beautiful restaurant landing page with menu display, reservation system, and location integration.',
  20000,
  'landing page',
  '["HTML5", "CSS3", "JavaScript", "PHP"]',
  '["Menu showcase", "Online reservations", "Location maps", "Gallery", "Contact integration"]',
  'approved',
  (SELECT user_id FROM public.profiles WHERE role = 'admin' LIMIT 1),
  '/placeholder.svg',
  '["restaurant-1.jpg", "restaurant-2.jpg"]'
);