-- ==============================================================================
-- GlobeTrotter - Direct Database Mode (Auth-Free Direct PostgreSQL Persistence)
-- File: supabase/migrations/003_direct_database_mode.sql
-- Description: Unlocks direct Supabase CRUD for profiles, trips, stops, activities,
--              and expenses without email verification or auth session blockers.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT,
  avatar_url TEXT,
  language TEXT DEFAULT 'English',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop auth.users FK constraint if present so any user profile can be created directly
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
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

ALTER TABLE public.trips DROP CONSTRAINT IF EXISTS trips_user_id_fkey;

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

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip_stop_id ON public.activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);

-- Disable RLS to allow direct database reads/writes without token requirement
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses DISABLE ROW LEVEL SECURITY;
