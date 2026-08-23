import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  Clock, 
  PlaneTakeoff,
  Share2
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { handleImageError } from '../utils/imageFallback';

export const SharedTrip: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { trips } = useApp();
  const [copied, setCopied] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="text-center py-12 font-interface">
        <h2 className="text-2xl font-bold text-white">Shared Trip not found</h2>
        <Link to="/trips" className="text-[#D9A752] hover:underline mt-2 inline-block text-xs font-semibold">Back to Trips</Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleImportTrip = () => {
    const clonedTrip = {
      ...trip,
      id: 'trip-' + Date.now(),
      name: `Cloned: ${trip.name}`,
      status: 'planning' as const
    };
    const currentTrips = JSON.parse(localStorage.getItem('globetrotter_trips') || '[]');
    currentTrips.push(clonedTrip);
    localStorage.setItem('globetrotter_trips', JSON.stringify(currentTrips));
    
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      navigate('/trips');
      window.location.reload();
    }, 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-interface transition-colors duration-300 pb-16">
      
      {/* Editorial Shared Header Header */}
      <div className="bg-zinc-900 text-white py-4 px-6 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-5 w-5 text-indigo-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Shared Travel Log</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleShareLink}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-white rounded text-xs font-semibold cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{shareToast ? 'Link Copied!' : 'Share'}</span>
          </button>
          <button
            onClick={handleImportTrip}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-zinc-100 text-zinc-900 rounded text-xs font-bold shadow-sm cursor-pointer"
          >
            {copied ? 'Cloning Itinerary...' : 'Clone to My Trips'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 animate-fade-in">
        
        {/* Cover Block */}
        <div className="relative h-96 rounded-lg overflow-hidden shadow-xs">
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent flex items-end p-8 sm:p-12">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-zinc-200">
                <MapPin className="h-3 w-3" />
                <span>{trip.destinations.join(' → ')}</span>
              </span>
              <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white m-0 tracking-tight leading-none">
                {trip.name}
              </h1>
              <p className="text-zinc-300 text-xs sm:text-sm font-medium tracking-wide">
                {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Day by Day Log */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="font-editorial text-2xl font-bold text-zinc-900 dark:text-white m-0">The Daily Log</h2>
            
            <div className="space-y-6">
              {trip.stops.map((stop, index) => (
                <div key={stop.id} className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-lg p-6 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                      <h3 className="font-editorial font-bold text-zinc-950 dark:text-white text-lg m-0">{stop.cityName}</h3>
                      <p className="text-[10px] text-zinc-400 mt-1 font-semibold">{formatDate(stop.arrivalDate)} — {formatDate(stop.departureDate)}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-550 uppercase">
                      Stop {index + 1}
                    </span>
                  </div>

                  {/* Activities */}
                  <div className="space-y-3 pt-2">
                    {stop.activities.map(act => (
                      <div key={act.id} className="flex justify-between items-center bg-zinc-50/40 dark:bg-zinc-950/20 p-4 rounded border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                          <img src={act.image} alt={act.name} onError={handleImageError} className="w-12 h-12 object-cover rounded shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white m-0">{act.name}</p>
                            <p className="text-[10px] text-zinc-400 flex items-center gap-2 mt-1.5 font-semibold">
                              <span className="text-indigo-600 dark:text-indigo-400">{act.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {act.time} ({act.duration} mins)</span>
                            </p>
                          </div>
                        </div>
                         <span className="text-xs font-bold text-zinc-900 dark:text-white">{formatINR(act.estimatedCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 p-6 rounded-lg shadow-xs space-y-4">
              <h3 className="font-editorial text-lg font-bold text-zinc-900 dark:text-white m-0">Itinerary Overview</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{trip.description}</p>
              
              <hr className="border-zinc-100 dark:border-zinc-800" />
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Budget Limit</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{formatINR(trip.totalBudget)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Estimated Expenses</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {formatINR(trip.expenses.reduce((acc, e) => acc + e.amount, 0))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Destinations</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{trip.destinations.length} Cities</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 text-white p-6 rounded-lg shadow-xs text-center space-y-3">
              <h4 className="font-editorial text-lg font-semibold m-0">Inspiring Itinerary?</h4>
              <p className="text-zinc-300 text-xs">Clone this travel timeline to customize your own stops, daily schedule, and budgets.</p>
              <button
                onClick={handleImportTrip}
                className="w-full py-2 bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-xs rounded transition-colors cursor-pointer"
              >
                {copied ? 'Cloning Itinerary...' : 'Clone to My Trips'}
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
