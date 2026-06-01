import React, { useState, useEffect } from "react";
import PeopleList from "./PeopleList";

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    whatsapp: "",
    alternateMobile: "",
    openingBalance: "",
    type: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [search, setSearch] = useState("");

  const userTypes = ["Party", "Vendor", "Agent"];

  const typeColors = {
    Customer: "bg-blue-100 text-blue-700 border border-blue-200",
    Vendor: "bg-amber-100 text-amber-700 border border-amber-200",
    Agent: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };

  const getInitials = (name = "") => {
    if (!name.trim()) return "?";
    return name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

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
    fetchUsers();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.mobile) {
      newErrors.mobile = "Mobile is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Enter valid 10 digit mobile number";
    }
    if (form.whatsapp && !/^\d{10}$/.test(form.whatsapp))
      newErrors.whatsapp = "Enter valid 10 digit number";
    if (form.alternateMobile && !/^\d{10}$/.test(form.alternateMobile))
      newErrors.alternateMobile = "Enter valid 10 digit number";
    if (form.openingBalance && isNaN(Number(form.openingBalance)))
      newErrors.openingBalance = "Enter a valid number";
    if (!form.type) newErrors.type = "Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form)
    // if (!validate()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://43.204.149.195:5001/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to add user");

      setSubmitted(true);
      await fetchUsers(); // refresh list after adding

      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", mobile: "", whatsapp: "", alternateMobile: "", openingBalance: "", type: "" });
        setErrors({});
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users
  // ?.filter((u) =>
  //   (u.name || u.username || "")?.toLowerCase()?.includes(search?.toLowerCase())
  // );

  return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Add New User</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

//           {/* ── Form Section ── */}
//           <div className="lg:col-span-3">
//             <div className="bg-white shadow-xl rounded-3xl p-8 md:p-10">
//               <h2 className="text-2xl font-semibold mb-8 text-gray-800">User Information</h2>

//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
//                   <input type="text" name="name" value={form.name} onChange={handleChange}
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                     placeholder="Enter full name" />
//                   {errors.name && <p className="text-red-500 text-sm mt-1.5">{errors.name}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
//                   <input type="text" name="mobile" value={form.mobile} onChange={handleChange} maxLength={10}
//                     className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                     placeholder="9876543210" />
//                   {errors.mobile && <p className="text-red-500 text-sm mt-1.5">{errors.mobile}</p>}
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
//                     <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} maxLength={10}
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       placeholder="9876543210" />
//                     {errors.whatsapp && <p className="text-red-500 text-sm mt-1.5">{errors.whatsapp}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Alternate Mobile</label>
//                     <input type="text" name="alternateMobile" value={form.alternateMobile} onChange={handleChange} maxLength={10}
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       placeholder="9876543210" />
//                     {errors.alternateMobile && <p className="text-red-500 text-sm mt-1.5">{errors.alternateMobile}</p>}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">Opening Balance (₹)</label>
//                     <input type="text" name="openingBalance" value={form.openingBalance} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       placeholder="0.00" />
//                     {errors.openingBalance && <p className="text-red-500 text-sm mt-1.5">{errors.openingBalance}</p>}
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1.5">User Type</label>
//                     <select name="type" value={form.type} onChange={handleChange}
//                       className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white transition">
//                       <option value="">Select User Type</option>
//                       {userTypes.map((type) => (
//                         <option key={type} value={type}>{type}</option>
//                       ))}
//                     </select>
//                     {errors.type && <p className="text-red-500 text-sm mt-1.5">{errors.type}</p>}
//                   </div>
//                 </div>

//                 <button type="submit"
//                   className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-lg mt-4">
//                   Add User
//                 </button>

//                 {submitted && (
//                   <div className="text-center py-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 font-medium flex items-center justify-center gap-2">
//                     <span>✓</span> User Added Successfully!
//                   </div>
//                 )}
//               </form>
//             </div>
//           </div>

//           {/* ── User List Panel ── */}
// <div className="lg:col-span-2">
//   <div className="bg-white shadow-xl rounded-3xl p-5 sticky top-8">

//     {/* Header */}
//     <div className="flex items-center justify-between mb-4">
//       <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
//       <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-semibold">
//         {users.length} total
//       </span>
//     </div>

