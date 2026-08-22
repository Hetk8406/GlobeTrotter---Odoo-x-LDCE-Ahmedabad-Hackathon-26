import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Calendar as CalendarIcon, MapPin, Briefcase, ChevronRight } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { trips } = useApp();

  // Extract all stops from all trips and sort them chronologically
  const allStops = trips
    .filter(t => t.status !== 'completed')
    .flatMap(t => 
      t.stops.map(s => ({
        ...s,
        tripName: t.name,
        tripId: t.id
      }))
    )
    .sort((a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white m-0 tracking-tight">Timeline & Schedule</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Check dates and stops for all your upcoming adventures.</p>
      </div>

      {allStops.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {allStops.map((stop, stopIdx) => (
                <li key={stop.id}>
                  <div className="relative pb-8">
                    {/* Line connection */}
                    {stopIdx !== allStops.length - 1 ? (
                      <span 
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200 dark:bg-slate-800" 
                        aria-hidden="true" 
                      />
                    ) : null}
                    
                    <div className="relative flex space-x-3 sm:space-x-6 items-start">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <MapPin className="h-4.5 w-4.5" />
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0 pt-1.5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{stop.cityName}</span>
                            <span className="font-normal text-xs text-slate-450 dark:text-slate-500">Stop {stop.order}</span>
                          </p>
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                            <Briefcase className="h-3 w-3" />
                            <span>Trip: </span>
                            <Link to={`/trips/${stop.tripId}`} className="font-semibold text-indigo-600 hover:underline">{stop.tripName}</Link>
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right shrink-0">
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Stay Duration</p>
                            <p className="text-xs text-slate-400 mt-0.5">{formatDate(stop.arrivalDate)} - {formatDate(stop.departureDate)}</p>
                          </div>
                          
                          <Link 
                            to={`/trips/${stop.tripId}`}
                            className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-12 text-center max-w-sm mx-auto shadow-sm">
          <CalendarIcon className="h-10 w-10 text-slate-350 mx-auto mb-3" />
          <h3 className="font-bold text-slate-900 dark:text-white">Timeline is Empty</h3>
          <p className="text-slate-500 text-xs mt-1">Schedule stops in your trips to display them here in a timeline.</p>
          <Link
            to="/create-trip"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white font-medium text-xs px-4 py-2 mt-4 rounded-lg shadow-sm"
          >
            Plan Trip
          </Link>
        </div>
      )}
    </div>
  );
};
