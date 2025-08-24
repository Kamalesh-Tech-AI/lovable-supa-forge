-- Add sample projects directly without foreign key constraints for testing
-- First, let's add sample data by temporarily disabling the foreign key constraint
-- or working with existing structure

-- Insert sample projects directly into the projects table
INSERT INTO public.projects (
  title, 
  description, 
  price_inr, 
  category, 
  tech_stack, 
  features, 
  status,
  seller_id,
  screenshot_url
) VALUES 
(
  'E-commerce Dashboard',
  'Complete e-commerce admin dashboard with inventory management, order tracking, and analytics.',
  45000,
  'dashboard',
  '["React", "Node.js", "PostgreSQL", "Tailwind CSS"]'::jsonb,
  ARRAY['Real-time analytics', 'Inventory management', 'Order tracking', 'User management', 'Payment integration'],
  'approved',
  (SELECT user_id FROM public.profiles LIMIT 1),
  '/placeholder.svg'
),
(
  'Portfolio Website Template',
  'Modern responsive portfolio website template with dark/light mode, animations, and contact form.',
  15000,
  'portfolio',
  '["React", "TypeScript", "Framer Motion", "Tailwind CSS"]'::jsonb,
  ARRAY['Responsive design', 'Dark mode', 'Smooth animations', 'Contact form', 'SEO optimized'],
  'approved',
  (SELECT user_id FROM public.profiles LIMIT 1),
  '/placeholder.svg'
),
(
  'Task Management App',
  'Full-featured task management application with team collaboration, deadlines, and progress tracking.',
  35000,
  'saas app',
  '["Vue.js", "Express.js", "MongoDB", "Socket.io"]'::jsonb,
  ARRAY['Team collaboration', 'Deadline tracking', 'Progress visualization', 'Real-time updates', 'File attachments'],
  'approved',
  (SELECT user_id FROM public.profiles LIMIT 1),
  '/placeholder.svg'
);