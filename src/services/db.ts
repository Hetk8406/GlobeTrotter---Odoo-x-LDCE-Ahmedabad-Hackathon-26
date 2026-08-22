import type { Trip, City, User } from '../types';
import { MOCK_TRIPS, MOCK_CITIES } from '../data/mockData';

const TRIPS_KEY = 'globetrotter_trips';
const USER_KEY = 'globetrotter_user';

export const db = {
  // Initialize default data if not present
  init() {
    if (!localStorage.getItem(TRIPS_KEY)) {
      localStorage.setItem(TRIPS_KEY, JSON.stringify(MOCK_TRIPS));
    }
    if (!localStorage.getItem(USER_KEY)) {
      const defaultUser: User = {
        id: 'user-1',
        name: 'Alex Mercer',
        email: 'alex@globetrotter.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        preferences: {
          theme: 'light',
          currency: 'USD'
        }
      };
      localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    }
  },

  // User methods
  getUser(): User | null {
    this.init();
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Trips methods
  getTrips(): Trip[] {
    this.init();
    const data = localStorage.getItem(TRIPS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getTrip(id: string): Trip | null {
    const trips = this.getTrips();
    return trips.find(t => t.id === id) || null;
  },

  saveTrip(trip: Trip) {
    const trips = this.getTrips();
    const index = trips.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      trips[index] = trip;
    } else {
      trips.push(trip);
    }
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
  },

  deleteTrip(id: string) {
    const trips = this.getTrips();
    const filtered = trips.filter(t => t.id !== id);
    localStorage.setItem(TRIPS_KEY, JSON.stringify(filtered));
  },

  // Cities database (read-only in standard UI, but we can query it)
  getCities(): City[] {
    return MOCK_CITIES;
  },

  getCity(id: string): City | null {
    return MOCK_CITIES.find(c => c.id === id) || null;
  }
};
