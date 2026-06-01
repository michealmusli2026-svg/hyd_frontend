import axios from "axios";
import React, { useMemo, useState  , useEffect} from "react";
// const data = [
//   {
//     id: 5,
//     final_amount: "69300.00",
//     order_amount: "900.00",
//     vendor_cost: "70.00",
//     delivery_charge: "77.00",
//   },
//   {
//     id: 4,
//     final_amount: "32000.00",
//     order_amount: "800.00",
//     vendor_cost: "30.00",
//     delivery_charge: "40.00",
//   },
//   {
//     id: 3,
//     final_amount: "796800.00",
//     order_amount: "800000.00",
//     vendor_cost: "0.00",
//     delivery_charge: "400.00",
//   },
//   {
//     id: 2,
//     final_amount: "803200.00",
//     order_amount: "800000.00",
//     vendor_cost: "0.00",
//     delivery_charge: "400.00",
//   },
//   {
//     id: 1,
//     final_amount: "72000.00",
//     order_amount: "800.00",
//     vendor_cost: "80.00",
//     delivery_charge: "90.00",
//   },
// ];

export default function ProfitLoss() {
    const [data,setData] = useState(null)

      useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://43.204.149.195:5001/api/orders");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalCost = 0;
    let totalDelivery = 0;

    const rows = data?.map((d) => {
        console.log("d",d)

    //   const revenue = Number(d.final_amount);
      const revenue = d.payment_type == 2 && d.commodity_id == 6 ? Number(d.order_amount) : Number(d.final_amount) 
    //   const cost = Number(d.vendor_cost) * Number(d.order_amount);
    //   const cost = d.commodity_id == 6 ? Number(d.order_amount) : Number(d.vendor_cost) * Number(d.order_amount);
      const cost = d.payment_type == 2 && d.commodity_id == 6 ? Number(d.final_amount) : d.payment_type !== 2 && d.commodity_id == 6 ? Number(d.order_amount) :Number(d.vendor_cost) * Number(d.order_amount);
      const delivery = Number(d.delivery_charge);

    //   const profit = revenue - cost - delivery;
      let profit = revenue - cost ;
        if(profit < 0){
            profit = Math.abs(profit)
        }
      totalRevenue += revenue;
      totalCost += cost;
    //   totalDelivery += delivery;

      return {
        ...d,
        revenue,
        cost,
        delivery,
        profit,
      };
    });

    // const netProfit = totalRevenue - totalCost - totalDelivery;
    const netProfit = totalRevenue - totalCost ;

    return {
      rows,
      totalRevenue,
      totalCost,
      totalDelivery,
      netProfit,
    };
  }, [data]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Profit & Loss Statement</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total Revenue" value={summary.totalRevenue} />
        <Card title="Total Cost" value={summary.totalCost} />
        <Card title="Delivery Expense" value={summary.totalDelivery} />
        <Card title="Net Profit" value={summary.netProfit} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">PayIn</th>
              <th className="p-3">PayOut</th>
              {/* <th className="p-3">Delivery</th> */}
              <th className="p-3">Profit</th>
            </tr>
          </thead>
          <tbody>
            {summary.rows?.map((row) => (
              <tr key={row.id} className="border-t">
                <td className="p-3">{row.id}</td>
                <td className="p-3">₹{row.revenue.toLocaleString()}</td>
                <td className="p-3">₹{row.cost.toLocaleString()}</td>
                {/* <td className="p-3">₹{row.delivery.toLocaleString()}</td> */}
                <td
                  className={`p-3 font-semibold ${
                    row.profit >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ₹{row.profit.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Reusable Card Component
function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-gray-500 text-sm">{title}</h2>
      <p className="text-xl font-bold mt-2">
        ₹{value.toLocaleString()}
      </p>
    </div>
  );
}