-- FIX SECURITY WARNINGS

-- 1. Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Fix function search_path for handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, ho_va_ten)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'ho_va_ten', NEW.email));
  
  -- Assign default 'viewer' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'viewer');
  
  RETURN NEW;
END;
$$;

-- 3. Fix overly permissive RLS policy for incidents INSERT
-- Drop the old policy and create a more restrictive one
DROP POLICY IF EXISTS "Staff can insert incidents" ON public.incidents;

CREATE POLICY "Authenticated can insert incidents"
  ON public.incidents FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND nguoi_bao_cao = auth.uid()
  );