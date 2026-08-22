import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlaneTakeoff, ShieldAlert, MapPin } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      setError('All fields are required to secure your account.');
      return;
    }
    setError('');
    const success = await signup(email, name, password);
    if (success) {
      navigate('/');
    } else {
      setError('Registration failed. Please check your inputs or try another email.');
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
              Create Account
            </h2>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-550">
              Join GlobeTrotter to map, calculate budgets, and share itineraries.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-655 dark:text-red-400 rounded-lg text-xs flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-premium"
                />
              </div>

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
                  placeholder="john@example.com"
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

              <button
                type="submit"
                className="w-full btn-premium btn-premium-primary text-xs tracking-wider uppercase font-semibold py-2.5 mt-2"
              >
                Get Started
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-zinc-900 dark:text-white hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>

      {/* Right panel: Graphic Editorial Travel Grid (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 bg-zinc-950 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&auto=format&fit=crop&q=80"
          alt="Editorial Bali Sunset"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Content Overlays */}
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-zinc-200 mb-6">
            <MapPin className="h-3 w-3" />
            <span>Bali, Indonesia</span>
          </span>
          <h3 className="font-editorial text-4xl font-light italic leading-snug">
            "Travel makes one modest. You see what a tiny place you occupy in the world."
          </h3>
          <p className="text-zinc-300 text-xs tracking-wider uppercase font-semibold mt-4">
            — Gustave Flaubert
          </p>
        </div>
      </div>

    </div>
  );
};
