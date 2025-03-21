export const MONTHLY_FEE = 500;
let month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const generateMonths = () => {
  return [
    { index: 0, name: "مارس" ,month:month[2]},
    { index: 1, name: "أبريل",month:month[3]}, 
    { index: 2, name: "مايو" ,month:month[4] },
    { index: 3, name: "يونيو" ,month:month[5]},
    { index: 4, name: "يوليو", month:month[6] },
    { index: 5, name: "أغسطس", month:month[7] },
    { index: 6, name: "سبتمبر" ,month:month[8]},
    { index: 7, name: "أكتوبر" ,month:month[9]},
    { index: 8, name: "نوفمبر" ,month:month[10]},
    { index: 9, name: "ديسمبر" ,  month:month[11]},
    { index: 10, name: "يناير" ,  month:month[0]},
    { index: 11, name: "فبراير" ,  month:month[1]},
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