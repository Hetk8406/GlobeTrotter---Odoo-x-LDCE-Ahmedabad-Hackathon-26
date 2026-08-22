export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    currency: string;
  };
}

export interface Activity {
  id: string;
  name: string;
  category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Shopping' | 'Relaxation';
  description: string;
  duration: number; // in minutes
  estimatedCost: number;
  image: string;
  time: string; // e.g. "09:00"
}

export interface TripStop {
  id: string;
  cityId: string;
  cityName: string;
  arrivalDate: string;
  departureDate: string;
  order: number;
  activities: Activity[];
}

export interface Expense {
  id: string;
  category: 'Transport' | 'Accommodation' | 'Activities' | 'Meals' | 'Miscellaneous';
  amount: number;
  date: string;
  description: string;
}

export interface Trip {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  destinations: string[]; // List of city names or IDs
  status: 'planning' | 'ongoing' | 'completed';
  stops: TripStop[];
  expenses: Expense[];
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  popularity: number; // 1-5 stars or score
  costIndex: 1 | 2 | 3 | 4 | 5; // 1 = budget, 5 = luxury
  image: string;
  description: string;
}
