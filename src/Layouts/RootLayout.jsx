import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar.jsx/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayout = () => {
    return (
      <div className="bg-gray-100">
        <div className="flex flex-col min-h-screen  max-w-[95%] mx-auto">
          <Navbar></Navbar>
          <div className="grow pt-16 mt-16">
            <Outlet></Outlet>
          </div>

          <Footer></Footer>
        </div>
      </div>
    );
};

export default RootLayout;