import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Trade", end: true },
  { to: "/ledger", label: "Ledger" },
  { to: "/p&l", label: "P&L" },
  { to: "/balanceSheet", label: "Balance Sheet" },
  { to: "/adduser", label: "Add User" },
];

const navLinkClass = ({ isActive }) =>
  `text-sm px-3 py-1.5 rounded-md transition-colors duration-150 ${
    isActive
      ? "bg-white/20 text-white font-medium"
      : "text-white/80 hover:bg-white/10 hover:text-white"
  }`;

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const isLoggedIn = !!username; 

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    if (isLoggedIn) {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/login");
  };

  // If NOT logged in → Show minimal navbar with only Login button
  if (!isLoggedIn) {
    return (
      <nav className="bg-blue-700 px-6">
        <div className="h-14 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/login")}
            className="text-white text-lg font-medium cursor-pointer select-none"
          >
            HYD
          </div>

          {/* Login Button */}
          <NavLink
            to="/login"
            className="bg-white text-blue-700 hover:bg-blue-50 text-sm font-medium px-5 py-1.5 rounded-lg transition-colors"
          >
            Login
          </NavLink>
        </div>
      </nav>
    );
  }

  // If logged in → Show FULL navbar
  return (
  <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6">
    <div className="h-14 flex items-center justify-between">
      
      {/* Logo */}
      <div
        onClick={handleLogoClick}
        className="text-gray-900 text-lg font-semibold tracking-tight cursor-pointer"
      >
        HYD
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            {label}
          </NavLink>
        ))}

        {/* Avatar Dropdown */}
        <div className="relative ml-4" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
          >
            <div className="bg-gray-900 text-white w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold">
              {username.slice(0, 2).toUpperCase()}
            </div>

            <svg
              className={`w-4 h-4 text-gray-500 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fadeIn">
              
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="bg-gray-900 text-white w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold">
                  {username.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{username}</p>
                  <p className="text-xs text-gray-400">Logged in</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-gray-50 flex items-center gap-2 transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Button */}
      <button
        className="md:hidden flex flex-col gap-[4px]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className={`w-5 h-[2px] bg-gray-800 transition ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
        <span className={`w-5 h-[2px] bg-gray-800 transition ${menuOpen ? "opacity-0" : ""}`} />
        <span className={`w-5 h-[2px] bg-gray-800 transition ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
      </button>
    </div>

    {/* Mobile Menu */}
    <div
      className={`md:hidden transition-all duration-300 overflow-hidden ${
        menuOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0"
      }`}
    >
      <div className="flex flex-col gap-2">
        {links.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="text-gray-700 text-sm px-2 py-2 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </NavLink>
        ))}

        <div className="border-t pt-3 mt-2">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="bg-gray-900 text-white w-8 h-8 flex items-center justify-center rounded-full text-xs font-semibold">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <span className="text-gray-800 text-sm">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left px-2 py-2 text-red-500 hover:bg-gray-100 text-sm flex items-center gap-2 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
  );
}

export default Navbar;