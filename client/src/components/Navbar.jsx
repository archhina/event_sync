import { Link, NavLink, useLocation, useParams } from "react-router-dom"

const Navbar = ({ navMessage, open, setOpen, loggedInUser, setLoggedInUser, setNavMessage, event, setOpenInvite }) => {

  const location = useLocation()
  const params = useParams()
  const isEventPage = /^\/events\/\d+$/.test(location.pathname)
  return (
    <div>
      <div className="navbar bg-base-100 shadow-md fixed top-0 z-50 md:w-[calc(100%-16rem)]">
        <div className="navbar-start">
          <p className="text-xl font-semibold ml-4">{navMessage}</p>
        </div>
        <div className="navbar-center hidden lg:flex">
        </div>
        <div className="navbar-end">
        {(location.pathname === "/" || location.pathname === '/myevents') && loggedInUser && <Link to={'/create'} onClick={() => setNavMessage("Creating New Event")} className="btn btn-success btn-outline px-16 mr-4 ">Create Event</Link>}
        {event && event.host && isEventPage && loggedInUser && event.private && loggedInUser.email === event.host.email && <button onClick={() => {
          setNavMessage("Inviting Users")
          setOpenInvite(true)
          }} className="btn btn-success btn-outline px-16 mr-4 ">Invite Users</button>}
          {loggedInUser ? (
            <div className="flex items-center">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-4">
                  <div className="w-10 rounded-full">
                    <img width="60" height="60" src={loggedInUser && loggedInUser.imageUrl ? `${loggedInUser.imageUrl}` : `https://img.icons8.com/ios-glyphs/60/user--v1.png`} alt="user-profile"/>
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li>
                    <Link className="justify-between" to={"/profile"} onClick={() => setNavMessage("User Profile")}>
                      Profile
                    </Link>
                  </li>
                  <li><button onClick={() => {
                      setLoggedInUser(null)
                      localStorage.removeItem("loggedInUser")
                    }}>Logout</button></li>
                </ul>
              </div>
              <h2 className="text-lg font-semibold mr-4">{loggedInUser.email}</h2>
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
}

export default Navbar
