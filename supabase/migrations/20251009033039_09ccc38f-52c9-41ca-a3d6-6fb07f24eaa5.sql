-- Fix SECURITY DEFINER view issue detected by linter
-- Update public_profiles view to use SECURITY INVOKER to respect RLS policies

-- Drop and recreate the view with SECURITY INVOKER
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker=on)
AS
SELECT 
  user_id,
  display_name,
  star_rating,
  created_at
FROM public.profiles;

COMMENT ON VIEW public.public_profiles IS 'Public view with only non-sensitive profile fields. Uses SECURITY INVOKER to respect RLS policies.';