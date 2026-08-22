import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Plus, 
  ArrowRight,
  Compass,
  TrendingUp
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

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 font-interface">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-6 gap-4">
        <div>
          <span className="text-xs font-bold text-[#D9A752] uppercase tracking-widest">{getGreeting()}, {user?.name || 'Explorer'}</span>
          <h1 className="font-editorial text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white m-0 mt-1 tracking-tight">
            Where are you going next?
          </h1>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold py-2 px-4 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Plan a new trip</span>
        </Link>
      </div>

      {/* Main Grid: Itinerary Workspace & Info Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Journeys (Upcoming & Recent) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Next Journey Feature Card */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Next Journey</h2>
            
            {upcomingTrip ? (
              <div className="travel-card rounded-lg overflow-hidden flex flex-col md:flex-row bg-white dark:bg-[#101316] border border-zinc-150 dark:border-[#292F36] shadow-md transition-all">
                <div className="md:w-5/12 h-48 md:h-auto relative shrink-0">
                  <img 
                    src={upcomingTrip.coverImage} 
                    alt={upcomingTrip.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-[#D9A752] text-[#090B0D] text-[10px] font-bold uppercase tracking-wider">
                    {upcomingTrip.status}
                  </div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-editorial text-2xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">{upcomingTrip.name}</h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 leading-relaxed line-clamp-2">{upcomingTrip.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <Calendar className="h-4 w-4 text-[#D9A752]" />
                        <span>{formatDate(upcomingTrip.startDate)} - {formatDate(upcomingTrip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                        <MapPin className="h-4 w-4 text-[#D9A752]" />
                        <span className="truncate">{upcomingTrip.destinations.join(' → ') || 'No stops selected'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-[#292F36] flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-zinc-400">Budget Limit:</span>{' '}
                      <span className="font-bold text-zinc-900 dark:text-[#D9A752]">{formatINR(upcomingTrip.totalBudget)}</span>
                    </div>
                    <Link
                      to={`/trips/${upcomingTrip.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white hover:text-[#D9A752] transition-colors"
                    >
                      <span>Continue planning</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#101316] p-8 rounded-lg border border-zinc-150 dark:border-[#292F36] text-center shadow-xs">
                <Compass className="h-8 w-8 text-[#D9A752] mx-auto mb-3" />
                <h3 className="font-editorial text-lg font-bold text-zinc-900 dark:text-white m-0">No upcoming trips</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2 max-w-xs mx-auto">
                  Start with a destination and build your first itinerary.
                </p>
                <Link
                  to="/create-trip"
                  className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold mt-4"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Plan a trip</span>
                </Link>
              </div>
            )}
          </div>

          {/* Recent Trips */}
          {otherTrips.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 m-0">Recent Trips</h2>
                <Link to="/trips" className="text-xs font-semibold text-[#D9A752] hover:underline">
                  View Travel Library
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {otherTrips.slice(0, 4).map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/trips/${trip.id}`}
                    className="bg-white dark:bg-[#101316] p-4 rounded-lg border border-zinc-150 dark:border-[#292F36] hover:border-zinc-300 dark:hover:border-[#D9A752]/50 shadow-xs hover:shadow-sm transition-all flex gap-4"
                  >
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-14 h-14 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs truncate m-0">{trip.name}</h4>
                        <p className="text-zinc-450 dark:text-zinc-500 text-[10px] truncate mt-0.5">
                          {trip.destinations.join(', ') || 'No stops'}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                        <span>{formatDate(trip.startDate)}</span>
                        <span className="font-semibold uppercase tracking-wider text-[#D9A752]">{trip.status}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Discovery & Budget Command Snapshots */}
        <div className="space-y-8">
          
          {/* Budget Snapshot */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">Budget Snapshot</h2>
            <div className="bg-white dark:bg-[#101316] p-5 rounded-lg border border-zinc-150 dark:border-[#292F36] space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-[#D9A752]/10 flex items-center justify-center text-[#D9A752]">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] text-zinc-455 dark:text-zinc-500 uppercase tracking-widest font-bold">Planned Travel budget</p>
                  <p className="text-lg font-bold text-zinc-900 dark:text-white m-0">{formatINR(totalBudgetSpent)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-100 dark:border-[#292F36] text-xs">
                <div>
                  <span className="text-zinc-400">Total Trips</span>
                  <p className="font-bold text-zinc-900 dark:text-white mt-0.5">{totalTrips} journeys</p>
                </div>
                <div>
                  <span className="text-zinc-400">Destinations</span>
                  <p className="font-bold text-zinc-900 dark:text-white mt-0.5">{totalDestinations} cities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Destinations (Editorial Cards) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 m-0">Explore Destinations</h2>
              <Link to="/explore" className="text-xs font-semibold text-[#D9A752] hover:underline">
                Explore All
              </Link>
            </div>
            
            <div className="space-y-4">
              {recommendedCities.map((city) => (
                <div 
                  key={city.id}
                  className="travel-card rounded-lg overflow-hidden flex flex-col bg-white dark:bg-[#101316] border border-zinc-150 dark:border-[#292F36]"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <div>
                        <h4 className="font-editorial text-white text-base font-bold m-0">{city.name}</h4>
                        <p className="text-zinc-300 text-[9px] font-bold tracking-widest mt-0.5 uppercase">{city.country}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-400">Estimated Cost:</span>
                      <span className="font-bold text-[#D9A752]">{formatINR(city.costIndex * 1500)} / day</span>
                    </div>
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-0.5 font-semibold text-[#D9A752] hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
