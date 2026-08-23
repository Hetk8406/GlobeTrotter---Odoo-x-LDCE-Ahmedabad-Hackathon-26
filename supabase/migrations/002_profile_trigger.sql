-- ==============================================================================
-- Migration: 002_profile_trigger.sql
-- Description: Creates a PostgreSQL SECURITY DEFINER trigger to automatically
--              insert a row into public.profiles whenever a new user signs up in auth.users.
-- ==============================================================================

-- 1. Create the trigger function in public schema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  extracted_name TEXT;
  extracted_avatar TEXT;
BEGIN
  -- Extract full_name from auth metadata or fallback to email local part
  extracted_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(NEW.email, '@', 1),
    'Explorer'
  );

  -- Extract avatar_url from metadata or use default traveler avatar
  extracted_avatar := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  -- Safely insert or update profile row in public.profiles
  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    language,
    avatar_url,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    extracted_name,
    NEW.email,
    'English',
    extracted_avatar,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log warning and avoid aborting auth transaction
    RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- 2. Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Create the Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill any existing auth.users without profiles
INSERT INTO public.profiles (id, full_name, email, language, avatar_url, created_at, updated_at)
SELECT 
  u.id,
  COALESCE(
    NULLIF(TRIM(u.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(u.raw_user_meta_data->>'name'), ''),
    split_part(u.email, '@', 1),
    'Explorer'
  ) AS full_name,
  u.email,
  'English',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  NOW(),
  NOW()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
