import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, MapPin, Star, X, Check, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/format';
import { handleImageError } from '../utils/imageFallback';
import { MOCK_ACTIVITIES } from '../data/mockData';

export const Cities: React.FC = () => {
  const { cities, trips, addStopToTrip, addActivityToStop } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');

  // Interactive Detailed Destination view state
  const [viewingCityId, setViewingCityId] = useState<string | null>(null);

  // Attraction-to-Itinerary modal state
  const [selectedAttraction, setSelectedAttraction] = useState<{
    name: string;
    category: any;
    description: string;
    duration: number;
    estimatedCost: number;
    image: string;
  } | null>(null);

  // Trip Stop addition flow helper state
  const [targetTripId, setTargetTripId] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const regions = ['All', 'India', 'Asia', 'Europe', 'Americas', 'Africa', 'Oceania'];

  // Filters logic
  const filteredCities = cities.filter(city => {
    const matchesSearch = 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || city.region === regionFilter;
    const matchesCost = costFilter === 'All' || city.costIndex === parseInt(costFilter);
    return matchesSearch && matchesRegion && matchesCost;
  });

  const activeCity = cities.find(c => c.id === viewingCityId);
  const attractions = viewingCityId ? (MOCK_ACTIVITIES[viewingCityId] || []) : [];

  // Best For category tags logic derived from attractions
  const bestForCategories = Array.from(new Set(attractions.map(a => a.category)));

  // Add attraction activity handler
  const handleAddAttractionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAttraction || !targetTripId || !viewingCityId || !activeCity) return;

    // Find if the selected trip already contains a stop for this city
    const selectedTrip = trips.find(t => t.id === targetTripId);
    if (!selectedTrip) return;

    let matchingStop = selectedTrip.stops.find(s => s.cityId === viewingCityId);

    if (!matchingStop) {
      if (!arrivalDate || !departureDate) {
        alert('Please select arrival and departure dates to add this city stop to your trip.');
        return;
      }
      // Add stop first
      const newStop = await addStopToTrip(targetTripId, viewingCityId, arrivalDate, departureDate);
      if (newStop) {
        // Refetch stop from list
        matchingStop = newStop;
      }
    }

    if (matchingStop) {
      // Add activity
      await addActivityToStop(targetTripId, matchingStop.id, {
        name: selectedAttraction.name,
        category: selectedAttraction.category,
        description: selectedAttraction.description,
        duration: selectedAttraction.duration,
        estimatedCost: selectedAttraction.estimatedCost,
        image: selectedAttraction.image,
        time: '10:00' // Default scheduled time
      });

      setSuccessMsg(`Added "${selectedAttraction.name}" to your trip itinerary!`);
      setSelectedAttraction(null);
      setTargetTripId('');
      setArrivalDate('');
      setDepartureDate('');

      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-8 font-interface">
      {/* Header */}
      <div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">Explore Destinations</h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Discover curated cities, local sightseeing spots, and plan stops.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center gap-3 shadow-xs animate-fade-in">
          <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            <Check className="h-4.5 w-4.5" />
          </div>
          <span className="font-semibold text-xs">{successMsg}</span>
        </div>
      )}

      {/* Explore Search and Region Tabs */}
      <div className="space-y-4">
        {/* Search Input with properly adjusted search icon */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by city, country, or region (e.g. India, Japan, Paris...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-premium pl-10 pr-10 py-2.5 text-xs bg-[#101316] border-[#292F36] focus:border-[#D9A752] rounded-lg placeholder:text-zinc-500 shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1 rounded transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Region & Cost Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#101316] border border-[#292F36] p-3 rounded-lg">
          {/* Region Tabs */}
          <div className="flex gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {regions.map(region => (
              <button
                key={region}
                onClick={() => setRegionFilter(region)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                  regionFilter === region
                    ? 'bg-[#D9A752] text-[#090B0D] shadow-xs'
                    : 'text-[#B8BEC6] hover:bg-zinc-800'
                }`}
              >
                {region === 'All' ? 'All Regions' : region}
              </button>
            ))}
          </div>

          {/* Cost Filter */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">Cost:</span>
            <select
              value={costFilter}
              onChange={(e) => setCostFilter(e.target.value)}
              className="w-full sm:w-36 px-2.5 py-1.5 border border-[#292F36] rounded bg-[#15191D] text-xs text-zinc-300"
            >
              <option value="All">All Budgets</option>
              <option value="1">₹ (Budget)</option>
              <option value="2">₹₹</option>
              <option value="3">₹₹₹</option>
              <option value="4">₹₹₹₹</option>
              <option value="5">₹₹₹₹₹ (Luxury)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Destinations Curated Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCities.map((city) => (
          <div
            key={city.id}
            className="travel-card rounded-lg overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden relative">
                <img
                  src={city.image}
                  alt={city.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div>
                    <h3 className="font-editorial text-white text-lg font-bold m-0">{city.name}</h3>
                    <p className="text-zinc-200 text-[10px] mt-0.5">{city.country} • {city.region}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <p className="text-xs text-[#B8BEC6] leading-relaxed line-clamp-2">
                  {city.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase">Popularity:</span>
                    <div className="flex text-[#D9A752]">
                      {Array.from({ length: city.popularity }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-zinc-455 dark:text-zinc-500 font-semibold uppercase">Cost Level:</span>
                    <div className="flex text-[#D9A752] text-xs font-bold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={i < city.costIndex ? 'opacity-100' : 'opacity-25'}>₹</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-5 py-3.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-semibold">Avg: {formatINR(city.costIndex * 3500)}/day</span>
              <button
                onClick={() => setViewingCityId(city.id)}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#D9A752] hover:text-[#C59643] transition-all cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL 1: DESTINATION DETAILED SIGHTSEEING VIEW */}
      {viewingCityId && activeCity && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 z-40 overflow-y-auto animate-fade-in">
          <div className="bg-[#101316] border border-[#292F36] rounded-xl shadow-xl w-full max-w-4xl overflow-hidden my-8">
            
            {/* Hero Banner header */}
            <div className="h-56 sm:h-64 relative">
              <img src={activeCity.image} alt={activeCity.name} onError={handleImageError} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101316] via-[#101316]/40 to-transparent" />
              <button
                onClick={() => setViewingCityId(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A752]">{activeCity.region} Region</span>
                <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-white m-0 mt-1">{activeCity.name}</h2>
                <p className="text-zinc-200 text-xs mt-1 font-semibold">{activeCity.country}</p>
              </div>
            </div>

            {/* Details Panel Info */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left Side: description */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">About the destination</h3>
                  <p className="text-sm text-[#B8BEC6] leading-relaxed">{activeCity.description}</p>
                  
                  {bestForCategories.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-zinc-450 uppercase block mb-2">Best for:</span>
                      <div className="flex flex-wrap gap-2">
                        {bestForCategories.map(cat => (
                          <span key={cat} className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Side: Quick Stats */}
                <div className="bg-[#15191D] border border-[#292F36] p-4 rounded-lg space-y-3">
                  <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Travel Indicators</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1.5 border-b border-zinc-800">
                      <span className="text-[#B8BEC6]">Estimated Budget:</span>
                      <span className="font-bold text-white">{formatINR(activeCity.costIndex * 3500)}/day</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-zinc-800">
                      <span className="text-[#B8BEC6]">Cost Level:</span>
                      <span className="font-bold text-[#D9A752]">{Array.from({ length: activeCity.costIndex }).map(() => '₹')}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-[#B8BEC6]">Popularity:</span>
                      <span className="font-bold text-[#D9A752]">{activeCity.popularity} / 5</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Places to Visit / Attraction Cards Section */}
              <div className="space-y-4 border-t border-[#292F36] pt-6">
                <h3 className="font-editorial text-lg font-bold text-white uppercase m-0 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-[#D9A752]" />
                  <span>Places to Visit</span>
                </h3>

                {attractions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {attractions.map((att, index) => (
                      <div 
                        key={index}
                        className="bg-[#15191D] border border-[#292F36] p-3 rounded-lg flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded overflow-hidden shrink-0 border border-zinc-800">
                            <img src={att.image} alt={att.name} onError={handleImageError} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white m-0">{att.name}</h4>
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">{att.category}</span>
                            </div>
                            <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{att.description}</p>
                            <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-0.5">
                              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {att.duration} mins</span>
                              <span className="font-bold text-zinc-300">{formatINR(att.estimatedCost)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedAttraction(att)}
                          className="px-2.5 py-1.5 bg-[#D9A752] hover:bg-[#C59643] text-[#090B0D] text-[10px] font-bold uppercase tracking-wider rounded-md shrink-0 cursor-pointer"
                        >
                          Add Stop
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No detailed attractions catalogued for this city yet.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD TO ITINERARY (SELECT TRIP & STOP FLOW) */}
      {selectedAttraction && viewingCityId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#101316] border border-[#292F36] rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-[#292F36] flex justify-between items-center bg-[#15191D]">
              <div className="flex items-center gap-2">
                <MapPin className="h-4.5 w-4.5 text-[#D9A752]" />
                <h3 className="font-bold text-white m-0">Add Attraction to Trip</h3>
              </div>
              <button
                onClick={() => setSelectedAttraction(null)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAttractionSubmit} className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Attraction selected:</span>
                <span className="text-sm font-bold text-[#D9A752] block">{selectedAttraction.name}</span>
                <span className="text-xs text-zinc-400 mt-0.5 block">{activeCity?.name} ({selectedAttraction.category})</span>
              </div>

              {trips.filter(t => t.status !== 'completed').length > 0 ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Select Active Trip</label>
                    <select
                      required
                      value={targetTripId}
                      onChange={(e) => setTargetTripId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#292F36] rounded bg-[#15191D] text-xs text-zinc-300"
                    >
                      <option value="">-- Choose one of your trips --</option>
                      {trips.filter(t => t.status !== 'completed').map(trip => (
                        <option key={trip.id} value={trip.id}>{trip.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date addition fields visible only if the selected trip does NOT contain a stop for this city yet */}
                  {targetTripId && !trips.find(t => t.id === targetTripId)?.stops.some(s => s.cityId === viewingCityId) && (
                    <div className="space-y-3 p-4 border border-[#292F36] bg-[#15191D] rounded-lg animate-fade-in">
                      <p className="text-[10px] text-[#D9A752] font-semibold m-0 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>First Stop Setup Required</span>
                      </p>
                      <p className="text-[10px] text-zinc-400 leading-normal m-0">
                        This city is not part of the selected trip yet. Enter stay dates to add it as a new route stop:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Arrival Date</label>
                          <input
                            type="date"
                            required
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#292F36] bg-[#090B0D] text-xs text-zinc-300 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-zinc-400 uppercase mb-1">Departure Date</label>
                          <input
                            type="date"
                            required
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="w-full px-2 py-1.5 border border-[#292F36] bg-[#090B0D] text-xs text-zinc-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#292F36]">
                    <button
                      type="button"
                      onClick={() => setSelectedAttraction(null)}
                      className="px-4 py-2 text-xs font-semibold text-zinc-450 hover:bg-zinc-800 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold text-[#090B0D] bg-[#D9A752] hover:bg-[#C59643] rounded cursor-pointer shadow-sm transition-all"
                    >
                      Add to Itinerary
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 space-y-4">
                  <p className="text-zinc-400 text-xs leading-normal">You don't have any active planning trips. Create a trip first to map attractions.</p>
                  <button
                    type="button"
                    onClick={() => setSelectedAttraction(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#090B0D] bg-[#D9A752] rounded"
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
