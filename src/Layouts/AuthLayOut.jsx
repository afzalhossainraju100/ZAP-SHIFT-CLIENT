import Logo from "../Component/Logo/Logo";
import { Outlet } from "react-router";
import authImage from "../assets/authImage.png";

const AuthLayOut = () => {
  return (
    <div className="flex sm:flex-col items-start justify-start min-h-screen gap-10 w-[95%] mx-auto mt-8 ">
      <div className="bg-white">
        <Logo></Logo>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-10 w-full bg-[#eef7e1]">
        <div className="flex-1 bg-[#ffffff] w-full h-full flex items-center justify-center">
          <Outlet></Outlet>
        </div>
        <div className="flex-1 w-full h-full ">
          <img className=" " src={authImage} alt="Auth" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayOut;
