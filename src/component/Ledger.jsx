// import React, { useEffect, useMemo, useState } from "react";
// import axios from "axios";

// const users = [
//   { id: 1, name: "Sara" },
//   { id: 2, name: "Micheal" },
//   { id: 3, name: "Akbar" },
//   { id: 4, name: "Sachin" },
//   { id: 5, name: "Null" },
// ];
// const commoditites = [
//   { id: 1, label: "TT", value: "USD_TT" },
//   { id: 2, label: "DT", value: "USDT" },
//   { id: 3, label: "RMB", value: "RMB" },
//   { id: 5, label: "DHRM", value: "DHRM" },
//   { id: 6, label: "CASH", value: "CASH" },
//   { id: 7, label: "EXPENSE", value: "EXPENSE" },
// ];
// const vendors = [
//   { id: 1, name: "Imlo" },
//   { id: 2, name: "John" }
// ];

// export default function Ledger() {
//       const [data, setOrders] = useState([]);
//     useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get("http://43.204.149.195:5001/api/orders");
//         setOrders(res.data);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };

//     fetchOrders();
//   }, []);

//   const [ledgerType, setLedgerType] = useState("party");
//   const [partyId, setPartyId] = useState(2);
//   const [vendorId, setVendorId] = useState(1);

//   const ledger = useMemo(() => {

//     let balance = 0;

//     let filtered =
//       ledgerType === "party"
//         ? data.filter((d) => d.party_id === partyId)
//         : data.filter((d) => d.vendor_id === vendorId);

//     return filtered.map((d) => {

//       let debit = 0;
//       let credit = 0;

//       const orderAmount = Number(d.order_amount);
//       const finalAmount = Number(d.final_amount);

//       if (ledgerType === "party") {

//         if (d.commodity_id === 6) {
//           debit = d.payment_type === 2 ? orderAmount : finalAmount;
//         } else {
//           debit = finalAmount;
//         }

//       } else {
//         console.log("ledger",d)
//          if (d.commodity_id === 6) {
//           credit = d.payment_type === 2 ? finalAmount  : orderAmount;
//         } else {
//           credit = d.vendor_cost * d.order_amount;
//         }
//         // credit = Number(d.vendor_cost == "0.00" ? finalAmount : d.vendor_cost * d.order_amount || finalAmount ) ;
//         // credit = Number(d.vendor_cost || finalAmount ) * d.order_amount;


//       }

//       balance = balance + debit - credit;

//       return {
//         ...d,
//         debit,
//         credit,
//         balance
//       };

//     });

//   }, [ledgerType, partyId, vendorId]);

//   const selectedParty = users.find((u) => u.id === partyId);
//   const selectedVendor = vendors.find((v) => v.id === vendorId);
//  const getCommodityName = (id) => {
//     return commoditites.find((u) => u.id === Number(id))?.label || "Unknown";
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 p-8">

//       <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border">

//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b">

//           <div>
//             <h1 className="text-2xl font-bold text-gray-800">
//               Ledger
//             </h1>

//             <p className="text-sm text-gray-500">
//               {ledgerType === "party"
//                 ? `Party Ledger - ${selectedParty?.name}`
//                 : `Vendor Ledger - ${selectedVendor?.name}`}
//             </p>
//           </div>

//           {/* Ledger Type Toggle */}
//           <div className="flex gap-2">

//             <button
//               onClick={() => setLedgerType("party")}
//               className={`px-4 py-2 rounded-lg text-sm ${
//                 ledgerType === "party"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               Party Ledger
//             </button>

//             <button
//               onClick={() => setLedgerType("vendor")}
//               className={`px-4 py-2 rounded-lg text-sm ${
//                 ledgerType === "vendor"
//                   ? "bg-blue-600 text-white"
//                   : "bg-gray-200"
//               }`}
//             >
//               Vendor Ledger
//             </button>

//           </div>

//         </div>

//         {/* Filters */}
//         <div className="p-6 flex gap-6">

