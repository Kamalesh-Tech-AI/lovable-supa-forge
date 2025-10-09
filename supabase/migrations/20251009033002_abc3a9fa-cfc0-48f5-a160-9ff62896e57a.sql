-- Fix critical security issue: Profiles table public exposure
-- This migration removes public access to sensitive profile data

-- Step 1: Create enum type (skip if exists)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'buyer', 'seller', 'developer', 'both');
  END IF;
END $$;

-- Step 2: Create user_roles table (skip if exists)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Migrate existing role data from profiles to user_roles
DO $$
BEGIN
  -- Insert buyer/seller/admin/developer roles
  INSERT INTO public.user_roles (user_id, role)
  SELECT user_id, role::app_role
  FROM public.profiles
  WHERE role IS NOT NULL AND role != 'both'
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Handle 'both' role - split into buyer and seller
  INSERT INTO public.user_roles (user_id, role)
  SELECT user_id, 'buyer'::app_role
  FROM public.profiles
  WHERE role = 'both'
  ON CONFLICT (user_id, role) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  SELECT user_id, 'seller'::app_role
  FROM public.profiles
  WHERE role = 'both'
  ON CONFLICT (user_id, role) DO NOTHING;
END $$;

-- Step 4: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Step 5: Update is_admin function to use new user_roles table
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

-- Step 6: Drop the dangerously permissive public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Step 7: Create secure RLS policies for profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Authenticated users can view public info'
  ) THEN
    CREATE POLICY "Authenticated users can view public info"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);
  END IF;
END $$;

-- Step 8: Create public view with only non-sensitive fields
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  user_id,
  display_name,
  star_rating,
  created_at
FROM public.profiles;

-- Step 9: RLS policies for user_roles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Users can view own roles'
  ) THEN
    CREATE POLICY "Users can view own roles"
    ON public.user_roles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_roles' AND policyname = 'Admins can manage all roles'
  ) THEN
    CREATE POLICY "Admins can manage all roles"
    ON public.user_roles
    FOR ALL
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- Step 10: Add update trigger for user_roles
DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comments
COMMENT ON TABLE public.user_roles IS 'Stores user roles separately from profiles for security. Use has_role() function in RLS policies to prevent recursion.';
COMMENT ON VIEW public.public_profiles IS 'Public view exposing only non-sensitive profile fields (display_name, star_rating).';