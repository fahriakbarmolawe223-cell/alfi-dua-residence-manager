import { Guest, GuestStatus } from '../types';

const STORAGE_KEY = 'alfi2_guests_data';

export const storageService = {
  getGuests: (): Guest[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveGuest: (guest: Guest): void => {
    const guests = storageService.getGuests();
    // Update if exists, else push
    const index = guests.findIndex(g => g.id === guest.id);
    if (index >= 0) {
      guests[index] = guest;
    } else {
      guests.push(guest);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
  },

  updateGuestStatus: (id: string, updates: Partial<Guest>): void => {
    const guests = storageService.getGuests();
    const index = guests.findIndex(g => g.id === id);
    if (index >= 0) {
      guests[index] = { ...guests[index], ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    }
  },
  
  // Simulation of "Network" sync (placeholder)
  syncData: async (): Promise<boolean> => {
    // In a real app, this would fetch from Firebase/Supabase/API
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }
};