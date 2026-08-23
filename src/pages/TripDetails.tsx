import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MOCK_ACTIVITIES, MOCK_CITIES } from '../data/mockData';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Share2, 
  Copy, 
  Activity as ActivityIcon, 
  Briefcase,
  ChevronRight,
  X,
  Edit2
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { handleImageError } from '../utils/imageFallback';

export const TripDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    trips, 
    removeStopFromTrip, 
    updateStopOrder, 
    addActivityToStop, 
    removeActivityFromStop, 
    addExpenseToTrip,
    removeExpenseFromTrip,
    addStopToTrip,
    updateTrip
  } = useApp();

  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'timeline' | 'share'>('itinerary');
  const [timelineViewMode, setTimelineViewMode] = useState<'timeline' | 'calendar'>('timeline');

  // Modals state
  const [showAddStop, setShowAddStop] = useState(false);
  const [selectedCityId, setSelectedCityId] = useState('');
  const [stopArrival, setStopArrival] = useState('');
  const [stopDeparture, setStopDeparture] = useState('');

  const [showAddActivity, setShowAddActivity] = useState<string | null>(null); // stopId
  const [activityCategory, setActivityCategory] = useState<'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Shopping' | 'Relaxation'>('Sightseeing');
  const [activityName, setActivityName] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityCost, setActivityCost] = useState('');
  const [activityDuration, setActivityDuration] = useState('');
  const [activityTime, setActivityTime] = useState('09:00');

  // Edit Activity state
  const [editActivityState, setEditActivityState] = useState<{
    stopId: string;
    activityId: string;
    name: string;
    category: 'Sightseeing' | 'Food' | 'Adventure' | 'Culture' | 'Shopping' | 'Relaxation';
    description: string;
    estimatedCost: string;
    duration: string;
    time: string;
  } | null>(null);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseCategory, setExpenseCategory] = useState<'Transport' | 'Accommodation' | 'Activities' | 'Meals' | 'Miscellaneous'>('Transport');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const [modalError, setModalError] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  const trip = trips.find(t => t.id === id);

  if (!trip) {
    return (
      <div className="text-center py-12 font-interface">
        <h2 className="text-2xl font-bold text-white">Trip not found</h2>
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

  // Calculations for budget
  const totalExpenses = trip.expenses.reduce((acc, e) => acc + e.amount, 0);
  const remainingBudget = trip.totalBudget - totalExpenses;
  const isOverBudget = remainingBudget < 0;
  const budgetPercentage = Math.min((totalExpenses / trip.totalBudget) * 100, 100);

  // Expense breakdown by categories
  const expensesByCategory = trip.expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoriesList: ('Transport' | 'Accommodation' | 'Activities' | 'Meals' | 'Miscellaneous')[] = [
    'Transport', 'Accommodation', 'Activities', 'Meals', 'Miscellaneous'
  ];

  // Duration in days
  const date1 = new Date(trip.startDate);
  const date2 = new Date(trip.endDate);
  const totalDays = Math.ceil(Math.abs(date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const avgDailyCost = totalDays > 0 ? (totalExpenses / totalDays) : 0;

  // Add stop handler
  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!selectedCityId) {
      setModalError('Please choose a destination city.');
      return;
    }
    if (!stopArrival || !stopDeparture) {
      setModalError('Arrival and departure dates are required.');
      return;
    }
    if (new Date(stopArrival) > new Date(stopDeparture)) {
      setModalError('Stop arrival date cannot be after departure date.');
      return;
    }

    addStopToTrip(trip.id, selectedCityId, stopArrival, stopDeparture);
    setShowAddStop(false);
    setSelectedCityId('');
    setStopArrival('');
    setStopDeparture('');
    setModalError('');
  };

  // Add custom activity handler
  const handleAddActivity = (e: React.FormEvent, stopId: string) => {
    e.preventDefault();
    setModalError('');

    const trimmedName = activityName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setModalError('Activity name must be at least 2 characters.');
      return;
    }

    const cost = parseFloat(activityCost);
    if (isNaN(cost) || cost < 0) {
      setModalError('Estimated cost must be a non-negative INR amount.');
      return;
    }

    const duration = parseInt(activityDuration);
    if (isNaN(duration) || duration <= 0) {
      setModalError('Duration must be at least 1 minute.');
      return;
    }

    addActivityToStop(trip.id, stopId, {
      name: trimmedName,
      category: activityCategory,
      description: activityDesc.trim() || 'No description provided.',
      estimatedCost: cost,
      duration: duration,
      time: activityTime || '09:00',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&auto=format&fit=crop&q=80'
    });

    setShowAddActivity(null);
    setActivityName('');
    setActivityDesc('');
    setActivityCost('');
    setActivityDuration('');
    setActivityTime('09:00');
    setModalError('');
  };

  // Add preset activity helper
  const handleAddPresetActivity = (stopId: string, preset: any) => {
    addActivityToStop(trip.id, stopId, {
      name: preset.name,
      category: preset.category,
      description: preset.description,
      estimatedCost: preset.estimatedCost,
      duration: preset.duration,
      time: '10:00', // default time
      image: preset.image
    });
  };

  // Activity reordering inside a stop
  const handleMoveActivity = (stopId: string, activityId: string, direction: 'up' | 'down') => {
    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        const actIndex = stop.activities.findIndex(a => a.id === activityId);
        if (actIndex === -1) return stop;

        const newActs = [...stop.activities];
        if (direction === 'up' && actIndex > 0) {
          const temp = newActs[actIndex];
          newActs[actIndex] = newActs[actIndex - 1];
          newActs[actIndex - 1] = temp;
        } else if (direction === 'down' && actIndex < newActs.length - 1) {
          const temp = newActs[actIndex];
          newActs[actIndex] = newActs[actIndex + 1];
          newActs[actIndex + 1] = temp;
        }

        return {
          ...stop,
          activities: newActs
        };
      }
      return stop;
    });

    updateTrip({
      ...trip,
      stops: updatedStops
    });
  };

  // Edit activity submit
  const handleEditActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');
    if (!editActivityState) return;

    const { stopId, activityId, name, category, description, estimatedCost, duration, time } = editActivityState;

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setModalError('Activity name must be at least 2 characters.');
      return;
    }

    const cost = parseFloat(estimatedCost);
    if (isNaN(cost) || cost < 0) {
      setModalError('Estimated cost must be a non-negative INR amount.');
      return;
    }

    const dur = parseInt(duration);
    if (isNaN(dur) || dur <= 0) {
      setModalError('Duration must be at least 1 minute.');
      return;
    }

    const originalActivity = trip.stops.find(s => s.id === stopId)?.activities.find(a => a.id === activityId);
    if (!originalActivity) return;

    const updatedStops = trip.stops.map(stop => {
      if (stop.id === stopId) {
        return {
          ...stop,
          activities: stop.activities.map(act => {
            if (act.id === activityId) {
              return {
                ...act,
                name: trimmedName,
                category,
                description: description.trim() || 'No description provided.',
                estimatedCost: cost,
                duration: dur,
                time
              };
            }
            return act;
          }).sort((a, b) => a.time.localeCompare(b.time))
        };
      }
      return stop;
    });

    // Update related auto-created activity expense
    const updatedExpenses = trip.expenses.map(exp => {
      if (exp.description === `Activity: ${originalActivity.name}`) {
        return {
          ...exp,
          amount: cost,
          description: `Activity: ${trimmedName}`
        };
      }
      return exp;
    });

    updateTrip({
      ...trip,
      stops: updatedStops,
      expenses: updatedExpenses
    });

    setEditActivityState(null);
    setModalError('');
  };

  // Add Expense handler
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    const trimmedDesc = expenseDesc.trim();
    if (!trimmedDesc || trimmedDesc.length < 2) {
      setModalError('Expense description must be at least 2 characters.');
      return;
    }

    const amt = parseFloat(expenseAmount);
    if (isNaN(amt) || amt < 0) {
      setModalError('Expense amount must be a non-negative INR amount.');
      return;
    }

    if (!expenseDate) {
      setModalError('A valid expense date is required.');
      return;
    }

    addExpenseToTrip(trip.id, {
      category: expenseCategory,
      amount: amt,
      date: expenseDate,
      description: trimmedDesc
    });

    setShowAddExpense(false);
    setExpenseAmount('');
    setExpenseDesc('');
    setExpenseDate('');
    setModalError('');
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/#/shared/${trip.id}`;
    navigator.clipboard.writeText(shareUrl);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-interface">
      {/* Cover / Header Card */}
      <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden shadow-xs">
        <img 
          src={trip.coverImage} 
          alt={trip.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/40 to-transparent flex flex-col justify-end p-6 sm:p-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-300 text-xs font-semibold uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Trip Itinerary</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-4xl font-extrabold text-white mt-1 mb-2 tracking-tight">{trip.name}</h1>
              <p className="text-zinc-200 text-xs sm:text-sm line-clamp-2 max-w-2xl">{trip.description}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-lg text-white shrink-0 self-start sm:self-auto">
              <div className="flex items-center gap-2 text-xs text-zinc-200">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
              </div>
              <div className="mt-2 text-xs text-zinc-200 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[200px]">{trip.destinations.join(' → ') || 'No stops yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-lg shadow-xs flex">
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'itinerary' 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-55 dark:hover:bg-zinc-800'
          }`}
        >
          <ActivityIcon className="h-4 w-4" />
          <span>Itinerary Builder</span>
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'budget' 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-55 dark:hover:bg-zinc-800'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          <span>Budget & Costs</span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'timeline' 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-55 dark:hover:bg-zinc-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>Timeline View</span>
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'share' 
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs' 
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-55 dark:hover:bg-zinc-800'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Share Trip</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* TAB 1: ITINERARY BUILDER */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white m-0">Trip Chronology</h2>
                <p className="text-xs text-zinc-400 mt-1">Add stay destinations, search preset suggestions, and map activities.</p>
              </div>
              <button
                onClick={() => setShowAddStop(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded-md shadow-xs cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Stop</span>
              </button>
            </div>

            {/* Stops Checklist */}
            {trip.stops.length > 0 ? (
              <div className="space-y-8 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[1.5px] before:bg-zinc-200 dark:before:bg-zinc-800">
                {trip.stops.map((stop, index) => {
                  const presetActivities = MOCK_ACTIVITIES[stop.cityId] || [];
                  const dailyActivityCost = stop.activities.reduce((acc, a) => acc + a.estimatedCost, 0);
                  
                  // Calculate stay days
                  const stop1 = new Date(stop.arrivalDate);
                  const stop2 = new Date(stop.departureDate);
                  const stopDays = Math.ceil(Math.abs(stop2.getTime() - stop1.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <div key={stop.id} className="relative pl-12 sm:pl-16 group">
                      {/* Timeline Dot Indicator */}
                      <div className="absolute left-3 top-1.5 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-950 border-2 border-zinc-900 dark:border-white flex items-center justify-center text-[10px] font-bold text-zinc-900 dark:text-white z-10">
                        {index + 1}
                      </div>

                      {/* Stop Panel */}
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800/80">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-editorial text-lg font-bold text-zinc-950 dark:text-white m-0">
                                {stop.cityName}
                              </h3>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-350">
                                {stopDays} {stopDays === 1 ? 'Day' : 'Days'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-1.5 font-semibold">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</span>
                            </div>
                          </div>

                          {/* Order & Deletion Controls */}
                          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
                            <span className="text-[10px] font-semibold text-zinc-405 dark:text-zinc-500 mr-2">Stop Total: ${dailyActivityCost}</span>
                            <button
                              onClick={() => updateStopOrder(trip.id, stop.id, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-550 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => updateStopOrder(trip.id, stop.id, 'down')}
                              disabled={index === trip.stops.length - 1}
                              className="p-1 rounded border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-550 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => removeStopFromTrip(trip.id, stop.id)}
                              className="p-1 rounded border border-red-200 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Stop Activities */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Scheduled Activities</h4>
                          
                          {stop.activities.length > 0 ? (
                            <div className="space-y-3">
                              {stop.activities.map((act, actIdx) => (
                                <div 
                                  key={act.id} 
                                  className="flex items-center justify-between p-3 rounded border border-zinc-150 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/40 hover:bg-zinc-50 dark:hover:bg-zinc-850/60 transition-all gap-4 animate-fade-in"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded overflow-hidden shrink-0">
                                      <img src={act.image} alt={act.name} onError={handleImageError} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="text-xs font-bold text-zinc-900 dark:text-white m-0">{act.name}</p>
                                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase">{act.category}</span>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-zinc-400 mt-1 font-medium">
                                        <span className="flex items-center gap-1 font-bold text-zinc-650 dark:text-zinc-350"><Clock className="h-3 w-3" /> {act.time} • {act.duration} mins</span>
                                        <span className="font-bold text-zinc-850 dark:text-zinc-100">{formatINR(act.estimatedCost)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Activity Time, Reorder, Edit, Delete */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleMoveActivity(stop.id, act.id, 'up')}
                                      disabled={actIdx === 0}
                                      className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                      title="Move Up"
                                    >
                                      <ArrowUp className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveActivity(stop.id, act.id, 'down')}
                                      disabled={actIdx === stop.activities.length - 1}
                                      className="p-1 rounded text-zinc-400 hover:text-zinc-900 dark:hover:text-white disabled:opacity-20 cursor-pointer"
                                      title="Move Down"
                                    >
                                      <ArrowDown className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setEditActivityState({
                                        stopId: stop.id,
                                        activityId: act.id,
                                        name: act.name,
                                        category: act.category,
                                        description: act.description,
                                        estimatedCost: act.estimatedCost.toString(),
                                        duration: act.duration.toString(),
                                        time: act.time
                                      })}
                                      className="p-1.5 text-zinc-400 hover:text-zinc-855 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                      title="Edit Activity"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => removeActivityFromStop(trip.id, stop.id, act.id)}
                                      className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                                      title="Delete"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-zinc-400 dark:text-zinc-550 italic m-0">No activities scheduled yet for this stop.</p>
                          )}
                        </div>

                        {/* Add Activities Drawer/Buttons */}
                        <div className="pt-2 flex flex-col gap-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => setShowAddActivity(stop.id)}
                              className="inline-flex items-center gap-1 py-1.5 px-3 rounded border border-zinc-250 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-350 text-xs font-semibold cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Custom Activity</span>
                            </button>

                            {/* Preset suggestions */}
                            {presetActivities.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase">Presets:</span>
                                {presetActivities.map(p => (
                                  <button
                                    key={p.name}
                                    onClick={() => handleAddPresetActivity(stop.id, p)}
                                    className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
                                  >
                                    + {p.name} ({formatINR(p.estimatedCost)})
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-lg text-center shadow-xs max-w-sm mx-auto">
                <MapPin className="h-10 w-10 text-zinc-350 mx-auto mb-3" />
                <h4 className="font-editorial text-lg font-bold text-zinc-900 dark:text-white m-0">No Stops Configured</h4>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-2">Start adding destinations to configure your dates.</p>
                <button
                  onClick={() => setShowAddStop(true)}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-semibold rounded-md cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stop</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BUDGET & EXPENSES */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Estimated Budget</p>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 m-0">{formatINR(trip.totalBudget)}</h3>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Scheduled Costs</p>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 m-0">{formatINR(totalExpenses)}</h3>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Remaining Budget</p>
                <h3 className={`text-xl font-bold mt-1 m-0 ${isOverBudget ? 'text-red-500' : 'text-emerald-500'}`}>
                  {formatINR(remainingBudget)}
                </h3>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Avg Daily Cost</p>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-1 m-0">{formatINR(Math.round(avgDailyCost))}/day</h3>
              </div>
            </div>

            {/* Budget Progress Bar */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-zinc-500">Budget Spent</span>
                <span className={isOverBudget ? 'text-red-500' : 'text-zinc-900 dark:text-white'}>
                  {Math.round(budgetPercentage)}%
                </span>
              </div>
              <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${isOverBudget ? 'bg-red-500' : 'bg-zinc-900 dark:bg-white'}`}
                  style={{ width: `${budgetPercentage}%` }}
                />
              </div>
              {isOverBudget && (
                <p className="text-[10px] text-red-500 font-semibold m-0">Warning: You have exceeded your estimated trip budget!</p>
              )}
            </div>

            {/* Expenses Breakdown & Logger Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Expense List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white m-0">Logged Costs</h3>
                  <button
                    onClick={() => setShowAddExpense(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold rounded-md shadow-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Log Expense</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-xs">
                  {trip.expenses.length > 0 ? (
                    <div className="divide-y divide-zinc-150 dark:divide-zinc-800/80">
                      {trip.expenses.map((exp) => (
                        <div key={exp.id} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-50/50 dark:hover:bg-zinc-850/30 transition-colors animate-fade-in">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                              {exp.category}
                            </span>
                            <div>
                              <p className="font-bold text-zinc-900 dark:text-white m-0">{exp.description}</p>
                              <p className="text-zinc-400 mt-0.5 m-0 text-[10px]">{formatDate(exp.date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-900 dark:text-white">{formatINR(exp.amount)}</span>
                            <button
                              onClick={() => removeExpenseFromTrip(trip.id, exp.id)}
                              className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-zinc-500 text-xs">No expenses logged yet. Add your activities or log other travel costs.</div>
                  )}
                </div>
              </div>

              {/* Right Col: Category Breakdown visual */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 rounded-lg shadow-xs space-y-4">
                <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Spending Categories</h3>
                <div className="space-y-3">
                  {categoriesList.map((category) => {
                    const amount = expensesByCategory[category] || 0;
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-zinc-400">{category}</span>
                          <span className="text-zinc-850 dark:text-zinc-100">${amount.toLocaleString()} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full bg-zinc-900 dark:bg-white"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: TIMELINE VIEW */}
        {activeTab === 'timeline' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg shadow-xs space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="font-editorial text-xl font-bold text-zinc-900 dark:text-white m-0">Route Roadmap</h3>
                <p className="text-zinc-400 text-xs mt-1">Chronological summary of your travel cities and stops.</p>
              </div>
              <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-md text-xs">
                <button
                  onClick={() => setTimelineViewMode('timeline')}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                    timelineViewMode === 'timeline' 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                      : 'text-zinc-500'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setTimelineViewMode('calendar')}
                  className={`px-3 py-1 rounded font-bold cursor-pointer transition-all ${
                    timelineViewMode === 'calendar' 
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm' 
                      : 'text-zinc-500'
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {trip.stops.length > 0 ? (
              <div>
                {timelineViewMode === 'timeline' ? (
                  <div className="relative pt-4 pb-4">
                    <div className="flex flex-col sm:flex-row items-start gap-6 overflow-x-auto pb-4">
                      {trip.stops.map((stop, index) => (
                        <React.Fragment key={stop.id}>
                          <div className="bg-zinc-50 dark:bg-zinc-850/40 p-5 rounded-lg border border-zinc-150 dark:border-zinc-800 w-full sm:w-64 shrink-0 space-y-3">
                            <div className="flex items-center gap-2.5">
                              <span className="h-5 w-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                                {index + 1}
                              </span>
                              <h4 className="font-bold text-zinc-900 dark:text-white m-0 text-sm">{stop.cityName}</h4>
                            </div>
                            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-semibold m-0">{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p>
                            
                            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider m-0">Schedule:</p>
                              {stop.activities.map(a => (
                                <div key={a.id} className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400">
                                  <span className="truncate max-w-[140px]">{a.time} - {a.name}</span>
                                  <span className="font-semibold shrink-0">${a.estimatedCost}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {index < trip.stops.length - 1 && (
                            <div className="hidden sm:flex items-center h-24 text-zinc-300 dark:text-zinc-700">
                              <ChevronRight className="h-8 w-8" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
                    {Array.from({ length: totalDays }).map((_, dayIdx) => {
                      const currentDate = new Date(trip.startDate);
                      currentDate.setDate(currentDate.getDate() + dayIdx);
                      const dateStr = currentDate.toISOString().split('T')[0];
                      
                      // Find stops matching this date
                      const activeStop = trip.stops.find(s => dateStr >= s.arrivalDate && dateStr <= s.departureDate);
                      
                      return (
                        <div key={dayIdx} className="border border-zinc-150 dark:border-zinc-800 rounded-lg p-4 bg-zinc-55/35 dark:bg-zinc-900/20 space-y-2">
                          <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Day {dayIdx + 1}</span>
                            <span className="text-[10px] font-semibold text-zinc-500">{currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          
                          {activeStop ? (
                            <div className="space-y-1.5">
                              <p className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1 m-0">
                                <MapPin className="h-3 w-3 text-indigo-500" />
                                <span>{activeStop.cityName}</span>
                              </p>
                              <div className="space-y-1">
                                {activeStop.activities.map(act => (
                                  <div key={act.id} className="text-[10px] text-zinc-550 dark:text-zinc-400 flex justify-between gap-2">
                                    <span className="truncate max-w-[120px]">{act.time} - {act.name}</span>
                                    <span className="font-bold shrink-0">${act.estimatedCost}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <p className="text-[10px] text-zinc-400 italic m-0">Transit or Free Day</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 text-xs text-center py-6">No stops found. Add destinations in the Itinerary tab.</p>
            )}
          </div>
        )}

        {/* TAB 4: SHARING CONTROLS */}
        {activeTab === 'share' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 rounded-lg shadow-xs space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <Share2 className="h-8 w-8 text-zinc-900 dark:text-white mx-auto" />
              <h3 className="font-editorial text-lg font-bold text-zinc-900 dark:text-white m-0">Share Your Trip</h3>
              <p className="text-zinc-400 text-xs">Publish this trip and share a read-only preview with friends and family.</p>
            </div>

            {/* Input display */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Public Shareable Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/#/shared/${trip.id}`}
                    className="flex-1 px-3 py-2 text-xs border border-zinc-250 dark:border-zinc-850 rounded bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-450 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs rounded shadow-xs cursor-pointer"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy</span>
                  </button>
                </div>
                {shareSuccess && (
                  <p className="text-[10px] text-emerald-500 font-semibold mt-1.5 m-0">✓ Copied link to clipboard!</p>
                )}
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-medium">Link Status:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="pt-2">
                <Link
                  to={`/shared/${trip.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-350 text-xs font-semibold"
                >
                  <span>Preview Shared Page</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: ADD STOP */}
      {showAddStop && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-850">
              <h3 className="font-editorial font-bold text-zinc-900 dark:text-white m-0">Add Travel Stop</h3>
              <button
                onClick={() => setShowAddStop(false)}
                className="p-1 rounded hover:bg-zinc-105 text-zinc-400 hover:text-zinc-650 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStop} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs font-medium">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1.5">City</label>
                <select
                  required
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                >
                  <option value="">-- Choose destination city --</option>
                  {MOCK_CITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Arrival Date</label>
                  <input
                    type="date"
                    required
                    value={stopArrival}
                    onChange={(e) => setStopArrival(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1.5">Departure Date</label>
                  <input
                    type="date"
                    required
                    value={stopDeparture}
                    onChange={(e) => setStopDeparture(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddStop(false)}
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
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD CUSTOM ACTIVITY */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-850">
              <h3 className="font-editorial font-bold text-zinc-900 dark:text-white m-0">Create Custom Activity</h3>
              <button
                onClick={() => setShowAddActivity(null)}
                className="p-1 rounded hover:bg-zinc-105 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => handleAddActivity(e, showAddActivity)} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs font-medium">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Activity Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guided Art Tour, Rooftop Dinner"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Category</label>
                  <select
                    value={activityCategory}
                    onChange={(e) => setActivityCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-zinc-250 dark:border-zinc-850 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={activityTime}
                    onChange={(e) => setActivityTime(e.target.value)}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    placeholder="2500"
                    value={activityCost}
                    onChange={(e) => setActivityCost(e.target.value)}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    placeholder="120"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Description</label>
                <textarea
                  placeholder="Details of the activity..."
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  rows={2}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddActivity(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded cursor-pointer shadow-sm"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT ACTIVITY */}
      {editActivityState && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-850">
              <h3 className="font-editorial font-bold text-zinc-900 dark:text-white m-0">Edit Activity Details</h3>
              <button
                onClick={() => setEditActivityState(null)}
                className="p-1 rounded hover:bg-zinc-105 text-zinc-400 hover:text-zinc-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditActivitySubmit} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs font-medium">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Activity Name</label>
                <input
                  type="text"
                  required
                  value={editActivityState.name}
                  onChange={(e) => setEditActivityState({ ...editActivityState, name: e.target.value })}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Category</label>
                  <select
                    value={editActivityState.category}
                    onChange={(e) => setEditActivityState({ ...editActivityState, category: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 border border-zinc-250 dark:border-zinc-850 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-800 dark:text-zinc-200"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Food">Food</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Culture">Culture</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Relaxation">Relaxation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Scheduled Time</label>
                  <input
                    type="time"
                    required
                    value={editActivityState.time}
                    onChange={(e) => setEditActivityState({ ...editActivityState, time: e.target.value })}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    value={editActivityState.estimatedCost}
                    onChange={(e) => setEditActivityState({ ...editActivityState, estimatedCost: e.target.value })}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Duration (mins)</label>
                  <input
                    type="number"
                    required
                    min={5}
                    value={editActivityState.duration}
                    onChange={(e) => setEditActivityState({ ...editActivityState, duration: e.target.value })}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Description</label>
                <textarea
                  value={editActivityState.description}
                  onChange={(e) => setEditActivityState({ ...editActivityState, description: e.target.value })}
                  rows={2}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditActivityState(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-50 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded cursor-pointer shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD EXPENSE */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-850 flex justify-between items-center bg-zinc-50 dark:bg-zinc-850">
              <h3 className="font-editorial font-bold text-zinc-900 dark:text-white m-0">Log Travel Cost</h3>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-1 rounded hover:bg-zinc-105 text-zinc-450 hover:text-zinc-650 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs font-medium">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight tickets, Hotel stay, Museum Pass"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Category</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Accommodation">Accommodation</option>
                    <option value="Activities">Activities</option>
                    <option value="Meals">Meals</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-405 uppercase mb-1.5">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step="any"
                    placeholder="2500"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="input-premium py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Date</label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="input-premium py-1.5 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-550 hover:bg-zinc-50 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded cursor-pointer shadow-sm"
                >
                  Log Cost
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
