import { NavLink } from "react-router";
import { useState } from "react";
import Logo from "../../../Component/Logo/Logo";
import useAuth from "../../../Hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleRiderClick = () => {
    if (user) {
      navigate("/rider");
    } else {
      navigate("/signin", { state: { from: { pathname: "/rider" } } });
    }
  };

  const handleLogOut = () => {
    logOut()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const links = (
    <>
      <li>
        <NavLink
          to="/services"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          Services
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/coverage"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          Coverage
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          About Us
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/send-parcel"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          Send Parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/blog"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          Blog
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
              isActive
                ? "bg-(--color-primary) text-[#000000] font-semibold shadow-lg"
                : "text-[#000000] hover:bg-[#f0f0f0]"
            } hover:scale-105 active:scale-95`
          }
        >
          Contact
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between bg-[#ffffff] text-[#000000] font-[#000000] px-4 py-1 rounded-3xl shadow-md">
      {/* Logo Section */}
      <div className="text-[#000000]">
        <Logo></Logo>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 list-none">{links}</div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-3">
        {user ? (
          <div>
            <a onClick={handleLogOut}>
              <button className="px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] hover:scale-105 active:scale-95">
                Logout
              </button>
            </a>
            <button className="px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] hover:scale-105 active:scale-95">
              Profile
            </button>
          </div>
        ) : (
          <div>
            <Link to="/signin">
              <button className="px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] hover:scale-105 active:scale-95">
                Sign In
              </button>
            </Link>
            <button
              onClick={handleRiderClick}
              className="px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] hover:scale-105 active:scale-95"
            >
              Be a rider
            </button>
          </div>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden flex flex-col gap-1 focus:outline-none transition-all duration-300"
        aria-label="Toggle menu"
      >
        <span
          className={`w-6 h-0.5 bg-[#000000] transition-all duration-300 transform ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-[#000000] transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
        ></span>
        <span
          className={`w-6 h-0.5 bg-[#000000] transition-all duration-300 transform ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
        ></span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#ffffff] md:hidden rounded-b-3xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-50">
          <ul className="flex flex-col gap-2 p-4 list-none">
            {links}
            <hr className="my-2 border-[#f0f0f0]" />

            {user ? (
              <div>
                <li>
                  <button className="w-full px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] text-left hover:scale-105 active:scale-95">
                    Logout
                  </button>
                </li>
                <li>
                  <button className="w-full px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] text-left hover:scale-105 active:scale-95">
                    Profile
                  </button>
                </li>
              </div>
            ) : (
              <li>
                <button className="w-full px-4 py-2 text-[#000000] rounded-lg transition-all duration-300 hover:bg-[#f0f0f0] text-left hover:scale-105 active:scale-95">
                  Sign In
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