//           {ledgerType === "party" && (
//             <select
//               value={partyId}
//               onChange={(e) => setPartyId(Number(e.target.value))}
//               className="border px-4 py-2 rounded-lg"
//             >
//               {users.map((u) => (
//                 <option key={u.id} value={u.id}>
//                   {u.name}
//                 </option>
//               ))}
//             </select>
//           )}

//           {ledgerType === "vendor" && (
//             <select
//               value={vendorId}
//               onChange={(e) => setVendorId(Number(e.target.value))}
//               className="border px-4 py-2 rounded-lg"
//             >
//               {vendors.map((v) => (
//                 <option key={v.id} value={v.id}>
//                   {v.name}
//                 </option>
//               ))}
//             </select>
//           )}

//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">

//           <table className="w-full text-sm">

//             <thead className="bg-gray-50 text-xs uppercase text-gray-600">

//               <tr>
//                 <th className="px-6 py-3 text-left">Date</th>
//                 <th className="px-6 py-3 text-left">To Party</th>
//                 {/* {ledgerType == "vendor" ?  */}
//                 <th className="px-6 py-3 text-left">City</th>
//                 <th className="px-6 py-3 text-left">Cost * Quantity</th>
//                 {/* : */}
//                 {/* } */}
//                 <th className="px-6 py-3 text-right">Commodity</th>
//                 <th className="px-6 py-3 text-right">Debit</th>
//                 <th className="px-6 py-3 text-right">Credit</th>
//                 <th className="px-6 py-3 text-right">Balance</th>
//               </tr>

//             </thead>

//             <tbody className="divide-y">

//               {ledger.map((row, i) => (

//                 <tr
//                   key={row.id}
//                   className={`hover:bg-gray-50 ${
//                     i % 2 === 0 ? "bg-white" : "bg-gray-50"
//                   }`}
//                 >

//                   <td className="px-6 py-3">
//                     {new Date(row.order_date).toLocaleDateString()}
//                   </td>

//                   <td className="px-6 py-3">{row.to_party}</td>
//                   {/* {ledgerType == "party" ?  */}
//                   <td className="px-6 py-3">{row.city}</td>
//                   {/* : */}
//                   <td className="px-6 py-3">{ledgerType == "party" ? row.delivery_charge:row.vendor_cost} * {row.order_amount}</td>
//                   {/* } */}
//                   <td className="px-6 py-3">{getCommodityName(row.commodity_id)}</td>

//                   <td className="px-6 py-3 text-right text-red-600">
//                     {row.debit ? row.debit.toLocaleString() : "-"}
//                   </td>

//                   <td className="px-6 py-3 text-right text-green-600">
//                     {row.credit ? row.credit.toLocaleString() : "-"}
//                   </td>

//                   <td className="px-6 py-3 text-right font-semibold">
//                     {row.balance.toLocaleString()}
//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>

//       </div>

//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const users = [
  { id: 1, name: "Sara" },
  { id: 2, name: "Micheal" },
  { id: 3, name: "Akbar" },
  { id: 4, name: "Sachin" },
  { id: 5, name: "Null" },
];

const commoditites = [
  { id: 1, label: "TT", value: "USD_TT" },
  { id: 2, label: "DT", value: "USDT" },
  { id: 3, label: "RMB", value: "RMB" },
  { id: 5, label: "DHRM", value: "DHRM" },
  { id: 6, label: "CASH", value: "CASH" },
  { id: 7, label: "EXPENSE", value: "EXPENSE" },
];

const vendors = [
  { id: 1, name: "Imlo" },
  { id: 2, name: "John" },
];

