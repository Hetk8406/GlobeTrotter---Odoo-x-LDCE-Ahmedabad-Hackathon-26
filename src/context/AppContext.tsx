import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Trip, User, City, Activity, Expense, TripStop } from '../types';
import { db } from '../services/db';
import { supabase } from '../services/supabase';

interface AppContextType {
  user: User | null;
  trips: Trip[];
  cities: City[];
  loading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  signup: (email: string, name: string, password?: string) => Promise<boolean>;
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

  // Initialize cities mock data (discovery context is static as per specs)
  useEffect(() => {
    setCities(db.getCities());
  }, []);

  // Listen to Supabase auth state changes
  useEffect(() => {
    if (!supabase) {
      // Fallback mode: Load profile and trips from local storage DB
      setUser(db.getUser());
      setTrips(db.getTrips());
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await loadUserProfileAndData(session.user.id, session.user.email || '');
        } else {
          setUser(null);
          setTrips([]);
        }
      } catch (err) {
        console.error('Error checking auth session:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      setLoading(true);
      if (session?.user) {
        await loadUserProfileAndData(session.user.id, session.user.email || '');
      } else {
        setUser(null);
        setTrips([]);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfileAndData = async (userId: string, email: string) => {
    try {
      // 1. Fetch Profile
      let { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Auto-heal: If profile is missing (PGRST116 / 404), safely upsert profile using authenticated session
      if (!profile || (profileErr && profileErr.code === 'PGRST116')) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && authUser.id === userId) {
          const fallbackName = 
            authUser.user_metadata?.full_name || 
            authUser.user_metadata?.name || 
            email.split('@')[0] || 
            'Explorer';
          
          const fallbackAvatar = 
            authUser.user_metadata?.avatar_url || 
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

          const { data: healedProfile, error: healErr } = await supabase
            .from('profiles')
            .upsert({
              id: userId,
              full_name: fallbackName,
              email: email,
              language: 'English',
              avatar_url: fallbackAvatar
            }, { onConflict: 'id' })
            .select()
            .single();

          if (!healErr && healedProfile) {
            profile = healedProfile;
          } else if (healErr) {
            console.error('Error auto-healing user profile:', healErr);
          }
        }
      } else if (profileErr) {
        console.error('Error fetching profile:', profileErr);
      }

      const activeUser: User = {
        id: userId,
        name: profile?.full_name || email.split('@')[0] || 'Explorer',
        email: email,
        avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        preferences: {
          theme: 'dark', // Dark mode only enforced
          currency: 'INR' // INR only enforced
        }
      };

      setUser(activeUser);

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

  const login = async (email: string, password?: string): Promise<boolean> => {
    if (!supabase) {
      const currentUser = db.getUser();
      if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
        setUser(currentUser);
        return true;
      }
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0],
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        preferences: { theme: 'dark', currency: 'INR' }
      };
      db.saveUser(newUser);
      setUser(newUser);
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || 'defaultPassword123'
      });

      if (error) throw error;
      if (data?.user) {
        await loadUserProfileAndData(data.user.id, data.user.email || '');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error signing in:', err);
      return false;
    }
  };

  const signup = async (email: string, name: string, password?: string): Promise<boolean> => {
    if (!supabase) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: name,
        email: email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        preferences: { theme: 'dark', currency: 'INR' }
      };
      db.saveUser(newUser);
      setUser(newUser);
      return true;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || 'defaultPassword123',
        options: {
          data: {
            full_name: name,
            name: name,
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
        }
      });

      if (error) throw error;
      if (data?.user) {
        // If session is immediately active, perform idempotent profile upsert
        if (data.session) {
          const { error: profileErr } = await supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: name,
              email: email,
              language: 'English',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
            }, { onConflict: 'id' });

