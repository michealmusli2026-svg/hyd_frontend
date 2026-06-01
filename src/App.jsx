import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./component/Navbar";
import HeroSection from "./component/HeroSection";
import TradePage from "./component/tradePage";
import Ledger from "./component/Ledger";
import ProfitLoss from "./component/ProfitLoss";
import BalanceSheet from "./component/BalanceSheet";
import AddUser from "./component/AddUser";
import Login from "./component/Login";

// Protected Route (Sabse safe aur clean)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const isLoggedIn = !!(token && username);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Home Route */}
        <Route
          path="/"
          element={isLoggedIn ? <TradePage /> : <Login />}
        />

        {/* Login Route */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" replace /> : <Login />}
        />

        {/* All Protected Dashboard Routes */}
        <Route
          path="/ledger"
          element={
            <ProtectedRoute>
              <Ledger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/p&l"
          element={
            <ProtectedRoute>
              <ProfitLoss />
            </ProtectedRoute>
          }
        />
        <Route
          path="/balanceSheet"
          element={
            <ProtectedRoute>
              <BalanceSheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adduser"
          element={
            <ProtectedRoute>
              <AddUser />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;