import React from 'react';
import { User } from '../types';
import { Button } from './Button';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onClose: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onClose }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full mx-auto mt-10">
      <div className="text-center mb-6">
        <div className={`w-20 h-20 mx-auto ${user.avatarColor} rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md`}>
          {user.fullName.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block">
          {user.role}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="border-t border-b border-gray-100 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-gray-500">Cabang</p>
              <p className="font-medium">Alfi 2 Residence</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
          <p className="font-semibold mb-1">Status Akun</p>
          <p>Aktif. Anda memiliki akses untuk mengelola data tamu dan melihat laporan keuangan.</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} fullWidth>Tutup</Button>
        <Button variant="danger" onClick={onLogout} fullWidth>Keluar Akun</Button>
      </div>
    </div>
  );
};