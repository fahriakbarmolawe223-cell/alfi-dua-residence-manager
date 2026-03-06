export const RATES = {
  daily: 80000,
  weekly: 500000,
  monthly: 1200000,
};

export const RULES = {
  standardCheckInHour: 10, // 10:00 AM
  standardCheckOutHour: 12, // 12:00 PM
  fees: {
    earlyCheckIn: 30000,
    lateCheckOutTier1: 25000, // 13:00 - 14:00 (approx 30%)
    lateCheckOutTier2: 40000, // 15:00 - 17:00 (approx 50%)
  }
};

export const MOCK_USERS = [
  {
    username: 'admin',
    password: '123',
    fullName: 'Alfi Owner',
    role: 'Owner',
    avatarColor: 'bg-purple-600'
  },
  {
    username: 'staff',
    password: '123',
    fullName: 'Budi Staff',
    role: 'Staff',
    avatarColor: 'bg-blue-600'
  }
];

export const calculateDueDate = (checkInDateStr: string, duration: number, rateType: string): Date => {
  const date = new Date(checkInDateStr);
  let daysToAdd = 0;
  
  if (rateType === 'daily') daysToAdd = duration;
  else if (rateType === 'weekly') daysToAdd = duration * 7;
  else if (rateType === 'monthly') daysToAdd = duration * 30;

  date.setDate(date.getDate() + daysToAdd);
  return date;
};