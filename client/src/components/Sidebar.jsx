import { useState } from "react";
import { NavLink } from "react-router-dom";



const Sidebar = ({ setNavMessage, loggedInUser }) => {

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 bg-base-100 p-2 rounded-md shadow-md ${isOpen && 'justify-end'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-screen bg-base-100 text-white shadow-md transition-transform duration-300 z-40
        w-64 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:relative md:flex
      `}>
        {/* Sidebar Header */}
        <div className="p-[18px] text-xl font-semibold shadow-md">
          EventSync
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2">
          <ul className="menu w-60 m-2 p-0">
            <li><NavLink to='/' className="sidebar-link" onClick={() => { setNavMessage("Public Events"); setIsOpen(false); }}>Public Events</NavLink></li>
            { loggedInUser && (
              <>
                <li><NavLink to='/myevents' className="sidebar-link" onClick={() => { setNavMessage("My Events"); setIsOpen(false); }}>My Events</NavLink></li>
                <li><NavLink to='/invitations' className="sidebar-link" onClick={() => { setNavMessage("Invitations"); setIsOpen(false); }}>Invitations</NavLink></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </>
    // <div className="h-screen w-64 bg-base-100 text-white shadow-md flex flex-col fixed left-0 top-0">
    //   {/* Sidebar Header */}
    //   <div className="p-[18px] text-xl font-semibold shadow-md">EventSync</div>

    //   {/* Navigation Links */}
    //   <nav className="flex flex-col space-y-2">
    //     <ul className="menu w-60 m-2 p-0">
    //       <li><NavLink to='/' className="sidebar-link" onClick={() => setNavMessage("Public Events")}>Public Events </NavLink></li>
    //       { loggedInUser !== null && <li><NavLink to='/myevents' className="sidebar-link" onClick={() => setNavMessage("My Events")}>My Events</NavLink></li>}
    //       { loggedInUser !== null && <li><NavLink className="sidebar-link" onClick={() => setNavMessage("Invitations")}>Invitations</NavLink></li>}
    //     </ul>
    //   </nav>
    // </div>
  )
};

export default Sidebar;
