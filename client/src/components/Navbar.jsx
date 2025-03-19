import { useState } from "react";
import { NavLink } from "react-router-dom";
import AccountModal from "./AccountModal";

const Navbar = ({ open, setOpen }) => {

  

  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
              <li><a>Item 1</a></li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </li>
              <li><a>Item 3</a></li>
            </ul>
          </div>
          <button className="btn btn-ghost text-xl">EventSync</button>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li><NavLink to={'/'}>Link 1</NavLink></li>
            <li><NavLink to={'/'}>Link 2</NavLink></li>
            <li><NavLink to={'/'}>Link 3</NavLink></li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn mr-4" onClick={() => setOpen(!open)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Account
          </button>
        </div>
      </div>
      
    </div>
  )
};

export default Navbar;
