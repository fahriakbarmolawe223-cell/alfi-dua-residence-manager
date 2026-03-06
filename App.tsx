import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { User } from './types';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');

  useEffect(() => {
    const sessionStr = localStorage.getItem('alfi2_user_session');
    if (sessionStr) {
      try {
        const user = JSON.parse(sessionStr);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem('alfi2_user_session');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem('alfi2_user_session', JSON.stringify(user));
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('alfi2_user_session');
    setCurrentUser(null);
    setView('dashboard');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Top Navigation - Glassmorphism */}
      <nav className="sticky top-0 z-30 w-full backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex-shrink-0 flex items-center gap-3 cursor-pointer group"
              onClick={() => setView('dashboard')}
            >
              <div className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <BuildingOffice2Icon className="w-5 h-5"/>
              </div>
              <div>
                 <h1 className="text-lg font-bold text-gray-800 tracking-tight leading-none group-hover:text-primary-600 transition-colors">Alfi 2</h1>
                 <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Residence Manager</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                className="flex items-center gap-3 cursor-pointer p-1.5 pl-3 pr-2 rounded-full hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100"
                onClick={() => setView('profile')}
              >
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{currentUser.fullName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{currentUser.role}</p>
                </div>
                <div className={`w-9 h-9 ${currentUser.avatarColor} rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ring-2 ring-white`}>
                  {currentUser.fullName.charAt(0)}
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' ? (
          <Dashboard />
        ) : (
          <Profile 
            user={currentUser} 
            onLogout={handleLogout} 
            onClose={() => setView('dashboard')} 
          />
        )}
      </main>

      {/* Network Info Footer */}
      <footer className="fixed bottom-0 w-full bg-slate-900/90 backdrop-blur text-white/80 py-2.5 text-center text-[10px] uppercase tracking-wider z-50">
         Server Demo (LocalStorage) • Siap untuk Integrasi Backend
      </footer>
    </div>
  );
};

export default App;