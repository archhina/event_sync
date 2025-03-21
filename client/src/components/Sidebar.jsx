import { NavLink } from "react-router-dom";

const Sidebar = ({ setNavMessage, loggedInUser }) => {
  return (
    <div className="h-screen w-64 bg-base-100 text-white shadow-md flex flex-col fixed left-0 top-0">
      {/* Sidebar Header */}
      <div className="p-[18px] text-xl font-semibold shadow-md">EventSync</div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-2">
        <ul className="menu w-60 m-2 p-0">
          <li><NavLink to='/' className="sidebar-link" onClick={() => setNavMessage("Public Events")}>Public Events </NavLink></li>
          { loggedInUser !== null && <li><NavLink to='/myevents' className="sidebar-link" onClick={() => setNavMessage("My Events")}>My Events</NavLink></li>}
          { loggedInUser !== null && <li><NavLink className="sidebar-link" onClick={() => setNavMessage("Invitations")}>Invitations</NavLink></li>}
        </ul>
      </nav>
    </div>
  )
};

export default Sidebar;
