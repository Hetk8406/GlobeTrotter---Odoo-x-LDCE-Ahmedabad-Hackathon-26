import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlaneTakeoff, ShieldAlert, Sparkles, MapPin } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required to access your itineraries.');
      return;
    }
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex font-interface transition-colors duration-300">
      
      {/* Left panel: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:w-[480px] xl:w-[540px]">
        <div className="mx-auto w-full max-w-sm lg:w-[360px]">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
              <PlaneTakeoff className="h-4.5 w-4.5" />
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-zinc-900 dark:text-white">GlobeTrotter</span>
          </div>

          <div className="mt-8">
            <h2 className="font-editorial text-3xl font-bold tracking-tight text-zinc-900 dark:text-white m-0">
              Welcome Back
            </h2>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-550">
              Sign in to manage, share, and design your upcoming journeys.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@globetrotter.com"
                  className="input-premium"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-3.5 w-3.5 border-zinc-300 dark:border-zinc-700 rounded text-zinc-900 focus:ring-zinc-900/10"
                  />
                  <span>Keep me signed in</span>
                </label>
                <a href="#" className="font-semibold text-zinc-900 dark:text-white hover:underline">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full btn-premium btn-premium-primary text-xs tracking-wider uppercase font-semibold py-2.5"
              >
                Sign In
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
                <span className="px-2.5 bg-white dark:bg-zinc-950 text-zinc-400">
                  Demo Credentials
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setEmail('alex@globetrotter.com');
                setPassword('password');
                login('alex@globetrotter.com');
                navigate('/');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-zinc-250 dark:border-zinc-800 rounded-lg bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Explore as Alex Mercer (Guest)</span>
            </button>

            <p className="mt-6 text-center text-xs text-zinc-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-semibold text-zinc-900 dark:text-white hover:underline">
                Create account
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right panel: Graphic Editorial Travel Grid (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-zinc-950 relative overflow-hidden">
        {/* Editorial Cover Background */}
        <img
          src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1600&auto=format&fit=crop&q=80"
          alt="Editorial Rome Travel"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Content Overlays */}
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-zinc-200 mb-6">
            <MapPin className="h-3 w-3" />
            <span>Rome, Italy</span>
          </span>
          <h3 className="font-editorial text-4xl font-light italic leading-snug">
            "To travel is to discover that everyone is wrong about other countries."
          </h3>
          <p className="text-zinc-300 text-xs tracking-wider uppercase font-semibold mt-4">
            — Aldous Huxley
          </p>
        </div>
      </div>

    </div>
  );
};
