import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Plus, 
  ArrowRight,
  Compass
} from 'lucide-react';
import { formatINR } from '../utils/format';

export const Dashboard: React.FC = () => {
  const { user, trips, cities } = useApp();

  // Find upcoming trip (planning status or earliest start date)
  const upcomingTrip = trips
    .filter(t => t.status === 'planning')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];

  // Rest of trips
  const otherTrips = trips.filter(t => t.id !== (upcomingTrip?.id || ''));

  // Calculate statistics
  const totalTrips = trips.length;
  const totalDestinations = Array.from(new Set(trips.flatMap(t => t.destinations))).length;
  const totalBudgetSpent = trips.reduce((acc, t) => acc + t.totalBudget, 0);

  // Recommended destinations (take first 3 from cities)
  const recommendedCities = cities.slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-10 font-interface">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">
            Welcome back, {user?.name || 'Explorer'}
          </h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">
            Discover recommendations, track budgets, and map out your next routes.
          </p>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-150 dark:border-zinc-800/80 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Trips</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5 m-0">{totalTrips}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-150 dark:border-zinc-800/80 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Destinations Planned</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5 m-0">{totalDestinations}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-150 dark:border-zinc-800/80 shadow-xs flex items-center gap-4">
          <div className="h-10 w-10 rounded-md bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center text-zinc-900 dark:text-white border border-zinc-100 dark:border-zinc-800">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Budget</p>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-0.5 m-0">{formatINR(totalBudgetSpent)}</h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Trip & Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Upcoming Trip & All Trips */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white mb-4">Your Next Journey</h2>
            
            {upcomingTrip ? (
              <div className="travel-card rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-2/5 h-48 md:h-auto relative shrink-0">
                  <img 
                    src={upcomingTrip.coverImage} 
                    alt={upcomingTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-zinc-900/80 text-white text-[10px] font-bold uppercase tracking-wider">
                    {upcomingTrip.status}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white m-0">{upcomingTrip.name}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed line-clamp-2">{upcomingTrip.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-450">
                        <Calendar className="h-4 w-4 text-zinc-400" />
                        <span>{formatDate(upcomingTrip.startDate)} - {formatDate(upcomingTrip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-450">
                        <MapPin className="h-4 w-4 text-zinc-400" />
                        <span className="truncate">{upcomingTrip.destinations.join(' → ') || 'No destinations'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-zinc-400">Budget:</span>{' '}
                      <span className="font-bold text-zinc-900 dark:text-white">{formatINR(upcomingTrip.totalBudget)}</span>
                    </div>
                    <Link
                      to={`/trips/${upcomingTrip.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white hover:underline"
                    >
                      <span>Build Itinerary</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-lg border border-zinc-150 dark:border-zinc-800 text-center shadow-xs">
                <Compass className="h-10 w-10 text-zinc-350 mx-auto mb-3" />
                <h3 className="font-editorial text-lg font-bold text-zinc-900 dark:text-white m-0">Create an Itinerary</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 max-w-xs mx-auto">
                  You don't have any upcoming trips scheduled. Get started by designing your first timeline.
                </p>
                <Link
                  to="/create-trip"
                  className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold mt-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Plan Trip</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Trips List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white m-0">Recent Trips</h2>
              <Link to="/trips" className="text-xs font-semibold text-zinc-900 dark:text-white hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {otherTrips.slice(0, 4).map((trip) => (
                <Link
                  key={trip.id}
                  to={`/trips/${trip.id}`}
                  className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-150 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs hover:shadow-sm transition-all flex gap-4"
                >
                  <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="w-14 h-14 rounded object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-xs truncate m-0">{trip.name}</h4>
                      <p className="text-zinc-450 dark:text-zinc-500 text-[10px] truncate mt-0.5">
                        {trip.destinations.join(', ') || 'No stops'}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                      <span>{formatDate(trip.startDate)}</span>
                      <span className="font-semibold uppercase tracking-wider">{trip.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Airbnb-like Recommended Destinations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white m-0">Wanderlust Discovery</h2>
            <Link to="/explore" className="text-xs font-semibold text-zinc-900 dark:text-white hover:underline">
              Explore
            </Link>
          </div>
          <div className="space-y-5">
            {recommendedCities.map((city) => (
              <div 
                key={city.id}
                className="travel-card rounded-lg overflow-hidden flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div>
                      <h4 className="font-editorial text-white text-lg font-bold m-0">{city.name}</h4>
                      <p className="text-zinc-250 text-[10px] font-semibold tracking-wider mt-0.5">{city.country.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-400">Daily cost index:</span>
                    <span className="font-bold text-zinc-905 dark:text-white flex gap-0.5">
                      {Array.from({ length: city.costIndex }).map((_, idx) => (
                        <span key={idx}>₹</span>
                      ))}
                    </span>
                  </div>
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-white hover:underline"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
