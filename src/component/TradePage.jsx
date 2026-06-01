import { useEffect, useMemo, useState } from "react";
import axios from "axios";
// const users = [
//   { id: 1, name: "Sara" },
//   { id: 2, name: "Micheal" },
//   { id: 3, name: "Akbar" },
//   { id: 4, name: "Sachin" },
//   { id: 5, name: "Null" },
// ];

// const vendor = [
//   { id: 1, name: "Imlo" },
//   { id: 2, name: "John" },
//   { id: 3, name: "VB" },
//   { id: 4, name: "Mac" },
// ];

// const agent = [
//   { id: 1, name: "S" },
//   { id: 2, name: "D" },
//   { id: 3, name: "M" },
// ];

const commoditites = [
  { id: 1, label: "TT", value: "USD_TT" },
  { id: 2, label: "DT", value: "USDT" },
  { id: 3, label: "RMB", value: "RMB" },
  { id: 5, label: "DHRM", value: "DHRM" },
  { id: 6, label: "CASH", value: "CASH" },
  { id: 7, label: "EXPENSE", value: "EXPENSE" },
];
const formatIndianNumber = (num) => {
  if (!num) return "0";

  const x = Number(num).toString().split(".");
  let lastThree = x[0].substring(x[0].length - 3);
  let otherNumbers = x[0].substring(0, x[0].length - 3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return x.length > 1 ? formatted + "." + x[1] : formatted;
};

export default function TradePage() {
  const [form, setForm] = useState({
    date: "",
    agent: "",
    party: "",
    toParty: "",
    city: "",
    orderAmount: "",
    commodity: "",
    deliveryCharge: "",
    vendor: "",
    vendorCost: 0,
    remarkMobile: "",
    remarkToken: "",
    paymentType: "1", // default
  });
  const [errors, setErrors] = useState({});
  const validateForm = () => {
    const newErrors = {};

    if (!form.date) newErrors.date = "Date is required";
    if (!form.agent || form.agent === "0")
      newErrors.agent = "Agent is required";
    if (!form.party) newErrors.party = "Sender party is required";
    if (!form.toParty || form.toParty === "0")
      newErrors.toParty = "Receiver party is required";
    if (!form.commodity || form.commodity === "0")
      newErrors.commodity = "Commodity is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.orderAmount) newErrors.orderAmount = "Amount is required";
    if (!form.deliveryCharge) newErrors.deliveryCharge = "Rate is required";
    if (!form.vendor || form.vendor === "0")
      newErrors.vendor = "Vendor is required";

    if (!form.remarkMobile && !form.remarkToken) {
      newErrors.remarkMobile = "One of the Remark is required";
      newErrors.remarkToken = "One of the Remark is required";
    }
    console.log(">>>>", newErrors);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const [loadingUsers, setLoadingUsers] = useState(true);
const [users, setUsers] = useState([]);

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

  const [orders, setOrders] = useState([]);

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
  const myCharge =
    (Number(form.orderAmount || 0) / 100000) * Number(form.deliveryCharge || 0);

  const vendorCharge =
    (Number(form.orderAmount || 0) / 100000) * Number(form.vendorCost || 0);

  const profit = myCharge - vendorCharge;

  const finalAmount =
    Number(form.commodity) === 6
      ? Number(form.paymentType) === 1
        ? Number(form.orderAmount) + myCharge
        : Number(form.orderAmount) - myCharge
      : Number(form.orderAmount) * Number(form.deliveryCharge);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrder = async () => {
    // if (!form.party) return;
    if (!validateForm()) return;

    const newOrder = {
      ...form,
      profit: form?.commodity !== "6" ? 0 : profit,
      myCharge: form?.commodity !== "6" ? 0 : myCharge,
      finalAmount,
      id: Date.now(),
    };
    console.log("neewOder", newOrder);
    await axios
      .post("http://43.204.149.195:5001/api/orders", newOrder)
      .then((response) => {
        alert(response);
      })
      .catch((error) => alert(error));
    setOrders([...orders, newOrder]);

    setForm({
      date: "",
      agent: "",
      party: "",
      toParty: "",
      city: "",
      orderAmount: "",
      commodity: "",
      deliveryCharge: "",
      vendor: "",
      vendorCost: "",
      remarkMobile: "",
      remarkToken: "",
      paymentType: "1",
    });
  };
  const getPartyName = (id) => {
    return users.find((u) => u.id === Number(id))?.name || "Unknown";
  };
  const getVendorName = (id) => {
    return vendor.find((u) => u.id === Number(id))?.name || "Unknown";
  };
  const getAgentName = (id) => {
    return agent.find((u) => u.id === Number(id))?.name || "Unknown";
  };

  const getCommodityName = (id) => {
    return commoditites.find((u) => u.id === Number(id))?.label || "Unknown";
  };
  //   const generatePartyLedger = (orders) => {
  //       const ledger = {};
  //     orders.forEach((o) => {
  //       const partyId = o.party;

  //       if (!ledger[partyId]) {
  //         ledger[partyId] = {
  //           debit: 0,
  //           credit: 0,
  //           balance: 0,
  //         };
  //       }

  //       if (o.paymentType === "1") {
  //         ledger[partyId].debit += Number(o.finalAmount || 0);
  //       } else {
  //         ledger[partyId].credit += Number(o.orderAmount || 0);
  //       }

  //       ledger[partyId].balance = ledger[partyId].debit - ledger[partyId].credit;
  //     });

  //     return ledger;
  //   };

  //   const ledger = useMemo(() => {
  //     let balance = 0;

  //     return orders?.map((o) => {
  //       let debit = 0;
  //       let credit = 0;

  //       if (o.paymentType === "1") {
  //         credit = Number(o.finalAmount || 0);
  //         balance += credit;
  //       } else {
  //         credit = Number(o.orderAmount || 0);
  //         balance += credit;
  //       }

  //       return {
  //         ...o,
  //         debit,
  //         credit,
  //         balance,
  //       };
  //     });
  //   }, [orders]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className=" bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Delivery Order
              </h1>
              <p className="text-slate-500 mt-1">
                Create and manage logistics transactions
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2.5 rounded-xl border 
              ${errors.date ? "border-red-400" : "border-slate-300"} 
              focus:ring-2 focus:ring-slate-900 focus:border-slate-900 
              outline-none transition`}
                />
                {errors.date && (
                  <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Agent
                </label>
                <select
                  name="agent"
                  value={form.agent}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                >
                  <option value="0">Select Agent</option>
                  {users?.agents?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Sender Party
                </label>
                <select
                  name="party"
                  value={form.party}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                >
                  <option value="0">Select Sender</option>
                  {users?.users?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Receiver Party
                </label>
                <input
                  type="text"
                  name="toParty"
                  value={form.toParty}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                   className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                  // className={`input ${errors.city ? "border-red-500" : ""}`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Commodity
                </label>
                <select
                  name="commodity"
                  value={form.commodity}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                >
                  <option value="0">Select Commodity</option>
                  {commoditites.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {form.commodity !== "6" ? "Quantity" : "Amount"}
                </label>
                <input
                  type="number"
                  name="orderAmount"
                  value={form.orderAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Rate
                </label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={form.deliveryCharge}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Vendor
                </label>
                <select
                  name="vendor"
                  value={form.vendor}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                >
                  <option value="0">Select Vendor</option>
                  {users?.vendors?.map((data) => (
                    <option key={data.id} value={data.id}>
                      {data.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {form.commodity !== "6" && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Vendor Cost *</label>
                  <input
                    name="vendorCost"
                    value={form.vendorCost}
                    onChange={handleChange}
                    // className={`input ${errors.vendorCost ? "border-red-500" : ""}`}
                     className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                  />
                  {errors.vendorCost && (
                    <p className="text-red-500 text-xs">{errors.vendorCost}</p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Payment Type
                </label>
                <select
                  name="paymentType"
                  value={form.paymentType}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                >
                  <option value="1">We Pay</option>
                  <option value="2">To Pay</option>
                  <option value="3">Null</option>
                </select>
              </div>

              <div className="min-w-[180px]">
                <label className="block text-sm font-bold text-slate-700 mb-2">Remark Mobile *</label>
                <input
                  type="number"
                  name="remarkMobile"
                  value={form.remarkMobile}
                  onChange={handleChange}
                  // className={`input ${errors.remarkMobile ? "border-red-500" : ""}`}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                />
                {errors.remarkMobile && (
                  <p className="text-red-500 text-xs">{errors.remarkMobile}</p>
                )}
              </div>

              <div className="min-w-[180px]">
                <label className="block text-sm font-bold text-slate-700 mb-2">Remark Token *</label>
                <input
                  type="text"
                  name="remarkToken"
                  value={form.remarkToken}
                  onChange={handleChange}
                  // className={`input ${errors.remarkToken ? "border-red-500" : ""}`}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 
                       focus:ring-2 focus:ring-slate-900 
                       focus:border-slate-900 outline-none transition"
                />
                {errors.remarkToken && (
                  <p className="text-red-500 text-xs">{errors.remarkToken}</p>
                )}
              </div>

              <div className="flex items-end p-[6px]">
                <button
                  onClick={addOrder}
                  className="bg-slate-900 hover:bg-slate-800 text-white 
                   px-2 py-2.5 rounded-xl text-sm font-semibold 
                   shadow-sm"
                >
                  + Add Order
                </button>
              </div>
            </div>
          </div>

          <div
            className="mt-2 bg-white border border-slate-200 
                    rounded-2xl shadow-sm p-6 flex 
                    items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-500">Final Amount</p>
              <h2
                className={`text-3xl font-bold 
          ${finalAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                ₹ {formatIndianNumber(finalAmount)}
              </h2>
            </div>

            <div className="text-right text-sm text-slate-500">
              Auto-calculated based on quantity & rate
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Orders</h2>
          <p className="text-sm text-slate-500">
            Manage and review delivery transactions
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {console.log("new", orders)}
          {orders?.map((order) => (
            <div
              key={order.id}
              className="px-6 py-5 hover:bg-slate-50 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                    {/* Sender : {getPartyName(order.party)} • {order.city} */}
                    Sender : {order.party} • {order.city}
                  </h3>
                  <h3 className="text-sm text-slate-500 ">
                    Receiver :{order.to_party}
                  </h3>
                 
                </div>

                <div className="text-left md:text-right">
                  <p
                    className={`text-xl font-bold 
              ${order.finalAmount >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    Final : ₹ {formatIndianNumber(Number(order.final_amount))}
                  </p>
                  <span
                    className="inline-block mt-1 text-xs px-3 py-1 rounded-full 
              bg-slate-100 text-slate-600"
                  >
                    Payment Type :
                    {order.payment_type === 1
                      ? " We Pay"
                      : order.payment_type === 2
                        ? " To Pay"
                        : " Null"}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="font-medium">{order.order_date}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Agent</p>
                  <p className="font-medium">{order.agent}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Paid By/Cost</p>
                  <p className="font-medium">{order.vendor}/{order.vendor_cost}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Commodity</p>
                  <p className="font-medium">
                    {getCommodityName(order.commodity_id)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    {order.commodity !== "6" ? "Quantity" : "Amount"}
                  </p>
                  <p className="font-medium">
                    {formatIndianNumber(order.order_amount)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Rate</p>
                  <p className="font-medium">₹ {order.delivery_charge}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Mobile</p>
                  <p className="font-medium">{order.remark_mobile || "-"}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Token</p>
                  <p className="font-medium">{order.remark_token || "-"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-slate-700">
          📘 Party Ledger
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-200 text-slate-700">
                <th className="p-3 text-left">Party</th>
                <th className="p-3 text-left">Debit</th>
                <th className="p-3 text-left">Credit</th>
                <th className="p-3 text-left">Balance</th>
              </tr>
            </thead>

            <tbody>
              {ledger?.map((l) => (
                <tr key={l.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{getPartyName(l.party)}</td>

                  <td className="p-3 text-green-600">
                    {l.debit ? `₹ ${l.debit}` : "-"}
                  </td>

                  <td className="p-3 text-red-600">
                    {l.credit ? `₹ ${l.credit}` : "-"}
                  </td>

                  <td
                    className={`p-3 font-semibold ${
                      l.balance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹ {Math.abs(l.balance)} {l.balance >= 0 ? "Dr" : "Cr"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
