export const MONTHLY_FEE = 500;

export const generateMonths = () => {
  return [
    { index: 0, name: "مارس" },
    { index: 1, name: "أبريل" },
    { index: 2, name: "مايو" },
    { index: 3, name: "يونيو" },
    { index: 4, name: "يوليو" },
    { index: 5, name: "أغسطس" },
    { index: 6, name: "سبتمبر" },
    { index: 7, name: "أكتوبر" },
    { index: 8, name: "نوفمبر" },
    { index: 9, name: "ديسمبر" },
    { index: 10, name: "يناير" },
    { index: 11, name: "فبراير" }
  ];
};

export const calculateTotalPayments = (member) => {
  return Object.values(member.payments).reduce((sum, amount) => sum + (amount || 0), 0);
};

export const calculateOutstandingAmount = (member) => {
  const totalPaid = calculateTotalPayments(member);
  return (MONTHLY_FEE * 12) - totalPaid;
};

export const calculateMonthlyTotal = (members, month) => {
  return members.reduce((total, member) => {
    return total + (member.payments[month] || 0);
  }, 0);
};

export const calculateYearlyTotal = (members) => {
  return members.reduce((total, member) => {
    return total + calculateTotalPayments(member);
  }, 0);
};