-- Grant full admin access to all tables
-- Admins with the 'admin' role can now manage all data across all tables

-- notification_preferences: Add admin access
CREATE POLICY "Admins can manage all notification preferences"
ON public.notification_preferences
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- profiles: Add admin full access
CREATE POLICY "Admins can manage all profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- project_likes: Add admin access
CREATE POLICY "Admins can manage all project likes"
ON public.project_likes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- project_ratings: Add admin access
CREATE POLICY "Admins can manage all project ratings"
ON public.project_ratings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- purchases: Add admin access
CREATE POLICY "Admins can manage all purchases"
ON public.purchases
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- search_history: Add admin access
CREATE POLICY "Admins can manage all search history"
ON public.search_history
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- seller_subscriptions: Add admin access
CREATE POLICY "Admins can manage all seller subscriptions"
ON public.seller_subscriptions
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add helpful comment
COMMENT ON FUNCTION public.has_role IS 'Checks if a user has a specific role. Used in RLS policies to grant role-based permissions.';