          if (profileErr) console.warn('Client profile upsert note:', profileErr.message);
        }

        await loadUserProfileAndData(data.user.id, email);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error in signup:', err);
      return false;
    }
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      setTrips([]);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setTrips([]);
  };

  const saveUser = async (updatedUser: User) => {
    if (!user) return;
    if (!supabase) {
      db.saveUser(updatedUser);
      setUser(updatedUser);
      return;
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.name,
          avatar_url: updatedUser.avatar,
          language: 'English'
        })
        .eq('id', user.id);

      if (error) throw error;
      setUser(updatedUser);
    } catch (err) {
      console.error('Error saving user profile:', err);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'stops' | 'expenses' | 'destinations' | 'status'>): Promise<Trip | null> => {
    if (!user) return null;
    if (!supabase) {
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
    }

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

      if (error) {
        console.error('[GlobeTrotter Supabase Error] createTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

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
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to persist trip to Supabase:', err.message || err);
      return null;
    }
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
    if (!supabase) {
      const city = cities.find(c => c.id === cityId);
      if (!city) return null;
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return null;
      const newStop: TripStop = {
        id: 'stop-' + Date.now(),
        cityId,
        cityName: city.name,
        arrivalDate,
        departureDate,
        order: trip.stops.length + 1,
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

    try {
      const city = cities.find(c => c.id === cityId);
      if (!city) return null;

      const trip = trips.find(t => t.id === tripId);
      const nextOrder = trip ? trip.stops.length + 1 : 1;

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

      if (error) {
        console.error('[GlobeTrotter Supabase Error] addStopToTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);

      if (data) {
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
      return null;
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to add stop to Supabase:', err.message || err);
      return null;
    }
  };

  const removeStopFromTrip = async (_tripId: string, stopId: string) => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === _tripId);
      if (!trip) return;
      const updatedStops = trip.stops.filter(s => s.id !== stopId);
      updatedStops.forEach((stop, index) => { stop.order = index + 1; });
      const updatedDestinations = Array.from(new Set(updatedStops.map(s => s.cityName)));
      const updatedTrip = { ...trip, stops: updatedStops, destinations: updatedDestinations };
      const updatedTrips = trips.map(t => t.id === _tripId ? updatedTrip : t);
      setTrips(updatedTrips);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_stops')
        .delete()
        .eq('id', stopId);

      if (error) {
        console.error('[GlobeTrotter Supabase Error] removeStopFromTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to remove stop from Supabase:', err.message || err);
    }
  };

  const updateStopOrder = async (tripId: string, stopId: string, direction: 'up' | 'down') => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;
      const stopIndex = trip.stops.findIndex(s => s.id === stopId);
      if (stopIndex === -1) return;
      const newStops = [...trip.stops];
      if (direction === 'up' && stopIndex > 0) {
        const temp = newStops[stopIndex];
        newStops[stopIndex] = newStops[stopIndex - 1];
        newStops[stopIndex - 1] = temp;
      } else if (direction === 'down' && stopIndex < newStops.length - 1) {
        const temp = newStops[stopIndex];
        newStops[stopIndex] = newStops[stopIndex + 1];
        newStops[stopIndex + 1] = temp;
      }
      newStops.forEach((stop, index) => { stop.order = index + 1; });
      const updatedTrip = { ...trip, stops: newStops };
      const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
      setTrips(updatedTrips);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      return;
    }

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

    try {
      // Perform batch update orders
      const updates = stopsToReorder.map((stop, index) => 
        supabase
          .from('trip_stops')
          .update({ stop_order: index + 1 })
          .eq('id', stop.id)
      );

      await Promise.all(updates);
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to update stop order in Supabase:', err.message || err);
    }
  };

  const addActivityToStop = async (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;
      const updatedStops = trip.stops.map(stop => {
        if (stop.id === stopId) {
          const newActivity: Activity = {
            ...activity,
            id: 'act-' + Date.now()
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
      return;
    }

    try {
      const { error } = await supabase
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
        });

      if (error) {
        console.error('[GlobeTrotter Supabase Error] addActivityToStop failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      // Automatically add corresponding Activity expense
      const { error: expErr } = await supabase
        .from('expenses')
        .insert({
          trip_id: tripId,
          category: 'Activities',
          amount_inr: activity.estimatedCost,
          expense_date: new Date().toISOString().split('T')[0],
          description: `Activity: ${activity.name}`
        });

      if (expErr) console.warn('[GlobeTrotter] Activity expense creation note:', expErr.message);

      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to add activity to Supabase:', err.message || err);
    }
  };

  const removeActivityFromStop = async (tripId: string, stopId: string, activityId: string) => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;
      const activityName = trip.stops.find(s => s.id === stopId)?.activities.find(a => a.id === activityId)?.name;
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
      return;
    }

    try {
      const trip = trips.find(t => t.id === tripId);
      const activityName = trip?.stops.find(s => s.id === stopId)?.activities.find(a => a.id === activityId)?.name;

      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) {
        console.error('[GlobeTrotter Supabase Error] removeActivityFromStop failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      // Delete corresponding expense
      if (activityName) {
        await supabase
          .from('expenses')
          .delete()
          .eq('trip_id', tripId)
          .eq('description', `Activity: ${activityName}`);
      }

      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to remove activity from Supabase:', err.message || err);
    }
  };

  const addExpenseToTrip = async (tripId: string, expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === tripId);
      if (!trip) return;
      const newExpense: Expense = {
        ...expense,
        id: 'exp-' + Date.now()
      };
      const updatedTrip = {
        ...trip,
        expenses: [...trip.expenses, newExpense]
      };
      const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
      setTrips(updatedTrips);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .insert({
          trip_id: tripId,
          category: expense.category,
          amount_inr: expense.amount,
          expense_date: expense.date,
          description: expense.description
        });

      if (error) {
        console.error('[GlobeTrotter Supabase Error] addExpenseToTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to add expense to Supabase:', err.message || err);
    }
  };

  const removeExpenseFromTrip = async (_tripId: string, expenseId: string) => {
    if (!user) return;
    if (!supabase) {
      const trip = trips.find(t => t.id === _tripId);
      if (!trip) return;
      const updatedTrip = {
        ...trip,
        expenses: trip.expenses.filter(e => e.id !== expenseId)
      };
      const updatedTrips = trips.map(t => t.id === _tripId ? updatedTrip : t);
      setTrips(updatedTrips);
      localStorage.setItem('globetrotter_trips', JSON.stringify(updatedTrips));
      return;
    }

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) {
        console.error('[GlobeTrotter Supabase Error] removeExpenseFromTrip failed:', {
          code: error.code,
          message: error.message,
          details: error.details
        });
        throw error;
      }
      await refreshTrips(user.id);
    } catch (err: any) {
      console.error('[GlobeTrotter] Failed to remove expense from Supabase:', err.message || err);
    }
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
