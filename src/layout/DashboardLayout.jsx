import { Outlet } from "react-router-dom";
import Header from "../component/Navbar";
import Footer from "../component/Footer";

const DashboardLayout = () => {
  return (
    <div>
      <Header />

      <main className="p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
