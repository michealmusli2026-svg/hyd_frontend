import axios from "axios";
import React, { useMemo ,useEffect,useState} from "react";
// const data = [
//   {
//     id: 5,
//     final_amount: "69300.00",
//     order_amount: "900.00",
//     vendor_cost: "70.00",
//     delivery_charge: "77.00",
//     payment_type: 3,
//   },
//   {
//     id: 4,
//     final_amount: "32000.00",
//     order_amount: "800.00",
//     vendor_cost: "30.00",
//     delivery_charge: "40.00",
//     payment_type: 3,
//   },
//   {
//     id: 3,
//     final_amount: "796800.00",
//     order_amount: "800000.00",
//     vendor_cost: "0.00",
//     delivery_charge: "400.00",
//     payment_type: 2,
//   },
//   {
//     id: 2,
//     final_amount: "803200.00",
//     order_amount: "800000.00",
//     vendor_cost: "0.00",
//     delivery_charge: "400.00",
//     payment_type: 1,
//   },
//   {
//     id: 1,
//     final_amount: "72000.00",
//     order_amount: "800.00",
//     vendor_cost: "80.00",
//     delivery_charge: "90.00",
//     payment_type: 3,
//   },
// ];

export default function BalanceSheet() {

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


  const sheet = useMemo(() => {
    let receivable = 0;
    let payable = 0;
    let revenue = 0;
    let cost = 0;
    let delivery = 0;

    data?.forEach((d) => {
        console.log("d",d)
    //   const finalAmount = Number(d.final_amount);
      const finalAmount = d.payment_type == 2 && d.commodity_id == 6 ? Number(d.order_amount) : Number(d.final_amount) 

    //   const vendorCost = Number(d.vendor_cost) * Number(d.order_amount);
    //   const deliveryCharge = Number(d.delivery_charge);
    //   const vendorCost = d.commodity_id == 6 ? Number(d.order_amount) : Number(d.vendor_cost) * Number(d.order_amount);
      const vendorCost = d.payment_type == 2 && d.commodity_id == 6 ? Number(d.final_amount) : d.payment_type !== 2 && d.commodity_id == 6 ? Number(d.order_amount) :Number(d.vendor_cost) * Number(d.order_amount);

      receivable += finalAmount; // party se lena
      payable += vendorCost;     // vendor ko dena

      revenue += finalAmount;
      cost += vendorCost;
    //   delivery += deliveryCharge;
    });

    const profit = revenue - cost ;

    return {
      assets: {
        receivable,
        total: receivable,
      },
      liabilities: {
        payable,
        total: payable,
      },
      equity: {
        profit,
        total: profit,
      },
    };
  }, [data]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Balance Sheet</h1>

      <div className="grid grid-cols-3 gap-6">
        
        {/* Assets */}
        <Section title="Assets">
          <Row label="Accounts Receivable" value={sheet.assets.receivable} />
          <Total value={sheet.assets.total} />
        </Section>

        {/* Liabilities */}
        <Section title="Liabilities">
          <Row label="Accounts Payable" value={sheet.liabilities.payable} />
          <Total value={sheet.liabilities.total} />
        </Section>

        {/* Equity */}
        <Section title="Profit">
          <Row label="Retained Earnings (Profit)" value={sheet.equity.profit} />
          <Total value={sheet.equity.total} />
        </Section>

      </div>

      {/* Balance Check */}
      <div className="mt-8 p-4 bg-white rounded-2xl shadow">
        <h2 className="font-bold text-lg mb-2">Balance Check</h2>
        <p>
          Assets = ₹{sheet.assets.total.toLocaleString()} | Liabilities + Equity = ₹
          {(sheet.liabilities.total + sheet.equity.total).toLocaleString()}
        </p>

        <p className="mt-2 font-semibold">
          {sheet.assets.total ===
          sheet.liabilities.total + sheet.equity.total
            ? "✅ Balanced"
            : "❌ Not Balanced"}
        </p>
      </div>
    </div>
  );
}

// Components
function Section({ title, children }) {
  return (
    <div className="bg-white p-4 rounded-2xl shadow">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between mb-2">
      <span>{label}</span>
      <span>₹{value.toLocaleString()}</span>
    </div>
  );
}

function Total({ value }) {
  return (
    <div className="flex justify-between border-t mt-3 pt-2 font-bold">
      <span>Total</span>
      <span>₹{value.toLocaleString()}</span>
    </div>
  );
}