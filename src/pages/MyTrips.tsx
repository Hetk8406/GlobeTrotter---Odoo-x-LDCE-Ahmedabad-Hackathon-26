import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar, MapPin, DollarSign, Plus, Trash2, ArrowRight, Search, Activity } from 'lucide-react';
import { formatINR } from '../utils/format';

export const MyTrips: React.FC = () => {
  const { trips, deleteTrip } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30';
      case 'completed':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
      default:
        return 'bg-zinc-50 dark:bg-zinc-850 text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800';
    }
  };

  // Filter & Search logic
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          trip.destinations.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-interface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">My Trips</h1>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Manage and edit your travel itineraries.</p>
        </div>
        <Link
          to="/create-trip"
          className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold self-start sm:self-center"
        >
          <Plus className="h-4 w-4" />
          <span>Plan Trip</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-lg shadow-xs flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by trip name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-9 py-1.5 text-xs"
          />
        </div>

        {/* Status Dropdown */}
        <div className="w-full sm:w-auto self-stretch sm:self-auto flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-36 px-2.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-xs text-zinc-700 dark:text-zinc-300"
          >
            <option value="All">All Statuses</option>
            <option value="Planning">Planning</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Trips list */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const activityCount = trip.stops.reduce((acc, stop) => acc + stop.activities.length, 0);
            return (
              <div
                key={trip.id}
                className="travel-card rounded-lg overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badge */}
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-editorial font-bold text-zinc-950 dark:text-slate-50 text-lg truncate m-0">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-2 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-zinc-500 dark:text-zinc-450">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span className="truncate">{trip.destinations.join(' → ') || 'No destinations'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>{activityCount} Scheduled Activities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-zinc-400 shrink-0" />
                        <span>Budget: <span className="font-bold text-zinc-900 dark:text-white">{formatINR(trip.totalBudget)}</span></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${trip.name}"?`)) {
                        deleteTrip(trip.id);
                      }
                    }}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors cursor-pointer"
                    title="Delete Trip"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link
                    to={`/trips/${trip.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white hover:underline"
                  >
                    <span>View Itinerary</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg p-12 text-center max-w-sm mx-auto shadow-xs">
          <Calendar className="h-10 w-10 text-zinc-350 mx-auto mb-3" />
          <h3 className="font-editorial text-lg font-bold text-zinc-950 dark:text-slate-50 m-0">No Trips Found</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">
            No matching itineraries were found. Expand your search or start planning a new trip stop.
          </p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 btn-premium btn-premium-primary text-xs uppercase tracking-wider font-semibold mt-4"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create a Trip</span>
          </Link>
        </div>
      )}
    </div>
  );
};
