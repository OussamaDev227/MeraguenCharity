import { Member } from './types';

export const MONTHLY_FEE = 50;

export const generateMonths = () => {
  const months = [];
  const currentDate = new Date();
  const startMonth = 2; // March (0-based index)
  
  for (let i = 0; i < 12; i++) {
    const monthIndex = (startMonth + i) % 12;
    const date = new Date(currentDate.getFullYear(), monthIndex, 1);
    months.push({
      name: date.toLocaleString('ar', { 
        month: 'long',
        calendar: 'gregory'
      }),
      index: monthIndex
    });
  }
  return months;
};

export const calculateTotalPayments = (member: Member): number => {
  return Object.values(member.payments).reduce((sum, amount) => sum + amount, 0);
};

export const calculateOutstandingAmount = (member: Member): number => {
  const totalExpected = MONTHLY_FEE * 12;
  const totalPaid = calculateTotalPayments(member);
  return totalExpected - totalPaid;
};

export const calculateMonthlyTotal = (members: Member[], month: string): number => {
  return members.reduce((sum, member) => sum + (member.payments[month] || 0), 0);
};

export const calculateYearlyTotal = (members: Member[]): number => {
  return members.reduce((sum, member) => sum + calculateTotalPayments(member), 0);
};