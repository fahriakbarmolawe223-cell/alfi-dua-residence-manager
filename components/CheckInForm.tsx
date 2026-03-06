import React, { useState } from 'react';
import { Guest, GuestStatus, RateType } from '../types';
import { RATES, RULES } from '../constants';
import { Button } from './Button';
import { v4 as uuidv4 } from 'uuid';
import { 
  UserIcon, 
  PhoneIcon, 
  KeyIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

interface CheckInFormProps {
  onSuccess: (guest: Guest) => void;
  onCancel: () => void;
}

export const CheckInForm: React.FC<CheckInFormProps> = ({ onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [rateType, setRateType] = useState<RateType>('daily');
  const [duration, setDuration] = useState(1);
  const [checkInTimeStr, setCheckInTimeStr] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // HH:mm
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGuest: Guest = {
      id: uuidv4(),
      name,
      phone,
      roomNumber,
      checkInDate: new Date().toISOString(),
      checkInTimeStr,
      rateType,
      duration,
      status: GuestStatus.ACTIVE
    };
    
    onSuccess(newGuest);
  };

  const checkInHour = parseInt(checkInTimeStr.split(':')[0], 10);
  const isEarlyCheckIn = checkInHour < RULES.standardCheckInHour;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-6 text-white">
        <h2 className="text-2xl font-bold">Registrasi Tamu Baru</h2>
        <p className="text-primary-100 text-sm mt-1">Isi formulir lengkap untuk check-in kamar.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        
        {/* Personal Info */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Tamu</h3>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              required
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-transparent transition-all"
              placeholder="Nama Lengkap"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                required
                type="text" 
                value={roomNumber}
                onChange={e => setRoomNumber(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                placeholder="No. Kamar"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                placeholder="Nomor HP / WhatsApp"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Detail Sewa</h3>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ClockIcon className={`h-5 w-5 ${isEarlyCheckIn ? 'text-orange-500' : 'text-gray-400'}`} />
            </div>
            <input 
              type="time" 
              required
              value={checkInTimeStr}
              onChange={e => setCheckInTimeStr(e.target.value)}
              className={`pl-10 w-full p-3 border rounded-xl focus:ring-2 focus:outline-none transition-all ${
                isEarlyCheckIn ? 'border-orange-300 bg-orange-50 focus:ring-orange-500' : 'border-gray-300 focus:ring-primary-500'
              }`}
            />
            {isEarlyCheckIn && (
              <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                <CurrencyDollarIcon className="w-4 h-4" />
                Denda Early Check-in (+Rp {RULES.fees.earlyCheckIn.toLocaleString('id-ID')}) akan ditagihkan saat checkout.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select 
                value={rateType}
                onChange={e => setRateType(e.target.value as RateType)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none appearance-none bg-white"
              >
                <option value="daily">Harian (Rp 80rb)</option>
                <option value="weekly">Mingguan (Rp 500rb)</option>
                <option value="monthly">Bulanan (Rp 1.2jt)</option>
              </select>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="number" 
                min="1"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
                className="pl-10 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-primary-50 p-4 rounded-xl flex justify-between items-center border border-primary-100">
          <span className="text-primary-700 font-medium">Estimasi Biaya Dasar</span>
          <span className="text-2xl font-bold text-primary-700">Rp {(RATES[rateType] * duration).toLocaleString('id-ID')}</span>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel} fullWidth size="lg">Batal</Button>
          <Button type="submit" fullWidth size="lg">Proses Check In</Button>
        </div>

      </form>
    </div>
  );
};