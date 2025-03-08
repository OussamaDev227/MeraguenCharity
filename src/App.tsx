import React, { useState, useEffect } from 'react';
import { UserPlus, Trash2 } from 'lucide-react';
import { Member } from './types';
import { 
  MONTHLY_FEE, 
  generateMonths, 
  calculateTotalPayments, 
  calculateOutstandingAmount, 
  calculateMonthlyTotal, 
  calculateYearlyTotal
} from './utils';
import {
  saveMember,
  deleteMember,
  savePayment,
  loadMembersWithPayments
} from './db';

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [newMemberName, setNewMemberName] = useState('');
  const months = generateMonths();

  // Load data from SQLite on initial render and year change
  useEffect(() => {
    const loadedMembers = loadMembersWithPayments(selectedYear);
    setMembers(loadedMembers);
  }, [selectedYear]);

  const addMember = () => {
    if (!newMemberName.trim()) return;
    
    const newMember: Member = {
      id: Date.now().toString(),
      name: newMemberName,
      payments: {}
    };
    
    saveMember(newMember.id, newMember.name);
    setMembers([...members, newMember]);
    setNewMemberName('');
  };

  const removeMember = (id: string) => {
    deleteMember(id);
    setMembers(members.filter(member => member.id !== id));
  };

  const updatePayment = (memberId: string, monthName: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    savePayment(memberId, monthName, numAmount, selectedYear);
    
    setMembers(members.map(member => {
      if (member.id === memberId) {
        return {
          ...member,
          payments: {
            ...member.payments,
            [monthName]: numAmount
          }
        };
      }
      return member;
    }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">نظام إدارة مصاريف  الجنائز مراقن</h1>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">لسنة</span>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {generateYearOptions().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Add Member Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="اسم العضو الجديد"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <button
              onClick={addMember}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus size={20} />
              إضافة عضو
            </button>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العضو
                </th>
                {months.map(month => (
                  <th key={`header-${month.index}`} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {month.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المجموع السنوي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ المتبقي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map(member => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {member.name}
                  </td>
                  {months.map(month => (
                    <td key={`${member.id}-${month.index}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        value={member.payments[month.name] || ''}
                        onChange={(e) => updatePayment(member.id, month.name, e.target.value)}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateTotalPayments(member)} دينار
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateOutstandingAmount(member)} دينار
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeMember(member.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  المجموع الشهري
                </td>
                {months.map(month => (
                  <td key={`total-${month.index}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateMonthlyTotal(members, month.name)} دينار
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {calculateYearlyTotal(members)} دينار
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">إجمالي المدفوعات</h3>
            <p className="text-3xl font-bold text-blue-600">{calculateYearlyTotal(members)} دينار</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">الرسوم الشهرية</h3>
            <p className="text-3xl font-bold text-green-600">{MONTHLY_FEE} دينار</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">عدد الأعضاء</h3>
            <p className="text-3xl font-bold text-purple-600">{members.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;