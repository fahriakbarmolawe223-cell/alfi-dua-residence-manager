import React, { useState, useEffect } from 'react';
import { Guest, GuestStatus, BillDetails } from '../types';
import { storageService } from '../services/storageService';
import { CheckInForm } from './CheckInForm';
import { CheckOutLogic } from './CheckOutLogic';
import { Button } from './Button';
import { calculateDueDate } from '../constants';
import { 
  UserPlusIcon, 
  ArrowRightOnRectangleIcon, 
  ClockIcon, 
  HomeModernIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [view, setView] = useState<'list' | 'checkin' | 'checkout'>('list');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = storageService.getGuests();
    const sorted = data.sort((a, b) => {
        // Sort by Status (Active first), then by Room Number
        if (a.status !== b.status) return a.status === GuestStatus.ACTIVE ? -1 : 1;
        return a.roomNumber.localeCompare(b.roomNumber, undefined, { numeric: true });
    });
    setGuests(sorted);
  };

  const handleCheckInSuccess = (guest: Guest) => {
    storageService.saveGuest(guest);
    loadData();
    setView('list');
  };

  const handleCheckoutClick = (guest: Guest) => {
    setSelectedGuest(guest);
    setView('checkout');
  };

  const handleConfirmCheckout = (id: string, finalBill: BillDetails, checkOutTime: string) => {
    storageService.updateGuestStatus(id, {
      status: GuestStatus.CHECKED_OUT,
      checkOutTimeStr: checkOutTime,
      finalBill: finalBill,
      checkOutDate: new Date().toISOString()
    });
    loadData();
    setSelectedGuest(null);
    setView('list');
  };

  const getGuestTimeStatus = (guest: Guest) => {
    const dueDate = calculateDueDate(guest.checkInDate, guest.duration, guest.rateType);
    const today = new Date();
    const d1 = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (d2 > d1) return 'overdue';
    if (d2.getTime() === d1.getTime()) return 'due-today';
    return 'safe';
  };

  const activeGuests = guests.filter(g => g.status === GuestStatus.ACTIVE);
  
  // Search Filter
  const filteredActiveGuests = activeGuests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const overdueCount = activeGuests.filter(g => getGuestTimeStatus(g) === 'overdue').length;
  const dueTodayCount = activeGuests.filter(g => getGuestTimeStatus(g) === 'due-today').length;
  const totalOccupied = activeGuests.length;

  if (view === 'checkin') {
    return (
      <div className="max-w-2xl mx-auto mt-4 animate-fade-in-up">
        <Button variant="ghost" onClick={() => setView('list')} className="mb-6">
          ← Kembali ke Dashboard
        </Button>
        <CheckInForm onSuccess={handleCheckInSuccess} onCancel={() => setView('list')} />
      </div>
    );
  }

  if (view === 'checkout' && selectedGuest) {
    return (
      <div className="max-w-xl mx-auto mt-4 animate-fade-in-up">
        <Button variant="ghost" onClick={() => { setSelectedGuest(null); setView('list'); }} className="mb-6">
          ← Kembali ke Dashboard
        </Button>
        <CheckOutLogic 
          guest={selectedGuest} 
          onConfirmCheckout={handleConfirmCheckout} 
          onCancel={() => { setSelectedGuest(null); setView('list'); }} 
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-gray-500 text-sm font-medium">Kamar Terisi</p>
            <p className="text-4xl font-bold text-gray-800 mt-2">{totalOccupied}</p>
          </div>
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
            <HomeModernIcon className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-gray-500 text-sm font-medium">Checkout Hari Ini</p>
            <p className="text-4xl font-bold text-gray-800 mt-2">{dueTodayCount}</p>
          </div>
          <div className="p-4 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
            <ClockIcon className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
          <div>
            <p className="text-gray-500 text-sm font-medium">Lewat Batas (Overdue)</p>
            <p className={`text-4xl font-bold mt-2 ${overdueCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>{overdueCount}</p>
          </div>
          <div className={`p-4 rounded-xl group-hover:scale-110 transition-transform ${overdueCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            <ExclamationCircleIcon className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Main Actions & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all"
            placeholder="Cari nama tamu atau no. kamar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => setView('checkin')} icon={<UserPlusIcon className="w-5 h-5"/>}>
          Check-in Baru
        </Button>
      </div>

      {/* Guest Grid */}
      {filteredActiveGuests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <HomeModernIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">Belum ada tamu yang check-in saat ini.</p>
          <p className="text-gray-400 text-sm mt-1">Gunakan tombol "Check-in Baru" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActiveGuests.map(guest => {
            const timeStatus = getGuestTimeStatus(guest);
            const dueDate = calculateDueDate(guest.checkInDate, guest.duration, guest.rateType);
            const isOverdue = timeStatus === 'overdue';
            const isDueToday = timeStatus === 'due-today';
            
            return (
              <div 
                key={guest.id} 
                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md relative overflow-hidden ${
                  isOverdue ? 'border-red-200 ring-1 ring-red-100' : 
                  isDueToday ? 'border-orange-200 ring-1 ring-orange-100' : 'border-gray-100'
                }`}
              >
                {/* Status Stripe */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  isOverdue ? 'bg-red-500' : isDueToday ? 'bg-orange-500' : 'bg-primary-500'
                }`}></div>

                <div className="flex justify-between items-start mb-4 pl-3">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">Kamar</span>
                    <h3 className="text-3xl font-bold text-gray-800">{guest.roomNumber}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    isOverdue ? 'bg-red-100 text-red-700' :
                    isDueToday ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {isOverdue ? 'Lewat Batas' : isDueToday ? 'Checkout Hari Ini' : 'Aktif'}
                  </div>
                </div>

                <div className="pl-3 space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nama Tamu</p>
                      <p className="font-semibold text-gray-800">{guest.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-in</p>
                      <p className="font-medium text-gray-700">
                        {new Date(guest.checkInDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} • {guest.checkInTimeStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${isOverdue ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                      <ClockIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Batas Checkout</p>
                      <p className={`font-medium ${isOverdue ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                        {dueDate.toLocaleDateString('id-ID', {weekday: 'short', day: 'numeric', month: 'short'})}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pl-3 pt-4 border-t border-gray-50">
                   <Button 
                    variant={isOverdue ? 'danger' : 'secondary'} 
                    fullWidth 
                    onClick={() => handleCheckoutClick(guest)}
                    icon={<ArrowRightOnRectangleIcon className="w-4 h-4"/>}
                  >
                    Proses Checkout
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};