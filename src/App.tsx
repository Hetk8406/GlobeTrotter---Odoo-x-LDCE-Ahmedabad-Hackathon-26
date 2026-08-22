import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import './App.css';

// Route guard for authenticated routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white font-interface">
        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-zinc-900 shadow-md animate-pulse">
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

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Public read-only sharing route */}
          <Route path="/shared/:id" element={<SharedTrip />} />

          {/* Protected Main routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
          <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Cities /></ProtectedRoute>} />
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
