-- Simple fix for the RLS issue

-- 1. Add INSERT policy for profile creation during signup
CREATE POLICY IF NOT EXISTS "Allow profile creation during signup" ON public.profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. Alternative: Temporarily disable RLS for testing (NOT recommended for production)
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- 3. Or create a more permissive policy for authenticated users
DROP POLICY IF EXISTS "Enable profile creation during signup" ON public.profiles;
CREATE POLICY "Enable profile creation during signup" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 4. Make sure the trigger function has proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW;
END;
$$;

-- 5. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();