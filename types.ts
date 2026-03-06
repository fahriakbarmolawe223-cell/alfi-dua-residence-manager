export type RateType = 'daily' | 'weekly' | 'monthly';

export enum GuestStatus {
  ACTIVE = 'ACTIVE',
  CHECKED_OUT = 'CHECKED_OUT'
}

export interface BillDetails {
  baseTotal: number;
  earlyCheckInFee: number;
  lateCheckOutFee: number;
  grandTotal: number;
  notes: string[];
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  roomNumber: string;
  checkInDate: string; // ISO Date String
  checkInTimeStr: string; // HH:mm format for logic
  rateType: RateType;
  duration: number; // e.g., 2 nights, 1 week
  status: GuestStatus;
  checkOutDate?: string; // ISO Date String
  checkOutTimeStr?: string; // HH:mm format
  finalBill?: BillDetails;
}

export interface User {
  username: string;
  fullName: string;
  role: 'Owner' | 'Admin' | 'Staff';
  avatarColor: string;
}