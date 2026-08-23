-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget_limit NUMERIC NOT NULL CHECK (budget_limit >= 0),
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'ongoing', 'completed')),
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Trip Stops Table
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  city_image TEXT,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  stop_order INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Sightseeing', 'Food', 'Adventure', 'Culture', 'Shopping', 'Relaxation')),
  description TEXT,
  image_url TEXT,
  activity_date DATE,
  start_time TEXT,
  duration_minutes INT DEFAULT 60,
  estimated_cost_inr NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Transport', 'Accommodation', 'Activities', 'Meals', 'Miscellaneous')),
  description TEXT,
  amount_inr NUMERIC NOT NULL CHECK (amount_inr >= 0),
  expense_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Enablement
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. Trips Policies
CREATE POLICY "Users can select own trips" 
  ON public.trips FOR SELECT 
  USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can insert own trips" 
  ON public.trips FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" 
  ON public.trips FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" 
  ON public.trips FOR DELETE 
  USING (auth.uid() = user_id);

-- Helper functions to check trip ownership
CREATE OR REPLACE FUNCTION public.check_trip_ownership(trip_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trips 
    WHERE id = trip_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trip Stops Policies
CREATE POLICY "Users can select stops for own trips" 
  ON public.trip_stops FOR SELECT 
  USING (
    public.check_trip_ownership(trip_id) OR 
    EXISTS (SELECT 1 FROM public.trips WHERE id = trip_id AND is_public = true)
  );

CREATE POLICY "Users can insert stops for own trips" 
  ON public.trip_stops FOR INSERT 
  WITH CHECK (public.check_trip_ownership(trip_id));

CREATE POLICY "Users can update stops for own trips" 
  ON public.trip_stops FOR UPDATE 
  USING (public.check_trip_ownership(trip_id));

CREATE POLICY "Users can delete stops for own trips" 
  ON public.trip_stops FOR DELETE 
  USING (public.check_trip_ownership(trip_id));

-- Helper function to check stop ownership
CREATE OR REPLACE FUNCTION public.check_stop_ownership(stop_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.trip_stops s
    JOIN public.trips t ON s.trip_id = t.id
    WHERE s.id = stop_id AND t.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Activities Policies
CREATE POLICY "Users can select activities for own trips" 
  ON public.activities FOR SELECT 
  USING (
    public.check_stop_ownership(trip_stop_id) OR
    EXISTS (
      SELECT 1 FROM public.trip_stops s
      JOIN public.trips t ON s.trip_id = t.id
      WHERE s.id = trip_stop_id AND t.is_public = true
    )
  );

CREATE POLICY "Users can insert activities for own trips" 
  ON public.activities FOR INSERT 
  WITH CHECK (public.check_stop_ownership(trip_stop_id));

CREATE POLICY "Users can update activities for own trips" 
  ON public.activities FOR UPDATE 
  USING (public.check_stop_ownership(trip_stop_id));

CREATE POLICY "Users can delete activities for own trips" 
  ON public.activities FOR DELETE 
  USING (public.check_stop_ownership(trip_stop_id));

-- 5. Expenses Policies
CREATE POLICY "Users can select expenses for own trips" 
  ON public.expenses FOR SELECT 
  USING (public.check_trip_ownership(trip_id));

CREATE POLICY "Users can insert expenses for own trips" 
  ON public.expenses FOR INSERT 
  WITH CHECK (public.check_trip_ownership(trip_id));

CREATE POLICY "Users can update expenses for own trips" 
  ON public.expenses FOR UPDATE 
  USING (public.check_trip_ownership(trip_id));

CREATE POLICY "Users can delete expenses for own trips" 
  ON public.expenses FOR DELETE 
  USING (public.check_trip_ownership(trip_id));

-- ==============================================================================
-- 6. Automatic Profile Creation Trigger on auth.users (SECURITY DEFINER)
-- ==============================================================================

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
  -- Extract full_name from auth metadata or fallback to email username
  extracted_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    split_part(NEW.email, '@', 1),
    'Explorer'
  );

  extracted_avatar := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'avatar_url'), ''),
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

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
    RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

