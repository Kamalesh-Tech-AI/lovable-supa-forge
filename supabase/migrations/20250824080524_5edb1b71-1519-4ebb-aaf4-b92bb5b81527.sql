-- First create a demo profile that doesn't reference auth.users
INSERT INTO public.profiles (user_id, display_name, role)
VALUES ('11111111-1111-1111-1111-111111111111'::uuid, 'Demo Developer', 'seller')
ON CONFLICT (user_id) DO NOTHING;

-- Add a simple sample project
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
  ARRAY['Real-time analytics', 'Inventory management', 'Order tracking'],
  'approved',
  '11111111-1111-1111-1111-111111111111'::uuid,
  '/placeholder.svg'
);