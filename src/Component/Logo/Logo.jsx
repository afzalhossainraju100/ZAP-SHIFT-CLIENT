import logo from "../../assets/logo.png";
import { NavLink } from "react-router-dom";


const Logo = () => {
  return (
    <NavLink to="/">
        <div className="flex items-end  justify-center gap-3 mb-4">
      <img src={logo} alt="logo" />
      <h2 className="text-2xl md:text-3xl  -ms-6 font-bold tracking-wider">
        ZapShift
      </h2>
    </div>
    </NavLink>
  );
};

export default Logo;
