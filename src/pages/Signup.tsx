import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PlaneTakeoff, ShieldAlert, CheckCircle2, ArrowRight, MapPin, Eye, EyeOff } from 'lucide-react';

export const Signup: React.FC = () => {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Field-level error messages
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [generalError, setGeneralError] = useState('');
  const [confirmationNotice, setConfirmationNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Email regex validator
  const isValidEmail = (str: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str.trim());
  };

  // Password strength calculator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-zinc-700' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedName = name.trim();
    if (!trimmedName) {
      errors.name = 'Full name is required.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(trimmedEmail)) {
      errors.email = 'Please provide a valid email address (e.g., name@example.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }

    setConfirmationNotice(false);
    setSubmitting(true);

    try {
      const res = await signup(email.trim(), name.trim(), password);
      if (res.success) {
        if (res.requiresConfirmation) {
          setConfirmationNotice(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        setGeneralError(res.error || 'Registration failed. Please verify your inputs and try again.');
      }
    } catch (err: any) {
      setGeneralError(err.message || 'An unexpected error occurred during account creation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex font-interface transition-colors duration-300">
      
      {/* Left panel: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:w-[500px] xl:w-[560px]">
        <div className="mx-auto w-full max-w-sm lg:w-[380px]">
          
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#090B0D] shadow-sm group-hover:scale-105 transition-transform">
              <PlaneTakeoff className="h-4.5 w-4.5" />
            </div>
            <span className="font-editorial text-xl font-bold tracking-tight text-zinc-900 dark:text-white">GlobeTrotter</span>
          </Link>

          <div className="mt-8">
            <h2 className="font-editorial text-3xl font-bold tracking-tight text-zinc-900 dark:text-white m-0">
              Create Account
            </h2>
            <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-550">
              Join GlobeTrotter to map multi-city routes, track INR budgets, and share itineraries.
            </p>
          </div>

          <div className="mt-8">
            {confirmationNotice ? (
              <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-emerald-300">Account Created Successfully!</h3>
                    <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                      Your profile has been created. Please proceed to sign in to access your itinerary dashboard.
                    </p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-lg text-xs uppercase tracking-wider transition-all"
                >
                  <span>Proceed to Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {generalError && (
                  <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-650 dark:text-red-400 rounded-lg text-xs flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0" />
                    <span>{generalError}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="e.g. Alex Mercer"
                    className={`input-premium ${fieldErrors.name ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30' : ''}`}
                  />
                  {fieldErrors.name && (
                    <p className="text-[11px] text-red-400 mt-1 font-medium">{fieldErrors.name}</p>
                  )}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="e.g. alex@globetrotter.com"
                    className={`input-premium ${fieldErrors.email ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30' : ''}`}
                  />
                  {fieldErrors.email && (
                    <p className="text-[11px] text-red-400 mt-1 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    placeholder="At least 6 characters"
                    className={`input-premium ${fieldErrors.password ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30' : ''}`}
                  />
                  {fieldErrors.password && (
                    <p className="text-[11px] text-red-400 mt-1 font-medium">{fieldErrors.password}</p>
                  )}

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-400">Strength:</span>
                        <span className={`font-semibold ${strength.score === 3 ? 'text-emerald-400' : strength.score === 2 ? 'text-amber-400' : 'text-red-400'}`}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder="Re-enter your password"
                    className={`input-premium ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30' : ''}`}
                  />
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-red-400 mt-1 font-medium">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-premium btn-premium-primary text-xs tracking-wider uppercase font-semibold py-2.5 mt-3 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Creating Account...' : 'Get Started'}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-xs text-zinc-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-zinc-900 dark:text-[#D9A752] hover:underline">
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] uppercase font-bold tracking-widest text-[#D9A752] mb-6 border border-white/10">
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