export default function Ledger() {
  const [data, setOrders] = useState([]);
const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [selection, setSelection] = useState({
    type: "party",
    id: 2,
  });
  const fetchUsers = async () => {
  try {
    setLoadingUsers(true);
    const res = await fetch("http://43.204.149.195:5001/api/auth/users");
    const data = await res.json();

    setUsers(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    setLoadingUsers(false);
  }
};

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://43.204.149.195:5001/api/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
fetchUsers()

    fetchOrders();
  }, []);

  // derived values
  const ledgerType = selection.type;
  const partyId = selection.type === "party" ? selection.id : null;
  const vendorId = selection.type === "vendor" ? selection.id : null;

  const ledger = useMemo(() => {
    let balance = 0;

    let filtered =
      ledgerType === "party"
        ? data.filter((d) => d.party_id === partyId)
        : data.filter((d) => d.vendor_id === vendorId);

    return filtered.map((d) => {
      let debit = 0;
      let credit = 0;

      const orderAmount = Number(d.order_amount);
      const finalAmount = Number(d.final_amount);

      if (ledgerType === "party") {
        if (d.commodity_id === 6) {
          debit = d.payment_type === 2 ? orderAmount : finalAmount;
        } else {
          debit = finalAmount;
        }
      } else {
        if (d.commodity_id === 6) {
          credit = d.payment_type === 2 ? finalAmount : orderAmount;
        } else {
          credit = d.vendor_cost * d.order_amount;
        }
      }

      balance = balance + debit - credit;

      return {
        ...d,
        debit,
        credit,
        balance,
      };
    });
  }, [data, ledgerType, partyId, vendorId]);

  const selectedName =
    selection.type === "party"
      ? users?.users?.find((u) => u.id === selection.id)?.name
      : users?.vendors?.find((v) => v.id === selection.id)?.name;

  const getCommodityName = (id) => {
    return (
      commoditites.find((u) => u.id === Number(id))?.label || "Unknown"
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Ledger</h1>
            <p className="text-sm text-gray-500">
              {selection.type === "party"
                ? `Party Ledger - ${selectedName}`
                : `Vendor Ledger - ${selectedName}`}
            </p>
          </div>
        </div>

        {/* Single Dropdown */}
        <div className="p-6">
          <select
            value={`${selection.type}-${selection.id}`}
            onChange={(e) => {
              const [type, id] = e.target.value.split("-");
              setSelection({ type, id: Number(id) });
            }}
            className="border px-4 py-2 rounded-lg"
          >
            {/* <optgroup label="Parties"> */}
              {users?.users?.map((u) => (
                <option key={`party-${u.id}`} value={`party-${u.id}`}>
                  {u.name}
                </option>
              ))}
            {/* </optgroup> */}

            {/* <optgroup label="Vendors"> */}
              {users?.vendors?.map((v) => (
                <option key={`vendor-${v.id}`} value={`vendor-${v.id}`}>
                  {v.name}
                </option>
              ))}
            {/* </optgroup> */}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">To Party</th>
                <th className="px-6 py-3 text-left">City</th>
                <th className="px-6 py-3 text-left">Cost * Quantity</th>
                <th className="px-6 py-3 text-right">Commodity</th>
                <th className="px-6 py-3 text-right">Debit</th>
                <th className="px-6 py-3 text-right">Credit</th>
                <th className="px-6 py-3 text-right">Balance</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {ledger.map((row, i) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-3">
                    {new Date(row.order_date).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-3">{row.to_party}</td>

                  <td className="px-6 py-3">{row.city}</td>

                  <td className="px-6 py-3">
                    {ledgerType === "party"
                      ? `${row.delivery_charge} * ${row.order_amount}`
                      : `${row.vendor_cost} * ${row.order_amount}`}
                  </td>

                  <td className="px-6 py-3">
                    {getCommodityName(row.commodity_id)}
                  </td>

                  <td className="px-6 py-3 text-right text-red-600">
                    {row.debit ? row.debit.toLocaleString() : "-"}
                  </td>

                  <td className="px-6 py-3 text-right text-green-600">
                    {row.credit ? row.credit.toLocaleString() : "-"}
                  </td>

                  <td className="px-6 py-3 text-right font-semibold">
                    {row.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
