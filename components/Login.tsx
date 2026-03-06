import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { Button } from './Button';
import { User } from '../types';
import { BuildingOffice2Icon, UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userFound = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (userFound) {
      const userProfile: User = {
        username: userFound.username,
        fullName: userFound.fullName,
        role: userFound.role as any,
        avatarColor: userFound.avatarColor
      };
      onLogin(userProfile);
    } else {
      setError('Username atau password tidak ditemukan.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-sm w-full border border-white/20">
        <div className="text-center mb-8">
          <div className="bg-primary-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <BuildingOffice2Icon className="w-9 h-9 text-primary-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Alfi 2 Residence</h1>
          <p className="text-gray-500 text-sm mt-1">Sistem Manajemen Asrama</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockClosedIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              className="w-full pl-10 p-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center font-medium border border-red-100">{error}</div>}
          
          <Button type="submit" fullWidth size="lg" className="shadow-lg shadow-primary-500/30">
            Masuk ke Aplikasi
          </Button>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Akun Demo</p>
            <div className="flex gap-2 justify-center text-xs">
              <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">admin / 123</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">staff / 123</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};