import { Outlet } from "react-router";
import Navbar from "../Pages/Shared/Navbar.jsx/Navbar";
import Footer from "../Pages/Shared/Footer/Footer";

const RootLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;