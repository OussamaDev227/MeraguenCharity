import React, { useState, useEffect } from "react";
import { UserPlus, Trash2 } from "lucide-react";
import {
  MONTHLY_FEE,
  generateMonths,
  calculateTotalPayments,
  calculateOutstandingAmount,
  calculateMonthlyTotal,
  calculateYearlyTotal,
} from "./utils";

function App() {
  const [members, setMembers] = useState([]);
  const [yearlyExtra, setYearlyExtra] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [newMemberName, setNewMemberName] = useState("");
  const [extraAmountInput, setExtraAmountInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const months = generateMonths();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members?year=${selectedYear}`);
        if (!response.ok) throw new Error("Failed to fetch members");
        const data = await response.json();
        setMembers(data.members);
        setYearlyExtra(data.yearlyExtra || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, [selectedYear]);

  const addMember = async () => {
    if (!newMemberName.trim()) return;
    try {
      const response = await fetch("https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMemberName }),
      });
      if (!response.ok) throw new Error("Failed to add member");
      const updatedResponse = await fetch(`https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members?year=${selectedYear}`);
      if (!updatedResponse.ok)
        throw new Error("Failed to fetch updated members");
      const updatedData = await updatedResponse.json();
      setMembers(updatedData.members);
      setYearlyExtra(updatedData.yearlyExtra || 0);
      setNewMemberName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const removeMember = async (id) => {
    try {
      const response = await fetch(`https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete member");
      setMembers(members.filter((member) => member.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePayment = async (memberId, monthName, amount) => {
    try {
      const numAmount = parseFloat(amount) || 0;
      const response = await fetch("https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberId,
          month: monthName,
          amount: numAmount,
          year: selectedYear,
        }),
      });
      if (!response.ok) throw new Error("Failed to update payment");
      setMembers(
        members.map((member) => {
          if (member.id === memberId) {
            return {
              ...member,
              payments: { ...member.payments, [monthName]: numAmount },
            };
          }
          return member;
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

const addYearlyExtra = async () => {
  const amount = parseFloat(extraAmountInput) || 0;
  if (!amount) return;
  try {
    const response = await fetch(
      "https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members/yearly-extra",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: selectedYear, amount }),
      }
    );
    if (!response.ok) throw new Error("Failed to add yearly extra");
    console.log("POST response:", await response.json());
    const updatedResponse = await fetch(
      `https://applicable-gaby-oussama01-baf39923.koyeb.app/api/members?year=${selectedYear}`
    );
    if (!updatedResponse.ok) throw new Error("Failed to fetch updated data");
    const updatedData = await updatedResponse.json();
    console.log("Updated data:", updatedData);
    setMembers(updatedData.members);
    setYearlyExtra(updatedData.yearlyExtra || 0);
    setExtraAmountInput("");
  } catch (err) {
    setError(err.message);
    console.error("Error in addYearlyExtra:", err);
  }
};

  const handleYearChange = (e) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-600">حدث خطأ: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            نظام إدارة مصاريف الجنائز مراقن
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium">لسنة</span>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {generateYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

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

        <div className="bg-white rounded-lg shadow overflow-x-auto" dir="rtl">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-40 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase sticky right-0 z-20 bg-gray-300  tracking-wider border-l">
                  العضو
                </th>
                {months.map((month) => (
                  <th
                    key={`header-${month.index}`}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
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
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="w-40 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky right-0 bg-white z-10 border-l shadow-sm">
                    {member.name}
                  </td>
                  {months.map((month) => (
                    <td
                      key={`${member.id}-${month.index}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      <input
                        type="number"
                        value={member.payments[month.name] || ""}
                        onChange={(e) =>
                          updatePayment(member.id, month.name, e.target.value)
                        }
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
                <td className="w-40 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 sticky right-0 bg-gray-50 z-10 border-l shadow-sm">
                  المجموع الشهري
                </td>
                {months.map((month) => (
                  <td
                    key={`total-${month.index}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {calculateMonthlyTotal(members, month.name)} دينار
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <p className="text-3xl font-bold text-blue-600">
                    {calculateYearlyTotal(members) + yearlyExtra} دينار
                  </p>
                </td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              إجمالي المدفوعات
            </h3>
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-bold text-blue-600">
                {calculateYearlyTotal(members) + yearlyExtra} دينار
              </p>
              <div className="flex gap-3 ">
                <input
                  type="number"
                  value={extraAmountInput}
                  onChange={(e) => setExtraAmountInput(e.target.value)}
                  placeholder="اضافة مداخيل أخرى"
                  className="w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={addYearlyExtra}
                  className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700"
                >
                  إضافة
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              الرسوم الشهرية
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {MONTHLY_FEE} دينار
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              عدد الأعضاء
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {members.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
