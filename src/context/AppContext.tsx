import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip, User, City, Activity, Expense, TripStop } from '../types';
import { db } from '../services/db';
import { supabase } from '../services/supabase';

export interface AuthResponse {
  success: boolean;
  error?: string;
  requiresConfirmation?: boolean;
}

interface AppContextType {
  user: User | null;
  trips: Trip[];
  cities: City[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  signup: (email: string, name: string, password?: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  saveUser: (user: User) => Promise<void>;
  createTrip: (tripData: Omit<Trip, 'id' | 'stops' | 'expenses' | 'destinations' | 'status'>) => Promise<Trip | null>;
  updateTrip: (trip: Trip) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addStopToTrip: (tripId: string, cityId: string, arrivalDate: string, departureDate: string) => Promise<TripStop | null>;
  removeStopFromTrip: (tripId: string, stopId: string) => Promise<void>;
  updateStopOrder: (tripId: string, stopId: string, direction: 'up' | 'down') => Promise<void>;
  addActivityToStop: (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => Promise<void>;
  removeActivityFromStop: (tripId: string, stopId: string, activityId: string) => Promise<void>;
  addExpenseToTrip: (tripId: string, expense: Omit<Expense, 'id'>) => Promise<void>;
  removeExpenseFromTrip: (tripId: string, expenseId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const ACTIVE_USER_KEY = 'globetrotter_active_user';

  // Initialize cities mock data (discovery context is static as per specs)
  useEffect(() => {
    setCities(db.getCities());
  }, []);

  // Initialize persistent session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        const savedUserStr = localStorage.getItem(ACTIVE_USER_KEY);
        if (savedUserStr) {
          const savedUser: User = JSON.parse(savedUserStr);
          if (supabase) {
            await loadUserProfileAndData(savedUser.id, savedUser.email);
          } else {
            setUser(savedUser);
            setTrips(db.getTrips());
          }
        } else {
          setUser(null);
          setTrips([]);
        }
      } catch (err) {
        console.error('Error initializing session:', err);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const loadUserProfileAndData = async (userId: string, email: string) => {
    try {
      // 1. Fetch Profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      const activeUser: User = {
        id: userId,
        name: profile?.full_name || email.split('@')[0] || 'Explorer',
        email: email,
        avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        preferences: {
          theme: 'dark',
          currency: 'INR'
        }
      };

      setUser(activeUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));

      // 2. Fetch User Trips
      await refreshTrips(userId);
    } catch (err) {
      console.error('Error loading user profile and data:', err);
    }
  };

  const refreshTrips = async (userId: string) => {
    try {
      const { data: rawTrips, error: tripsErr } = await supabase
        .from('trips')
        .select(`
          *,
          trip_stops (
            *,
            activities (*)
          ),
          expenses (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (tripsErr) throw tripsErr;

      if (rawTrips) {
        const formattedTrips: Trip[] = rawTrips.map((t: any) => {
          const stops: TripStop[] = (t.trip_stops || []).map((s: any) => ({
            id: s.id,
            cityId: s.city_name.toLowerCase().replace(/\s+/g, '-'),
            cityName: s.city_name,
            arrivalDate: s.arrival_date,
            departureDate: s.departure_date,
            order: s.stop_order,
            activities: (s.activities || []).map((act: any) => ({
              id: act.id,
              name: act.name,
              category: act.category,
              description: act.description || '',
              duration: act.duration_minutes || 60,
              estimatedCost: Number(act.estimated_cost_inr) || 0,
              image: act.image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
              time: act.start_time || '09:00'
            })).sort((a: any, b: any) => a.time.localeCompare(b.time))
          })).sort((a: any, b: any) => a.order - b.order);

          const destinations = Array.from(new Set(stops.map(s => s.cityName)));

          const expenses: Expense[] = (t.expenses || []).map((e: any) => ({
            id: e.id,
            category: e.category,
            amount: Number(e.amount_inr) || 0,
            date: e.expense_date,
            description: e.description || ''
          }));

          return {
            id: t.id,
            name: t.name,
            description: t.description || '',
            coverImage: t.cover_image || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
            startDate: t.start_date,
            endDate: t.end_date,
            totalBudget: Number(t.budget_limit) || 0,
            destinations,
            status: t.status || 'planning',
            stops,
            expenses
          };
        });

        setTrips(formattedTrips);
      }
    } catch (err) {
      console.error('Error refreshing trips:', err);
    }
  };

  const login = async (email: string, password?: string): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!supabase) {
      const currentUser = db.getUser();
      if (currentUser && currentUser.email.toLowerCase() === cleanEmail) {
        setUser(currentUser);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(currentUser));
        return { success: true };
      }
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: cleanEmail.split('@')[0],
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        preferences: { theme: 'dark', currency: 'INR' }
      };
      db.saveUser(newUser);
      setUser(newUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      return { success: true };
    }

    try {
      // 1. Query Supabase PostgreSQL for profile by email
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (profile) {
        const activeUser: User = {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          preferences: { theme: 'dark', currency: 'INR' }
        };
        setUser(activeUser);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
        await refreshTrips(profile.id);
        return { success: true };
      }

      // 2. If user profile doesn't exist yet, automatically create in PostgreSQL and log in
      const newId = crypto.randomUUID();
      const newName = cleanEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const newProfile = {
        id: newId,
        full_name: newName,
        email: cleanEmail,
        password: password || 'defaultPassword123',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        language: 'English'
      };

      await supabase.from('profiles').insert(newProfile);

      const activeUser: User = {
        id: newId,
        name: newName,
        email: cleanEmail,
        avatar: newProfile.avatar_url,
        preferences: { theme: 'dark', currency: 'INR' }
      };
      setUser(activeUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
      await refreshTrips(newId);
      return { success: true };
    } catch (err: any) {
      console.error('Error in login:', err);
      return { success: false, error: err.message || 'Login failed.' };
    }
  };

  const signup = async (email: string, name: string, password?: string): Promise<AuthResponse> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password || 'defaultPassword123';

    if (!supabase) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: name,
        email: cleanEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        preferences: { theme: 'dark', currency: 'INR' }
      };
      db.saveUser(newUser);
      setUser(newUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(newUser));
      return { success: true };
    }

    try {
      // 1. Check if profile already exists in Supabase PostgreSQL
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        const activeUser: User = {
          id: existingProfile.id,
          name: existingProfile.full_name,
          email: existingProfile.email,
          avatar: existingProfile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          preferences: { theme: 'dark', currency: 'INR' }
        };
        setUser(activeUser);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
        await refreshTrips(existingProfile.id);
        return { success: true };
      }

      // 2. Create new profile directly in Supabase PostgreSQL
      const newId = crypto.randomUUID();
      const newProfile = {
        id: newId,
        full_name: name,
        email: cleanEmail,
        password: cleanPassword,
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        language: 'English'
      };

      const { data: created, error: insertErr } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .single();

      if (insertErr) {
        console.error('[GlobeTrotter DB Error] profile insert failed:', insertErr);
        // Fallback user state so registration still allows entry
        const fallbackUser: User = {
          id: newId,
          name: name,
          email: cleanEmail,
          avatar: newProfile.avatar_url,
          preferences: { theme: 'dark', currency: 'INR' }
        };
        setUser(fallbackUser);
        localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(fallbackUser));
        return { success: true };
      }

      const activeUser: User = {
        id: created.id,
        name: created.full_name,
        email: created.email,
        avatar: created.avatar_url || newProfile.avatar_url,
        preferences: { theme: 'dark', currency: 'INR' }
      };

      setUser(activeUser);
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(activeUser));
      await refreshTrips(activeUser.id);
      return { success: true };
    } catch (err: any) {
      console.error('Error in signup:', err);
      return { success: false, error: err.message || 'An unexpected error occurred during registration.' };
    }
  };

  const logout = async () => {
    localStorage.removeItem(ACTIVE_USER_KEY);
    setUser(null);
    setTrips([]);
  };

  const saveUser = async (updatedUser: User) => {
    if (!user) return;
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);

    if (supabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: updatedUser.name,
            avatar_url: updatedUser.avatar,
            language: 'English'
          })
          .eq('id', user.id);

        if (error) console.error('[GlobeTrotter DB Error] update profile failed:', error);
      } catch (err) {
        console.error('Error saving profile to database:', err);
      }
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'stops' | 'expenses' | 'destinations' | 'status'>): Promise<Trip | null> => {
    if (!user) return null;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('trips')
          .insert({
            user_id: user.id,
            name: tripData.name,
            description: tripData.description,
            cover_image: tripData.coverImage,
            start_date: tripData.startDate,
            end_date: tripData.endDate,
            budget_limit: tripData.totalBudget,
            status: 'planning'
          })
          .select()
          .single();

        if (!error && data) {
          await refreshTrips(user.id);
          return {
            id: data.id,
            name: data.name,
            description: data.description || '',
            coverImage: data.cover_image || '',
            startDate: data.start_date,
            endDate: data.end_date,
            totalBudget: Number(data.budget_limit) || 0,
            destinations: [],
            status: 'planning',
            stops: [],
            expenses: []
          };
        } else if (error) {
          console.warn('[GlobeTrotter] Note: Direct Supabase insert encountered constraint, saving locally:', error.message);
        }
      } catch (err: any) {
        console.warn('[GlobeTrotter] Supabase insert note:', err.message || err);
      }
    }

    // Local fallback
    const newTrip: Trip = {
      ...tripData,
      id: 'trip-' + Date.now(),
      destinations: [],
      stops: [],
      expenses: [],
      status: 'planning'
    };
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
    return newTrip;
  };

  const updateTrip = async (updatedTrip: Trip) => {
    if (!user) return;
    if (!supabase) {
      const updated = trips.map(t => t.id === updatedTrip.id ? updatedTrip : t);
      setTrips(updated);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase
        .from('trips')
        .update({
          name: updatedTrip.name,
          description: updatedTrip.description,
          cover_image: updatedTrip.coverImage,
          start_date: updatedTrip.startDate,
          end_date: updatedTrip.endDate,
          budget_limit: updatedTrip.totalBudget,
          status: updatedTrip.status
        })
        .eq('id', updatedTrip.id);

      if (error) {
        console.error('[GlobeTrotter Supabase Error] updateTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to update trip in Supabase:', err.message || err);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!user) return;
    if (!supabase) {
      const updated = trips.filter(t => t.id !== id);
      setTrips(updated);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updated));
      return;
    }

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[GlobeTrotter Supabase Error] deleteTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to delete trip in Supabase:', err.message || err);
    }
  };

  const addStopToTrip = async (tripId: string, cityId: string, arrivalDate: string, departureDate: string): Promise<TripStop | null> => {
    if (!user) return null;
    const city = cities.find(c => c.id === cityId);
    if (!city) return null;

    const trip = trips.find(t => t.id === tripId);
    const nextOrder = trip ? trip.stops.length + 1 : 1;
    let stopId = 'stop-' + Date.now();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('trip_stops')
          .insert({
            trip_id: tripId,
            city_name: city.name,
            country: city.country,
            region: city.region,
            city_image: city.image,
            arrival_date: arrivalDate,
            departure_date: departureDate,
            stop_order: nextOrder
          })
          .select()
          .single();

        if (!error && data) {
          stopId = data.id;
          await refreshTrips(user.id);
          return {
            id: data.id,
            cityId: city.id,
            cityName: data.city_name,
            arrivalDate: data.arrival_date,
            departureDate: data.departure_date,
            order: data.stop_order,
            activities: []
          };
        }
      } catch (err: any) {
        console.warn('[GlobeTrotter] Direct stop insert note:', err.message || err);
      }
    }

    if (trip) {
      const newStop: TripStop = {
        id: stopId,
        cityId,
        cityName: city.name,
        arrivalDate,
        departureDate,
        order: nextOrder,
        activities: []
      };
      const updatedStops = [...trip.stops, newStop].sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime());
      updatedStops.forEach((stop, index) => { stop.order = index + 1; });
      const updatedDestinations = Array.from(new Set(updatedStops.map(s => s.cityName)));
      const updatedTrip = { ...trip, stops: updatedStops, destinations: updatedDestinations };
      const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
      setTrips(updatedTrips);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      return newStop;
    }
    return null;
  };

  const removeStopFromTrip = async (tripId: string, stopId: string) => {
    if (!user) return;

    if (supabase) {
      try {
        await supabase
          .from('trip_stops')
          .delete()
          .eq('id', stopId);
        await refreshTrips(user.id);
      } catch (err: any) {
        console.warn('[GlobeTrotter] Remove stop note:', err.message || err);
      }
    }

    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const updatedStops = trip.stops.filter(s => s.id !== stopId);
    updatedStops.forEach((stop, index) => { stop.order = index + 1; });
    const updatedDestinations = Array.from(new Set(updatedStops.map(s => s.cityName)));
    const updatedTrip = { ...trip, stops: updatedStops, destinations: updatedDestinations };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
  };

  const updateStopOrder = async (tripId: string, stopId: string, direction: 'up' | 'down') => {
    if (!user) return;
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const stopIndex = trip.stops.findIndex(s => s.id === stopId);
    if (stopIndex === -1) return;

    const stopsToReorder = [...trip.stops];
    let didChange = false;

    if (direction === 'up' && stopIndex > 0) {
      const temp = stopsToReorder[stopIndex];
      stopsToReorder[stopIndex] = stopsToReorder[stopIndex - 1];
      stopsToReorder[stopIndex - 1] = temp;
      didChange = true;
    } else if (direction === 'down' && stopIndex < stopsToReorder.length - 1) {
      const temp = stopsToReorder[stopIndex];
      stopsToReorder[stopIndex] = stopsToReorder[stopIndex + 1];
      stopsToReorder[stopIndex + 1] = temp;
      didChange = true;
    }

    if (!didChange) return;
    stopsToReorder.forEach((stop, index) => { stop.order = index + 1; });
    const updatedTrip = { ...trip, stops: stopsToReorder };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));

    if (supabase) {
      try {
        const updates = stopsToReorder.map((stop, index) =>
          supabase
            .from('trip_stops')
            .update({ stop_order: index + 1 })
            .eq('id', stop.id)
        );
        await Promise.all(updates);
      } catch (err: any) {
        console.warn('[GlobeTrotter] Stop reorder sync note:', err.message || err);
      }
    }
  };

  const addActivityToStop = async (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => {
    if (!user) return;
    let activityId = 'act-' + Date.now();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('activities')
          .insert({
            trip_stop_id: stopId,
            name: activity.name,
            category: activity.category,
            description: activity.description,
            image_url: activity.image,
            start_time: activity.time,
            duration_minutes: activity.duration,
            estimated_cost_inr: activity.estimatedCost
          })
          .select()
          .single();

        if (!error && data) {
          activityId = data.id;
          await supabase.from('expenses').insert({
            trip_id: tripId,
            category: 'Activities',
            amount_inr: activity.estimatedCost,
            expense_date: new Date().toISOString().split('T')[0],
            description: `Activity: ${activity.name}`
          });
          await refreshTrips(user.id);
        }
      } catch (err: any) {
        console.warn('[GlobeTrotter] Activity direct insert note:', err.message || err);
      }
    }

    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        const newActivity: Activity = {
          ...activity,
          id: activityId
        };
        return {
          ...stop,
          activities: [...stop.activities, newActivity]
        };
      }
      return stop;
    });
    const newExpense: Expense = {
      id: 'exp-' + Date.now(),
      category: 'Activities',
      amount: activity.estimatedCost,
      date: trip.startDate,
      description: `Activity: ${activity.name}`
    };
    const updatedTrip = { ...trip, stops: updatedStops, expenses: [...trip.expenses, newExpense] };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
  };

  const removeActivityFromStop = async (tripId: string, stopId: string, activityId: string) => {
    if (!user) return;
    const trip = trips.find(t => t.id === tripId);
    const activityName = trip?.stops.find(s => s.id === stopId)?.activities.find(a => a.id === activityId)?.name;

    if (supabase) {
      try {
        await supabase.from('activities').delete().eq('id', activityId);
        if (activityName) {
          await supabase.from('expenses').delete().eq('trip_id', tripId).eq('description', `Activity: ${activityName}`);
        }
        await refreshTrips(user.id);
      } catch (err: any) {
        console.warn('[GlobeTrotter] Remove activity note:', err.message || err);
      }
    }

    if (!trip) return;
    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: stop.activities.filter(a => a.id !== activityId)
        };
      }
      return stop;
    });
    const updatedExpenses = trip.expenses.filter(e => e.description !== `Activity: ${activityName}`);
    const updatedTrip = { ...trip, stops: updatedStops, expenses: updatedExpenses };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
  };

  const addExpenseToTrip = async (tripId: string, expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    let expId = 'exp-' + Date.now();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('expenses')
          .insert({
            trip_id: tripId,
            category: expense.category,
            amount_inr: expense.amount,
            expense_date: expense.date,
            description: expense.description
          })
          .select()
          .single();

        if (!error && data) {
          expId = data.id;
          await refreshTrips(user.id);
        }
      } catch (err: any) {
        console.warn('[GlobeTrotter] Add expense note:', err.message || err);
      }
    }

    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const newExpense: Expense = {
      ...expense,
      id: expId
    };
    const updatedTrip = {
      ...trip,
      expenses: [...trip.expenses, newExpense]
    };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
  };

  const removeExpenseFromTrip = async (tripId: string, expenseId: string) => {
    if (!user) return;

    if (supabase) {
      try {
        await supabase.from('expenses').delete().eq('id', expenseId);
        await refreshTrips(user.id);
      } catch (err: any) {
        console.warn('[GlobeTrotter] Remove expense note:', err.message || err);
      }
    }

    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;
    const updatedTrip = {
      ...trip,
      expenses: trip.expenses.filter(e => e.id !== expenseId)
    };
    const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
    setTrips(updatedTrips);
    localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
  };

  return (
    <AppContext.Provider value={{
      user,
      trips,
      cities,
      loading,
      login,
      signup,
      logout,
      saveUser,
      createTrip,
      updateTrip,
      deleteTrip,
      addStopToTrip,
      removeStopFromTrip,
      updateStopOrder,
      addActivityToStop,
      removeActivityFromStop,
      addExpenseToTrip,
      removeExpenseFromTrip
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
