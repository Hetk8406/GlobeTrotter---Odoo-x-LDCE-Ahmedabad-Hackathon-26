import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { CreateTrip } from './pages/CreateTrip';
import { MyTrips } from './pages/MyTrips';
import { TripDetails } from './pages/TripDetails';
import { Cities } from './pages/Cities';
import { Calendar } from './pages/Calendar';
import { SharedTrip } from './pages/SharedTrip';
import { Settings } from './pages/Settings';
import { PlaneTakeoff } from 'lucide-react';
import './App.css';

// Route guard for authenticated routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-interface">
        <div className="h-10 w-10 rounded-lg bg-[#D9A752] flex items-center justify-center text-zinc-900 shadow-md animate-pulse">
          <span className="font-editorial text-lg font-bold">G</span>
        </div>
        <p className="mt-4 text-xs text-zinc-400 tracking-wider uppercase font-semibold animate-pulse">
          Restoring your session...
        </p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Shell>{children}</Shell>;
};

// Route guard for public auth routes (redirects authenticated users to dashboard)
const PublicAuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-interface">
        <div className="h-10 w-10 rounded-lg bg-[#D9A752] flex items-center justify-center text-zinc-900 shadow-md animate-pulse">
          <span className="font-editorial text-lg font-bold">G</span>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Route for exploring destinations (works for public and authenticated visitors)
const ExploreRoute: React.FC = () => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-interface">
        <div className="h-10 w-10 rounded-lg bg-[#D9A752] flex items-center justify-center text-zinc-900 shadow-md animate-pulse">
          <span className="font-editorial text-lg font-bold">G</span>
        </div>
        <p className="mt-4 text-xs text-zinc-400 tracking-wider uppercase font-semibold animate-pulse">
          Loading catalog...
        </p>
      </div>
    );
  }

  if (user) {
    return <Shell><Cities /></Shell>;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-interface flex flex-col antialiased selection:bg-[#D9A752]/20 selection:text-[#D9A752]">
      {/* Public Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0E1114]/90 backdrop-blur-md border-b border-[#20252B] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#090B0D] shadow-sm group-hover:scale-105 transition-transform">
              <PlaneTakeoff className="h-4.5 w-4.5" />
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-white">GlobeTrotter</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-3.5 py-1.5 rounded-lg bg-[#D9A752] hover:bg-[#C59643] text-[#090B0D] text-xs font-bold transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Cities />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/signup" element={<PublicAuthRoute><Signup /></PublicAuthRoute>} />

          {/* Public read-only sharing route */}
          <Route path="/shared/:id" element={<SharedTrip />} />

          {/* Destination Catalog (Public / Authenticated) */}
          <Route path="/explore" element={<ExploreRoute />} />

          {/* Protected Main routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          {/* Catch-all redirect to Homepage */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
