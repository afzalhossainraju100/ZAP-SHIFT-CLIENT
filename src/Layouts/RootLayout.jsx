import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar.jsx/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayout = () => {
    return (
        <div  className="flex flex-col min-h-screen">
            <Navbar></Navbar>
            <div className="grow pt-16">
                <Outlet></Outlet>
            </div>
            
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;