//     {/* Search */}
//     <input
//       type="text"
//       value={search}
//       onChange={(e) => setSearch(e.target.value)}
//       placeholder="Search users..."
//       className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition mb-4"
//     />

//     {/* List — each card ~64px, 6 cards = ~384px + padding */}
//     <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
//       {loadingUsers ? (
//         <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
//       ) : filteredUsers.length === 0 ? (
//         <div className="text-center py-10 text-gray-300 text-sm">No users found</div>
//       ) : (
//         filteredUsers.map((user) => (
//           <div
//             key={user.id}
//             className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 transition"
//           >
//             {/* Avatar */}
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
//               {getInitials(user.name || user.username)}
//             </div>

//             {/* Info */}
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-800 text-sm truncate">
//                 {user.name || user.username}
//               </p>
              
//             </div>
//           </div>
//         ))
//       )}
//     </div>

//   </div>
// </div>

//         </div>
//       </div>
//     </div>

<div className="min-h-screen bg-gray-50/60 py-10 px-4">
  <div className="max-w-6xl mx-auto">

    {/* Page Title */}
    <div className="mb-10 text-center">
      <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
        Add New User
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Create and manage your users seamlessly
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

      {/* ── Form Section ── */}
      <div className="lg:col-span-3">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl p-8 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            User Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Input Style */}
            {/** Reusable class */}
            {/* inputStyle */}
            {/* focus:ring-1 instead of heavy ring */}

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mobile Number</label>
              <input
                type="text"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="9876543210"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition"
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={form.whatsapp}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">Alternate</label>
                <input
                  type="text"
                  name="alternateMobile"
                  value={form.alternateMobile}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gray-900 outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Opening Balance</label>
                <input
                  type="text"
                  name="openingBalance"
                  value={form.openingBalance}
                  onChange={handleChange}
                  placeholder="₹ 0.00"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-gray-900 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">User Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:ring-1 focus:ring-gray-900 outline-none"
                >
                  <option value="">Select type</option>
                  {userTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white text-sm font-medium py-3.5 rounded-xl transition"
            >
              Add User
            </button>

            {/* Success */}
            {submitted && (
              <div className="text-center py-2.5 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                ✓ User Added Successfully
              </div>
            )}

          </form>
        </div>
      </div>

      {/* ── User List ── */}
      <div className="lg:col-span-2">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl p-5 shadow-sm sticky top-24">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            {/* <h2 className="text-lg font-semibold text-gray-800">Users</h2> */}
            {/* <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {users.length}
            </span> */}
          </div>

          {/* Search */}
          {/* <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-gray-900 outline-none mb-4"
          /> */}

          {/* List */}
         <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
  {loadingUsers ? (
    <div className="text-center py-10 text-gray-400 text-sm">
      Loading users...
    </div>
  ) : filteredUsers.length === 0 ? (
    <div className="text-center py-10 text-gray-300 text-sm">
      No users found
    </div>
  ) : (
    // filteredUsers.map((user) => (
    //   <div
    //     key={`${user.id}-${user.mobile}`}
    //     className="group flex items-start justify-between p-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
    //   >
    //     {/* Left */}
    //     <div className="flex gap-3 min-w-0">
    //       {/* Avatar */}
    //       <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center text-xs font-semibold shrink-0">
    //         {getInitials(user.name)}
    //       </div>

    //       {/* Details */}
    //       <div className="min-w-0">
    //         <h3 className="text-sm font-semibold text-gray-900 truncate">
    //           {user.name}
    //         </h3>

    //         <div className="flex flex-col text-xs text-gray-500 mt-1">
    //           <span>M:{user.mobile}</span>

    //           {user.whatsapp && (
    //             <span>WA: {user.whatsapp}</span>
    //           )}
    //           <span>M:{user.mobile}</span>

    //         </div>
    //       </div>
    //     </div>

    //     {/* Right */}
    //     <div className="flex flex-col items-end shrink-0 ml-3">
    //       <span className="text-xs font-medium text-gray-700">
    //         ₹{user.opening_balance}
    //       </span>

    //       <span className="text-[11px] text-gray-400 mt-1">
    //         {new Date(user.created_at).toLocaleDateString()}
    //       </span>
    //     </div>
    //   </div>
    // ))
    <PeopleList data={filteredUsers} loading={loadingUsers}/>
  )}
</div>

        </div>
      </div>

    </div>
  </div>
</div>
  );
};

export default AddUser;