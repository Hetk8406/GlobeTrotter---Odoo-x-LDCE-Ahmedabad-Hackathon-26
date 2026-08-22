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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row transition-colors duration-300 font-interface">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200/80 dark:border-zinc-800 shrink-0">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800 gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
            <PlaneTakeoff className="h-4.5 w-4.5" />
          </div>
          <span className="font-editorial text-xl font-bold tracking-tight text-zinc-900 dark:text-white">GlobeTrotter</span>
        </div>

        {/* User Card */}
        {user && (
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
            <img 
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
              alt={user.name} 
              className="h-9 w-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-50 truncate">{user.name}</p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">{user.email}</p>
            </div>
          </div>
        )}

        {/* Quick Action Button */}
        <div className="px-4 py-4">
          <Link 
            to="/create-trip"
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-zinc-900 hover:bg-zinc-800 dark:bg-[#D9A752] dark:hover:bg-[#C59643] dark:text-[#090B0D] text-white text-xs font-semibold shadow-xs transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5 font-bold" />
            <span>Plan New Trip</span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  active 
                    ? 'bg-zinc-100 dark:bg-[#D9A752]/10 text-zinc-900 dark:text-[#D9A752] font-bold border-l-2 border-[#D9A752]' 
                    : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-55 dark:hover:bg-zinc-850/45 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Icon className={`h-4 w-4 transition-colors ${active ? 'text-zinc-900 dark:text-[#D9A752]' : 'text-zinc-400 dark:text-zinc-550'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section: Theme & Logout */}
        <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 flex flex-col gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-zinc-500 dark:text-zinc-450 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-zinc-455 hover:text-red-500" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-zinc-900 border-b border-zinc-150 dark:border-zinc-800 z-20">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-sm">
            <PlaneTakeoff className="h-4 w-4" />
          </div>
          <span className="font-editorial text-lg font-bold tracking-tight text-zinc-900 dark:text-white">GlobeTrotter</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white dark:bg-zinc-900 z-10 flex flex-col p-4 border-t border-zinc-100 dark:border-zinc-800 animate-fade-in">
          {/* Quick Action */}
          <Link 
            to="/create-trip"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-zinc-900 text-white font-semibold text-xs shadow-xs mb-4"
          >
            <Plus className="h-4 w-4" />
            <span>Plan New Trip</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-zinc-100 dark:bg-zinc-850 text-zinc-900 dark:text-white' 
                      : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Theme & Logout */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-semibold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
