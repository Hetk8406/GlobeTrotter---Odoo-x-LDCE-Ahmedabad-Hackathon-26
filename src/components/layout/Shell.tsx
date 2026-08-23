import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Compass, 
  Calendar as CalendarIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Menu, 
  X,
  PlaneTakeoff,
  Briefcase
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: Briefcase },
    { name: 'Explore Cities', path: '/explore', icon: Compass },
    { name: 'Timeline / Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-interface antialiased selection:bg-[#D9A752]/20 selection:text-[#D9A752]">
      {/* Top Horizontal Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#0E1114]/90 backdrop-blur-md border-b border-[#20252B] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Brand Logo & Links */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 min-w-0">
            <Link to="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
              <div className="h-8 w-8 rounded-lg bg-[#D9A752] flex items-center justify-center text-[#090B0D] shadow-sm group-hover:scale-105 transition-transform">
                <PlaneTakeoff className="h-4.5 w-4.5" />
              </div>
              <span className="font-editorial text-xl font-bold tracking-tight text-white">GlobeTrotter</span>
            </Link>

            {/* Desktop Horizontal Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-xs font-semibold transition-all ${
                      active 
                        ? 'bg-[#D9A752]/10 text-[#D9A752] border border-[#D9A752]/30 shadow-xs' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-[#D9A752]' : 'text-zinc-400'}`} />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Quick Action CTA, User Info, Logout */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Action Plan New Trip */}
            <Link 
              to="/create-trip"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-[#D9A752] hover:bg-[#C59643] text-[#090B0D] text-xs font-bold shadow-sm transition-all hover:shadow-[0_0_15px_rgba(217,167,82,0.25)]"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Plan New Trip</span>
              <span className="sm:hidden">Plan</span>
            </Link>

            {/* User Profile Badge (Desktop) */}
            {user && (
              <div className="hidden lg:flex items-center gap-2.5 pl-3 border-l border-zinc-800">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-full object-cover border border-zinc-700 shrink-0"
                />
                <div className="min-w-0 max-w-[120px]">
                  <p className="text-xs font-semibold text-zinc-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Logout Button (Desktop) */}
            <button 
              onClick={handleLogout}
              title="Log Out"
              className="hidden md:flex items-center justify-center p-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#101316] border-b border-[#20252B] p-4 flex flex-col gap-3 animate-fade-in">
            {/* User Card on Mobile */}
            {user && (
              <div className="p-3 bg-[#15191D] border border-zinc-800 rounded-lg flex items-center gap-3">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
                  alt={user.name} 
                  className="h-9 w-9 rounded-full object-cover border border-zinc-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5">{user.email}</p>
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      active 
                        ? 'bg-[#D9A752]/10 text-[#D9A752] border border-[#D9A752]/30' 
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-[#D9A752]' : 'text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Logout */}
            <div className="pt-3 border-t border-zinc-800">
              <button 
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area - Full-Width Expansive Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex-1">
        {children}
      </main>
    </div>
  );
};
