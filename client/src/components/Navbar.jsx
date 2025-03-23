import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import AccountModal from "./AccountModal";

const Navbar = ({ navMessage, open, setOpen, loggedInUser, setLoggedInUser, setNavMessage }) => {

  const location = useLocation();

  

  return (
    <div>
      <div className="navbar bg-base-100 shadow-md fixed top-0 z-50 md:w-[calc(100%-16rem)]">
        <div className="navbar-start">
          <p className="text-xl font-semibold ml-4">{navMessage}</p>
        </div>
        <div className="navbar-center hidden lg:flex">
          {/* <ul className="menu menu-horizontal px-1">
            <li><NavLink to={'/'}>Link 1</NavLink></li>
            <li><NavLink to={'/'}>Link 2</NavLink></li>
            <li><NavLink to={'/'}>Link 3</NavLink></li>
          </ul> */}
        </div>
        <div className="navbar-end">
        {(location.pathname === "/" || location.pathname === '/myevents') && loggedInUser && <Link to={'/create'} onClick={() => setNavMessage("Creating New Event")} className="btn btn-success btn-dash px-16 mr-4 ">Create Event</Link>}
          {loggedInUser ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-4">
                <div className="w-10 rounded-full">
                  <img width="60" height="60" src="https://img.icons8.com/ios-glyphs/60/user--v1.png" alt="user--v1"/>
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <a className="justify-between">
                    Profile
                  </a>
                </li>
                <li><a>Settings</a></li>
                <li><button onClick={() => {
                    setLoggedInUser(null)
                    localStorage.removeItem("loggedInUser")
                  }}>Logout</button></li>
              </ul>
            </div>
          ): (
            <button className="btn mr-4" onClick={() => setOpen(!open)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4 mr-2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Account
            </button>
          )}
        </div>
      </div>
      
    </div>
  )
};

export default Navbar;
