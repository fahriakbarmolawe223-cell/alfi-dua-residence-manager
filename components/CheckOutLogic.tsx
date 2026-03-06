import React, { useState, useEffect } from 'react';
import { Guest, BillDetails } from '../types';
import { RATES, RULES } from '../constants';
import { Button } from './Button';
import { PrinterIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface CheckOutLogicProps {
  guest: Guest;
  onConfirmCheckout: (guestId: string, finalBill: BillDetails, checkOutTime: string) => void;
  onCancel: () => void;
}

export const CheckOutLogic: React.FC<CheckOutLogicProps> = ({ guest, onConfirmCheckout, onCancel }) => {
  const [checkOutTimeStr, setCheckOutTimeStr] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // Current time HH:mm
  });

  const [bill, setBill] = useState<BillDetails>({
    baseTotal: 0,
    earlyCheckInFee: 0,
    lateCheckOutFee: 0,
    grandTotal: 0,
    notes: []
  });

  useEffect(() => {
    calculateBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutTimeStr]);

  const calculateBill = () => {
    let notes: string[] = [];
    const baseTotal = RATES[guest.rateType] * guest.duration;
    
    // Early Check-in Fee logic
    const checkInHour = parseInt(guest.checkInTimeStr.split(':')[0], 10);
    let earlyCheckInFee = 0;
    if (checkInHour < RULES.standardCheckInHour) {
      earlyCheckInFee = RULES.fees.earlyCheckIn;
      notes.push(`Early Check-in (${guest.checkInTimeStr})`);
    }

    // Late Check-out Fee logic
    const checkOutHour = parseInt(checkOutTimeStr.split(':')[0], 10);
    let lateCheckOutFee = 0;
    
    if (checkOutHour >= 13 && checkOutHour < 15) {
      lateCheckOutFee = RULES.fees.lateCheckOutTier1;
      notes.push(`Late Check-out (${checkOutTimeStr})`);
    } else if (checkOutHour >= 15) {
      lateCheckOutFee = RULES.fees.lateCheckOutTier2;
      notes.push(`Late Check-out (${checkOutTimeStr})`);
    }

    const grandTotal = baseTotal + earlyCheckInFee + lateCheckOutFee;

    setBill({ baseTotal, earlyCheckInFee, lateCheckOutFee, grandTotal, notes });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-lg mx-auto border border-gray-200">
      <div className="bg-gray-800 text-white p-6 text-center">
        <h2 className="text-2xl font-bold tracking-wide">INVOICE CHECKOUT</h2>
        <p className="text-gray-400 text-sm mt-1">Alfi 2 Residence</p>
      </div>

      <div className="p-6">
        {/* Time Settings */}
        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase">Waktu Keluar</label>
            <p className="text-gray-400 text-xs">Sesuaikan untuk hitung denda</p>
          </div>
          <input 
            type="time" 
            value={checkOutTimeStr}
            onChange={(e) => setCheckOutTimeStr(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-lg font-mono font-bold text-gray-800 focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        {/* Receipt Body */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 font-mono text-sm bg-yellow-50/30 relative">
           {/* Decorative holes */}
           <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between py-4">
             {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-4 bg-white rounded-full border-r border-gray-200"></div>)}
           </div>
           <div className="absolute -right-2 top-0 bottom-0 flex flex-col justify-between py-4">
             {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-4 bg-white rounded-full border-l border-gray-200"></div>)}
           </div>

          <div className="text-center mb-4 pb-4 border-b border-dashed border-gray-300">
            <p className="font-bold text-lg uppercase">{guest.name}</p>
            <p className="text-gray-600">Kamar: {guest.roomNumber}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sewa ({guest.duration} {guest.rateType})</span>
              <span className="font-bold">Rp {bill.baseTotal.toLocaleString('id-ID')}</span>
            </div>
            
            {bill.earlyCheckInFee > 0 && (
              <div className="flex justify-between text-gray-800">
                <span>+ Early Check-in</span>
                <span>Rp {bill.earlyCheckInFee.toLocaleString('id-ID')}</span>
              </div>
            )}

            {bill.lateCheckOutFee > 0 && (
              <div className="flex justify-between text-gray-800">
                <span>+ Late Check-out</span>
                <span>Rp {bill.lateCheckOutFee.toLocaleString('id-ID')}</span>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-gray-300 mt-4 pt-3 flex justify-between items-center text-lg">
            <span className="font-bold">TOTAL</span>
            <span className="font-bold text-black">Rp {bill.grandTotal.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
        <Button variant="secondary" onClick={onCancel} fullWidth>
          Batal
        </Button>
        <Button 
          variant="success" 
          onClick={() => onConfirmCheckout(guest.id, bill, checkOutTimeStr)} 
          fullWidth
          icon={<CheckCircleIcon className="w-5 h-5"/>}
        >
          Konfirmasi Bayar
        </Button>
      </div>
    </div>
  );
};