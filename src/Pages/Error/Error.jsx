import errorImg from "../../assets/Error.png"
import { NavLink } from "react-router-dom";

const Error = () => {
    return (
      <div className="flex flex-col items-center justify-center gap-8 Auto ">
        <img width="300" src={errorImg} alt="Error" />
        <NavLink
          to="/"
          className="bg-[#7a8d2b] text-white px-6 py-3 rounded-full hover:bg-[#6a7d1b] transition"
        >
          Go Back
        </NavLink>
      </div>
    );
};

export default Error;