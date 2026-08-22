import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Plus, Star, X, Check } from 'lucide-react';
import { formatINR } from '../utils/format';

export const Cities: React.FC = () => {
  const { cities, trips, addStopToTrip } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');

  // Modal / Dropdown state for adding stop
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [targetTripId, setTargetTripId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const regions = ['All', ...Array.from(new Set(cities.map(c => c.region)))];

  const filteredCities = cities.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || city.region === regionFilter;
    const matchesCost = costFilter === 'All' || city.costIndex === parseInt(costFilter);
    return matchesSearch && matchesRegion && matchesCost;
  });

  const handleAddStopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !targetTripId || !arrivalDate || !departureDate) return;

    addStopToTrip(targetTripId, selectedCity, arrivalDate, departureDate);
    
    // Clear and show success
    const cityName = cities.find(c => c.id === selectedCity)?.name;
    const tripName = trips.find(t => t.id === targetTripId)?.name;
    setSuccessMsg(`Successfully added ${cityName} to ${tripName}!`);
    setSelectedCity(null);
    setTargetTripId('');
    setArrivalDate('');
    setDepartureDate('');

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white m-0 tracking-tight">Explore Destinations</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Discover popular cities, local activity costs, and plan stops.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-xl flex items-center gap-3 shadow-sm animate-fade-in">
          <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="h-4.5 w-4.5" />
          </div>
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by city or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Region Filter */}
        <div className="flex gap-4 w-full md:w-auto">
          <div className="flex-1 md:flex-initial">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full md:w-44 px-3 py-2 border border-slate-300 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Cost Index Filter */}
          <div className="flex-1 md:flex-initial">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cost Index</label>
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value)}
              className="w-full md:w-36 px-3 py-2 border border-slate-300 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value="All">All Costs</option>
              <option value="1">₹ (Budget)</option>
              <option value="2">₹₹</option>
              <option value="3">₹₹₹</option>
              <option value="4">₹₹₹₹</option>
              <option value="5">₹₹₹₹₹ (Luxury)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="font-bold text-white text-xl m-0">{city.name}</h3>
                    <p className="text-slate-200 text-xs mt-0.5">{city.country} • {city.region}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {city.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Popularity:</span>
                    <div className="flex text-amber-500">
                      {Array.from({ length: city.popularity }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">Cost Level:</span>
                    <div className="flex text-amber-500 text-xs font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < city.costIndex ? 'opacity-100' : 'opacity-20'}>₹</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action footer */}
            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">Approx. Daily: {formatINR(city.costIndex * 5000)}/day</span>
              <button
                onClick={() => setSelectedCity(city.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Trip</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Stop Modal Form Overlay */}
      {selectedCity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  Add {cities.find(c => c.id === selectedCity)?.name} to Trip
                </h3>
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStopSubmit} className="p-6 space-y-4">
              {trips.filter(t => t.status !== 'completed').length > 0 ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Select Trip</label>
                    <select
                      required
                      value={targetTripId}
                      onChange={(e) => setTargetTripId(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                    >
                      <option value="">-- Choose one of your trips --</option>
                      {trips.filter(t => t.status !== 'completed').map(trip => (
                        <option key={trip.id} value={trip.id}>{trip.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Arrival Date</label>
                      <input
                        type="date"
                        required
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        className="input-premium py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Departure Date</label>
                      <input
                        type="date"
                        required
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        className="input-premium py-1.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setSelectedCity(null)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded cursor-pointer shadow-sm"
                    >
                      Add Stop
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-slate-500 text-sm">You don't have any planning trips to add stops to.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedCity(null)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
