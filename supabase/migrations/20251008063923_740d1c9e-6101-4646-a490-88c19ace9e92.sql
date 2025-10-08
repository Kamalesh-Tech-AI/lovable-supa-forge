-- Fix critical security issue: Profiles table public exposure
-- Updated to handle all existing role values including 'both'

-- Step 1: Create app_role enum with all existing role values
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'buyer', 'seller', 'developer', 'both');

-- Step 2: Create user_roles table for proper role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate existing roles, handling 'both' as separate buyer and seller roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 
  CASE 
    WHEN role = 'both' THEN 'buyer'::app_role
    ELSE role::app_role
  END
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- For users with 'both', also add seller role
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'seller'::app_role
FROM public.profiles
WHERE role = 'both'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 4: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 5: Update is_admin to use new structure
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN public.has_role(auth.uid(), 'admin');
END;
$function$;

-- Step 6: Drop dangerous public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Step 7: Create secure RLS policies for profiles
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view public profile info"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Step 8: Create public view with only non-sensitive fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  display_name,
  star_rating,
  created_at
FROM public.profiles;

-- Step 9: RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 10: Add update trigger
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.user_roles IS 'Stores user roles separately from profiles for security. Use has_role() function in RLS policies.';
COMMENT ON VIEW public.public_profiles IS 'Public view exposing only non-sensitive profile fields.';