import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlaneTakeoff, 
  ArrowRight, 
  Share2, 
  Sparkles
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { handleImageError } from '../utils/imageFallback';
import Footer from '../components/layout/Footer';

export const Landing: React.FC = () => {
  const { user } = useApp();

  const sampleActivities = [
    { time: '09:00', name: 'Tsukiji Outer Market', duration: '90 mins' },
    { time: '14:00', name: 'TeamLab Borderless', duration: '180 mins' },
    { time: '19:30', name: 'Shibuya Crossing & Dinner', duration: '120 mins' }
  ];

  const sampleDestinations = [
    { 
      name: 'Tokyo', 
      desc: 'Neon nights, quiet mornings.', 
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&auto=format&fit=crop&q=80',
      country: 'Japan' 
    },
    { 
      name: 'Paris', 
      desc: 'Art, architecture and long evenings.', 
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
      country: 'France' 
    },
    { 
      name: 'Rome', 
      desc: 'Ancient roads, endless flavors.', 
      image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&auto=format&fit=crop&q=80',
      country: 'Italy' 
    },
    { 
      name: 'Singapore', 
      desc: 'Future gardens, heritage streets.', 
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
      country: 'Singapore' 
    }
  ];

  return (
    <div className="min-h-screen bg-[#090B0D] text-[#F5F5F2] font-interface selection:bg-[#D9A752]/30 selection:text-[#D9A752]">
      
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#090B0D]/80 backdrop-blur-md border-b border-[#292F36] transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#090B0D] shadow-sm">
              <PlaneTakeoff className="h-4.5 w-4.5" />
            </div>
            <span className="font-editorial text-xl font-extrabold tracking-tight text-white">GlobeTrotter</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-[#B8BEC6]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <Link to="/explore" className="hover:text-white transition-colors">Destinations</Link>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-[#B8BEC6] hover:text-white transition-colors px-2">
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#090B0D] bg-[#D9A752] hover:bg-[#C59643] px-4 py-2 rounded-md transition-all shadow-xs"
              >
                Start Planning
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#D9A752] uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5" />
              <span>Personalized travel planning</span>
            </span>
            <h1 className="font-editorial text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight m-0 uppercase">
              Plan the trip.<br />
              <span className="text-[#D9A752] font-normal italic font-editorial lowercase">not just</span> the destination.
            </h1>
            <p className="text-sm sm:text-base text-[#B8BEC6] leading-relaxed max-w-lg">
              Build multi-city itineraries, organize day-by-day activities, track your estimated budget, and see your entire journey in one cohesive view.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {user ? (
              <Link 
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#090B0D] bg-[#D9A752] hover:bg-[#C59643] px-6 py-3 rounded-md transition-all shadow-sm"
              >
                <span>Continue Planning</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#090B0D] bg-[#D9A752] hover:bg-[#C59643] px-6 py-3 rounded-md transition-all shadow-sm"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a 
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider border border-[#292F36] hover:bg-white/5 px-6 py-3 rounded-md text-[#B8BEC6] hover:text-white transition-all"
                >
                  <span>Explore Features</span>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Right Column: Editorial Visual (Japan Route Preview) */}
        <div className="lg:col-span-7 bg-[#111418] border border-[#292F36] p-6 sm:p-8 rounded-xl shadow-lg relative overflow-hidden flex flex-col justify-between h-[360px] sm:h-[400px]">
          {/* Subtle grid lines background overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="flex justify-between items-start border-b border-[#292F36] pb-4 z-10">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-[#D9A752] uppercase">Active Journey Preview</span>
              <h3 className="font-editorial text-2xl font-bold text-white m-0 mt-1">Autumn Japan Discovery</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-[#7F8791]">Total Cost</span>
              <p className="text-sm font-bold text-white m-0 mt-0.5">{formatINR(124500)}</p>
            </div>
          </div>

          {/* Visual Editorial Connections (Tokyo -> Kyoto -> Osaka) */}
          <div className="relative flex justify-between items-center my-6 py-4 px-2 sm:px-6 z-10">
            {/* The Connecting Path line */}
            <div className="absolute left-6 right-6 top-1/2 h-0.5 border-t border-dashed border-[#D9A752]/40 -translate-y-1/2 z-0" />

            {/* Stops */}
            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="h-9 w-9 rounded-full bg-[#1B2025] border border-[#D9A752] flex items-center justify-center text-[10px] font-bold text-[#D9A752]">01</div>
              <div className="text-center">
                <span className="text-xs font-bold text-white block">TOKYO</span>
                <span className="text-[9px] text-[#7F8791] block">12 Oct</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="h-9 w-9 rounded-full bg-[#1B2025] border border-[#D9A752] flex items-center justify-center text-[10px] font-bold text-[#D9A752]">02</div>
              <div className="text-center">
                <span className="text-xs font-bold text-white block">KYOTO</span>
                <span className="text-[9px] text-[#7F8791] block">15 Oct</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 relative z-10">
              <div className="h-9 w-9 rounded-full bg-[#1B2025] border border-[#D9A752] flex items-center justify-center text-[10px] font-bold text-[#D9A752]">03</div>
              <div className="text-center">
                <span className="text-xs font-bold text-white block">OSAKA</span>
                <span className="text-[9px] text-[#7F8791] block">18 Oct</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#292F36] pt-4 flex items-center justify-between text-[11px] text-[#7F8791] z-10">
            <span>8 Days Journey</span>
            <span>3 Destinations Planned</span>
          </div>
        </div>
      </section>

      {/* Section 2: Everything for the journey in one place */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Interactive capabilities</span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-extrabold text-white uppercase m-0">
            Everything for the journey, in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#111418] border border-[#292F36] p-6 rounded-lg space-y-3">
            <span className="text-xs font-bold text-[#D9A752] uppercase">01 / Route Architect</span>
            <h3 className="font-editorial text-lg font-bold text-white m-0">Build your route</h3>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">
              Create complex multi-city trips and arrange destination stops. GlobeTrotter tracks stops chronologically with correct dates.
            </p>
          </div>

          <div className="bg-[#111418] border border-[#292F36] p-6 rounded-lg space-y-3">
            <span className="text-xs font-bold text-[#D9A752] uppercase">02 / Itinerary Planner</span>
            <h3 className="font-editorial text-lg font-bold text-white m-0">Plan each day</h3>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">
              Add activities, category labels (Relaxation, Culture, Sightseeing), duration tags, and scheduled timings to construct a polished schedule.
            </p>
          </div>

          <div className="bg-[#111418] border border-[#292F36] p-6 rounded-lg space-y-3">
            <span className="text-xs font-bold text-[#D9A752] uppercase">03 / Spend Analytics</span>
            <h3 className="font-editorial text-lg font-bold text-white m-0">Know your cost</h3>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">
              Track accommodation, transport, meals, and sightseeing inside an analytical budget dashboard showing total expenditure and remaining allowances.
            </p>
          </div>

          <div className="bg-[#111418] border border-[#292F36] p-6 rounded-lg space-y-3">
            <span className="text-xs font-bold text-[#D9A752] uppercase">04 / Unified Schedule</span>
            <h3 className="font-editorial text-lg font-bold text-white m-0">See the whole journey</h3>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">
              Switch between an editorial timeline preview and a unified calendar scheduler to inspect stays, checkouts, and transit days.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Interactive Itinerary Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Workspace Timeline</span>
          <h2 className="font-editorial text-3xl font-bold uppercase text-white m-0 leading-tight">
            Constructing rich timelines.
          </h2>
          <p className="text-xs text-[#B8BEC6] leading-relaxed">
            See a real-time preview of your planned days. Easily manage, add, or inspect activity blocks with exact time offsets, categories, and estimated costs.
          </p>
        </div>

        <div className="lg:col-span-7 bg-[#111418] border border-[#292F36] p-6 rounded-xl space-y-6">
          <div className="flex justify-between items-center border-b border-[#292F36] pb-3 text-xs text-[#7F8791]">
            <span className="font-bold text-white uppercase tracking-wider">Day 01 — Tokyo, JP</span>
            <span>12 October</span>
          </div>

          <div className="space-y-4">
            {sampleActivities.map((act, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 border border-[#292F36] bg-[#090B0D] rounded-lg text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#D9A752] w-10 shrink-0">{act.time}</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-[#D9A752]" />
                  <div>
                    <span className="font-semibold text-white block">{act.name}</span>
                    <span className="text-[10px] text-[#7F8791]">{act.duration}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 bg-white/5 border border-zinc-800 px-2 py-0.5 rounded">
                  Activity
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Destination Discovery */}
      <section id="destinations" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Wanderlust discovery</span>
          <h2 className="font-editorial text-3xl font-bold uppercase text-white m-0">
            Where will you go next?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleDestinations.map((dest, index) => (
            <Link 
              to="/explore"
              key={index}
              className="travel-card rounded-lg overflow-hidden flex flex-col bg-[#111418] border border-[#292F36] group hover:border-[#D9A752] transition-all cursor-pointer"
            >
              <div className="h-44 overflow-hidden relative">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <div>
                    <h4 className="font-editorial text-white text-lg font-bold m-0">{dest.name}</h4>
                    <span className="text-[9px] uppercase tracking-widest text-[#D9A752] font-semibold mt-0.5">{dest.country}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 text-xs text-[#B8BEC6] leading-relaxed">
                {dest.desc}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link 
            to="/explore"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D9A752] hover:text-[#C59643] transition-all"
          >
            <span>Explore all destinations</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Section 5: How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Step-by-step guidance</span>
          <h2 className="font-editorial text-3xl font-bold uppercase text-white m-0">How GlobeTrotter Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D9A752] block">01 / Create Trip</span>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">Give your itinerary a name, scheduled dates, and a base budget limit in INR.</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D9A752] block">02 / Build Route</span>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">Search cities, inspect daily cost indices, and arrange stops chronologically.</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D9A752] block">03 / Plan Days</span>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">Add scheduled sights, meals, transport nodes, and notes for each day.</p>
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#D9A752] block">04 / Share & Travel</span>
            <p className="text-xs text-[#B8BEC6] leading-relaxed">Copy public read-only links to share travel progression logs with friends.</p>
          </div>
        </div>
      </section>

      {/* Section 6: Budget Preview */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Spend Snapshot</span>
          <h2 className="font-editorial text-3xl font-bold uppercase text-white m-0 leading-tight">
            Comprehensive Expense Tracking.
          </h2>
          <p className="text-xs text-[#B8BEC6] leading-relaxed">
            Break down travel costs into Transport, Accommodation, Activities, Meals, and Miscellaneous groups. Monitor remaining limits to avoid overbudgeting.
          </p>
        </div>

        <div className="lg:col-span-7 bg-[#111418] border border-[#292F36] p-6 rounded-xl space-y-4">
          <span className="text-[10px] uppercase font-bold text-[#7F8791] tracking-widest block">Estimated Cost Breakdown</span>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-[#292F36]">
              <span className="text-[#B8BEC6]">Accommodation</span>
              <span className="font-bold text-white">{formatINR(55000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#292F36]">
              <span className="text-[#B8BEC6]">Transport</span>
              <span className="font-bold text-white">{formatINR(30000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#292F36]">
              <span className="text-[#B8BEC6]">Activities</span>
              <span className="font-bold text-white">{formatINR(24500)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#292F36]">
              <span className="text-[#B8BEC6]">Meals</span>
              <span className="font-bold text-white">{formatINR(15000)}</span>
            </div>
            <div className="flex justify-between items-center py-2 text-sm font-bold pt-3 text-[#D9A752]">
              <span>TOTAL ESTIMATED</span>
              <span>{formatINR(124500)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Sharing */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-[#292F36] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Public Sharing</span>
          <h2 className="font-editorial text-3xl font-bold uppercase text-white m-0 leading-tight">
            Share Itineraries Instantly.
          </h2>
          <p className="text-xs text-[#B8BEC6] leading-relaxed">
            Generate a clean, read-only public itinerary link. Share your journey details, city stops, and scheduled timelines without exposing sensitive profile records.
          </p>
        </div>

        <div className="lg:col-span-7 bg-[#111418] border border-[#292F36] p-5 rounded-lg flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-[10px] uppercase font-bold text-[#7F8791] tracking-widest block">Public Preview URL</span>
            <span className="text-xs text-[#B8BEC6] font-semibold mt-1 block truncate">globetrotter.com/shared/japan-autumn-2026</span>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 px-3 py-1.5 bg-[#D9A752] text-[#090B0D] text-xs font-bold uppercase tracking-wider rounded-md"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Copy Link</span>
          </button>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="bg-[#111418] border-y border-[#292F36]">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center space-y-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Plan together. Share the route. Keep the trip moving.</span>
          <h2 className="font-editorial text-4xl sm:text-5xl font-extrabold text-white uppercase m-0 leading-tight">
            Your next trip starts with a plan.
          </h2>
          <p className="text-xs sm:text-sm text-[#B8BEC6] leading-relaxed max-w-lg mx-auto">
            Create your first travel itinerary and see the entire journey come together.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/signup"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#090B0D] bg-[#D9A752] hover:bg-[#C59643] px-6 py-3 rounded-md transition-all shadow-sm"
            >
              <span>Start Planning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider border border-[#292F36] hover:bg-white/5 px-6 py-3 rounded-md text-[#B8BEC6] hover:text-white transition-all"
            >
              <span>Log in</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
};
