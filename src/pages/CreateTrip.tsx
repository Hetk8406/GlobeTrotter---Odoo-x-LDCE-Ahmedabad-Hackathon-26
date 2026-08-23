import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_CITIES } from '../data/mockData';
import { handleImageError } from '../utils/imageFallback';
import { 
  Calendar, 
  Image as ImageIcon, 
  Plus, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  ChevronRight, 
  ArrowLeft,
  Search,
  Check,
  Star
} from 'lucide-react';

const COVER_PRESETS = [
  { name: 'Tropical Beach', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80' },
  { name: 'Historic Europe', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80' },
  { name: 'Neon Cityscape', url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&auto=format&fit=crop&q=80' },
  { name: 'Alpine Mountains', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80' }
];

export const CreateTrip: React.FC = () => {
  const { createTrip, addStopToTrip } = useApp();
  const navigate = useNavigate();

  // Wizard state: 1 = Basic Info, 2 = Destination Selection, 3 = Route Configuration
  const [step, setStep] = useState(1);

  // Step 1: Basic details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [customCover, setCustomCover] = useState('');

  // Step 2: Destination selection state
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [costFilter, setCostFilter] = useState('All');
  
  // Selected route stops (local state before persistence)
  const [routeStops, setRouteStops] = useState<{
    cityId: string;
    cityName: string;
    arrivalDate: string;
    departureDate: string;
  }[]>([]);

  const regions = ['All', ...Array.from(new Set(MOCK_CITIES.map(c => c.region)))];

  const filteredCities = MOCK_CITIES.filter(city => {
    const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          city.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'All' || city.region === regionFilter;
    const matchesCost = costFilter === 'All' || city.costIndex === parseInt(costFilter);
    return matchesSearch && matchesRegion && matchesCost;
  });

  const handleAddCityToRoute = (cityId: string, cityName: string) => {
    // If not already in route, append with default dates
    if (!routeStops.some(s => s.cityId === cityId)) {
      setRouteStops([
        ...routeStops,
        {
          cityId,
          cityName,
          arrivalDate: startDate || '',
          departureDate: endDate || ''
        }
      ]);
    }
  };

  const handleRemoveCityFromRoute = (cityId: string) => {
    setRouteStops(routeStops.filter(s => s.cityId !== cityId));
  };

  const handleMoveStop = (index: number, direction: 'up' | 'down') => {
    const newStops = [...routeStops];
    if (direction === 'up' && index > 0) {
      const temp = newStops[index];
      newStops[index] = newStops[index - 1];
      newStops[index - 1] = temp;
    } else if (direction === 'down' && index < newStops.length - 1) {
      const temp = newStops[index];
      newStops[index] = newStops[index + 1];
      newStops[index + 1] = temp;
    }
    setRouteStops(newStops);
  };

  const handleUpdateStopDate = (index: number, field: 'arrivalDate' | 'departureDate', val: string) => {
    const newStops = [...routeStops];
    newStops[index] = {
      ...newStops[index],
      [field]: val
    };
    setRouteStops(newStops);
  };

  const handleFinalSave = async () => {
    if (!name || !startDate || !endDate || !budget) return;

    // 1. Create Trip base
    const finalCover = customCover || coverImage;
    const newTrip = await createTrip({
      name,
      description: description || 'No description provided.',
      coverImage: finalCover,
      startDate,
      endDate,
      totalBudget: parseFloat(budget)
    });

    if (newTrip) {
      // 2. Add Stops sequentially
      for (const stop of routeStops) {
        await addStopToTrip(newTrip.id, stop.cityId, stop.arrivalDate, stop.departureDate);
      }

      // 3. Go to the new Trip details page
      navigate(`/trips/${newTrip.id}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-interface">
      {/* Step Stepper Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">
            {step === 1 && 'Configure Trip Details'}
            {step === 2 && 'Discover Destinations'}
            {step === 3 && 'Configure Your Route'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Step {step} of 3</p>
        </div>

        <div className="flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          )}

          {step < 3 ? (
            <button
              disabled={step === 1 && (!name || !startDate || !endDate || !budget)}
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs font-semibold rounded-md disabled:opacity-30 cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              disabled={routeStops.length === 0}
              onClick={handleFinalSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-650 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md disabled:opacity-30 cursor-pointer shadow-sm"
            >
              <span>Create Itinerary</span>
              <Check className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: CONFIGURE BASIC DETAILS */}
      {step === 1 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Trip Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. European Interrail, Japan Explorer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  placeholder="Brief travel theme, goals, or notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="input-premium"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Start Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-premium py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-premium py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <span>Total Budget (₹)</span>
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  placeholder="150000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="input-premium"
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Cover presets */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Choose Presets Cover</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {COVER_PRESETS.map(preset => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    setCoverImage(preset.url);
                    setCustomCover('');
                  }}
                  className={`relative h-20 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                    coverImage === preset.url && !customCover
                      ? 'border-zinc-900 dark:border-white ring-2 ring-zinc-500/10'
                      : 'border-transparent hover:border-zinc-200'
                  }`}
                >
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                    <span className="text-[10px] font-semibold text-white truncate">{preset.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Or custom Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={customCover}
                onChange={(e) => setCustomCover(e.target.value)}
                className="input-premium mt-1 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: DESTINATION SEARCH & DISCOVERY */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Active Route preview bar */}
          <div className="bg-zinc-900 text-white px-5 py-3 rounded-lg shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Route Preview:</span>
              <span className="text-xs font-semibold flex items-center gap-2">
                {routeStops.length > 0 ? (
                  routeStops.map((stop, idx) => (
                    <React.Fragment key={stop.cityId}>
                      <span>{stop.cityName}</span>
                      {idx < routeStops.length - 1 && <span className="text-zinc-550">→</span>}
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-zinc-500 italic font-normal">Add destinations below...</span>
                )}
              </span>
            </div>
            <span className="text-xs font-bold text-indigo-400 shrink-0">{routeStops.length} selected</span>
          </div>

          {/* Filtering bar */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:flex-1 flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search destination cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-premium pl-10 py-2 text-xs"
              />
            </div>

            <div className="w-full sm:w-auto flex gap-4">
              <div className="flex-1 sm:flex-initial">
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="w-full sm:w-36 px-2 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-xs"
                >
                  {regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="flex-1 sm:flex-initial">
                <select
                  value={costFilter}
                  onChange={(e) => setCostFilter(e.target.value)}
                  className="w-full sm:w-32 px-2 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-xs"
                >
                  <option value="All">All Costs</option>
                  <option value="1">₹</option>
                  <option value="2">₹₹</option>
                  <option value="3">₹₹₹</option>
                  <option value="4">₹₹₹₹</option>
                  <option value="5">₹₹₹₹₹</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid list of cities */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => {
              const isInRoute = routeStops.some(s => s.cityId === city.id);
              return (
                <div 
                  key={city.id} 
                  className="travel-card rounded-lg overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="h-40 overflow-hidden relative">
                      <img src={city.image} alt={city.name} onError={handleImageError} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <div>
                          <h4 className="font-editorial text-white text-lg font-bold m-0">{city.name}</h4>
                          <p className="text-zinc-200 text-[10px] mt-0.5">{city.country} • {city.region}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{city.description}</p>
                      
                      <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-100 dark:border-zinc-800">
                        <div className="flex text-amber-500">
                          {Array.from({ length: city.popularity }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                        <span className="font-semibold text-zinc-400 flex gap-0.5">
                          Cost: {Array.from({ length: city.costIndex }).map((_, idx) => (
                            <span key={idx}>₹</span>
                          ))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
                    {isInRoute ? (
                      <button
                        onClick={() => handleRemoveCityFromRoute(city.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 text-xs font-semibold rounded-md cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddCityToRoute(city.id, city.name)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs font-semibold rounded-md cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Stop</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: CONFIGURE ROUTE & ASSIGN DATES */}
      {step === 3 && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h3 className="font-editorial text-xl font-bold text-zinc-950 dark:text-white m-0">Review Route Chronology</h3>
            <p className="text-xs text-zinc-400 mt-1">Reorder stops and assign specific dates for each city stay.</p>
          </div>

          <div className="space-y-4">
            {routeStops.map((stop, index) => (
              <div 
                key={stop.cityId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-lg gap-4"
              >
                <div className="flex items-center gap-4">
                  <span className="h-6 w-6 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-xs font-bold shadow-xs">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{stop.cityName}</h4>
                  </div>
                </div>

                {/* Dates configuration */}
                <div className="flex gap-4 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-initial">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Arrival</label>
                    <input
                      type="date"
                      required
                      value={stop.arrivalDate}
                      onChange={(e) => handleUpdateStopDate(index, 'arrivalDate', e.target.value)}
                      className="px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-750 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div className="flex-1 sm:flex-initial">
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Departure</label>
                    <input
                      type="date"
                      required
                      value={stop.departureDate}
                      onChange={(e) => handleUpdateStopDate(index, 'departureDate', e.target.value)}
                      className="px-2 py-1 text-xs border border-zinc-300 dark:border-zinc-750 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Order controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => handleMoveStop(index, 'up')}
                    disabled={index === 0}
                    className="p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 rounded cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleMoveStop(index, 'down')}
                    disabled={index === routeStops.length - 1}
                    className="p-1 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 rounded cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleRemoveCityFromRoute(stop.cityId)}
                    className="p-1 border border-red-200 dark:border-red-950/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 rounded cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <button
              disabled={routeStops.length === 0}
              onClick={handleFinalSave}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-white text-xs font-semibold uppercase tracking-wider rounded-md disabled:opacity-30 cursor-pointer shadow-sm"
            >
              <span>Build Complete Itinerary</span>
              <Check className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
