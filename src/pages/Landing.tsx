import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  PlaneTakeoff, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Wallet, 
  Share2, 
  Compass, 
  Clock, 
  Check, 
  Layers, 
  ArrowUpRight 
} from 'lucide-react';
import { formatINR } from '../utils/format';
import { handleImageError } from '../utils/imageFallback';
import { MOCK_CITIES, MOCK_ACTIVITIES } from '../data/mockData';

export const Landing: React.FC = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // State for interactive route demo
  const [activeRouteIndex, setActiveRouteIndex] = useState(0);

  // State for itinerary demo day tabs
  const [activeItineraryDay, setActiveItineraryDay] = useState<'day1' | 'day4' | 'day8' | 'day11'>('day1');

  // State for destination filter category
  const [activeRegionTab, setActiveRegionTab] = useState<'India' | 'Asia' | 'Europe' | 'Americas' | 'MiddleEastAfrica' | 'Oceania'>('India');

  const journeyRoute = [
    { city: 'Ahmedabad', state: 'Gujarat', days: '2 Days', tag: 'Heritage & UNESCO', image: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=600&auto=format&fit=crop&q=80' },
    { city: 'Udaipur', state: 'Rajasthan', days: '3 Days', tag: 'City of Lakes', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=600&auto=format&fit=crop&q=80' },
    { city: 'Jodhpur', state: 'Rajasthan', days: '3 Days', tag: 'The Blue City', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&auto=format&fit=crop&q=80' },
    { city: 'Jaipur', state: 'Rajasthan', days: '4 Days', tag: 'The Pink City', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&auto=format&fit=crop&q=80' },
  ];

  const cityTaglines: Record<string, string> = {
    mumbai: "The City of Dreams",
    delhi: "The Historic Capital",
    jaipur: "The Pink City",
    udaipur: "The City of Lakes",
    goa: "Sun-Drenched Coastline",
    bengaluru: "Silicon Valley of India",
    kolkata: "The Cultural Capital",
    varanasi: "Eternal Spiritual Ghats",
    agra: "Mughal Imperial Wonder",
    manali: "Himalayan Adventure",
    shimla: "Queen of the Hills",
    srinagar: "Paradise on Earth",
    kochi: "Queen of Arabian Sea",
    darjeeling: "Himalayan Tea Country",
    kerala: "God's Own Country",
    ahmedabad: "UNESCO World Heritage",
    jodhpur: "The Blue City",
    hyderabad: "The City of Pearls",
    rishikesh: "Yoga & River Sanctuary",
    tokyo: "Neon Lights & Shrines",
    kyoto: "Ancient Imperial Temples",
    osaka: "Street Food & Canal Town",
    seoul: "Dynamic K-Culture Capital",
    singapore: "Futuristic Garden City",
    bangkok: "Grand Temples & Souks",
    bali: "Tropical Island Sanctuary",
    dubai: "Futuristic Skyline & Sands",
    paris: "The City of Light",
    london: "Royalty & Rich Heritage",
    rome: "The Eternal City",
    barcelona: "Gaudí Art & Coastline",
    amsterdam: "Canals, Art & Cycling",
    prague: "City of a Hundred Spires",
    vienna: "Imperial Palace & Music",
    berlin: "Modern Art & History",
    venice: "Floating City of Canals",
    florence: "Cradle of Renaissance",
    'new-york': "The City That Never Sleeps",
    'los-angeles': "Hollywood & Golden Coast",
    'san-francisco': "Golden Gate & Rolling Hills",
    'rio-de-janeiro': "Copacabana & Samba Beats",
    'buenos-aires': "Tango & Grand Architecture",
    'cape-town': "Table Mountain Coast",
    marrakech: "Historic Souks & Riads",
    cairo: "Pyramids & Nile River",
    sydney: "Harbour Bridge & Sunny Surf",
    melbourne: "Coffee & Laneway Culture",
    queenstown: "Global Adventure Capital"
  };

  const getCitySights = (cityId: string) => {
    const acts = MOCK_ACTIVITIES[cityId];
    if (acts && acts.length > 0) {
      return acts.slice(0, 3).map(a => a.name);
    }
    const defaultSights: Record<string, string[]> = {
      tokyo: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree'],
      kyoto: ['Fushimi Inari Shrine', 'Kinkaku-ji', 'Arashiyama Bamboo'],
      singapore: ['Gardens by the Bay', 'Marina Bay Sands', 'Sentosa Island'],
      bangkok: ['Grand Palace', 'Wat Arun', 'Chatuchak Weekend Market'],
      bali: ['Uluwatu Temple', 'Ubud Rice Terraces', 'Seminyak Beach'],
      dubai: ['Burj Khalifa', 'Dubai Mall', 'Palm Jumeirah'],
      paris: ['Eiffel Tower', 'Louvre Museum', 'Arc de Triomphe'],
      london: ['Big Ben & Westminster', 'Tower of London', 'British Museum'],
      rome: ['Colosseum', 'Vatican Museums', 'Trevi Fountain'],
      barcelona: ['Sagrada Familia', 'Park Güell', 'La Rambla'],
      amsterdam: ['Rijksmuseum', 'Canal Cruise', 'Van Gogh Museum'],
      'new-york': ['Times Square', 'Central Park', 'Statue of Liberty'],
      'rio-de-janeiro': ['Christ the Redeemer', 'Copacabana Beach', 'Sugarloaf Mountain'],
      'cape-town': ['Table Mountain', 'Boulders Beach Penguins', 'Kirstenbosch Botanical'],
      cairo: ['Pyramids of Giza', 'Great Sphinx', 'Khan el-Khalili Bazaar'],
      sydney: ['Sydney Opera House', 'Bondi Beach', 'Harbour Bridge'],
      queenstown: ['Lake Wakatipu Cruise', 'Milford Sound Day Trip', 'Skyline Gondola']
    };
    return defaultSights[cityId] || ['City Center Tour', 'Historic Old Town', 'Local Food Market'];
  };

  // Convert MOCK_CITIES into enriched global destination cards
  const globalDestinations = MOCK_CITIES.map(city => {
    let regionGroup = city.region;
    if (city.country === 'India') {
      regionGroup = 'India';
    } else if (city.id === 'dubai' || city.region === 'Africa') {
      regionGroup = 'MiddleEastAfrica';
    }

    const estimatedDaily = (city.costIndex || 2) * 1600 + 1200;

    return {
      id: city.id,
      name: city.name,
      country: city.country,
      region: city.country === 'India' ? `${city.name}, India` : `${city.name}, ${city.country}`,
      regionGroup,
      tagline: cityTaglines[city.id] || `${city.country} Escape`,
      image: city.image,
      description: city.description,
      sights: getCitySights(city.id),
      estimatedDaily
    };
  });

  // Filtered based on tab
  const filteredDestinations = globalDestinations.filter(d => {
    if (activeRegionTab === 'India') return d.regionGroup === 'India';
    if (activeRegionTab === 'Asia') return d.regionGroup === 'Asia';
    if (activeRegionTab === 'Europe') return d.regionGroup === 'Europe';
    if (activeRegionTab === 'Americas') return d.regionGroup === 'Americas';
    if (activeRegionTab === 'MiddleEastAfrica') return d.regionGroup === 'MiddleEastAfrica';
    if (activeRegionTab === 'Oceania') return d.regionGroup === 'Oceania';
    return true;
  });

  const itineraryDays = {
    day1: {
      dayNumber: 'Day 01',
      city: 'Ahmedabad',
      state: 'Gujarat',
      date: 'Nov 01, 2026',
      totalDayCost: 500,
      activities: [
        { time: '09:00', name: 'Adalaj Stepwell Architecture Tour', category: 'Culture', duration: '90 mins', cost: 100, image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=500&auto=format&fit=crop&q=80' },
        { time: '14:30', name: 'Sabarmati Gandhi Ashram Heritage', category: 'Culture', duration: '75 mins', cost: 0, image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=500&auto=format&fit=crop&q=80' },
        { time: '19:30', name: 'Manek Chowk Historic Street Food Walk', category: 'Food', duration: '120 mins', cost: 400, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80' },
      ]
    },
    day4: {
      dayNumber: 'Day 04',
      city: 'Udaipur',
      state: 'Rajasthan',
      date: 'Nov 04, 2026',
      totalDayCost: 1050,
      activities: [
        { time: '09:30', name: 'City Palace of Udaipur Walkthrough', category: 'Culture', duration: '150 mins', cost: 450, image: 'https://images.unsplash.com/photo-1595238210381-81765c7c2b4d?w=500&auto=format&fit=crop&q=80' },
        { time: '16:30', name: 'Lake Pichola Sunset Boat Cruise', category: 'Relaxation', duration: '90 mins', cost: 600, image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=500&auto=format&fit=crop&q=80' },
        { time: '19:45', name: 'Traditional Rajasthani Folk Show at Bagore Ki Haveli', category: 'Culture', duration: '60 mins', cost: 0, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80' },
      ]
    },
    day8: {
      dayNumber: 'Day 08',
      city: 'Jodhpur',
      state: 'Rajasthan',
      date: 'Nov 08, 2026',
      totalDayCost: 650,
      activities: [
        { time: '09:00', name: 'Mehrangarh Fort High-Cliff Exploration', category: 'Sightseeing', duration: '150 mins', cost: 350, image: 'https://images.unsplash.com/photo-1562122606-d0a068a52cb2?w=500&auto=format&fit=crop&q=80' },
        { time: '14:00', name: 'Jaswant Thada Marble Cenotaphs', category: 'Culture', duration: '60 mins', cost: 100, image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=500&auto=format&fit=crop&q=80' },
        { time: '17:00', name: 'Blue City Brahmin Alleyways Guided Stroll', category: 'Sightseeing', duration: '90 mins', cost: 200, image: 'https://images.unsplash.com/photo-1562122606-d0a068a52cb2?w=500&auto=format&fit=crop&q=80' },
      ]
    },
    day11: {
      dayNumber: 'Day 11',
      city: 'Jaipur',
      state: 'Rajasthan',
      date: 'Nov 11, 2026',
      totalDayCost: 850,
      activities: [
        { time: '08:30', name: 'Hawa Mahal Palace of Winds Morning Facade', category: 'Sightseeing', duration: '60 mins', cost: 200, image: 'https://images.unsplash.com/photo-1603262110263-fb010d6e59d4?w=500&auto=format&fit=crop&q=80' },
        { time: '11:00', name: 'Amber Fort Hilltop Palace & Sheesh Mahal', category: 'Culture', duration: '180 mins', cost: 500, image: 'https://images.unsplash.com/photo-1477584322904-48618db530c2?w=500&auto=format&fit=crop&q=80' },
        { time: '17:30', name: 'Nahargarh Fort Sunset Skyline Observation', category: 'Relaxation', duration: '90 mins', cost: 150, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500&auto=format&fit=crop&q=80' },
      ]
    }
  };

  const budgetBreakdown = [
    { category: 'Flights & Rail Transit', amount: 18000, percentage: 37, color: 'bg-[#D9A752]' },
    { category: 'Heritage Hotels & Stays', amount: 14500, percentage: 30, color: 'bg-emerald-400' },
    { category: 'Activities & Monument Passes', amount: 7000, percentage: 14, color: 'bg-amber-400' },
    { category: 'Regional Cuisine & Dining', amount: 6000, percentage: 12, color: 'bg-blue-400' },
    { category: 'Local Transport & Cabs', amount: 3000, percentage: 7, color: 'bg-purple-400' },
  ];

  const handleStartPlanning = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090B] text-[#F3F4F6] font-interface selection:bg-[#D9A752]/30 selection:text-[#D9A752]">
      
      {/* 1. EDITORIAL NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#07090B]/85 backdrop-blur-xl border-b border-zinc-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#07090B] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <PlaneTakeoff className="h-5 w-5" />
            </div>
            <span className="font-editorial text-2xl font-bold tracking-tight text-white group-hover:text-[#D9A752] transition-colors">
              GlobeTrotter
            </span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            <a href="#product-value" className="hover:text-white transition-colors">Experience</a>
            <Link to="/explore" className="hover:text-white transition-colors">Destinations</Link>
            <a href="#visual-itinerary" className="hover:text-white transition-colors">Itineraries</a>
            <a href="#budget-showcase" className="hover:text-white transition-colors">Budgeting</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#07090B] bg-[#D9A752] hover:bg-[#E5B560] px-5 py-2.5 rounded-lg transition-all shadow-sm"
              >
                <span>My Trips</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-xs font-bold uppercase tracking-widest text-zinc-300 hover:text-white transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-[#07090B] bg-[#D9A752] hover:bg-[#E5B560] px-5 py-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. CINEMATIC HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 border-b border-zinc-800/80">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#D9A752]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-[#D9A752]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Editorial Copy */}
            <div className="lg:col-span-6 space-y-8 z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-[#D9A752] tracking-wide shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Your Journey, Beautifully Organized</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-editorial text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08] m-0">
                YOUR NEXT<br />
                JOURNEY<br />
                <span className="text-[#D9A752] italic font-normal">STARTS HERE.</span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl font-light">
                Build multi-city adventures, discover places worth visiting, manage your budget, and keep your entire journey beautifully organized.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={handleStartPlanning}
                  className="inline-flex items-center justify-center gap-2.5 text-sm font-bold uppercase tracking-wider text-[#07090B] bg-[#D9A752] hover:bg-[#E5B560] px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-[#D9A752]/20 active:scale-[0.99] cursor-pointer"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link
                  to="/explore"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 px-7 py-4 rounded-xl transition-all"
                >
                  <Compass className="h-4 w-4 text-[#D9A752]" />
                  <span>Explore Destinations</span>
                </Link>
              </div>

              {/* Micro Metrics */}
              <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-editorial text-white">20+</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-medium">Indian Cities</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-editorial text-[#D9A752]">₹ INR</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-medium">Budget Tracking</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-editorial text-white">100%</div>
                  <div className="text-xs uppercase tracking-wider text-zinc-400 mt-1 font-medium">Organized Routes</div>
                </div>
              </div>
            </div>

            {/* Right Cinematic Visual & Interactive Route Canvas */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Main Cinematic Image Card */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl group">
                <div className="aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&auto=format&fit=crop&q=85"
                    alt="Rajasthan Palace Heritage - GlobeTrotter"
                    onError={handleImageError}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out brightness-90"
                  />
                </div>
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090B] via-[#07090B]/40 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
                    <MapPin className="h-3 w-3 text-[#D9A752]" />
                    <span>Rajasthan Heritage Circuit</span>
                  </span>
                </div>

                {/* Floating Bottom Trip Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/80 backdrop-blur-md border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#D9A752]/20 border border-[#D9A752]/40 flex items-center justify-center text-[#D9A752]">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white font-editorial">Rajasthan Grand Expedition</div>
                      <div className="text-xs text-zinc-400">4 Cities • 12 Days • ₹48,500 Estimated</div>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="text-xs font-semibold text-[#D9A752] uppercase tracking-wider bg-[#D9A752]/10 px-2.5 py-1 rounded">
                      Planning
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Journey Route Bar */}
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#D9A752]" />
                    <span>Multi-City Route Preview</span>
                  </span>
                  <span className="text-[#D9A752] font-semibold text-xs">Interactive Route</span>
                </div>

                {/* Route Nodes */}
                <div className="grid grid-cols-4 gap-2 relative">
                  {/* Background connection line */}
                  <div className="absolute top-1/2 left-6 right-6 h-0.5 bg-zinc-800 -translate-y-1/2 z-0" />
                  <div 
                    className="absolute top-1/2 left-6 h-0.5 bg-[#D9A752] -translate-y-1/2 z-0 transition-all duration-500" 
                    style={{ width: `${(activeRouteIndex / (journeyRoute.length - 1)) * 82}%` }}
                  />

                  {journeyRoute.map((stop, idx) => {
                    const isActive = activeRouteIndex === idx;
                    const isPassed = activeRouteIndex >= idx;
                    return (
                      <button
                        key={stop.city}
                        onClick={() => setActiveRouteIndex(idx)}
                        className={`relative z-10 flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-zinc-800/90 border border-[#D9A752]/50 shadow-sm' 
                            : 'hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1.5 transition-colors ${
                          isActive 
                            ? 'bg-[#D9A752] text-[#07090B] ring-4 ring-[#D9A752]/20' 
                            : isPassed
                            ? 'bg-[#D9A752]/80 text-[#07090B]'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-xs font-bold truncate max-w-full ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                          {stop.city}
                        </span>
                        <span className="text-[10px] text-zinc-500 truncate">{stop.days}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Node Details */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-zinc-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold">{journeyRoute[activeRouteIndex].city}, {journeyRoute[activeRouteIndex].state}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400">{journeyRoute[activeRouteIndex].tag}</span>
                  </div>
                  <span className="text-[#D9A752] font-semibold">{journeyRoute[activeRouteIndex].days}</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION 2 — PRODUCT VALUE ("PLAN MORE. TRAVEL BETTER.") */}
      <section id="product-value" className="py-24 border-b border-zinc-800/80 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Core Capabilities
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                PLAN MORE.<br />
                <span className="text-zinc-400 font-normal italic font-editorial">TRAVEL BETTER.</span>
              </h2>
            </div>
            <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed">
              Every detail from multi-city routing to minute-by-minute activity scheduling and live budget enforcement in INR.
            </p>
          </div>

          {/* 4 Editorial Capability Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* 01 EXPLORE */}
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-[#D9A752]/40 transition-all space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-editorial font-bold text-zinc-600 group-hover:text-[#D9A752] transition-colors">01</span>
                <div className="h-10 w-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-[#D9A752]">
                  <Compass className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight uppercase">EXPLORE</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Discover curated Indian destinations, heritage monuments, coastal gems, and high-altitude adventures with authentic details.
                </p>
              </div>
              <ul className="text-xs text-zinc-400 space-y-2 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>20+ Top Indian Cities</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Verified Sights & Timings</span>
                </li>
              </ul>
            </div>

            {/* 02 BUILD */}
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-[#D9A752]/40 transition-all space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-editorial font-bold text-zinc-600 group-hover:text-[#D9A752] transition-colors">02</span>
                <div className="h-10 w-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-[#D9A752]">
                  <Layers className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight uppercase">BUILD</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Create seamless multi-city itineraries. Sequence your stops, arrange day-by-day activities, and visualize your entire timeline.
                </p>
              </div>
              <ul className="text-xs text-zinc-400 space-y-2 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Multi-City Stop Ordering</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Activity Time Blocks</span>
                </li>
              </ul>
            </div>

            {/* 03 BUDGET */}
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-[#D9A752]/40 transition-all space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-editorial font-bold text-zinc-600 group-hover:text-[#D9A752] transition-colors">03</span>
                <div className="h-10 w-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-[#D9A752]">
                  <Wallet className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight uppercase">BUDGET</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Track estimated costs and real expenditures in INR. View category allocations for flights, hotels, dining, and activities.
                </p>
              </div>
              <ul className="text-xs text-zinc-400 space-y-2 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>100% INR-Native Accounting</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Real-Time Expense Breakdown</span>
                </li>
              </ul>
            </div>

            {/* 04 SHARE */}
            <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/90 hover:border-[#D9A752]/40 transition-all space-y-6 group">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-editorial font-bold text-zinc-600 group-hover:text-[#D9A752] transition-colors">04</span>
                <div className="h-10 w-10 rounded-xl bg-zinc-800/80 flex items-center justify-center text-[#D9A752]">
                  <Share2 className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-editorial text-2xl font-bold text-white tracking-tight uppercase">SHARE</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Share read-only journey links with friends and family. Let travel companions view live itineraries and day plans with one click.
                </p>
              </div>
              <ul className="text-xs text-zinc-400 space-y-2 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Public Trip Link Sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-[#D9A752]" />
                  <span>Interactive Live Preview</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 3 — DESTINATION GALLERY ("EXPLORE THE WORLD") */}
      <section id="destination-gallery" className="py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                DESTINATION GALLERY
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                EXPLORE THE WORLD
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                From iconic cities and hidden gems to beaches, mountains, and historic landmarks — discover places worth adding to your next journey.
              </p>
            </div>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D9A752] hover:text-[#E5B560] transition-colors py-2 group"
            >
              <span>Explore All {globalDestinations.length} Destinations</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Region Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'India', label: 'India & South Asia' },
              { id: 'Asia', label: 'East & SE Asia' },
              { id: 'Europe', label: 'Europe' },
              { id: 'Americas', label: 'Americas' },
              { id: 'MiddleEastAfrica', label: 'Middle East & Africa' },
              { id: 'Oceania', label: 'Australia & Pacific' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRegionTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  activeRegionTab === tab.id
                    ? 'bg-[#D9A752] text-[#07090B] shadow-sm font-bold'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map(dest => (
              <div 
                key={dest.id}
                className="group rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                {/* Image Aspect Box */}
                <div className="aspect-[4/3] w-full relative overflow-hidden bg-zinc-950">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#D9A752] border border-white/10">
                      {dest.tagline}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h3 className="font-editorial text-2xl font-bold text-white tracking-tight leading-none m-0">
                        {dest.name}
                      </h3>
                      <span className="text-xs text-zinc-300 font-medium">{dest.region}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Popular Sights Pill Badges */}
                  <div className="space-y-1.5 pt-2 border-t border-zinc-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                      Popular Sights:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {dest.sights.slice(0, 3).map(sight => (
                        <span 
                          key={sight}
                          className="px-2 py-0.5 rounded bg-zinc-800/90 text-[11px] text-zinc-300 font-medium border border-zinc-700/50"
                        >
                          {sight}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action */}
                  <div className="pt-3 flex items-center justify-between border-t border-zinc-800/80">
                    <span className="text-xs text-zinc-400">
                      Est. <strong className="text-white">{formatINR(dest.estimatedDaily)}</strong>/day
                    </span>
                    <Link
                      to="/explore"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#D9A752] hover:text-[#E5B560] transition-colors"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SECTION 4 — VISUAL ITINERARY SHOWCASE ("YOUR TRIP. YOUR WAY.") */}
      <section id="visual-itinerary" className="py-24 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-14">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Itinerary Experience
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
                YOUR TRIP. YOUR WAY.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
                Experience the structure of a real GlobeTrotter itinerary with timed activities, day sequences, and live cost calculation.
              </p>
            </div>

            {/* Trip Summary Card */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A752] block">Sample Trip</span>
                <span className="font-editorial text-lg font-bold text-white">RAJASTHAN ESCAPE</span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Duration & Budget</span>
                <span className="text-sm font-bold text-white">12 Days • {formatINR(48500)}</span>
              </div>
            </div>
          </div>

          {/* Interactive Itinerary Box */}
          <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 overflow-hidden shadow-2xl">
            
            {/* Top Stop Header Strip */}
            <div className="p-4 sm:p-6 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[#D9A752] text-[#07090B] flex items-center justify-center font-bold">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-zinc-400 block font-medium">Active Stop</span>
                  <span className="text-base font-bold text-white">{itineraryDays[activeItineraryDay].city}, {itineraryDays[activeItineraryDay].state}</span>
                </div>
              </div>

              {/* Day Tab Selectors */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'day1', label: 'Day 01: Ahmedabad' },
                  { key: 'day4', label: 'Day 04: Udaipur' },
                  { key: 'day8', label: 'Day 08: Jodhpur' },
                  { key: 'day11', label: 'Day 11: Jaipur' },
                ].map(day => (
                  <button
                    key={day.key}
                    onClick={() => setActiveItineraryDay(day.key as any)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeItineraryDay === day.key
                        ? 'bg-[#D9A752] text-[#07090B] font-bold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Day Activity Timeline Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between text-xs pb-4 border-b border-zinc-800/80">
                <span className="font-editorial text-xl font-bold text-white">
                  {itineraryDays[activeItineraryDay].dayNumber} Schedule
                </span>
                <span className="text-zinc-400">
                  Estimated Day Total: <strong className="text-[#D9A752] font-semibold">{formatINR(itineraryDays[activeItineraryDay].totalDayCost)}</strong>
                </span>
              </div>

              {/* Activity Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {itineraryDays[activeItineraryDay].activities.map(act => (
                  <div 
                    key={act.name}
                    className="rounded-xl bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 p-4 space-y-4 flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-3">
                      <div className="aspect-[16/9] w-full rounded-lg overflow-hidden relative">
                        <img
                          src={act.image}
                          alt={act.name}
                          onError={handleImageError}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-[#D9A752]">
                          {act.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Clock className="h-3.5 w-3.5 text-[#D9A752]" />
                        <span className="font-semibold text-white">{act.time}</span>
                        <span>•</span>
                        <span>{act.duration}</span>
                      </div>

                      <h4 className="font-editorial text-base font-bold text-white tracking-tight leading-snug">
                        {act.name}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Ticket / Entry</span>
                      <span className="font-bold text-white">
                        {act.cost === 0 ? 'Free Entry' : formatINR(act.cost)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 5 — BUDGET BREAKDOWN ("KNOW WHERE YOUR MONEY GOES.") */}
      <section id="budget-showcase" className="py-24 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Financial Clarity
              </span>
              <h2 className="font-editorial text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                KNOW WHERE<br />
                YOUR MONEY<br />
                <span className="text-[#D9A752] italic font-normal">GOES.</span>
              </h2>
              <p className="text-base text-zinc-300 leading-relaxed font-light">
                GlobeTrotter maintains rigorous INR accounting across flights, heritage hotels, daily monument entries, and dining. Track live progress against your trip budget limit.
              </p>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Total Trip Budget Limit</span>
                  <span className="font-bold text-white">{formatINR(50000)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Total Planned Spend</span>
                  <span className="font-bold text-[#D9A752]">{formatINR(48500)}</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#D9A752] h-full rounded-full" style={{ width: '97%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>97% of budget utilized</span>
                  <span className="text-emerald-400 font-semibold">Under Budget (₹1,500 surplus)</span>
                </div>
              </div>
            </div>

            {/* Right Realistic Breakdown Visual Cards */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 block">Rajasthan Expedition (12 Days)</span>
                  <span className="font-editorial text-2xl font-bold text-white">Expense Distribution</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-500 block">Total Calculated</span>
                  <span className="text-xl font-bold text-[#D9A752]">{formatINR(48500)}</span>
                </div>
              </div>

              {/* Progress Bar Stack */}
              <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-800">
                {budgetBreakdown.map((item) => (
                  <div
                    key={item.category}
                    className={`${item.color} h-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.category}: ${item.percentage}%`}
                  />
                ))}
              </div>

              {/* Detailed Breakdown Rows */}
              <div className="space-y-3 pt-2">
                {budgetBreakdown.map((item) => (
                  <div 
                    key={item.category}
                    className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-xs font-semibold text-zinc-200">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-zinc-500 font-medium">{item.percentage}%</span>
                      <span className="font-bold text-white w-20 text-right">{formatINR(item.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center text-xs text-zinc-500">
                Visual demonstration. All figures calibrated in Indian Rupees (INR).
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SECTION 6 — TRAVEL DISCOVERY STRIP */}
      <section className="py-20 border-b border-zinc-800/80 bg-zinc-950/60 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752]">Global & Domestic Inspiration</span>
            <h3 className="font-editorial text-3xl sm:text-4xl font-bold text-white">WORLDWIDE DESTINATION DISCOVERY</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { region: 'INDIA', count: '20+ Cities', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=500' },
              { region: 'EUROPE', count: 'Paris, Rome & London', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500' },
              { region: 'ASIA', count: 'Tokyo, Bangkok & Singapore', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500' },
              { region: 'MIDDLE EAST', count: 'Dubai & Cairo', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500' },
              { region: 'OCEANIA', count: 'Sydney & Queenstown', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500' },
            ].map(item => (
              <Link
                key={item.region}
                to="/explore"
                className="group relative rounded-xl overflow-hidden aspect-[3/4] border border-zinc-800 p-4 flex flex-col justify-between transition-all hover:border-[#D9A752]/60 hover:-translate-y-1 shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.region}
                  onError={handleImageError}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A752] bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {item.count}
                  </span>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-editorial text-lg font-bold text-white tracking-wide">{item.region}</span>
                  <ArrowRight className="h-4 w-4 text-[#D9A752] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. SECTION 7 — FINAL CINEMATIC CTA */}
      <section className="py-28 relative overflow-hidden border-b border-zinc-800/80">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D9A752]/5 to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-[#D9A752]">
            <Compass className="h-4 w-4" />
            <span>Ready for your next expedition?</span>
          </div>

          <h2 className="font-editorial text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-tight">
            WHERE WILL YOU<br />
            GO NEXT?
          </h2>

          <p className="text-base sm:text-xl text-zinc-300 max-w-xl mx-auto leading-relaxed font-light">
            Your next adventure is easier to plan than you think. Build your multi-city route, pick activities, and stay on budget.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartPlanning}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-base font-bold uppercase tracking-wider text-[#07090B] bg-[#D9A752] hover:bg-[#E5B560] px-10 py-4.5 rounded-xl transition-all shadow-xl hover:shadow-[#D9A752]/20 active:scale-[0.99] cursor-pointer"
            >
              <span>Start Planning</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-8 py-4 rounded-xl transition-all"
            >
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-[#07090B] text-zinc-400 font-interface">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20 space-y-12">
          
          {/* Top Brand Area */}
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#07090B] shadow-sm">
                <PlaneTakeoff className="h-4.5 w-4.5" />
              </div>
              <span className="font-editorial text-2xl font-bold tracking-tight text-white uppercase">
                GlobeTrotter
              </span>
            </div>

            <p className="font-editorial text-base text-[#D9A752] italic font-normal">
              Your journey, beautifully organized.
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
              A comprehensive travel intelligence and multi-destination itinerary platform. 
              Organize multi-city routes, plan day-by-day sightseeing, track live INR expenditures, 
              and share seamless journey timelines.
            </p>
          </div>

          {/* 4 Vertical Columns */}
          <div className="pt-10 border-t border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Column 1: GlobeTrotter */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                GlobeTrotter
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><a href="#product-value" className="hover:text-white transition-colors">Experience</a></li>
                <li><a href="#visual-itinerary" className="hover:text-white transition-colors">Itineraries</a></li>
                <li><a href="#budget-showcase" className="hover:text-white transition-colors">Budgeting</a></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">All Destinations</Link></li>
              </ul>
            </div>

            {/* Column 2: Explore */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Explore
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/explore" className="hover:text-white transition-colors">Destinations</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Rajasthan Circuits</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Himalayan Trails</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Coastal Escapes</Link></li>
              </ul>
            </div>

            {/* Column 3: Account */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Account
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">My Itineraries</Link></li>
              </ul>
            </div>

            {/* Column 4: Discover */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A752] block">
                Discover
              </span>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/explore" className="hover:text-white transition-colors">India</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Popular Destinations</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Travel Inspiration</Link></li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom Bar */}
          <div className="pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              © 2026 GlobeTrotter. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-[#D9A752] font-medium">All prices displayed in INR (₹).</span>
              <span>Dark Editorial Edition</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
