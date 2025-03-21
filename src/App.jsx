// import React, { useState, useEffect } from "react";
// import { Wallet, Calendar, Users } from "lucide-react";
// import {
//   MONTHLY_FEE,
//   generateMonths,
//   calculateTotalPayments,
//   calculateOutstandingAmount,
//   calculateMonthlyTotal,
//   calculateYearlyTotal,
// } from "./utils";

// function App() {
//   const [members, setMembers] = useState([]);
//   const [yearlyExtra, setYearlyExtra] = useState(0);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const months = generateMonths();
//   const currentMonthEnglish = new Date().toLocaleString("en-US", {
//     month: "short",
//   });
//   const currentMonth = generateMonths().find(
//     (m) => m.month === currentMonthEnglish
//   );
//   const currentMonthName = currentMonth ? currentMonth.name : "";
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `https://charityserver.runasp.net/api/members?year=${selectedYear}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch members");
//         const data = await response.json();
//         setMembers(data.members);
//         setYearlyExtra(data.yearlyExtra || 0);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchMembers();
//   }, [selectedYear]);

//   const handleYearChange = (e) => {
//     setSelectedYear(parseInt(e.target.value));
//   };

//   const generateYearOptions = () => {
//     const currentYear = new Date().getFullYear();
//     const years = [];
//     for (let i = currentYear - 5; i <= currentYear + 5; i++) {
//       years.push(i);
//     }
//     return years;
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl">جاري التحميل...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-xl text-red-600">حدث خطأ: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             نظام إدارة مصاريف الجنائز مراقن
//           </h1>
//           <div className="flex items-center gap-2">
//             <span className="text-lg font-medium">لسنة</span>
//             <select
//               value={selectedYear}
//               onChange={handleYearChange}
//               className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//             >
//               {generateYearOptions().map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow overflow-x-auto" dir="rtl">
//           <table className="min-w-full divide-y divide-gray-200 table-fixed">
//             <thead className="bg-gray-50">
//               <tr>
//                 {/* Sticky header column */}
//                 <th className="w-40 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
//                   العضو
//                 </th>

//                 {/* Scrollable headers */}
//                 {months.map((month) => (
//                   <th
//                     key={`header-${month.index}`}
//                     className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     {month.name}
//                   </th>
//                 ))}
//                 <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                   المجموع السنوي
//                 </th>
//                 <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
//                   المبلغ المتبقي
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {members.map((member) => (
//                 <tr key={member.id} className=" even:bg-gray-50">
//                   {/* Sticky member name cell */}
//                   <td className="w-40 px-6 py-4 whitespace-nowrap text-sm font-medium border-l">
//                     <div
//                       className={`${
//                         (member.payments[currentMonthName] || 0) > 0
//                           ? " bg-green-500 text-white hover:bg-green-600"
//                           : "bg-red-500 text-white hover:bg-red-600 "
//                       } p-2 rounded`}
//                     >
//                       {member.name}
//                     </div>
//                   </td>

//                   {/* Scrollable content cells */}
//                   {months.map((month) => (
//                     <td
//                       key={`${member.id}-${month.index}`}
//                       className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
//                     >
//                       {member.payments[month.name] || 0} دينار
//                     </td>
//                   ))}

//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {calculateTotalPayments(member)} دينار
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-900">
//                     {calculateOutstandingAmount(member)} دينار
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
//               <Wallet size={20} />
//               إجمالي المدفوعات
//             </h3>
//             <p className="text-3xl font-bold text-blue-600">
//               {calculateYearlyTotal(members) + yearlyExtra} دينار
//             </p>
//           </div>
//           {/* رصيد سابق (Previous Balance) */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
//               <Wallet size={20} />
//               رصيد سابق
//             </h3>
//             <p className="text-3xl font-bold text-amber-600">
//               {yearlyExtra} دينار
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
//               <Calendar size={20} />
//               الرسوم الشهرية
//             </h3>
//             <p className="text-3xl font-bold text-green-600">
//               {MONTHLY_FEE} دينار
//             </p>
//           </div>
//           <div className="bg-white rounded-lg shadow p-6">
//             <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
//               <Users size={20} />
//               عدد الأعضاء
//             </h3>
//             <p className="text-3xl font-bold text-purple-600">
//               {members.length}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import { UserPlus, Trash2, Wallet, Calendar, Users } from "lucide-react";
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

  // Get current month data for highlighting
  const currentMonthEnglish = new Date().toLocaleString("en-US", {
    month: "short",
  });
  const currentMonth = generateMonths().find(
    (m) => m.month === currentMonthEnglish
  );
  const currentMonthName = currentMonth ? currentMonth.name : "";

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://charityserver.runasp.net/api/members?year=${selectedYear}`
        );
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
      const response = await fetch(
        "https://charityserver.runasp.net/api/members",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newMemberName }),
        }
      );
      if (!response.ok) throw new Error("Failed to add member");
      const updatedResponse = await fetch(
        `https://charityserver.runasp.net/api/members?year=${selectedYear}`
      );
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
      const response = await fetch(
        `https://charityserver.runasp.net/api/members/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete member");
      setMembers(members.filter((member) => member.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePayment = async (memberId, monthName, amount) => {
    try {
      const numAmount = parseFloat(amount) || 0;
      const response = await fetch(
        "https://charityserver.runasp.net/api/members/payments",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memberId,
            month: monthName,
            amount: numAmount,
            year: selectedYear,
          }),
        }
      );
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
        "https://charityserver.runasp.net/api/members/yearly-extra",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ year: selectedYear, amount }),
        }
      );
      if (!response.ok) throw new Error("Failed to add yearly extra");
      console.log("POST response:", await response.json());
      const updatedResponse = await fetch(
        `https://charityserver.runasp.net/api/members?year=${selectedYear}`
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
        {/* Header Section */}
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

        {/* Add Member Section */}
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

        {/* Fixed Column Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto" dir="rtl">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-40 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-l">
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
                <tr key={member.id} className="even:bg-gray-50">
                  <td className="w-40 px-6 py-4 whitespace-nowrap text-sm font-medium border-l">
                    <div
                      className={`${
                        (member.payments[currentMonthName] || 0) > 0
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-red-500 text-white hover:bg-red-600"
                      } p-2 rounded transition-colors duration-200`}
                    >
                      {member.name}
                      {/* <button
                        onClick={() => removeMember(member.id)}
                        className="float-left text-white hover:text-gray-200"
                      >
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                  {months.map((month) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        value={member.payments[month.name] || ""}
                        onChange={(e) =>
                          updatePayment(member.id, month.name, e.target.value)
                        }
                        className="w-20 rounded-md border border-blue-200 bg-blue-50 text-gray-800 shadow-sm 
               focus:border-blue-500  focus:ring-blue-500 hover:border-blue-300 text-center
               transition-colors duration-200"
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
          </table>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Wallet size={20} />
              إجمالي المدفوعات
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {calculateYearlyTotal(members) + yearlyExtra} دينار
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Wallet size={20} />
              رصيد سابق
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-amber-600">
                {yearlyExtra} دينار
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={extraAmountInput}
                  onChange={(e) => setExtraAmountInput(e.target.value)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  onClick={addYearlyExtra}
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                >
                  تحديث
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Calendar size={20} />
              الرسوم الشهرية
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {MONTHLY_FEE} دينار
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Users size={20} />
              عدد الأعضاء
            </h3>
            <p className="text-3xl font-bold text-purple-600">
              {members.length}
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS for fixed column */}
      <style jsx>{`
        .fixed-column {
          position: absolute;
          left: 0;
          width: 160px; /* Match w-40 (40 * 4px) */
          z-index: 30;
          background: white;
          box-shadow: 4px 0 6px -1px rgba(0, 0, 0, 0.1);
        }

        .scrollable-section {
          margin-left: 160px;
          overflow-x: auto;
        }

        .fixed-column table,
        .scrollable-section table {
          table-layout: fixed;
        }

        .fixed-column td,
        .fixed-column th {
          height: 57px; /* Match row height */
        }
      `}</style>
    </div>
  );
}

export default App;
