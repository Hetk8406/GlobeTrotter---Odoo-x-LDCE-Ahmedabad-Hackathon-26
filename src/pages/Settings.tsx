import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User, Shield, Globe, Trash2, Heart } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, saveUser, logout } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [language, setLanguage] = useState('English');
  const [success, setSuccess] = useState(false);

  // Saved destinations demo list
  const [savedDestinations, setSavedDestinations] = useState([
    { id: 'rome', name: 'Rome', country: 'Italy' },
    { id: 'tokyo', name: 'Tokyo', country: 'Japan' }
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser = {
      ...user,
      name,
      email,
      preferences: {
        theme: 'dark' as const,
        currency: 'INR'
      }
    };

    saveUser(updatedUser);
    
    document.documentElement.classList.add('dark');

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to permanently delete your GlobeTrotter account? This action cannot be undone.')) {
      // Clear localStorage
      localStorage.clear();
      logout();
      navigate('/');
    }
  };

  const handleRemoveSaved = (cityId: string) => {
    setSavedDestinations(savedDestinations.filter(d => d.id !== cityId));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-interface">
      <div>
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white m-0 tracking-tight">Settings</h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-1">Configure your profile, app appearance, and preferences.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800 text-emerald-700 dark:text-emerald-450 rounded-lg text-xs font-semibold">
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-zinc-400" />
              <span>User Profile</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-premium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-premium"
                />
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />          {/* Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-zinc-400" />
              <span>App Preferences</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Currency Selector (Fixed INR) */}
              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5">Currency</label>
                <div className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-850 text-xs text-zinc-500 font-semibold">
                  INR (₹) — Indian Rupee (Platform Default)
                </div>
              </div>

              {/* Language Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-405 uppercase mb-1.5 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-zinc-400" />
                  <span>Language</span>
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900 text-xs text-zinc-850 dark:text-zinc-100"
                >
                  <option value="English">English</option>
                  <option value="French">Français</option>
                  <option value="Spanish">Español</option>
                  <option value="Japanese">日本語</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Saved Destinations list */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <Heart className="h-4.5 w-4.5 text-zinc-400" />
              <span>Saved Destinations</span>
            </h3>
            {savedDestinations.length > 0 ? (
              <div className="space-y-2">
                {savedDestinations.map(dest => (
                  <div key={dest.id} className="flex justify-between items-center p-3 border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 rounded-lg text-xs">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white">{dest.name}</span>
                      <span className="text-zinc-450 dark:text-zinc-500 ml-2">({dest.country})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(dest.id)}
                      className="p-1 text-zinc-405 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-450 dark:text-zinc-500 italic m-0">No saved destinations.</p>
            )}
          </div>

        </div>

        {/* Action footer */}
        <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-200 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/10 text-red-500 text-xs font-semibold rounded cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete Account</span>
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs rounded shadow-xs cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
