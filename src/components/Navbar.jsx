import React, { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import SearchIcon from "../assets/search_icon.png";
import MenuIcon from "../assets/menu_icon.png";
import BackIcon from "../assets/dropdown_icon.png";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  // lock body scrolling while sidebar is open
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <div className="flex items-center relative py-5 font-medium">
      <div className="flex items-center flex-1">
        <Link to={"/"}>
          <h1 className="font-bold text-base sm:text-3xl">billboard</h1>
        </Link>
      </div>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Link to={"/"} className="text-center text-2xl font-bold sm:text-4xl pointer-events-auto">
          The Box
        </Link>
      </div>

      <div className="hidden lg:flex gap-5 text-sm items-center">
        <Link to="/subscribe" className="bg-[#F43A15] px-6 py-2 text-white rounded font-bold">
          SUBSCRIBE
        </Link>
        <Link to="/sign-in" className="font-bold">
          SIGN IN
        </Link>
        <Link className="flex items-center">
          <p className="mr-2 font-bold">SEARCH</p>
          <img className="w-5" src={SearchIcon} alt="search icon" />
        </Link>
      </div>

      <img onClick={() => setVisible(true)} className="w-5 cursor-pointer lg:hidden" src={MenuIcon} alt="menu-icon" />

      {/* Fullscreen sidebar for mobile (fixed + inset-0 + z-index) */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-transform transform ${
          visible ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        aria-hidden={!visible}
      >
        {/* Optional: content wrapper with safe padding and scroll inside */}
        <div className="h-full overflow-auto">
          {/* Top bar with back/close */}
          <div className="flex items-center gap-4 p-4 border-b">
            <button
              onClick={() => setVisible(false)}
              className="flex items-center gap-2 text-gray-700"
              aria-label="Close menu"
            >
              <img className="h-4 rotate-180" src={BackIcon} alt="back-icon" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col text-gray-700 p-6 space-y-4">
            <NavLink onClick={() => setVisible(false)} to="/subscribe" className="py-2 text-lg font-semibold">
              SUBSCRIBE
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to="/sign-in" className="py-2 text-lg font-semibold">
              SIGN IN
            </NavLink>
            <NavLink onClick={() => setVisible(false)} to="/" className="py-2 text-lg font-semibold">
              SEARCH
            </NavLink>
            {/* add any extra nav links below */}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
