-- Minimal fix - just add the missing INSERT policy

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "Enable profile creation during signup" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Create a simple INSERT policy that allows users to create their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Alternative: More permissive policy for authenticated users
-- CREATE POLICY "Enable profile creation" ON public.profiles
--   FOR INSERT TO authenticated
--   WITH CHECK (true);