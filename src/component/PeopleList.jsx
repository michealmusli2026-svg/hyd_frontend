import { useMemo, useState } from "react";

const tabs = [
  { key: "users", label: "Party" },
  { key: "vendors", label: "Vendors" },
  { key: "agents", label: "Agents" },
];

export default function PeopleList({ data, loading }) {
  const [activeTab, setActiveTab] = useState("users");

  const activeData = useMemo(() => {
    return data?.[activeTab] || [];
  }, [activeTab, data]);

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-4 bg-gray-100 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const count = data?.[tab.key]?.length || 0;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white shadow-sm text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <span>{tab.label}</span>

              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? "bg-gray-100 text-gray-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Loading...
          </div>
        ) : activeData.length === 0 ? (
          <div className="text-center py-10 text-gray-300 text-sm">
            No {activeTab}
          </div>
        ) : (
          activeData.map((item) => (
            <div
              key={`${activeTab}-${item.id}`}
              className="group flex items-start justify-between p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
            >
              {/* Left */}
              <div className="flex gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
                  {getInitials(item.name)}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.name}
                  </h3>

                  <div className="flex flex-col text-xs text-gray-500 mt-1">
                    <span>{item.mobile}</span>

                    {item.whatsapp && (
                      <span>WA: {item.whatsapp}</span>
                    )}

                    {item.alternate_mobile && (
                      <span>Alt: {item.alternate_mobile}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end shrink-0 ml-3">
                <span className="text-xs font-medium text-gray-700">
                  ₹{item.opening_balance}
                </span>

                <span className="text-[11px] text-gray-400 mt-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}