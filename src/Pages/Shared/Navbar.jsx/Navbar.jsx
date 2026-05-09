import { NavLink } from "react-router";
import Logo from "../../../Component/Logo/Logo";

const Navbar = () => {
    const links =
    <>
    <li>
    <NavLink to="/services">Services</NavLink>
    </li>
    <li>
    <NavLink to="/coverage">Coverage</NavLink>
    </li>
    <li>
    <NavLink to="/about">About Us</NavLink>
    </li>
    <li>
    <NavLink to="/pricing">Pricing</NavLink>
    </li>
    <li>
    <NavLink to="/blog">Blog</NavLink>
    </li>
    <li>
    <NavLink to="/contact">Contact</NavLink>
    </li>
    </>;
        
    
    return (
      <div className="flex items-center justify-between bg-[#ffffff] text-[#000000] font-[#000000] p-4">
        <div className="text-[#000000]">
          <Logo></Logo>
        </div>
        <div className="flex gap-4 list-none">{links}</div>
        <div className="flex gap-4">
          <button>Sign In</button>
          <button>Sign Up</button>
          <button>Profile</button>
          <button>Logout</button>
        </div>
      </div>
    );
};

export default Navbar;